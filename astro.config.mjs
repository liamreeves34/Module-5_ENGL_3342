// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://liamreeves34.github.io',
  base: '/Module-5_ENGL_3342',
  vite: {
    plugins: [tailwindcss()]
  }
});