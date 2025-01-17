import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ghPages } from 'vite-plugin-gh-pages';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ghPages(), // Add the GitHub Pages plugin
  ],
  base:"/SummarEase-frontend/",
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
