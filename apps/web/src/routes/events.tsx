import { createFileRoute } from "@tanstack/react-router";
import { EventsPage } from "@/views/events-page";

export const Route = createFileRoute("/events")({
  component: EventsPage,
});
