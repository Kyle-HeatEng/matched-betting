import { MATCHED_BETTING_OFFER_SEEDS } from "@matched-betting/domain";

export type OfferStep = {
  id: string;
  title: string;
  body: string;
};

export type OfferSummary = {
  id: string;
  bookmakerSlug: string;
  bookmakerName: string;
  title: string;
  qualifierStake: number;
  totalFreeBet: number;
  expectedProfit: number;
  restrictions: string[];
  steps: OfferStep[];
};

export type Opportunity = {
  id: string;
  event: string;
  competition: string;
  kickoff: string;
  market: string;
  outcome: string;
  backOdds: number;
  layOdds: number;
  layLiquidity: number;
  qualifyingLoss: number;
  freeBetProfit: number;
  netExpectedProfit: number;
  oneClickEligible: boolean;
};

export type DashboardSnapshot = {
  estimatedProfit: number;
  actualProfit: number;
  freeBetsAvailable: number;
  qualifyingPlaced: number;
  layBetsPlaced: number;
  completedOffers: number;
};

export type AdminSnapshot = {
  staleWarnings: string[];
  failedJobs: string[];
  pendingMappings: string[];
};

export type EventSnapshot = {
  id: string;
  event: string;
  competition: string;
  kickoff: string;
  markets: string[];
};

export const offers: OfferSummary[] = MATCHED_BETTING_OFFER_SEEDS.filter(
  (seed) => seed.active,
).map((seed) => ({
  id: `${seed.bookmakerSlug}-welcome`,
  bookmakerSlug: seed.bookmakerSlug,
  bookmakerName: seed.bookmakerName,
  title: `Bet £${seed.qualifyingStake}, get £${seed.totalFreeBetValue} in free bets`,
  qualifierStake: seed.qualifyingStake,
  totalFreeBet: seed.totalFreeBetValue,
  expectedProfit: seed.expectedProfit,
  restrictions: [
    "Football only for the MVP odds feed",
    "Minimum odds 1.5",
    "Qualifying bet must settle within 14 days",
    "Bet builder excluded from v1",
  ],
  steps: [
    {
      id: "open-account",
      title: "Open account + deposit",
      body: "Create the account manually on Virgin Bet, deposit at least £10, and complete identity checks before placing the qualifier.",
    },
    {
      id: "qualifying-bet",
      title: "Place the qualifying bet",
      body: "Choose an eligible football market that meets the minimum odds and stake rules, then use the matched betting table to find the lowest loss option.",
    },
    {
      id: "free-bet",
      title: "Use the free bets",
      body: "Once the free bet is credited, switch to free bet SNR mode to maximize conversion and keep the lay side inside the one-click flow when mapping is exact.",
    },
  ],
}));

export const opportunities: Opportunity[] = [
  {
    id: "opp-1",
    event: "Gillingham vs Bristol Rovers",
    competition: "English League Two",
    kickoff: "2026-03-20T15:00:00.000Z",
    market: "Match Result",
    outcome: "Bristol Rovers",
    backOdds: 3.1,
    layOdds: 3.25,
    layLiquidity: 412.3,
    qualifyingLoss: -0.46,
    freeBetProfit: 21.82,
    netExpectedProfit: 21.36,
    oneClickEligible: true,
  },
  {
    id: "opp-2",
    event: "Padova vs Palermo",
    competition: "Serie B",
    kickoff: "2026-03-20T14:00:00.000Z",
    market: "Over/Under 2.5",
    outcome: "Over 2.5 Goals",
    backOdds: 1.84,
    layOdds: 1.92,
    layLiquidity: 287.14,
    qualifyingLoss: -0.42,
    freeBetProfit: 20.61,
    netExpectedProfit: 20.19,
    oneClickEligible: true,
  },
  {
    id: "opp-3",
    event: "Club Necaxa vs Club Tijuana",
    competition: "Liga MX",
    kickoff: "2026-03-20T01:00:00.000Z",
    market: "BTTS",
    outcome: "Yes",
    backOdds: 2.28,
    layOdds: 2.42,
    layLiquidity: 88.72,
    qualifyingLoss: -0.58,
    freeBetProfit: 18.94,
    netExpectedProfit: 18.36,
    oneClickEligible: false,
  },
];

export const dashboard: DashboardSnapshot = {
  estimatedProfit: 42.18,
  actualProfit: 18.5,
  freeBetsAvailable: 1,
  qualifyingPlaced: 2,
  layBetsPlaced: 2,
  completedOffers: 1,
};

export const admin: AdminSnapshot = {
  staleWarnings: [
    "Virgin Bet BTTS scrape is 5m 14s old",
    "Smarkets liquidity sync skipped one mapped event",
  ],
  failedJobs: ["Virgin odds parser failed on 1 event card snapshot"],
  pendingMappings: [
    "League Two outcome label mismatch: Bristol Rovers / Bristol Rov.",
    "Serie B event alias needs manual review",
  ],
};

export const events: EventSnapshot[] = [
  {
    id: "evt-1",
    event: "Gillingham vs Bristol Rovers",
    competition: "English League Two",
    kickoff: "2026-03-20T15:00:00.000Z",
    markets: ["Match Result", "Over/Under 2.5", "BTTS"],
  },
  {
    id: "evt-2",
    event: "Padova vs Palermo",
    competition: "Serie B",
    kickoff: "2026-03-20T14:00:00.000Z",
    markets: ["Match Result", "Over/Under 2.5"],
  },
  {
    id: "evt-3",
    event: "Club Necaxa vs Club Tijuana",
    competition: "Liga MX",
    kickoff: "2026-03-20T01:00:00.000Z",
    markets: ["Match Result", "BTTS"],
  },
];
