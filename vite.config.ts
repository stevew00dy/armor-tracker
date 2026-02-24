import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/star-citizen-rare-armor/",
  plugins: [react(), tailwindcss()],
  server: { port: 3000 },
});
