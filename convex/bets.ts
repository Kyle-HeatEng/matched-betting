import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { TABLE_NAMES } from "../packages/db/src/table-names";

const ALLOWED_STATUSES = {
  [TABLE_NAMES.userQualifyingBets]: ["planned", "placed", "settled"],
  [TABLE_NAMES.userLayBets]: ["draft", "preflighted", "confirmed", "placed", "failed"],
  [TABLE_NAMES.userFreeBets]: ["available", "selected", "placed", "settled", "used"],
} as const;

export const advanceStatus = mutation({
  args: {
    table: v.union(
      v.literal(TABLE_NAMES.userQualifyingBets),
      v.literal(TABLE_NAMES.userLayBets),
      v.literal(TABLE_NAMES.userFreeBets),
    ),
    id: v.string(),
    status: v.union(
      v.literal("planned"),
      v.literal("placed"),
      v.literal("settled"),
      v.literal("draft"),
      v.literal("preflighted"),
      v.literal("confirmed"),
      v.literal("failed"),
      v.literal("available"),
      v.literal("selected"),
      v.literal("used"),
    ),
  },
  handler: async (ctx, args) => {
    const current = await ctx.db.get(args.id as any);
    if (!current) {
      return null;
    }

    if (!ALLOWED_STATUSES[args.table].includes(args.status as never)) {
      return { updated: false, reason: "invalid-status-for-table" };
    }

    await ctx.db.patch(args.id as any, {
      status: args.status as any,
      updatedAt: Date.now(),
    });
    return { updated: true };
  },
});
