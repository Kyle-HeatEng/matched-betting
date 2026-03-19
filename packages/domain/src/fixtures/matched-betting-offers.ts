import type { NormalizedBookmakerOfferSeed } from "../types";
import { normalizeBookmakerName, slugify } from "../mapping";

const RAW_MATCHED_BETTING_OFFERS_CSV = `Bookmaker,Qualifying Bet (£),Total Free Bet (£),Standard Free Bet (£),Bet Builder Free Bet (£),Accumulator Free Bet (£),Expected Profit (£)
Paddy Power,5,30,30,0,0,22.0
Bally Casino,10,30,30,0,0,22.0
William Hill,10,30,30,0,0,22.0
JackpotJoy,10,10,10,0,0,7.5
Monopoly Casino,10,20,20,0,0,15.0
Bwin,5,20,20,0,0,14.0
LiveScore Bet,10,30,30,0,0,22.0
Betfair Sportsbook,10,50,0,25,25,34.0
Tote,10,30,30,0,0,15.0
Kwiff,10,40,40,0,0,25.0
NRG,20,10,10,0,0,7.0
Unibet,20,20,20,0,0,15.0
BetVickers,10,20,20,0,0,15.0
Bet600,50,10,10,0,0,6.0
Meta Betting,10,10,10,0,0,7.5
Dabble,10,10,10,0,0,7.5
Betfred,10,50,30,0,20,34.0
Lottoland,10,10,0,10,0,6.0
BetUK,10,30,30,0,0,20.0
Virgin Bet,10,30,30,0,0,22.0
BetWright,10,10,0,0,10,6.0
10Bet,50,50,50,0,0,15.0
PricedUp,40,20,0,0,20,10.0
BetStGeorge,20,20,20,0,0,12.0
DAZN Bet,10,20,20,0,0,14.0
BetGoodwin,10,15,15,0,0,8.0
Betnero,10,10,0,10,0,6.0
Betano,10,30,30,0,0,18.0
VBet,20,20,0,0,20,10.0
NetBet,10,20,20,0,0,14.0
BetMGM,10,40,40,0,0,28.0
Midnite,10,30,30,0,0,20.0
LuckyMate,10,10,0,0,10,6.0
Parimatch,10,20,20,0,0,14.0
BrotherBets,10,20,0,0,20,14.0
BetVictor,10,30,30,0,0,20.0
StakeMate,10,20,20,0,0,12.0
FanTeam,10,40,30,0,10,20.0
Hollywoodbets,30,30,0,0,30,16.0
Betway,30,30,0,0,30,16.0
Sports Broker,10,10,10,0,0,5.0
Grosvenor,10,10,10,0,0,8.0
ArrowBet,10,10,0,0,10,6.0
HotStreak,10,20,20,0,0,15.0
BetTOM,25,25,0,0,25,10.0
Ken Howells,25,25,0,0,25,10.0
Octobet,50,50,0,0,50,15.0
BresBet,25,25,0,0,25,10.0
DragonBet,25,25,0,0,25,10.0
QuinnBet,25,25,0,0,25,10.0`;

export function parseMatchedBettingOffersCsv(
  csvText: string,
): NormalizedBookmakerOfferSeed[] {
  const lines = csvText.trim().split(/\r?\n/);
  const headers = parseCsvRow(lines[0]);

  return lines.slice(1).map((line) => {
    const row = parseCsvRow(line);
    const record = Object.fromEntries(
      headers.map((header, index) => [header, row[index] ?? ""]),
    );
    const bookmakerName = normalizeBookmakerName(record.Bookmaker ?? "");
    const bookmakerSlug = slugify(bookmakerName);
    const qualifyingStake = toNumber(record["Qualifying Bet (£)"]);
    const totalFreeBetValue = toNumber(record["Total Free Bet (£)"]);
    const standardFreeBetValue = toNumber(record["Standard Free Bet (£)"]);
    const betBuilderFreeBetValue = toNumber(record["Bet Builder Free Bet (£)"]);
    const accumulatorFreeBetValue = toNumber(record["Accumulator Free Bet (£)"]);
    const expectedProfit = toNumber(record["Expected Profit (£)"]);

    return {
      bookmakerName,
      bookmakerSlug,
      title: `${bookmakerName} welcome offer`,
      summary: `${bookmakerName} joining offer seeded from the CSV catalog.`,
      qualifyingStake,
      totalFreeBetValue,
      standardFreeBetValue,
      betBuilderFreeBetValue,
      accumulatorFreeBetValue,
      expectedProfit,
      currency: "GBP",
      active: bookmakerName === "Virgin Bet",
      sourceCsvRow: record,
    };
  });
}

export const MATCHED_BETTING_OFFER_SEEDS =
  parseMatchedBettingOffersCsv(RAW_MATCHED_BETTING_OFFERS_CSV);

export function getOfferSeedCsvSource(): string {
  return RAW_MATCHED_BETTING_OFFERS_CSV;
}

function parseCsvRow(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      const next = line[index + 1];
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  cells.push(current);
  return cells;
}

function toNumber(value: string | undefined): number {
  return Number(value ?? 0);
}

