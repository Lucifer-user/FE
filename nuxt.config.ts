
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-02',
  ssr: true,
  devtools: { enabled: false },

  modules: [
  '@nuxtjs/tailwindcss',
  '@nuxtjs/turnstile',
  '@nuxtjs/i18n'
],

  // Nuxt 3.21 + Vite 7 can miss this generated alias in Windows dev mode.
  // The app manifest is disabled in this project, so a static empty module is sufficient.
  alias: {
    '#app-manifest': fileURLToPath(new URL('./app-manifest.mock.ts', import.meta.url))
  },

  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'vi', file: 'vi.json' }
    ],
    defaultLocale: 'vi',
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'locales/',
  },

  turnstile: {
  siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || ''
},
  css: [
    '~/assets/tailwind.css'
  ],

  app: {
    head: {
      title: 'Orbit AI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/brand/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' }
      ]
    }
  },

  nitro: {
    preset: process.env.NITRO_PRESET || 'vercel',
    compressPublicAssets: true,
    minify: false,
    vercel: {
      functions: {
        maxDuration: 10
      }
    },
    // Cho phép Firebase OAuth popup giao tiếp với trang cha
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
        }
      }
    }
  },

  // Fix COOP cho dev server - Firebase Google login cần popup giao tiếp lại trang cha
  vite: {

    build: {
      minify: 'esbuild'
    },
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
      }
    }
  },

    runtimeConfig: {
  // Chỉ Nuxt SSR phía server sử dụng
  apiBaseInternal:
    process.env.NUXT_API_BASE_INTERNAL || 'http://127.0.0.1/api',

  turnstile: {
    secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY || ''
  },

  public: {
    // Trình duyệt sử dụng
    apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',

    siteUrl:
      process.env.NUXT_PUBLIC_SITE_URL ||
      process.env.NUXT_PUBLIC_APP_URL ||
      '',

    firebase: {
      apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId:
        process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || ''
    }
  }
}
})
