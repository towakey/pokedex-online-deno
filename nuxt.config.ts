// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // デバッグとエラー詳細表示設定
  ssr: true,
  debug: true,
  
  // エラー詳細表示
  experimental: {
    renderJsonPayloads: false
  },

  devServer: {
    port: 3001
  },

  vite: {
    plugins: [vuetify()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost/pokedex-online-deno',
          changeOrigin: true
        }
      }
    }
  },

  css: ['@/assets/styles/common.scss'],

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost/pokedex-online-deno',
        prependPath: true,
        changeOrigin: true
      }
    }
  },

  modules: ['@nuxt/image'],

  image: {
    // IPXのサイズ制限やフォーマット制限を緩和して500エラーを回避
    domains: [],
    alias: {
      '/img': '/img'
    },
    // 静的アセットを直接提供するためのipx設定
    ipx: {
      maxAge: 60 * 60 * 24 * 365, // 1年
      // 複雑なファイル名でも処理できるように設定
      modifiers: {
        quality: 100,
        format: 'png'
      }
    }
  }
})