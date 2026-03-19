import { createFileRoute, redirect } from "@tanstack/react-router";
import { getViewerState } from "@/server/viewer.functions";
import { AdminPage } from "@/views/admin-page";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const viewer = await getViewerState();
    if (!viewer.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminPage,
});
