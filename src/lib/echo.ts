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

export function getEcho(): Echo<"reverb"> | null {
  if (typeof window === "undefined") return null;

  const token = useAuthStore.getState().token;
  if (!token) {
    console.log("[Echo] No token, skipping connection");
    return null;
  }

  if (!echoInstance) {
    console.log("[Echo] Creating new connection with host:", process.env.NEXT_PUBLIC_REVERB_HOST, "port:", process.env.NEXT_PUBLIC_REVERB_PORT);
    window.Pusher = Pusher;

    const useTLS = (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http") === "https";

    echoInstance = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
      forceTLS: useTLS,
      enabledTransports: useTLS ? ["wss"] : ["ws"],
      authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    echoInstance.connector.pusher.connection.bind("state_change", (states: { previous: string; current: string }) => {
      console.log("[Echo] State:", states.previous, "→", states.current);
    });
    echoInstance.connector.pusher.connection.bind("error", (err: unknown) => {
      console.error("[Echo] Connection error:", err);
    });
  }

  return echoInstance;
}

export function disconnectEcho() {
  echoInstance?.disconnect();
  echoInstance = null;
}