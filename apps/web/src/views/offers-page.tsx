import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { listOffers } from "@/server/data.functions";

export function OffersPage() {
  const fetchOffers = useServerFn(listOffers);
  const { data = [] } = useQuery({
    queryKey: ["offers"],
    queryFn: () => fetchOffers(),
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
          Offer explorer
        </p>
        <h2 className="text-3xl font-semibold">Virgin Bet public MVP</h2>
      </div>

      <div className="grid gap-6">
        {data.map((offer) => (
          <Card key={offer.id}>
            <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge>{offer.bookmakerName}</Badge>
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    Expected {formatCurrency(offer.expectedProfit)}
                  </Badge>
                </div>
                <div>
                  <CardTitle>{offer.title}</CardTitle>
                  <CardDescription>
                    Qualifier stake {formatCurrency(offer.qualifierStake)}. Free bets total{" "}
                    {formatCurrency(offer.totalFreeBet)}.
                  </CardDescription>
                </div>
              </div>

              <Button asChild>
                <Link
                  params={{ bookmakerSlug: offer.bookmakerSlug }}
                  to="/offers/$bookmakerSlug"
                >
                  View offer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {offer.restrictions.map((restriction) => (
                <Badge key={restriction}>{restriction}</Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
