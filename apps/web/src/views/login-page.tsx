import { SignIn } from "@clerk/tanstack-react-start";
import { Card, CardContent } from "@/components/ui/card";

export function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
          Authentication
        </p>
        <h2 className="text-3xl font-semibold">Login</h2>
      </div>
      <Card className="mx-auto max-w-lg overflow-hidden">
        <CardContent className="p-0">
          <SignIn
            fallbackRedirectUrl="/dashboard"
            forceRedirectUrl="/dashboard"
            signUpFallbackRedirectUrl="/dashboard"
            signUpForceRedirectUrl="/dashboard"
          />
        </CardContent>
      </Card>
    </div>
  );
}
