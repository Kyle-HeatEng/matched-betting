import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { connectSmarketsToken } from "@/server/smarkets.functions";

export function SettingsSmarketsPage() {
  const connect = useServerFn(connectSmarketsToken);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      apiToken: "",
    },
    onSubmit: async ({ value }) => {
      const result = await connect({ data: value });
      setMessage(result.message);
    },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Connect Smarkets</CardTitle>
          <CardDescription>
            Store a reusable API token so one-click lay preflight and submission can stay inside the
            matched betting flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <form.Field
              name="apiToken"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Smarkets API token</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="sk_live_..."
                    value={field.state.value}
                  />
                </div>
              )}
            />

            <Button className="w-full" type="submit">
              Save token
            </Button>
          </form>

          {message ? (
            <p className="mt-4 rounded-2xl bg-[color:var(--panel)] p-4 text-sm text-[color:var(--muted-foreground)]">
              {message}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security notes</CardTitle>
          <CardDescription>
            The current server function accepts the token and returns a demo success message. The
            backend pass should encrypt before persistence, validate token scope, and audit all lay
            submissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
          <p>Use short-lived confirmations before order submission.</p>
          <p>Block one-click lay when odds move, mapping confidence drops, or liquidity is thin.</p>
          <p>Persist the preflight quote and final order response for audit and dispute handling.</p>
        </CardContent>
      </Card>
    </div>
  );
}
