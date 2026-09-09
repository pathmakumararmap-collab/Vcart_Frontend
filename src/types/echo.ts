import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { API_BASE_URL } from "@/lib/constants/api";
import { useAuthStore } from "@/store/auth-store";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echoInstance: Echo<"reverb"> | null = null;

/**
 * Returns a shared Echo/Reverb client, authenticated with the current
 * Sanctum token. Call this after the user is known to be logged in —
 * it returns null during SSR (no window) or when there's no auth token.
 */
export function getEcho(): Echo<"reverb"> | null {
  if (typeof window === "undefined") return null;

  const token = useAuthStore.getState().token;
  if (!token) return null;

  if (!echoInstance) {
    window.Pusher = Pusher;

    echoInstance = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http") === "https",
      enabledTransports: ["ws", "wss"],
      authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }

  return echoInstance;
}

/** Call on logout so the next login opens a fresh, correctly-authed connection. */
export function disconnectEcho() {
  echoInstance?.disconnect();
  echoInstance = null;
}
