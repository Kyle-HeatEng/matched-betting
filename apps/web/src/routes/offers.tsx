import { createFileRoute } from "@tanstack/react-router";
import { OffersPage } from "@/views/offers-page";

export const Route = createFileRoute("/offers")({
  component: OffersPage,
});
