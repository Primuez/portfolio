import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
  },
  preview: {
    port: 5000,
    host: '0.0.0.0',
  },
});
