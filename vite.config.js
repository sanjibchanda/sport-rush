import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"), // Your main entry point (e.g., home page)
        products: resolve(__dirname, "products.html"), // Additional HTML pages
        // Add more entry points for other HTML files as needed
      },
    },
  },
});
