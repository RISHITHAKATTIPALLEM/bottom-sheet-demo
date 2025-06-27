// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Add this:
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
