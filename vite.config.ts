import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import includePaths from "rollup-plugin-includepaths";
import EnvironmentPlugin from "vite-plugin-environment";

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
  plugins: [react(), includePaths({ paths: ["./"] }), EnvironmentPlugin("all")],
});
