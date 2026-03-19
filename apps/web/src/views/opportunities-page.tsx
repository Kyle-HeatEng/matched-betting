import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { OpportunityTable } from "@/components/offers/opportunity-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { listOpportunities } from "@/server/data.functions";
import { confirmLayBet, preflightLayBet } from "@/server/smarkets.functions";

export function OpportunitiesPage() {
  const { offerSlug } = useParams({
    from: "/offers/$bookmakerSlug/$offerSlug/opportunities",
  });
  const fetchOpportunities = useServerFn(listOpportunities);
  const runPreflight = useServerFn(preflightLayBet);
  const submitLay = useServerFn(confirmLayBet);
  const [preflightMessage, setPreflightMessage] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [preflightState, setPreflightState] = useState<{
    layStake: number;
    liability: number;
  } | null>(null);

  const { data = [] } = useQuery({
    queryKey: ["opportunities", offerSlug],
    queryFn: () => fetchOpportunities({ data: { offerId: "virgin-bet-welcome" } }),
  });

  const firstOpportunity = data[0];

  const form = useForm({
    defaultValues: {
      backStake: 10,
    },
    onSubmit: async ({ value }) => {
      if (!firstOpportunity) return;
      const result = await runPreflight({
        data: {
          opportunityId: firstOpportunity.id,
          backStake: Number(value.backStake),
        },
      });
      setPreflightState({ layStake: result.layStake, liability: result.liability });
      setPreflightMessage(result.confirmationMessage);
      setSubmissionMessage(null);
    },
  });

  async function handleConfirm() {
    if (!firstOpportunity || !preflightState) return;
    const result = await submitLay({
      data: {
        opportunityId: firstOpportunity.id,
        layStake: preflightState.layStake,
      },
    });
    setSubmissionMessage(result.message);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
          Recommendation view
        </p>
        <h2 className="text-3xl font-semibold">Best options for Virgin Bet</h2>
      </div>

      <OpportunityTable rows={data} />

      <Card>
        <CardHeader>
          <CardTitle>One-click lay preflight demo</CardTitle>
          <CardDescription>
            This uses TanStack Form and TanStack server functions as the synchronous boundary for the
            lay flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <form.Field
              name="backStake"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Back stake</Label>
                  <Input
                    id={field.name}
                    min="1"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(Number(event.target.value))}
                    step="0.5"
                    type="number"
                    value={String(field.state.value)}
                  />
                </div>
              )}
            />

            <Button className="w-full" type="submit">
              Run preflight
            </Button>
          </form>

          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard
                label="Lay stake"
                value={preflightState ? formatCurrency(preflightState.layStake) : "—"}
              />
              <MetricCard
                label="Liability"
                value={preflightState ? formatCurrency(preflightState.liability) : "—"}
              />
            </div>

            {preflightMessage ? (
              <p className="mt-4 rounded-2xl bg-white/70 p-4 text-sm text-[color:var(--muted-foreground)]">
                {preflightMessage}
              </p>
            ) : null}

            <Button
              className="mt-4 w-full"
              disabled={!preflightState}
              onClick={() => void handleConfirm()}
              type="button"
            >
              Confirm lay order
            </Button>

            {submissionMessage ? (
              <p className="mt-4 rounded-2xl bg-white/70 p-4 text-sm text-[color:var(--muted-foreground)]">
                {submissionMessage}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
