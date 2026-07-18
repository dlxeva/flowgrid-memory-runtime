import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages serves this project from a repository subpath.
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [react()],
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/.aws-sam/**"],
  },
});
