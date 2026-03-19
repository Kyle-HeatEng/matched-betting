import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKickoff } from "@/lib/utils";
import { listEvents } from "@/server/data.functions";

export function EventsPage() {
  const fetchEvents = useServerFn(listEvents);
  const { data = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
          Event browser
        </p>
        <h2 className="text-3xl font-semibold">Upcoming football events</h2>
      </div>

      <div className="grid gap-4">
        {data.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[color:var(--muted-foreground)]">
                    {formatKickoff(event.kickoff)}
                  </p>
                  <CardTitle>{event.event}</CardTitle>
                  <p className="text-sm text-[color:var(--muted-foreground)]">{event.competition}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.markets.map((market) => (
                    <Badge key={market}>{market}</Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                This browser is ready for bookmaker and exchange odds overlays once the Convex-backed
                data layer is wired in.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
