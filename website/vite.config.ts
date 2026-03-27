import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "production") {
    return {
      build: {
        ssr: "src/index.tsx",
        outDir: "dist",
      },
    };
  }
  return {
    plugins: [devServer({ entry: "src/index.tsx" })],
  };
});
