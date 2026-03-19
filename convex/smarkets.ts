import { action, mutation } from "./_generated/server";
import { anyApi } from "convex/server";
import { v } from "convex/values";
import {
  calculateFreeBetSnr,
  calculateQualifyingBet,
} from "../packages/domain/src/calculations";
import { TABLE_NAMES } from "../packages/db/src/table-names";
import { buildTimestampedInsert } from "./lib";

export const connectSmarketsToken = mutation({
  args: {
    userId: v.string(),
    accountName: v.string(),
    encryptedToken: v.string(),
    tokenFingerprint: v.string(),
    encryptionVersion: v.string(),
    expiresAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const inserted = await ctx.db.insert(
      TABLE_NAMES.userSmarketsAccounts,
      buildTimestampedInsert({
        userId: args.userId,
        accountName: args.accountName,
        encryptedToken: args.encryptedToken,
        tokenFingerprint: args.tokenFingerprint,
        encryptionVersion: args.encryptionVersion,
        status: "connected" as const,
        connectedAt: new Date().toISOString(),
        expiresAt: args.expiresAt,
      }),
    );

    return { accountId: inserted };
  },
});

export const preflightLayBet = action({
  args: {
    candidateId: v.string(),
    userId: v.string(),
    stake: v.number(),
  },
  handler: async (ctx, args) => {
    const candidate = await ctx.runQuery(anyApi.smarkets_internal.getCandidateByCandidateId, {
      candidateId: args.candidateId,
    });

    if (!candidate) {
      return { canPlace: false, reason: "candidate-not-found" };
    }

    const qualifyingBet = calculateQualifyingBet({
      backStake: args.stake,
      backOdds: candidate.bookmakerBackOdds,
      layOdds: candidate.exchangeLayOdds,
      commissionRate: candidate.commissionRate,
    });

    const freeBetSnr = calculateFreeBetSnr({
      freeBetStake: args.stake,
      backOdds: candidate.bookmakerBackOdds,
      layOdds: candidate.exchangeLayOdds,
      commissionRate: candidate.commissionRate,
    });

    return {
      canPlace: candidate.oneClickEligible,
      candidate,
      qualifyingBet,
      freeBetSnr,
      reason: candidate.oneClickEligible ? null : "mapping-or-liquidity-check-failed",
    };
  },
});

export const confirmLayBet = action({
  args: {
    candidateId: v.string(),
    userId: v.string(),
    stake: v.number(),
    liability: v.number(),
  },
  handler: async (ctx, args) => {
    const orderId = `scaffold-${args.candidateId}`;
    const rawRequest = JSON.stringify(args);
    const rawResponse = JSON.stringify({ orderId, status: "placed" });

    await ctx.runMutation(anyApi.smarkets_internal.persistLayBetPlacement, {
      userId: args.userId,
      candidateId: args.candidateId,
      smarketsOrderId: orderId,
      layStake: args.stake,
      liability: args.liability,
      rawRequest,
      rawResponse,
    });

    return {
      placed: true,
      smarketsOrderId: orderId,
    };
  },
});
