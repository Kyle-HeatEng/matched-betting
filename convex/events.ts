import { query } from "./_generated/server";
import { v } from "convex/values";
import { TABLE_NAMES } from "../packages/db/src/table-names";

export const list = query({
  args: {
    sportKey: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const events = await ctx.db.query(TABLE_NAMES.events).collect();

    return events
      .filter((event) => (args.sportKey ? event.sportKey === args.sportKey : true))
      .sort((left, right) => left.startsAt.localeCompare(right.startsAt))
      .slice(0, limit);
  },
});
