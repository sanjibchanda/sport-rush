import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// Get all .html files from project root
function getHtmlInputs() {
  const files = fs.readdirSync(__dirname);
  const htmlFiles = files.filter((file) => file.endsWith(".html"));

  const inputs = {};
  htmlFiles.forEach((file) => {
    const name = path.parse(file).name;
    inputs[name] = resolve(__dirname, file);
  });

  return inputs;
}

export default defineConfig({
  plugins: [tailwindcss()],

  build: {
    rollupOptions: {
      input: getHtmlInputs(),
    },
  },
});
