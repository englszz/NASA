import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')
  const domain = env.VITE_SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL
  const origin = domain ? new URL(domain.startsWith('http') ? domain : `https://${domain}`).origin : ''
  const image = `${origin}/brand/skyra-share.png`
  return {
  plugins: [react(), {
    name: 'skyra-social-metadata',
    transformIndexHtml(html, context) {
      const title = html.match(/<title>(.*?)<\/title>/)?.[1] || 'Skyra'
      const description = 'Datos que anticipan tu día. Explora el territorio de República Dominicana con Skyra.'
      const meta = (property, content) => ({ tag: 'meta', attrs: { property, content }, injectTo: 'head' })
      const tags = [
        meta('og:type', 'website'),
        meta('og:locale', 'es_DO'),
        meta('og:site_name', 'Skyra'),
        meta('og:title', title),
        meta('og:description', description),
        meta('og:image', image),
        meta('og:image:type', 'image/png'),
        meta('og:image:width', '1200'),
        meta('og:image:height', '630'),
        meta('og:image:alt', 'Isotipo de Skyra sobre fondo blanco'),
        ...Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': title, 'twitter:description': description, 'twitter:image': image, 'twitter:image:alt': 'Isotipo de Skyra sobre fondo blanco' }).map(([name, content]) => ({ tag: 'meta', attrs: { name, content }, injectTo: 'head' })),
      ]
      if (origin) tags.push(meta('og:url', new URL(context.path === '/index.html' ? '/' : context.path, origin).href))
      return tags
    },
  }],
  build: {
    rollupOptions: {
      input: ['index.html', 'mapa.html', 'nosotros.html', 'informacion.html'],
    },
  },
  }
})
