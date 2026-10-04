import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import { admin, apiEnv, apiUrl, corePath, webhookSecret } from "./env";

export function artisan(...args: string[]): string {
  return execFileSync("php", ["artisan", ...args], { cwd: corePath, env: { ...process.env, ...apiEnv }, encoding: "utf8" });
}

async function json<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`${response.status} ${await response.text()}`);
  }
  return (await response.json()) as T;
}

export async function adminToken(code?: string): Promise<string> {
  const response = await fetch(`${apiUrl}/api/v1/admin/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email: admin.email, password: admin.password, device_name: "e2e", code }),
  });
  return (await json<{ data: { token: string } }>(response)).data.token;
}

export type ApiOrder = { id: number; number: string; total_cents: number; payment_status: string; fulfillment_status: string; discount_cents: number };

export async function findOrder(token: string, query: string): Promise<ApiOrder> {
  const response = await fetch(`${apiUrl}/api/v1/admin/orders?q=${encodeURIComponent(query)}`, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } });
  const orders = await json<{ data: ApiOrder[] }>(response);
  if (!orders.data[0]) {
    throw new Error(`No order matches ${query}`);
  }
  return orders.data[0];
}

/** Deliver a Stripe event signed exactly like Stripe does (t=…,v1=HMAC-SHA256). */
export async function sendStripeEvent(event: Record<string, unknown>): Promise<number> {
  const payload = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac("sha256", webhookSecret).update(`${timestamp}.${payload}`).digest("hex");
  const response = await fetch(`${apiUrl}/webhooks/stripe`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Stripe-Signature": `t=${timestamp},v1=${signature}` },
    body: payload,
  });
  return response.status;
}

export function paymentSucceededEvent(order: ApiOrder): Record<string, unknown> {
  return {
    id: `evt_e2e_${order.number}`,
    object: "event",
    type: "payment_intent.succeeded",
    data: { object: { id: `pi_e2e_${order.number}`, object: "payment_intent", amount_received: order.total_cents, currency: "usd", metadata: { order_id: String(order.id) } } },
  };
}

/** RFC 6238 TOTP (SHA-1, 30s, 6 digits) for the MFA scenario. */
export function totp(base32Secret: string, offsetSteps = 0): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const char of base32Secret.replace(/=+$/, "").toUpperCase()) {
    bits += alphabet.indexOf(char).toString(2).padStart(5, "0");
  }
  const key = Buffer.from(bits.match(/.{8}/g)!.map((byte) => parseInt(byte, 2)));
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 1000 / 30) + offsetSteps));
  const hmac = crypto.createHmac("sha1", key).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  return String((hmac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, "0");
}
