import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    // Generate legacy bundles for older browsers
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    // Compress assets with Brotli and Gzip
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    compression({
      algorithm: "gzip",
      ext: ".gz",
    }),

    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Your App Name",
        short_name: "App",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    // Bundle size analyzer (generates stats.html)
    visualizer({
      filename: "stats.html",
      open: false,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Reduce disk space usage
    emptyOutDir: true,

    // Enable minification optimizations
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.trace",
        ],
      },
      format: {
        comments: false, // Remove comments
      },
    },

    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          // Add other large dependencies here
        },
        // Optimize chunk names
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },

    // Asset optimization
    assetsInlineLimit: 4096, // Inline small files (< 4kb)
    cssCodeSplit: true, // Enable CSS code splitting
    sourcemap: false, // Disable sourcemaps in production

    // Report compression stats
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },

  // Development server settings
  server: {
    host: "0.0.0.0",
    port: 5174,
  },

  // Enable asset preloading
  experimental: {
    renderBuiltUrl(
      filename: string,
      { hostType }: { hostType: "js" | "css" | "html" }
    ) {
      return { relative: true };
    },
  },
});
