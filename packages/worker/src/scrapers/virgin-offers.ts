import type { VirginOfferSnapshot } from "../types";

export interface VirginOfferParserInput {
  bookmakerSlug: string;
  offerSlug: string;
  url: string;
  html: string;
  scrapedAt?: string;
}

export interface VirginOfferParsingResult {
  snapshots: VirginOfferSnapshot[];
  warnings: string[];
}

function textBetween(html: string, start: RegExp, end: RegExp): string | null {
  const startMatch = html.match(start);
  if (!startMatch || startMatch.index === undefined) {
    return null;
  }

  const tail = html.slice(startMatch.index + startMatch[0].length);
  const endMatch = tail.match(end);
  if (!endMatch || endMatch.index === undefined) {
    return null;
  }

  return tail.slice(0, endMatch.index).replace(/\s+/g, " ").trim();
}

export function parseVirginOffers(input: VirginOfferParserInput): VirginOfferParsingResult {
  const title = textBetween(input.html, /<title[^>]*>/i, /<\/title>/i) ?? "Virgin Bet offer";
  return {
    snapshots: [
      {
        bookmakerSlug: input.bookmakerSlug,
        offerSlug: input.offerSlug,
        title,
        offerUrl: input.url,
        rawHtml: input.html,
        scrapedAt: input.scrapedAt ?? new Date().toISOString()
      }
    ],
    warnings: title === "Virgin Bet offer" ? ["Offer title could not be confidently parsed"] : []
  };
}
