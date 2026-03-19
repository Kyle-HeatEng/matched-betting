import { mutation } from "./_generated/server";
import { buildSeedManifest, withTimestamp } from "../packages/db/src/seed";
import { TABLE_NAMES } from "../packages/db/src/table-names";

export const seedMvpData = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query(TABLE_NAMES.bookmakers).collect();
    if (existing.length > 0) {
      return {
        seeded: false,
        reason: "database already contains bookmaker seeds",
      };
    }

    const manifest = buildSeedManifest();
    const insertedBookmakers: string[] = [];

    for (const row of manifest.bookmakers) {
      const id = await ctx.db.insert(TABLE_NAMES.bookmakers, withTimestamp(row));
      insertedBookmakers.push(id);
    }

    for (const row of manifest.bookmakerOffers) {
      await ctx.db.insert(TABLE_NAMES.bookmakerOffers, withTimestamp(row));
    }

    for (const row of manifest.bookmakerOfferRules) {
      await ctx.db.insert(TABLE_NAMES.bookmakerOfferRules, withTimestamp(row));
    }

    for (const row of manifest.competitions) {
      await ctx.db.insert(TABLE_NAMES.competitions, withTimestamp(row));
    }

    return {
      seeded: true,
      bookmakersInserted: insertedBookmakers.length,
      offersInserted: manifest.bookmakerOffers.length,
    };
  },
});
