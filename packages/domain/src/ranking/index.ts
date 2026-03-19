import type {
  CandidateRankingInput,
  CandidateRankingOptions,
  MatchedBetCandidate,
  RecommendationBadge,
} from "../types";
import { roundMoney } from "../calculations";

const DEFAULT_OPTIONS: Required<CandidateRankingOptions> = {
  profitWeight: 1,
  lossWeight: 1.35,
  liquidityWeight: 0.05,
  freshnessWeight: 0.2,
  oneClickBonus: 5,
};

export function scoreCandidate(
  input: CandidateRankingInput,
  options: CandidateRankingOptions = {},
): number {
  const merged = { ...DEFAULT_OPTIONS, ...options };
  const candidate = input.candidate;
  const profit = candidate.freeBetSnr?.expectedProfit ?? 0;
  const loss = candidate.qualifyingBet?.qualifyingLoss ?? 0;
  const liquidity = candidate.liquidity;
  const freshnessPenalty = input.freshnessMinutes ?? 0;
  const stalePenalty = input.stalePenalty ?? 0;

  const score =
    profit * merged.profitWeight -
    loss * merged.lossWeight +
    Math.log10(Math.max(1, liquidity)) * merged.liquidityWeight -
    freshnessPenalty * merged.freshnessWeight -
    stalePenalty +
    (candidate.oneClickEligible ? merged.oneClickBonus : 0);

  return roundMoney(score);
}

export function rankCandidates(
  candidates: MatchedBetCandidate[],
  options: CandidateRankingOptions = {},
): MatchedBetCandidate[] {
  return [...candidates]
    .map((candidate) => ({
      ...candidate,
      rankingScore: scoreCandidate({ candidate }, options),
      badges: buildBadges(candidate),
    }))
    .sort((left, right) => (right.rankingScore ?? 0) - (left.rankingScore ?? 0));
}

export function buildBadges(candidate: MatchedBetCandidate): RecommendationBadge[] {
  const badges: RecommendationBadge[] = [];

  if (candidate.freeBetSnr && candidate.freeBetSnr.expectedProfit > 0) {
    badges.push("best_profit");
  }
  if (candidate.qualifyingBet && candidate.qualifyingBet.qualifyingLoss <= 1) {
    badges.push("lowest_loss");
  }
  if (candidate.liquidity >= 100) {
    badges.push("best_liquidity");
  }
  if (candidate.qualifyingBet) {
    badges.push("qualifying_eligible");
  }
  if (candidate.oneClickEligible) {
    badges.push("one_click_eligible");
  }

  return badges;
}

