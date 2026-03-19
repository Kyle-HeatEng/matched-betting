import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Opportunity } from "@/lib/demo-data";
import { formatCurrency, formatKickoff } from "@/lib/utils";

type OpportunityTableProps = {
  rows: Opportunity[];
};

export function OpportunityTable({ rows }: OpportunityTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <CardTitle>Best qualifying and free bet options</CardTitle>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Ranked by expected profit, qualifying loss, liquidity, and one-click eligibility.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Best profit</Badge>
          <Badge>Lowest loss</Badge>
          <Badge>One-click eligible</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => (
          <div
            className="grid gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 lg:grid-cols-[1.8fr_repeat(4,minmax(0,0.8fr))_auto]"
            key={row.id}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
                {formatKickoff(row.kickoff)}
              </p>
              <div>
                <h3 className="text-xl font-semibold">{row.event}</h3>
                <p className="text-sm text-[color:var(--muted-foreground)]">{row.competition}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{row.market}</Badge>
                <Badge>{row.outcome}</Badge>
                {row.oneClickEligible ? (
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    One-click
                  </Badge>
                ) : (
                  <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                    Manual lay
                  </Badge>
                )}
              </div>
            </div>

            <Metric label="Back" tone="back" value={row.backOdds.toFixed(2)} />
            <Metric label="Lay" tone="lay" value={row.layOdds.toFixed(2)} />
            <Metric
              label="Qualifying loss"
              tone="loss"
              value={formatCurrency(row.qualifyingLoss)}
            />
            <Metric
              label="Net expected"
              tone="profit"
              value={formatCurrency(row.netExpectedProfit)}
            />
            <Metric
              label="Liquidity"
              tone="neutral"
              value={formatCurrency(row.layLiquidity)}
            />

            <Button className="self-center">Select</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "back" | "lay" | "loss" | "profit" | "neutral";
}) {
  const styles = {
    back: "bg-sky-100 text-sky-900",
    lay: "bg-rose-100 text-rose-900",
    loss: "bg-rose-50 text-rose-700",
    profit: "bg-emerald-50 text-emerald-700",
    neutral: "bg-slate-100 text-slate-900",
  }[tone];

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
        {label}
      </p>
      <div className={`rounded-2xl px-4 py-3 text-center text-lg font-semibold ${styles}`}>
        {value}
      </div>
    </div>
  );
}
