import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  envPrefix: ["VITE_"],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    watch: {
      ignored: ["**/src/routeTree.gen.ts"],
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
    }),
    react(),
  ],
  ssr: {
    noExternal: ["@clerk/tanstack-react-start"],
  },
});
