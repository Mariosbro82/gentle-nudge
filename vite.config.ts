import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    // Base path for GitHub Pages - use repo name for project pages
    // Change to "/" if using custom domain or user/org pages
    // "deep dive": dynamically detect if running in GitHub Actions to set the correct base path.
    // We use GITHUB_REPOSITORY (e.g. "owner/repo") to extract the repo name for the base path.
    // If not in GH Actions (e.g. Lovable/Local), fallback to "/".
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

