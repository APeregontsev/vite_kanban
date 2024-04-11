import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import includePaths from "rollup-plugin-includepaths";

export default defineConfig({
  server: {
    open: true,
    port: 5173,
  },
  resolve: {
    alias: {
      src: "/src",
    },
  },
  publicDir: "./public",
  base: "/vite_kanban/",
  plugins: [react(), includePaths({ paths: ["./"] })],
});
