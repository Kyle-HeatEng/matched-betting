import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { ensureViewerDashboard, getViewerState } from "@/server/viewer.functions";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    if (location.pathname !== "/dashboard") {
      return;
    }

    const viewer = await getViewerState();
    if (!viewer.isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    const dashboardId =
      viewer.defaultDashboardId ?? (await ensureViewerDashboard()).dashboardId;
    throw redirect({ to: "/dashboard/$dashboardId", params: { dashboardId } });
  },
  component: Outlet,
});
