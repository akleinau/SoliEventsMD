import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { siteName } from './src/constants/siteConfig.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      vueDevTools(),
      {
        name: 'site-config-html',
        transformIndexHtml: (html) => html.replaceAll('%SITE_NAME%', siteName),
      },
  ],
    base: '/',
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
    server: {
      fs: {
        // Allow serving files from the dataset directory at the project root
        allow: ['..'],
      },
    },
    publicDir: 'public',
})
