import type { MarketKind, VirginOddsSnapshot } from "../types";

export interface VirginOddsParserInput {
  bookmakerSlug: string;
  url: string;
  html: string;
  scrapedAt?: string;
}

export interface VirginOddsParsingResult {
  snapshots: VirginOddsSnapshot[];
  warnings: string[];
}

function detectMarketKind(label: string): MarketKind {
  const normalized = label.toLowerCase();
  if (normalized.includes("both teams")) {
    return "both_teams_to_score";
  }
  if (normalized.includes("over") || normalized.includes("under")) {
    return "over_under_25";
  }
  return "match_result";
}

export function parseVirginOdds(input: VirginOddsParserInput): VirginOddsParsingResult {
  const lines = input.html
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const snapshots: VirginOddsSnapshot[] = lines.slice(0, 20).map((line, index) => ({
    eventSourceId: `${input.bookmakerSlug}:${index}`,
    eventName: line,
    marketKind: detectMarketKind(line),
    marketLabel: line,
    outcomeLabel: "unknown",
    price: 0,
    scrapedAt: input.scrapedAt ?? new Date().toISOString(),
    sourceUrl: input.url
  }));

  return {
    snapshots,
    warnings: snapshots.length === 0 ? ["No odds rows were parsed from the Virgin HTML snapshot"] : []
  };
}
