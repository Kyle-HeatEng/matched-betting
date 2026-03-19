import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { TABLE_NAMES } from "../packages/db/src/table-names";
import { buildTimestampedInsert } from "./lib";
import type { Id } from "./_generated/dataModel";

type ViewerIdentity = {
  clerkUserId: string;
  tokenIdentifier: string;
};

async function getViewerIdentity(ctx: QueryCtx | MutationCtx): Promise<ViewerIdentity | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  return {
    clerkUserId: identity.subject,
    tokenIdentifier: identity.tokenIdentifier,
  };
}

function matchesViewerUserId(userId: string, identity: ViewerIdentity) {
  return userId === identity.clerkUserId || userId === identity.tokenIdentifier;
}

async function getDefaultDashboardByUserId(ctx: QueryCtx | MutationCtx, userId: string) {
  const dashboards = await ctx.db.query(TABLE_NAMES.dashboards).collect();
  return dashboards.find((row) => row.userId === userId && row.defaultDashboard) ?? null;
}

async function buildDashboardSnapshot(
  ctx: QueryCtx,
  userId: string,
  dashboardId: string,
) {
  const dashboard = await ctx.db.get(dashboardId as Id<"dashboards">);
  if (!dashboard || dashboard.userId !== userId) {
    return null;
  }

  const entries = await ctx.db.query(TABLE_NAMES.dashboardEntries).collect();
  const dashboardEntries = entries.filter((entry) => entry.dashboardId === dashboard._id);
  const candidateIds = new Set(dashboardEntries.map((entry) => entry.candidateId));
  const candidates = await ctx.db.query(TABLE_NAMES.matchedBettingCandidates).collect();
  const relatedCandidates = candidates.filter((candidate) => candidateIds.has(candidate.candidateId));

  const qualifyingBets = await ctx.db.query(TABLE_NAMES.userQualifyingBets).collect();
  const layBets = await ctx.db.query(TABLE_NAMES.userLayBets).collect();
  const freeBets = await ctx.db.query(TABLE_NAMES.userFreeBets).collect();

  return {
    dashboard: {
      id: String(dashboard._id),
      name: dashboard.name,
      defaultDashboard: dashboard.defaultDashboard,
    },
    entries: dashboardEntries,
    estimatedProfit: relatedCandidates.reduce(
      (sum, candidate) => sum + candidate.netExpectedProfit,
      0,
    ),
    actualProfit: 0,
    freeBetsAvailable: freeBets.filter(
      (bet) => bet.userId === userId && bet.status === "available",
    ).length,
    qualifyingPlaced: qualifyingBets.filter(
      (bet) =>
        bet.userId === userId &&
        (bet.status === "placed" || bet.status === "settled"),
    ).length,
    layBetsPlaced: layBets.filter(
      (bet) =>
        bet.userId === userId &&
        (bet.status === "placed" || bet.status === "confirmed"),
    ).length,
    completedOffers: dashboardEntries.filter((entry) => entry.status === "completed").length,
  };
}

async function ensureDefaultDashboardForUserIdImpl(
  ctx: MutationCtx,
  userId: string,
) {
  const existing = await getDefaultDashboardByUserId(ctx, userId);

  if (existing) {
    return {
      dashboardId: String(existing._id),
      name: existing.name,
      defaultDashboard: existing.defaultDashboard,
    };
  }

  const inserted = await ctx.db.insert(
    TABLE_NAMES.dashboards,
    buildTimestampedInsert({
      userId,
      name: "Main dashboard",
      defaultDashboard: true,
    }),
  );

  const created = await ctx.db.get(inserted);
  if (!created) {
    throw new Error("Failed to create dashboard");
  }

  return {
    dashboardId: String(created._id),
    name: created.name,
    defaultDashboard: created.defaultDashboard,
  };
}

export const list = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const dashboards = await ctx.db.query(TABLE_NAMES.dashboards).collect();
    const dashboard = dashboards.find(
      (row) => row.userId === args.userId && row.defaultDashboard,
    );
    if (!dashboard) {
      return null;
    }

    const entries = await ctx.db.query(TABLE_NAMES.dashboardEntries).collect();
    return {
      dashboard,
      entries: entries.filter((entry) => entry.dashboardId === dashboard._id),
    };
  },
});

export const getViewerDefaultDashboard = query({
  args: {},
  handler: async (ctx) => {
    const viewerIdentity = await getViewerIdentity(ctx);
    if (!viewerIdentity) {
      return null;
    }

    const dashboards = await ctx.db.query(TABLE_NAMES.dashboards).collect();
    return (
      dashboards.find(
        (row) => row.defaultDashboard && matchesViewerUserId(row.userId, viewerIdentity),
      ) ?? null
    );
  },
});

export const getDefaultDashboardForUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return getDefaultDashboardByUserId(ctx, args.userId);
  },
});

