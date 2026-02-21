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
            manifest: false, // We use the static manifest.json in public/
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
                navigateFallback: "/index.html",
                navigateFallbackDenylist: [/^\/~oauth/],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/.*supabase\.co\/.*/i,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "supabase-api",
                            expiration: { maxEntries: 50, maxAgeSeconds: 300 },
                        },
                    },
                ],
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
