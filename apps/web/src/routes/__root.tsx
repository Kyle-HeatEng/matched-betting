import type { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/tanstack-react-start";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { getClientClerkPublishableKey } from "@/lib/clerk-env";
import { getConvexClient } from "@/lib/convex-client";
import { queryClient } from "@/lib/query-client";

export interface RouterAppContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Matched Betting MVP" },
      {
        name: "description",
        content:
          "Virgin Bet + Smarkets matched betting dashboard with offer explorer, recommendations, and one-click lay scaffolding.",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <div className="space-y-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
        Not found
      </p>
      <h2 className="text-3xl font-semibold">That page does not exist.</h2>
    </div>
  ),
});

function RootComponent() {
  const publishableKey = getClientClerkPublishableKey();

  if (!publishableKey) {
    return (
      <RootDocument>
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              Clerk configuration required
            </p>
            <h2 className="text-3xl font-semibold">Authentication is not configured yet.</h2>
            <p className="text-[color:var(--muted-foreground)]">
              Set a real <code>VITE_CLERK_PUBLISHABLE_KEY</code>, <code>CLERK_SECRET_KEY</code>,
              and <code>CLERK_JWT_ISSUER_DOMAIN</code> in your local env, then restart the dev
              server.
            </p>
            <p className="text-sm text-[color:var(--muted-foreground)]">
              Placeholder Clerk values now show this message instead of crashing SSR and causing
              the route tree reload loop.
            </p>
          </div>
        </div>
      </RootDocument>
    );
  }

  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider
          publishableKey={publishableKey}
          signInUrl="/login"
          signInForceRedirectUrl="/dashboard"
          signInFallbackRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        >
          <ConvexProviderWithClerk client={getConvexClient()} useAuth={useAuth}>
            <AppShell>
              <Outlet />
            </AppShell>
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </QueryClientProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-GB">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
