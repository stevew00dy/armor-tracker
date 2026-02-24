import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/armor-tracker/",
  plugins: [react(), tailwindcss()],
  server: { port: 3000 },
});
