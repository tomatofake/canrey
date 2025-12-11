import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3333,
    allowedHosts: ["canrey.com.ua", "www.canrey.com.ua"],
  },
  preview: {
    host: "0.0.0.0",
    port: 3333,
    allowedHosts: ["canrey.com.ua", "www.canrey.com.ua"],
  },
});
