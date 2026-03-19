import { createServerFn } from "@tanstack/react-start";
import { api } from "../../../../convex/_generated/api";
import {
  admin,
  events,
  offers,
  opportunities,
} from "@/lib/demo-data";
import { fetchAuthQuery, getServerClerkUserId } from "@/lib/auth-server";

export const listOffers = createServerFn().handler(async () => offers);

export const getOfferSnapshot = createServerFn()
  .validator((data: { offerId: string }) => data)
  .handler(async ({ data }) => {
    return offers.find((offer) => offer.id === data.offerId) ?? null;
  });

export const listEvents = createServerFn().handler(async () => events);

export const listOpportunities = createServerFn()
  .validator((data: { offerId: string }) => data)
  .handler(async ({ data }) => {
    if (!offers.some((offer) => offer.id === data.offerId)) {
      return [];
    }

    return opportunities;
  });

export const getDashboardSnapshot = createServerFn()
  .validator((data: { dashboardId: string }) => data)
  .handler(async ({ data }) => {
    const userId = await getServerClerkUserId();
    if (!userId) {
      return null;
    }

    const snapshot = await fetchAuthQuery(api.dashboard.getDashboardSnapshotForUserId, {
      userId,
      dashboardId: data.dashboardId,
    });

    if (!snapshot) {
      return null;
    }

    return {
      ...snapshot,
      entries: snapshot.entries.map((entry) => ({
        ...entry,
        _id: String(entry._id),
      })),
    };
  });

export const getAdminSnapshot = createServerFn().handler(async () => admin);
