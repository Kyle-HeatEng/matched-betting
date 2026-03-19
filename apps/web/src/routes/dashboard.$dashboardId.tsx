import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  ensureViewerDashboard,
  getViewerDashboardAccess,
  getViewerState,
} from "@/server/viewer.functions";
import { DashboardPage } from "@/views/dashboard-page";

export const Route = createFileRoute("/dashboard/$dashboardId")({
  beforeLoad: async ({ params }) => {
    const viewer = await getViewerState();
    if (!viewer.isAuthenticated) {
      return;
    }

    if (viewer.defaultDashboardId === params.dashboardId) {
      return;
    }

    const access = await getViewerDashboardAccess({
      data: { dashboardId: params.dashboardId },
    });

    if (access.hasAccess) {
      return;
    }

    const fallbackDashboardId =
      viewer.defaultDashboardId ?? (await ensureViewerDashboard()).dashboardId;
    throw redirect({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: fallbackDashboardId },
    });
  },
  component: DashboardPage,
});
