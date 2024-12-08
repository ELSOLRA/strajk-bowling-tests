import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    global: true,
    environment: "jsdom",
    setupFiles: "./setup-tests.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "json-summary"],
      include: ["src/**/*.js", "src/**/*.jsx"],
      exclude: ["src/main.jsx", "src/mocks/**"],
    },
  },
});
