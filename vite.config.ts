import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    base: mode === "production" && process.env.GITHUB_ACTIONS === "true"
        ? "/" + (process.env.GITHUB_REPOSITORY?.split('/')[1] || "") + "/"
        : "/",
    server: {
        host: "::",
        port: 8080,
    },
    plugins: [
        react(),
        mode === 'development' && componentTagger(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.ico", "pwa-icon-192.png", "pwa-icon-512.png"],
            manifest: false,
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
                navigateFallback: null,
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            },
        }),
    ].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        sourcemap: mode === 'development',
        outDir: 'dist',
        assetsDir: 'assets',
    },
}));