export const getViewerDashboardSnapshot = query({
  args: {
    dashboardId: v.string(),
  },
  handler: async (ctx, args) => {
    const viewerIdentity = await getViewerIdentity(ctx);
    if (!viewerIdentity) {
      return null;
    }

    const dashboard = await ctx.db.get(args.dashboardId as Id<"dashboards">);
    if (!dashboard || !matchesViewerUserId(dashboard.userId, viewerIdentity)) {
      return null;
    }

    const entries = await ctx.db.query(TABLE_NAMES.dashboardEntries).collect();
    const dashboardEntries = entries.filter((entry) => entry.dashboardId === dashboard._id);
    const candidateIds = new Set(dashboardEntries.map((entry) => entry.candidateId));
    const candidates = await ctx.db.query(TABLE_NAMES.matchedBettingCandidates).collect();
    const relatedCandidates = candidates.filter((candidate) => candidateIds.has(candidate.candidateId));

    const qualifyingBets = await ctx.db.query(TABLE_NAMES.userQualifyingBets).collect();
    const layBets = await ctx.db.query(TABLE_NAMES.userLayBets).collect();
    const freeBets = await ctx.db.query(TABLE_NAMES.userFreeBets).collect();

    return {
      dashboard: {
        id: String(dashboard._id),
        name: dashboard.name,
        defaultDashboard: dashboard.defaultDashboard,
      },
      entries: dashboardEntries,
      estimatedProfit: relatedCandidates.reduce(
        (sum, candidate) => sum + candidate.netExpectedProfit,
        0,
      ),
      actualProfit: 0,
      freeBetsAvailable: freeBets.filter(
        (bet) => matchesViewerUserId(bet.userId, viewerIdentity) && bet.status === "available",
      ).length,
      qualifyingPlaced: qualifyingBets.filter(
        (bet) =>
          matchesViewerUserId(bet.userId, viewerIdentity) &&
          (bet.status === "placed" || bet.status === "settled"),
      ).length,
      layBetsPlaced: layBets.filter(
        (bet) =>
          matchesViewerUserId(bet.userId, viewerIdentity) &&
          (bet.status === "placed" || bet.status === "confirmed"),
      ).length,
      completedOffers: dashboardEntries.filter((entry) => entry.status === "completed").length,
    };
  },
});

export const getDashboardSnapshotForUserId = query({
  args: {
    userId: v.string(),
    dashboardId: v.string(),
  },
  handler: async (ctx, args) => {
    return buildDashboardSnapshot(ctx, args.userId, args.dashboardId);
  },
});

export const ensureViewerDefaultDashboard = mutation({
  args: {},
  handler: async (ctx) => {
    const viewerIdentity = await getViewerIdentity(ctx);
    if (!viewerIdentity) {
      throw new Error("Unauthenticated");
    }

    const dashboards = await ctx.db.query(TABLE_NAMES.dashboards).collect();
    const existing =
      dashboards.find(
        (row) => row.userId === viewerIdentity.clerkUserId && row.defaultDashboard,
      ) ?? null;

    if (existing) {
      return {
        dashboardId: String(existing._id),
        name: existing.name,
        defaultDashboard: existing.defaultDashboard,
      };
    }

    const legacyDashboard =
      dashboards.find(
        (row) => row.userId === viewerIdentity.tokenIdentifier && row.defaultDashboard,
      ) ?? null;

    if (legacyDashboard) {
      await ctx.db.patch(legacyDashboard._id, {
        userId: viewerIdentity.clerkUserId,
        updatedAt: Date.now(),
      });

      return {
        dashboardId: String(legacyDashboard._id),
        name: legacyDashboard.name,
        defaultDashboard: legacyDashboard.defaultDashboard,
      };
    }

    const inserted = await ctx.db.insert(
      TABLE_NAMES.dashboards,
      buildTimestampedInsert({
        userId: viewerIdentity.clerkUserId,
        name: "Main dashboard",
        defaultDashboard: true,
      }),
    );

    const created = await ctx.db.get(inserted);
    if (!created) {
      throw new Error("Failed to create dashboard");
    }

    return {
      dashboardId: String(created._id),
      name: created.name,
      defaultDashboard: created.defaultDashboard,
    };
  },
});

export const ensureDefaultDashboardForUserId = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return ensureDefaultDashboardForUserIdImpl(ctx, args.userId);
  },
});

export const saveCandidate = mutation({
  args: {
    userId: v.string(),
    candidateId: v.string(),
    notes: v.optional(v.string()),
    stake: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let dashboard = await ctx.db
      .query(TABLE_NAMES.dashboards)
      .collect()
      .then((rows) => rows.find((row) => row.userId === args.userId && row.defaultDashboard) ?? null);

    if (!dashboard) {
      const inserted = await ctx.db.insert(
        TABLE_NAMES.dashboards,
        buildTimestampedInsert({
          userId: args.userId,
          name: "Main dashboard",
          defaultDashboard: true,
        }),
      );
      dashboard = await ctx.db.get(inserted);
    }

    if (!dashboard) {
      return null;
    }

    const entryId = await ctx.db.insert(
      TABLE_NAMES.dashboardEntries,
      buildTimestampedInsert({
        dashboardId: dashboard._id,
        candidateId: args.candidateId,
        status: "saved" as const,
        notes: args.notes,
        stake: args.stake,
      }),
    );

    return { dashboardId: dashboard._id, dashboardEntryId: entryId };
  },
});
