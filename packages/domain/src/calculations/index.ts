import type {
  FreeBetSnrInput,
  FreeBetSnrResult,
  QualifyingBetInput,
  QualifyingBetResult,
} from "../types";

export function calculateLayStake(
  backStake: number,
  backOdds: number,
  layOdds: number,
  commissionRate: number,
): number {
  const denominator = layOdds - commissionRate;
  if (denominator <= 0) {
    return 0;
  }

  return roundMoney((backStake * backOdds) / denominator);
}

export function calculateLayLiability(layStake: number, layOdds: number): number {
  return roundMoney(layStake * (layOdds - 1));
}

export function calculateQualifyingBet(
  input: QualifyingBetInput,
): QualifyingBetResult {
  const layStake = calculateLayStake(
    input.backStake,
    input.backOdds,
    input.layOdds,
    input.commissionRate,
  );
  const liability = calculateLayLiability(layStake, input.layOdds);
  const layWinProfit = roundMoney(layStake * (1 - input.commissionRate));
  const netIfBackWins = roundMoney(input.backStake * (input.backOdds - 1) - liability);
  const netIfBackLoses = roundMoney(-input.backStake + layWinProfit);

  return {
    layStake,
    liability,
    netIfBackWins,
    netIfBackLoses,
    qualifyingLoss: roundMoney(Math.max(0, -Math.min(netIfBackWins, netIfBackLoses))),
  };
}

export function calculateFreeBetSnr(
  input: FreeBetSnrInput,
): FreeBetSnrResult {
  const layStake = calculateLayStake(
    input.freeBetStake,
    input.backOdds,
    input.layOdds,
    input.commissionRate,
  );
  const liability = calculateLayLiability(layStake, input.layOdds);
  const layWinProfit = roundMoney(layStake * (1 - input.commissionRate));
  const stakeReturned = input.stakeReturned ?? false;
  const winReturn = stakeReturned
    ? roundMoney(input.freeBetStake * input.backOdds)
    : roundMoney(input.freeBetStake * (input.backOdds - 1));
  const netIfBackWins = roundMoney(winReturn - liability);
  const netIfBackLoses = roundMoney(layWinProfit);
  const worstCaseProfit = roundMoney(Math.min(netIfBackWins, netIfBackLoses));
  const expectedProfit = roundMoney((netIfBackWins + netIfBackLoses) / 2);

  return {
    layStake,
    liability,
    netIfBackWins,
    netIfBackLoses,
    worstCaseProfit,
    expectedProfit,
  };
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

