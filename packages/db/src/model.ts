import type {
  CandidateKind,
  CurrencyCode,
  MarketKey,
  MappingConfidence,
  OutcomeKey,
  RecommendationBadge,
  SportKey,
} from "../../domain/src";

export interface TimestampedRow {
  createdAt: number;
  updatedAt: number;
}

export interface BookmakerRow extends TimestampedRow {
  slug: string;
  name: string;
  status: "active" | "inactive" | "archived";
  brandColor?: string;
  logoUrl?: string;
  source?: string;
}

export interface BookmakerOfferRow extends TimestampedRow {
  bookmakerSlug: string;
  slug: string;
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

export interface BookmakerOfferRuleRow extends TimestampedRow {
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

export interface CompetitionRow extends TimestampedRow {
  sportKey: SportKey;
  slug: string;
  name: string;
  country?: string;
}

export interface ParticipantRow extends TimestampedRow {
  slug: string;
  name: string;
  competitionSlug?: string;
}

export interface EventRow extends TimestampedRow {
  sportKey: SportKey;
  competitionSlug: string;
  externalSource: "virgin_bet" | "smarkets";
  externalId: string;
  slug: string;
  name: string;
  startsAt: string;
  status: "scheduled" | "live" | "settled" | "suspended";
  homeParticipantSlug?: string;
  awayParticipantSlug?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface MarketRow extends TimestampedRow {
  eventSlug: string;
  marketKey: MarketKey;
  label: string;
  status: "open" | "closed" | "suspended";
}

export interface OutcomeRow extends TimestampedRow {
  marketSlug: string;
  outcomeKey: OutcomeKey;
  label: string;
  sortOrder: number;
}

export interface BookmakerOutcomeOddsSnapshotRow extends TimestampedRow {
  bookmakerSlug: string;
  offerSlug?: string;
  eventSlug: string;
  marketKey: MarketKey;
  outcomeKey: OutcomeKey;
  odds: number;
  scrapedAt: string;
  sourceUrl?: string;
  rawPayload?: string;
  confidence: MappingConfidence;
}

export interface ExchangeOutcomeOddsSnapshotRow extends TimestampedRow {
  exchange: "smarkets";
  eventSlug: string;
  marketKey: MarketKey;
  outcomeKey: OutcomeKey;
  layOdds: number;
  liquidity: number;
  commissionRate: number;
  scrapedAt: string;
  sourceUrl?: string;
  rawPayload?: string;
}

export interface CurrentBestPriceRow extends TimestampedRow {
  eventSlug: string;
  marketKey: MarketKey;
  outcomeKey: OutcomeKey;
  bookmakerSlug: string;
  offerSlug?: string;
  bookmakerBackOdds: number;
  exchangeLayOdds: number;
  liquidity: number;
  commissionRate: number;
  mappingConfidence: MappingConfidence;
  oneClickEligible: boolean;
  qualifyingLoss: number;
  projectedFreeBetProfit: number;
  netExpectedProfit: number;
  priceUpdatedAt: string;
}

export interface MatchedBettingCandidateRow extends TimestampedRow {
  candidateId: string;
  kind: CandidateKind;
  bookmakerSlug: string;
  offerSlug: string;
  eventSlug: string;
  marketKey: MarketKey;
  outcomeKey: OutcomeKey;
  bookmakerBackOdds: number;
  exchangeLayOdds: number;
  liquidity: number;
  commissionRate: number;
  mappingConfidence: MappingConfidence;
  qualifyingLoss: number;
  projectedFreeBetProfit: number;
  netExpectedProfit: number;
  status: "draft" | "eligible" | "saved" | "placed" | "completed" | "stale";
  rankingScore: number;
  badges: RecommendationBadge[];
  oneClickEligible: boolean;
  notes?: string;
  freshnessAt: string;
}

export interface DashboardRow extends TimestampedRow {
  userId: string;
  name: string;
  defaultDashboard: boolean;
}

export interface DashboardEntryRow extends TimestampedRow {
  dashboardId: string;
  candidateId: string;
  status: "saved" | "planned" | "placed" | "completed";
  notes?: string;
  stake?: number;
}

export interface UserQualifyingBetRow extends TimestampedRow {
  userId: string;
  offerSlug: string;
  candidateId?: string;
  status: "planned" | "placed" | "settled";
  backStake: number;
  layStake?: number;
  liability?: number;
  qualifyingLoss?: number;
  placedAt?: string;
  settledAt?: string;
  notes?: string;
}

export interface UserLayBetRow extends TimestampedRow {
  userId: string;
  candidateId: string;
  smarketsOrderId?: string;
  status: "draft" | "preflighted" | "confirmed" | "placed" | "failed";
  layStake: number;
  liability: number;
  placedAt?: string;
  confirmedAt?: string;
  rawRequest?: string;
  rawResponse?: string;
  notes?: string;
}

export interface UserFreeBetRow extends TimestampedRow {
  userId: string;
  offerSlug: string;
  candidateId?: string;
  status: "available" | "selected" | "placed" | "settled" | "used";
  freeBetStake: number;
  expectedProfit: number;
  selectedAt?: string;
  placedAt?: string;
  settledAt?: string;
}

export interface UserSmarketsAccountRow extends TimestampedRow {
  userId: string;
  accountName: string;
  encryptedToken: string;
  tokenFingerprint: string;
  encryptionVersion: string;
  status: "connected" | "expired" | "revoked";
  connectedAt: string;
  lastVerifiedAt?: string;
  expiresAt?: string;
}

export interface ScrapeRunRow extends TimestampedRow {
  source: "virgin_bet" | "smarkets";
  jobName: string;
  status: "running" | "success" | "failed" | "partial";
  startedAt: string;
  finishedAt?: string;
  error?: string;
  payloadCount?: number;
}

export interface RawScrapeSnapshotRow extends TimestampedRow {
  source: "virgin_bet" | "smarkets";
  jobName: string;
  entityType: string;
  entityKey: string;
  scrapedAt: string;
  rawPayload: string;
  parsedOk: boolean;
}

export interface EventMappingRow extends TimestampedRow {
  bookmakerSlug?: string;
  exchangeSource: "smarkets";
  bookmakerEventName: string;
  exchangeEventName: string;
  eventSlug?: string;
  confidence: MappingConfidence;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface MarketMappingRow extends TimestampedRow {
  bookmakerSlug?: string;
  exchangeSource: "smarkets";
  bookmakerMarketLabel: string;
  exchangeMarketLabel: string;
  marketKey?: MarketKey;
  confidence: MappingConfidence;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface OutcomeMappingRow extends TimestampedRow {
  bookmakerSlug?: string;
  exchangeSource: "smarkets";
  bookmakerOutcomeLabel: string;
  exchangeOutcomeLabel: string;
  outcomeKey?: OutcomeKey;
  confidence: MappingConfidence;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface AdminOverrideRow extends TimestampedRow {
  entityType: string;
  entityKey: string;
  overrideKey: string;
  overrideValue: string;
  active: boolean;
  notes?: string;
}

export interface SeedManifest {
  bookmakers: Omit<BookmakerRow, "createdAt" | "updatedAt">[];
  bookmakerOffers: Omit<BookmakerOfferRow, "createdAt" | "updatedAt">[];
  bookmakerOfferRules: Omit<BookmakerOfferRuleRow, "createdAt" | "updatedAt">[];
  competitions: Omit<CompetitionRow, "createdAt" | "updatedAt">[];
  participants: Omit<ParticipantRow, "createdAt" | "updatedAt">[];
}
