import { query } from "./_generated/server";
import { v } from "convex/values";
import { TABLE_NAMES } from "../packages/db/src/table-names";

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const offers = await ctx.db.query(TABLE_NAMES.bookmakerOffers).collect();
    const bookmakers = await ctx.db.query(TABLE_NAMES.bookmakers).collect();

    return offers
      .filter((offer) => offer.active)
      .map((offer) => ({
        ...offer,
        bookmaker: bookmakers.find((bookmaker) => bookmaker.slug === offer.bookmakerSlug) ?? null,
      }));
  },
});

export const get = query({
  args: {
    bookmakerSlug: v.string(),
    offerSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const offer = await ctx.db
      .query(TABLE_NAMES.bookmakerOffers)
      .collect()
      .then((rows) =>
        rows.find(
          (row) =>
            row.bookmakerSlug === args.bookmakerSlug && row.slug === args.offerSlug,
        ) ?? null,
      );

    if (!offer) {
      return null;
    }

    const rule = await ctx.db
      .query(TABLE_NAMES.bookmakerOfferRules)
      .collect()
      .then((rows) =>
        rows.find(
          (row) =>
            row.bookmakerSlug === args.bookmakerSlug && row.offerSlug === args.offerSlug,
        ) ?? null,
      );

    return { offer, rule };
  },
});
