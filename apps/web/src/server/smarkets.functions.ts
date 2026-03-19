import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TokenSchema = z.object({
  apiToken: z.string().min(12),
});

const PreflightSchema = z.object({
  opportunityId: z.string().min(1),
  backStake: z.number().positive(),
});

export const connectSmarketsToken = createServerFn({ method: "POST" })
  .validator(TokenSchema)
  .handler(async ({ data }) => {
    return {
      connected: true,
      maskedToken: `${data.apiToken.slice(0, 4)}••••${data.apiToken.slice(-4)}`,
      message:
        "Token accepted by the web layer. Persist this through Convex with encryption in the backend integration pass.",
    };
  });

export const preflightLayBet = createServerFn({ method: "POST" })
  .validator(PreflightSchema)
  .handler(async ({ data }) => {
    const layStake = Number((data.backStake * 0.954).toFixed(2));
    const liability = Number((layStake * 2.25).toFixed(2));

    return {
      opportunityId: data.opportunityId,
      layStake,
      liability,
      quoteStatus: "fresh" as const,
      liquidityStatus: "sufficient" as const,
      confirmationMessage:
        "Preflight passed on the demo server action. Wire this to Smarkets quote refresh and Convex candidate validation next.",
    };
  });

export const confirmLayBet = createServerFn({ method: "POST" })
  .validator(
    z.object({
      opportunityId: z.string().min(1),
      layStake: z.number().positive(),
    }),
  )
  .handler(async ({ data }) => {
    return {
      ok: true,
      reference: `demo-${data.opportunityId}`,
      message:
        "Lay order submitted through the demo action. Replace this with the real Smarkets order placement flow after backend wiring.",
    };
  });
