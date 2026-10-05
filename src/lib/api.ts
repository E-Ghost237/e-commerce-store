import "server-only";
import { headers } from "next/headers";
import { serverConfig } from "./config";
import type { ApiErrorBody } from "./types";

export const GENERIC_ERROR_MESSAGE = "Something went wrong on our side. Please try again in a moment.";

/**
 * API failure that is safe to show: for server-side failures `message` is always generic (plus a support reference),
 * never the API's own text. The original detail is logged on this server only.
 */
export class ApiError extends Error {
  public readonly fieldErrors: Record<string, string[]>;

  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    fieldErrors: Record<string, string[]> = {},
    public readonly correlationId: string | null = null,
  ) {
    const isServerFailure = status >= 500;
    // The API only uses these codes for deliberate aborts whose message is written for customers.
    const hasClientMessage = !isServerFailure || ["service_unavailable", "upstream_provider_error"].includes(code);
    super(hasClientMessage ? message : `${GENERIC_ERROR_MESSAGE}${correlationId ? ` (reference ${correlationId.slice(0, 8)})` : ""}`);
    this.fieldErrors = isServerFailure ? {} : fieldErrors;

    if (isServerFailure && !hasClientMessage) {
      console.error(`[api] ${status} ${code}${correlationId ? ` correlation_id=${correlationId}` : ""}: ${message}`);
    }
  }

  /** First message per field, for forms. */
  firstErrors(): Record<string, string> {
    return Object.fromEntries(Object.entries(this.fieldErrors).map(([field, messages]) => [field, messages[0] ?? ""]));
  }
}

/** Longer than the API's own slowest path (live supplier shipping quotes). */
const REQUEST_TIMEOUT_MS = 60_000;

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
  idempotencyKey?: string;
  /** Cache GET responses for this many seconds (catalogue reads). */
  revalidate?: number;
  /** Forward the shopper IP so the API rate-limits per shopper rather than per storefront server. */
  forwardClientIp?: boolean;
};

async function clientIp(): Promise<string | null> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || requestHeaders.get("x-real-ip");
}

/** Server-side call to the Commerce Core API. Throws ApiError with the API's stable error code. */
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const method = options.method ?? "GET";
  const requestHeaders: Record<string, string> = { Accept: "application/json" };

  if (options.body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }
  if (serverConfig.storefrontApiKey) {
    requestHeaders["X-Storefront-Key"] = serverConfig.storefrontApiKey;
  }
  if (options.forwardClientIp ?? method !== "GET") {
    const ip = await clientIp();
    if (ip) {
      requestHeaders["X-Storefront-Client-Ip"] = ip;
    }
  }
  if (options.token) {
    requestHeaders.Authorization = `Bearer ${options.token}`;
  }
  if (options.idempotencyKey) {
    requestHeaders["Idempotency-Key"] = options.idempotencyKey;
  }

  let response: Response;
  try {
    response = await fetch(`${serverConfig.apiUrl}/api/v1${path}`, {
      method,
      headers: requestHeaders,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      ...(options.revalidate !== undefined && method === "GET" && !options.token
        ? { next: { revalidate: options.revalidate } }
        : { cache: "no-store" as const }),
    });
  } catch (error) {
    // Unreachable API, DNS failure or timeout: same safe error as any other server-side failure.
    throw new ApiError(503, "api_unreachable", `${method} ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json().catch(() => null)) as (ApiErrorBody & Record<string, unknown>) | null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.error?.code ?? `http_${response.status}`,
      payload?.error?.message ?? payload?.message ?? "Something went wrong. Please try again.",
      payload?.errors ?? {},
      payload?.error?.correlation_id ?? response.headers.get("x-correlation-id"),
    );
  }

  if (payload === null) {
    // A 2xx that is not JSON (e.g. a proxy error page) must not be treated as data.
    throw new ApiError(502, "invalid_api_response", "The service returned an unexpected response.", {}, response.headers.get("x-correlation-id"));
  }

  return payload as T;
}

/** Return null instead of throwing for 404s. */
export async function apiOrNull<T>(path: string, options: ApiOptions = {}): Promise<T | null> {
  try {
    return await api<T>(path, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
