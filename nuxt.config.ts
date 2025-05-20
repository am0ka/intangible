// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-06',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL,
      SUPABASE_KEY: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
    SUPABASE_SERVICE_KEY: process.env.NUXT_SUPABASE_SERVICE_KEY,
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/*'],
    },
  },
  imports: {
    dirs: ["~/stores"]
  },
  routeRules: {
    '/.well-known/**': { static: true }
  },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/content',
    '@pinia/nuxt',
    'nuxt-toast'
  ],
  fonts: {
    families: [
      {
        name: 'Inter',
        provider: 'google',
        preload: true,
        display: 'swap'
      }
    ]
  },
  vite: {
    plugins: [
      tailwindcss(),
    ]
  }
})