import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { TABLE_NAMES } from "../packages/db/src/table-names";
import { buildTimestampedInsert } from "./lib";

export const updateOffer = mutation({
  args: {
    bookmakerSlug: v.string(),
    offerSlug: v.string(),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db.query(TABLE_NAMES.bookmakerOffers).collect();
    const offer = rows.find(
      (row) => row.bookmakerSlug === args.bookmakerSlug && row.slug === args.offerSlug,
    );
    if (!offer) {
      return null;
    }

    await ctx.db.patch(
      offer._id,
      {
        title: args.title ?? offer.title,
        summary: args.summary ?? offer.summary,
        active: args.active ?? offer.active,
        updatedAt: Date.now(),
      },
    );

    return { updated: true };
  },
});

export const resolveMapping = mutation({
  args: {
    mappingType: v.union(v.literal("event"), v.literal("market"), v.literal("outcome")),
    bookmakerSlug: v.optional(v.string()),
    bookmakerLabel: v.string(),
    exchangeLabel: v.string(),
    canonicalKey: v.optional(v.string()),
    confidence: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.mappingType === "event") {
      const id = await ctx.db.insert(
        TABLE_NAMES.eventMappings,
        buildTimestampedInsert({
          exchangeSource: "smarkets" as const,
          bookmakerSlug: args.bookmakerSlug,
          bookmakerEventName: args.bookmakerLabel,
          exchangeEventName: args.exchangeLabel,
          eventSlug: args.canonicalKey,
          confidence: args.confidence,
          status: "approved" as const,
          notes: args.notes,
          approvedBy: "admin",
          approvedAt: new Date().toISOString(),
        }),
      );

      return { inserted: true, id };
    }

    if (args.mappingType === "market") {
      const id = await ctx.db.insert(
        TABLE_NAMES.marketMappings,
        buildTimestampedInsert({
          exchangeSource: "smarkets" as const,
          bookmakerSlug: args.bookmakerSlug,
          bookmakerMarketLabel: args.bookmakerLabel,
          exchangeMarketLabel: args.exchangeLabel,
          marketKey: args.canonicalKey,
          confidence: args.confidence,
          status: "approved" as const,
          notes: args.notes,
          approvedBy: "admin",
          approvedAt: new Date().toISOString(),
        }),
      );

      return { inserted: true, id };
    }

    const id = await ctx.db.insert(
      TABLE_NAMES.outcomeMappings,
      buildTimestampedInsert({
        exchangeSource: "smarkets" as const,
        bookmakerSlug: args.bookmakerSlug,
        bookmakerOutcomeLabel: args.bookmakerLabel,
        exchangeOutcomeLabel: args.exchangeLabel,
        outcomeKey: args.canonicalKey,
        confidence: args.confidence,
        status: "approved" as const,
        notes: args.notes,
        approvedBy: "admin",
        approvedAt: new Date().toISOString(),
      }),
    );

    return { inserted: true, id };
  },
});
