import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Ensure Vercel/CI also respects .env.* files locally when running vite commands.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      "process.env": {
        VITE_API_BASE_URL: env.VITE_API_BASE_URL,
      },
    },
  };
});
