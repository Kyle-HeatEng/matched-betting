import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { TABLE_NAMES } from "../packages/db/src/table-names";
import { buildTimestampedInsert } from "./lib";

export const getCandidateByCandidateId = internalQuery({
  args: {
    candidateId: v.string(),
  },
  handler: async (ctx, args) => {
    const candidates = await ctx.db.query(TABLE_NAMES.matchedBettingCandidates).collect();
    return candidates.find((row) => row.candidateId === args.candidateId) ?? null;
  },
});

export const persistLayBetPlacement = internalMutation({
  args: {
    userId: v.string(),
    candidateId: v.string(),
    smarketsOrderId: v.string(),
    layStake: v.number(),
    liability: v.number(),
    rawRequest: v.optional(v.string()),
    rawResponse: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert(
      TABLE_NAMES.userLayBets,
      buildTimestampedInsert({
        userId: args.userId,
        candidateId: args.candidateId,
        smarketsOrderId: args.smarketsOrderId,
        status: "placed" as const,
        layStake: args.layStake,
        liability: args.liability,
        placedAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
        rawRequest: args.rawRequest,
        rawResponse: args.rawResponse,
      }),
    );

    return { inserted: true, id };
  },
});
