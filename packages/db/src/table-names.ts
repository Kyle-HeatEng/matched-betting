export const TABLE_NAMES = {
  bookmakers: "bookmakers",
  bookmakerOffers: "bookmaker_offers",
  bookmakerOfferRules: "bookmaker_offer_rules",
  competitions: "competitions",
  participants: "participants",
  events: "events",
  markets: "markets",
  outcomes: "outcomes",
  bookmakerOutcomeOddsSnapshots: "bookmaker_outcome_odds_snapshots",
  exchangeOutcomeOddsSnapshots: "exchange_outcome_odds_snapshots",
  currentBestPrices: "current_best_prices",
  matchedBettingCandidates: "matched_betting_candidates",
  dashboards: "dashboards",
  dashboardEntries: "dashboard_entries",
  userQualifyingBets: "user_qualifying_bets",
  userLayBets: "user_lay_bets",
  userFreeBets: "user_free_bets",
  userSmarketsAccounts: "user_smarkets_accounts",
  scrapeRuns: "scrape_runs",
  rawScrapeSnapshots: "raw_scrape_snapshots",
  eventMappings: "event_mappings",
  marketMappings: "market_mappings",
  outcomeMappings: "outcome_mappings",
  adminOverrides: "admin_overrides",
} as const;

export type TableName = (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES];

