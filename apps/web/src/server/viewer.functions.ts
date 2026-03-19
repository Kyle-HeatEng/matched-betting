import { createServerFn } from "@tanstack/react-start";
import { api } from "../../../../convex/_generated/api";
import { fetchAuthMutation, fetchAuthQuery, getServerClerkUserId } from "@/lib/auth-server";

export const getViewerState = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await getServerClerkUserId();

  if (!userId) {
    return {
      isAuthenticated: false,
      defaultDashboardId: null,
      user: null,
    };
  }

  const defaultDashboard = await fetchAuthQuery(api.dashboard.getDefaultDashboardForUserId, {
    userId,
  });
  const ensuredDashboard =
    defaultDashboard ??
    (await fetchAuthMutation(api.dashboard.ensureDefaultDashboardForUserId, {
      userId,
    }));
  const defaultDashboardId =
    "_id" in ensuredDashboard ? String(ensuredDashboard._id) : String(ensuredDashboard.dashboardId);

  return {
    isAuthenticated: true,
    defaultDashboardId,
    user: {
      id: userId,
      email: null,
      name: null,
    },
  };
});

export const ensureViewerDashboard = createServerFn({ method: "POST" }).handler(async () => {
  const userId = await getServerClerkUserId();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const result = await fetchAuthMutation(api.dashboard.ensureDefaultDashboardForUserId, {
    userId,
  });
  return {
    ...result,
    dashboardId: String(result.dashboardId),
  };
});

export const getViewerDashboardAccess = createServerFn()
  .validator((data: { dashboardId: string }) => data)
  .handler(async ({ data }) => {
    const userId = await getServerClerkUserId();
    if (!userId) {
      return {
        hasAccess: false,
      };
    }

    const snapshot = await fetchAuthQuery(api.dashboard.getDashboardSnapshotForUserId, {
      userId,
      dashboardId: data.dashboardId,
    });

    return {
      hasAccess: Boolean(snapshot),
    };
  });
