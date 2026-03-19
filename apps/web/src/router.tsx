import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { RouterPending } from "@/components/router-pending";
import { queryClient } from "@/lib/query-client";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  return createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultPendingComponent: RouterPending,
  });
}

export const getRouter = createRouter;

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
