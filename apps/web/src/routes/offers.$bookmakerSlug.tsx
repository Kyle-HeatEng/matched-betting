import { createFileRoute } from "@tanstack/react-router";
import { OfferPage } from "@/views/offer-page";

export const Route = createFileRoute("/offers/$bookmakerSlug")({
  component: OfferPage,
});
