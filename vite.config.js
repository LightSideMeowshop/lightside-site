import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  // Для GitHub Pages (если деплой в корень домена)
  base: '/',

  build: {
    outDir: 'dist',
    // Генерируем sourcemaps для отладки в продакшене
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
      },
    },
  },

  // Dev server
  server: {
    port: 3000,
    open: true,
  },
});
