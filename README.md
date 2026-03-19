# Matched Betting MVP

TypeScript monorepo for a matched betting SaaS:

- `apps/web`: TanStack Start + React + shadcn/ui web app
- `packages/domain`: shared types, calculators, ranking, and mapping helpers
- `packages/db`: Convex schema, data contracts, and seed helpers
- `packages/worker`: Bun worker for Virgin odds and Smarkets ingestion
- `convex`: Convex app functions and Clerk-backed auth config

## Planned flows

- manual offer curation seeded from CSV
- Virgin Bet offer explorer and opportunities
- Smarkets token connect and one-click lay preflight
- dashboard tracking for qualifying bets, lay bets, and free bets
- admin pages for mapping and scrape health
- Clerk auth with a single login route that can handle sign-in and sign-up

## Environment

Create both environment files before running the app:

- root `.env.local` from [`.env.example`](/Users/kylealbert/Documents/matched-betting/.env.example) for Convex and backend auth secrets
- `apps/web/.env.local` from [`apps/web/.env.example`](/Users/kylealbert/Documents/matched-betting/apps/web/.env.example) for TanStack Start/Vite public client envs

The auth flow expects:

- `VITE_CONVEX_URL` for Convex HTTP access from the TanStack Start app
- `VITE_CLERK_PUBLISHABLE_KEY` for the TanStack Start Clerk client
- `CLERK_SECRET_KEY` for Clerk server middleware
- `CLERK_JWT_ISSUER_DOMAIN` for Convex JWT verification
- `CONVEX_DEPLOYMENT` for the local Convex CLI session

## Local development

1. `bun install`
2. `bunx convex dev`
3. configure root `.env.local` and `apps/web/.env.local`
4. `bun run dev:web`
