import { createFileRoute, redirect } from "@tanstack/react-router";
import { getViewerState } from "@/server/viewer.functions";
import { SettingsSmarketsPage } from "@/views/settings-smarkets-page";

export const Route = createFileRoute("/settings/smarkets")({
  beforeLoad: async () => {
    const viewer = await getViewerState();
    if (!viewer.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: SettingsSmarketsPage,
});
