import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

function contactDevPlugin() {
  return {
    name: 'contact-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { processContactSubmission } = await import('./lib/contact-handler.js');
              const data = JSON.parse(body || '{}');
              const result = await processContactSubmission(data);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.success ? 200 : 400;
              res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), contactDevPlugin()],
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
