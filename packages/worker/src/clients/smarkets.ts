import { requestJson } from "./http";
import type { HttpClientOptions } from "./http";
import type { SmarketsMarketSnapshot } from "../types";

export interface SmarketsClient {
  fetchMarketSnapshots(): Promise<SmarketsMarketSnapshot[]>;
  fetchAccountSummary(): Promise<{ balance: number; currency: string }>;
  placeLayOrder(input: { marketSourceId: string; outcomeLabel: string; layPrice: number; liability: number }): Promise<{ orderId: string; status: string }>;
}

export interface SmarketsClientOptions extends HttpClientOptions {
  apiToken?: string;
}

export function createSmarketsClient(options: SmarketsClientOptions): SmarketsClient {
  const authHeaders: HeadersInit = options.apiToken
    ? {
        authorization: `Bearer ${options.apiToken}`
      }
    : {};

  const baseOptions: HttpClientOptions = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers
    }
  };

  return {
    async fetchMarketSnapshots() {
      const payload = await requestJson<{ markets?: Array<{ id: string; eventName: string; marketLabel: string; outcomeLabel: string; layPrice: number; liquidity: number }> }>(
        "/markets",
        { method: "GET" },
        baseOptions
      );

      const scrapedAt = new Date().toISOString();
      return (payload.markets ?? []).map((market) => ({
        marketSourceId: market.id,
        eventName: market.eventName,
        marketLabel: market.marketLabel,
        outcomeLabel: market.outcomeLabel,
        layPrice: market.layPrice,
        liquidity: market.liquidity,
        scrapedAt
      }));
    },
    async fetchAccountSummary() {
      return requestJson<{ balance: number; currency: string }>("/account", { method: "GET" }, baseOptions);
    },
    async placeLayOrder(input) {
      return requestJson<{ orderId: string; status: string }>(
        "/orders",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            side: "lay",
            ...input
          })
        },
        baseOptions
      );
    }
  };
}
