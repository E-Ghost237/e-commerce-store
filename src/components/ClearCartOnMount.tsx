"use client";

import { useEffect } from "react";
import { finishCheckout } from "@/app/actions/checkout";

export function ClearCartOnMount() {
  useEffect(() => {
    void finishCheckout();
  }, []);
  return null;
}
