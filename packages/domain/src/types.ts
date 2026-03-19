export type CurrencyCode = "GBP";
export type SportKey = "football";
export type BookmakerStatus = "active" | "inactive" | "archived";
export type MarketKey = "match_result" | "over_under_2_5" | "both_teams_to_score";
export type OutcomeKey =
  | "home"
  | "draw"
  | "away"
  | "over"
  | "under"
  | "btts_yes"
  | "btts_no";

export type CandidateKind = "standard" | "bet_builder" | "accumulator";
export type MappingConfidence = "manual" | "exact" | "heuristic" | "unmapped";
export type RecommendationBadge =
  | "best_profit"
  | "lowest_loss"
  | "best_liquidity"
  | "qualifying_eligible"
  | "one_click_eligible";

export interface OfferSummary {
  bookmakerName: string;
  bookmakerSlug: string;
  title: string;
  summary: string;
  qualifyingStake: number;
  totalFreeBetValue: number;
  standardFreeBetValue: number;
  betBuilderFreeBetValue: number;
  accumulatorFreeBetValue: number;
  expectedProfit: number;
  currency: CurrencyCode;
  active: boolean;
}

export interface OfferRuleSet {
  bookmakerSlug: string;
  offerSlug: string;
  sportKeys: SportKey[];
  marketKeys: MarketKey[];
  minBackOdds?: number;
  minStake?: number;
  expiryDays?: number;
  qualifyingWindowDays?: number;
  termsUrl?: string;
  notes?: string;
}

export interface EventCard {
  eventId: string;
  sportKey: SportKey;
  competitionName: string;
  homeName: string;
  awayName: string;
  startsAt: string;
  bookmakerSlug?: string;
  bookmakerMarketKey?: MarketKey;
  outcomeKey?: OutcomeKey;
}

export interface PriceQuote {
  eventId: string;
  marketKey: MarketKey;
  outcomeKey: OutcomeKey;
  bookmakerBackOdds: number;
  exchangeLayOdds: number;
  liquidity: number;
  commissionRate: number;
  scrapedAt: string;
  mappingConfidence: MappingConfidence;
  oneClickEligible: boolean;
}

export interface QualifyingBetInput {
  backStake: number;
  backOdds: number;
  layOdds: number;
  commissionRate: number;
}

export interface QualifyingBetResult {
  layStake: number;
  liability: number;
  netIfBackWins: number;
  netIfBackLoses: number;
  qualifyingLoss: number;
}

export interface FreeBetSnrInput {
  freeBetStake: number;
  backOdds: number;
  layOdds: number;
  commissionRate: number;
  stakeReturned?: boolean;
}

export interface FreeBetSnrResult {
  layStake: number;
  liability: number;
  netIfBackWins: number;
  netIfBackLoses: number;
  worstCaseProfit: number;
  expectedProfit: number;
}

export interface MatchedBetCandidate {
  candidateId: string;
  kind: CandidateKind;
  bookmakerSlug: string;
  offerSlug: string;
  eventId: string;
  marketKey: MarketKey;
  outcomeKey: OutcomeKey;
  bookmakerBackOdds: number;
  exchangeLayOdds: number;
  liquidity: number;
  commissionRate: number;
  mappingConfidence: MappingConfidence;
  scrapedAt: string;
  oneClickEligible: boolean;
  qualifyingBet?: QualifyingBetResult;
  freeBetSnr?: FreeBetSnrResult;
  rankingScore?: number;
  badges?: RecommendationBadge[];
}

export interface CandidateRankingInput {
  candidate: MatchedBetCandidate;
  freshnessMinutes?: number;
  stalePenalty?: number;
}

export interface CandidateRankingOptions {
  profitWeight?: number;
  lossWeight?: number;
  liquidityWeight?: number;
  freshnessWeight?: number;
  oneClickBonus?: number;
}

export interface NormalizedBookmakerOfferSeed {
  bookmakerName: string;
  bookmakerSlug: string;
  title: string;
  summary: string;
  qualifyingStake: number;
  totalFreeBetValue: number;
  standardFreeBetValue: number;
  betBuilderFreeBetValue: number;
  accumulatorFreeBetValue: number;
  expectedProfit: number;
  currency: CurrencyCode;
  active: boolean;
  sourceCsvRow: Record<string, string>;
}

