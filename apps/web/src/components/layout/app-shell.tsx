import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  UserButton,
  useAuth,
  useClerk,
  useUser,
} from "@clerk/tanstack-react-start";
import { LoaderCircle, LogIn } from "lucide-react";
import { authItems, navItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();

  async function handleSignOut() {
    await clerk.signOut({
      redirectUrl: "/",
    });
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" to="/">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--brand)] text-lg font-bold text-white">
              MB
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                Matched Betting
              </p>
              <h1 className="text-lg font-semibold">Virgin + Smarkets MVP</h1>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <Link
                activeProps={{ className: "bg-[color:var(--brand)] text-white" }}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-[color:var(--muted-foreground)] transition hover:bg-[color:var(--panel)] hover:text-[color:var(--foreground)]",
                  pathname.startsWith(item.to) && "bg-[color:var(--brand)] text-white",
                )}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {!isLoaded ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Session
              </div>
            ) : isSignedIn ? (
              <>
                <div className="hidden rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] sm:block">
                  {user?.primaryEmailAddress?.emailAddress ?? user?.fullName ?? "Signed in"}
                </div>
                <div className="flex items-center gap-2">
                  <UserButton />
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
                    onClick={() => void handleSignOut()}
                    type="button"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
                  to="/login"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  className="hidden items-center gap-2 rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white sm:inline-flex"
                  to="/login"
                >
                  <LogIn className="h-4 w-4" />
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden">
          {[...navItems, ...(isSignedIn ? [] : authItems)].map((item) => (
            <Link
              activeProps={{ className: "bg-[color:var(--brand)] text-white" }}
              className="whitespace-nowrap rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm font-medium text-[color:var(--foreground)]"
              key={item.to}
              to={item.to}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
