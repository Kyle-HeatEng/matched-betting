import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSnapshot } from "@/server/data.functions";

export function AdminPage() {
  const fetchAdmin = useServerFn(getAdminSnapshot);
  const { data } = useQuery({
    queryKey: ["admin"],
    queryFn: () => fetchAdmin(),
  });

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
          Admin
        </p>
        <h2 className="text-3xl font-semibold">Ops and mapping review</h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <AdminListCard items={data.staleWarnings} title="Stale warnings" />
        <AdminListCard items={data.failedJobs} title="Failed jobs" />
        <AdminListCard items={data.pendingMappings} title="Pending mappings" />
      </div>
    </div>
  );
}

function AdminListCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-[color:var(--muted-foreground)]">
          {items.map((item) => (
            <li
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
