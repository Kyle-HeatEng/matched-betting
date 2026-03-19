import {
  MATCHED_BETTING_OFFER_SEEDS,
  slugify,
  type NormalizedBookmakerOfferSeed,
} from "../../domain/src";
import type {
  BookmakerOfferRuleRow,
  BookmakerOfferRow,
  BookmakerRow,
  CompetitionRow,
  ParticipantRow,
  SeedManifest,
} from "./model";

const NOW_MS = Date.now();
const DEFAULT_RULE_MARKETS = [
  "match_result",
  "over_under_2_5",
  "both_teams_to_score",
] as const;

export function buildSeedManifest(): SeedManifest {
  const bookmakers = buildBookmakers(MATCHED_BETTING_OFFER_SEEDS);
  const bookmakerOffers = MATCHED_BETTING_OFFER_SEEDS.map(toBookmakerOfferRow);
  const bookmakerOfferRules = MATCHED_BETTING_OFFER_SEEDS.map(toBookmakerOfferRuleRow);

  return {
    bookmakers,
    bookmakerOffers,
    bookmakerOfferRules,
    competitions: buildCompetitions(),
    participants: [],
  };
}

export function buildBookmakers(
  seeds: NormalizedBookmakerOfferSeed[],
): Omit<BookmakerRow, "createdAt" | "updatedAt">[] {
  const rows = new Map<string, Omit<BookmakerRow, "createdAt" | "updatedAt">>();

  for (const seed of seeds) {
    const existing = rows.get(seed.bookmakerSlug);
    if (existing) {
      continue;
    }

    rows.set(seed.bookmakerSlug, {
      slug: seed.bookmakerSlug,
      name: seed.bookmakerName,
      status: seed.bookmakerName === "Virgin Bet" ? "active" : "inactive",
      source: "matched_betting_offers.csv",
    });
  }

  return [...rows.values()];
}

export function toBookmakerOfferRow(
  seed: NormalizedBookmakerOfferSeed,
): Omit<BookmakerOfferRow, "createdAt" | "updatedAt"> {
  const offerSlug = slugify(`${seed.bookmakerName}-welcome-offer`);

  return {
    bookmakerSlug: seed.bookmakerSlug,
    slug: offerSlug,
    title: seed.title,
    summary: seed.summary,
    qualifyingStake: seed.qualifyingStake,
    totalFreeBetValue: seed.totalFreeBetValue,
    standardFreeBetValue: seed.standardFreeBetValue,
    betBuilderFreeBetValue: seed.betBuilderFreeBetValue,
    accumulatorFreeBetValue: seed.accumulatorFreeBetValue,
    expectedProfit: seed.expectedProfit,
    currency: seed.currency,
    active: seed.active,
    sourceCsvRow: seed.sourceCsvRow,
  };
}

export function toBookmakerOfferRuleRow(
  seed: NormalizedBookmakerOfferSeed,
): Omit<BookmakerOfferRuleRow, "createdAt" | "updatedAt"> {
  const offerSlug = slugify(`${seed.bookmakerName}-welcome-offer`);

  return {
    bookmakerSlug: seed.bookmakerSlug,
    offerSlug,
    sportKeys: ["football"],
    marketKeys: [...DEFAULT_RULE_MARKETS],
    minStake: seed.qualifyingStake,
    notes: "Seeded from CSV; manual admin review required for bookmaker-specific terms.",
  };
}

export function buildCompetitions(): Omit<CompetitionRow, "createdAt" | "updatedAt">[] {
  return [
    {
      sportKey: "football",
      slug: "football",
      name: "Football",
      country: "Global",
    },
  ];
}

export function buildParticipantRowsFromTeams(
  teams: string[],
  competitionSlug = "football",
): Omit<ParticipantRow, "createdAt" | "updatedAt">[] {
  return teams.map((team) => ({
    slug: slugify(team),
    name: team,
    competitionSlug,
  }));
}

export function withTimestamp<T extends object>(row: T): T & { createdAt: number; updatedAt: number } {
  return {
    ...row,
    createdAt: NOW_MS,
    updatedAt: NOW_MS,
  };
}
