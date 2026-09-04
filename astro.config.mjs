// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
  // Dominio custom alla root di regolazero.it — nessun `base`.
  site: 'https://regolazero.it',
  integrations: [mdx(), sitemap(), pagefind()],
  build: { format: 'directory' },
});
