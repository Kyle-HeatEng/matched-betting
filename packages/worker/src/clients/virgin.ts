import { requestJson, requestText } from "./http";
import type { HttpClientOptions } from "./http";
import type { MarketKind, VirginOfferSnapshot, VirginOddsSnapshot } from "../types";

export interface VirginClient {
  fetchOfferSnapshots(): Promise<VirginOfferSnapshot[]>;
  fetchOddsSnapshots(): Promise<VirginOddsSnapshot[]>;
}

export interface VirginClientOptions extends HttpClientOptions {
  bookmakerSlug: string;
}

function parseMarketKind(label: string): MarketKind {
  const normalized = label.toLowerCase();
  if (normalized.includes("both teams")) {
    return "both_teams_to_score";
  }
  if (normalized.includes("over") || normalized.includes("under")) {
    return "over_under_25";
  }
  return "match_result";
}

export function createVirginClient(options: VirginClientOptions): VirginClient {
  return {
    async fetchOfferSnapshots() {
      const html = await requestText("/offers", { method: "GET" }, options);
      const now = new Date().toISOString();
      return [
        {
          bookmakerSlug: options.bookmakerSlug,
          offerSlug: "virgin-bet",
          title: "Virgin Bet offers",
          offerUrl: new URL("/offers", options.baseUrl).toString(),
          rawHtml: html,
          scrapedAt: now
        }
      ];
    },
    async fetchOddsSnapshots() {
      const payload = await requestJson<{ rows?: Array<{ eventName: string; marketLabel: string; outcomeLabel: string; price: number; sourceUrl?: string }> }>(
        "/odds/football",
        { method: "GET" },
        options
      );

      const rows = payload.rows ?? [];
      const scrapedAt = new Date().toISOString();

      return rows.map((row, index) => ({
        eventSourceId: `${options.bookmakerSlug}:${index}`,
        eventName: row.eventName,
        marketKind: parseMarketKind(row.marketLabel),
        marketLabel: row.marketLabel,
        outcomeLabel: row.outcomeLabel,
        price: row.price,
        scrapedAt,
        sourceUrl: row.sourceUrl ?? new URL("/odds/football", options.baseUrl).toString()
      }));
    }
  };
}
