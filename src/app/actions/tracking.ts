"use server";

import { api, ApiError } from "@/lib/api";
import type { Tracking } from "@/lib/types";

export type TrackingState = { tracking: Tracking | null; message: string | null; orderNumber: string; email: string };

export async function lookUpOrder(_previous: TrackingState, formData: FormData): Promise<TrackingState> {
  const orderNumber = String(formData.get("order") ?? "").trim().toUpperCase();
  const email = String(formData.get("email") ?? "").trim();

  if (!orderNumber || !email) {
    return { tracking: null, message: "Enter your order number and the e-mail used at checkout.", orderNumber, email };
  }

  try {
    const response = await api<{ data: Tracking }>(`/tracking/${encodeURIComponent(orderNumber)}?email=${encodeURIComponent(email)}`, { forwardClientIp: true });
    return { tracking: response.data, message: null, orderNumber, email };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 422)) {
      return { tracking: null, message: "We couldn't find an order with that number and e-mail.", orderNumber, email };
    }
    if (error instanceof ApiError && error.status === 429) {
      return { tracking: null, message: "Too many attempts. Please wait a minute and try again.", orderNumber, email };
    }
    throw error;
  }
}
