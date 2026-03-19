import { createFileRoute, redirect } from "@tanstack/react-router";
import { ensureViewerDashboard, getViewerState } from "@/server/viewer.functions";
import { LoginPage } from "@/views/login-page";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const viewer = await getViewerState();
    if (viewer.isAuthenticated) {
      const dashboardId =
        viewer.defaultDashboardId ?? (await ensureViewerDashboard()).dashboardId;
      throw redirect({ to: "/dashboard/$dashboardId", params: { dashboardId } });
    }
  },
  component: LoginPage,
});
