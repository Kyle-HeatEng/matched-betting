import { ConvexReactClient } from "convex/react";

let client: ConvexReactClient | null = null;

export function getConvexClient() {
  if (client) {
    return client;
  }

  const url = import.meta.env.VITE_CONVEX_URL;
  if (!url) {
    throw new Error("VITE_CONVEX_URL is not set.");
  }

  client = new ConvexReactClient(url);
  return client;
}
