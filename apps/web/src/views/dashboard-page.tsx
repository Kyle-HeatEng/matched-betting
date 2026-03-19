import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useParams } from "@tanstack/react-router";
import { useAuth } from "@clerk/tanstack-react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getDashboardSnapshot } from "@/server/data.functions";

export function DashboardPage() {
  const fetchDashboard = useServerFn(getDashboardSnapshot);
  const { dashboardId } = useParams({ strict: false });
  const { isLoaded, isSignedIn } = useAuth();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["dashboard", dashboardId],
    queryFn: () => fetchDashboard({ data: { dashboardId: dashboardId ?? "" } }),
    enabled: Boolean(dashboardId) && isLoaded && Boolean(isSignedIn),
  });

  if (!isLoaded || (isSignedIn && (isLoading || isFetching))) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preparing your dashboard</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[color:var(--muted-foreground)]">
          Loading the latest dashboard data for this account.
        </CardContent>
      </Card>
    );
  }

  if (!isSignedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login required</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[color:var(--muted-foreground)]">
          Sign in to view this dashboard.
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard unavailable</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[color:var(--muted-foreground)]">
          This dashboard could not be found for the current authenticated user.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
          Dashboard
        </p>
        <h2 className="text-3xl font-semibold">{data.dashboard.name}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Estimated profit", value: formatCurrency(data.estimatedProfit) },
          { label: "Actual profit", value: formatCurrency(data.actualProfit) },
          { label: "Free bets available", value: String(data.freeBetsAvailable) },
          { label: "Qualifying placed", value: String(data.qualifyingPlaced) },
          { label: "Lay bets placed", value: String(data.layBetsPlaced) },
          { label: "Completed offers", value: String(data.completedOffers) },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
