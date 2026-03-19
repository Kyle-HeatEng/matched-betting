import { createFileRoute } from "@tanstack/react-router";
import { OpportunitiesPage } from "@/views/opportunities-page";

export const Route = createFileRoute("/offers/$bookmakerSlug/$offerSlug/opportunities")({
  component: OpportunitiesPage,
});
