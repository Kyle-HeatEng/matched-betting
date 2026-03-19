import type { MarketKey, MappingConfidence, OutcomeKey, SportKey } from "../types";

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeDisplayName(value: string): string {
  return normalizeWhitespace(value)
    .replace(/\bfc\b/gi, "FC")
    .replace(/\bcf\b/gi, "CF")
    .replace(/\bvs\b/gi, "v");
}

export function normalizeBookmakerName(value: string): string {
  return normalizeDisplayName(value).replace(/\s+/g, " ");
}

export function inferSportKey(value: string): SportKey {
  const normalized = value.toLowerCase();
  if (normalized.includes("football") || normalized.includes("soccer")) {
    return "football";
  }

  return "football";
}

export function inferMarketKey(label: string): MarketKey | undefined {
  const normalized = label.toLowerCase();
  if (normalized.includes("match result") || normalized.includes("1x2")) {
    return "match_result";
  }
  if (normalized.includes("over/under") || normalized.includes("o/u") || normalized.includes("totals")) {
    return "over_under_2_5";
  }
  if (normalized.includes("both teams") || normalized.includes("btts")) {
    return "both_teams_to_score";
  }

  return undefined;
}

export function inferOutcomeKey(label: string): OutcomeKey | undefined {
  const normalized = label.toLowerCase();
  if (normalized === "home" || normalized.includes("team 1") || normalized.includes("1")) {
    return "home";
  }
  if (normalized === "draw" || normalized.includes("x")) {
    return "draw";
  }
  if (normalized === "away" || normalized.includes("team 2") || normalized.includes("2")) {
    return "away";
  }
  if (normalized.includes("over")) {
    return "over";
  }
  if (normalized.includes("under")) {
    return "under";
  }
  if (normalized.includes("yes") || normalized.includes("btts yes")) {
    return "btts_yes";
  }
  if (normalized.includes("no") || normalized.includes("btts no")) {
    return "btts_no";
  }

  return undefined;
}

export function confidenceFromMatch(
  exactMatch: boolean,
  manualApproved: boolean,
): MappingConfidence {
  if (manualApproved) {
    return "manual";
  }
  if (exactMatch) {
    return "exact";
  }
  return "heuristic";
}

