import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "./api";
import { ADMIN_COOKIE } from "./cookies";

export type AdminUser = { id: number; name: string; email: string; mfa_enabled: boolean; mfa_required: boolean };

export async function adminToken(): Promise<string | null> {
  return (await cookies()).get(ADMIN_COOKIE)?.value ?? null;
}

/** Authenticated admin API call; an expired or revoked token sends the user back to sign in. */
export async function adminApi<T>(path: string, options: Omit<Parameters<typeof api>[1], "token"> = {}): Promise<T> {
  const token = await adminToken();
  if (!token) {
    redirect("/admin/login");
  }
  try {
    return await api<T>(`/admin${path}`, { ...options, token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/admin/login?expired=1");
    }
    if (error instanceof ApiError && error.code === "mfa_enrollment_required") {
      redirect("/admin/security");
    }
    throw error;
  }
}

/** Server-side guard for every back-office page. */
export async function requireAdmin(): Promise<AdminUser> {
  return (await adminApi<{ data: AdminUser }>("/me")).data;
}
