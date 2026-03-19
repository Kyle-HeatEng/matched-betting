import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgePoundSterling, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[0_30px_90px_rgba(15,23,42,0.12)] lg:grid-cols-[1.4fr_1fr] lg:p-12">
        <div className="space-y-6">
          <Badge className="border-sky-200 bg-sky-50 text-sky-700">Virgin Bet + Smarkets MVP</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Find the best qualifying bets, connect Smarkets, and track every offer in one flow.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[color:var(--muted-foreground)]">
              This MVP is built for Virgin Bet football offers first: curated offer terms, live
              odds comparison, one-click lay preflight, and a dashboard that follows your matched
              betting lifecycle from qualifier to free bet.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/offers">
                Explore offers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/login">Create account</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 rounded-[1.75rem] bg-[color:var(--panel)] p-6">
          {[
            {
              title: "Qualifying bet calculator",
              body: "Inline lay stake, liability, and qualifying loss against current Smarkets prices.",
              icon: BadgePoundSterling,
            },
            {
              title: "One-click lay flow",
              body: "Server-side preflight and confirmation flow for exact, approved mappings only.",
              icon: ShieldCheck,
            },
            {
              title: "Freshness-aware recommendations",
              body: "Best profit, lowest loss, and best liquidity views with stale data warnings.",
              icon: Zap,
            },
          ].map((feature) => (
            <Card className="bg-white/80" key={feature.title}>
              <CardHeader className="space-y-3">
                <feature.icon className="h-10 w-10 rounded-2xl bg-[color:var(--brand)]/10 p-2 text-[color:var(--brand)]" />
                <div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.body}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Clerk auth",
            description: "A single login route now handles both sign-in and sign-up.",
          },
          {
            title: "shadcn/ui design system",
            description: "Reusable cards, badges, accordion steps, and forms power the MVP screens.",
          },
          {
            title: "Bun + Convex ready",
            description: "The repo is laid out for a Convex backend and a separate Bun worker runtime.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}
