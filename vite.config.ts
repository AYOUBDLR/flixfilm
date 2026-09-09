import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function lockerApiPlugin(): Plugin {
  return {
    name: 'locker-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/locker/offers', async (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const response = await fetch('https://saveapp.space/cl/v/l7v3wd', {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
          });
          const html = await response.text();
          const match = html.match(/window\.lockerAssistant\s*=\s*(\{[\s\S]*?\});/);
          if (match && match[1]) {
            const data = JSON.parse(match[1]);
            res.statusCode = 200;
            res.end(JSON.stringify({success: true, data}));
            return;
          }
        } catch (err) {
          console.error('Error fetching live locker offers:', err);
        }

        res.statusCode = 200;
        res.end(
          JSON.stringify({
            success: true,
            data: {
              color: '#675E01',
              locker: {
                title: 'Movie Locked',
                slug: 'l7v3wd',
              },
              offers: [
                {
                  short_name: 'Quick install: Opera GX',
                  instructions: 'Download and run OperaGX!',
                  tracking_url: 'https://saveapp.space/cl/i/l7v3wd',
                  thumbnail:
                    'https://cdn.saveapp.space/img/offer/64999',
                  rating: 4.8,
                  time: '~1 min',
                },
                {
                  short_name: 'Get $750 to your CashApp here!',
                  instructions:
                    'Input Emails to have a chance to Get $750 to your CashApp!',
                  tracking_url: 'https://saveapp.space/cl/i/l7v3wd',
                  thumbnail:
                    'https://cdn.saveapp.space/img/offer/76195',
                  rating: 4.6,
                  time: '~1 min',
                },
              ],
            },
          })
        );
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), lockerApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
