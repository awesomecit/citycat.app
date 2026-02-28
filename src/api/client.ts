import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { ApiResponse } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.citycat.example";

export const isDemoMode = (): boolean =>
  import.meta.env.VITE_DEMO_MODE === "true";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Type-safe API request with DEMO_MODE fallback.
 * If DEMO_MODE is active, or the request fails / returns empty data,
 * the provided `fallback` is returned instead.
 */
export async function apiRequest<T>(
  config: AxiosRequestConfig,
  fallback: T
): Promise<ApiResponse<T>> {
  if (isDemoMode()) {
    return { data: fallback, success: true, message: "demo" };
  }

  try {
    const res: AxiosResponse<ApiResponse<T>> = await client.request(config);
    const payload = res.data;

    // Empty‑response guard
    if (
      !payload?.data ||
      (Array.isArray(payload.data) && payload.data.length === 0)
    ) {
      return { data: fallback, success: true, message: "fallback:empty" };
    }

    return payload;
  } catch {
    // Network / server error → fallback
    return { data: fallback, success: true, message: "fallback:error" };
  }
}

export default client;
