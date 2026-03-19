export type MarketKind = "match_result" | "over_under_25" | "both_teams_to_score";

export type WorkerJobName =
  | "virgin-offers-sync"
  | "virgin-odds-sync"
  | "smarkets-sync"
  | "candidate-recompute"
  | "stale-data-check";

export type WorkerStatus = "idle" | "running" | "succeeded" | "failed" | "skipped";

export interface WorkerEnv {
  NODE_ENV: "development" | "test" | "production";
  POLL_INTERVAL_MS: number;
  POLL_JITTER_MS: number;
  HTTP_TIMEOUT_MS: number;
  VIRGIN_BASE_URL: string;
  SMARKETS_BASE_URL: string;
  CONVEX_HTTP_URL?: string;
  CONVEX_ADMIN_KEY?: string;
  SECRET_ENCRYPTION_KEY?: string;
  LOG_LEVEL: LogLevel;
}

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  job?: WorkerJobName;
  runId?: string;
  requestId?: string;
  bookmakerId?: string;
  marketId?: string;
  eventId?: string;
  [key: string]: unknown;
}

export interface WorkerLogger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}

export interface JobRunSummary {
  job: WorkerJobName;
  runId: string;
  status: WorkerStatus;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  itemsScanned: number;
  itemsChanged: number;
  warnings: string[];
}

export interface CanonicalCompetition {
  id: string;
  name: string;
  sport: "football";
  country?: string;
}

export interface CanonicalEvent {
  id: string;
  competitionId: string;
  homeParticipant: string;
  awayParticipant: string;
  startsAt: string;
  sourceName: string;
  source: "virgin" | "smarkets";
  freshnessTimestamp: string;
}

export interface CanonicalMarket {
  id: string;
  eventId: string;
  kind: MarketKind;
  label: string;
  source: "virgin" | "smarkets";
  freshnessTimestamp: string;
}

export interface CanonicalOutcome {
  id: string;
  marketId: string;
  label: string;
  price: number;
  isActive: boolean;
  liquidity?: number;
  source: "virgin" | "smarkets";
  freshnessTimestamp: string;
}

export interface VirginOfferSnapshot {
  bookmakerSlug: string;
  offerSlug: string;
  title: string;
  offerUrl: string;
  rawHtml: string;
  scrapedAt: string;
}

export interface VirginOddsSnapshot {
  eventSourceId: string;
  eventName: string;
  marketKind: MarketKind;
  marketLabel: string;
  outcomeLabel: string;
  price: number;
  scrapedAt: string;
  sourceUrl: string;
}

export interface SmarketsMarketSnapshot {
  marketSourceId: string;
  eventName: string;
  marketLabel: string;
  outcomeLabel: string;
  layPrice: number;
  liquidity: number;
  scrapedAt: string;
}

export interface LayCandidateHookInput {
  eventId: string;
  bookmakerOutcomeId: string;
  exchangeOutcomeId: string;
  staleAfterMs: number;
}
