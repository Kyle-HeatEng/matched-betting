import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { OfferSteps } from "@/components/offers/offer-steps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getOfferSnapshot } from "@/server/data.functions";

export function OfferPage() {
  const { bookmakerSlug } = useParams({ from: "/offers/$bookmakerSlug" });
  const fetchOffer = useServerFn(getOfferSnapshot);
  const { data: offer } = useQuery({
    queryKey: ["offer", bookmakerSlug],
    queryFn: () => fetchOffer({ data: { offerId: "virgin-bet-welcome" } }),
  });

  if (!offer) {
    return <div>Offer not found.</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge>{offer.bookmakerName}</Badge>
          <h2 className="text-3xl font-semibold">{offer.title}</h2>
          <p className="max-w-3xl text-[color:var(--muted-foreground)]">
            Curated offer terms with a live opportunity screen for the qualifying bet and free bet
            conversion flow.
          </p>
        </div>

        <OfferSteps steps={offer.steps} />
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Offer summary</CardTitle>
          <CardDescription>
            Keep the rules visible while you compare markets and preflight the Smarkets lay.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryMetric label="Qualifier" value={formatCurrency(offer.qualifierStake)} />
            <SummaryMetric label="Free bet" value={formatCurrency(offer.totalFreeBet)} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Key restrictions</p>
            <div className="flex flex-wrap gap-2">
              {offer.restrictions.map((restriction) => (
                <Badge key={restriction}>{restriction}</Badge>
              ))}
            </div>
          </div>

          <Button asChild className="w-full">
            <Link
              params={{ bookmakerSlug, offerSlug: offer.id }}
              to="/offers/$bookmakerSlug/$offerSlug/opportunities"
            >
              View best options
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
