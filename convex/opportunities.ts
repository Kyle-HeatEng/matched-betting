import { query } from "./_generated/server";
import { v } from "convex/values";
import { TABLE_NAMES } from "../packages/db/src/table-names";

export const listForOffer = query({
  args: {
    bookmakerSlug: v.string(),
    offerSlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 25;
    const candidates = await ctx.db.query(TABLE_NAMES.matchedBettingCandidates).collect();

    return candidates
      .filter(
        (candidate) =>
          candidate.bookmakerSlug === args.bookmakerSlug &&
          candidate.offerSlug === args.offerSlug &&
          candidate.status !== "stale",
      )
      .sort((left, right) => right.rankingScore - left.rankingScore)
      .slice(0, limit);
  },
});
