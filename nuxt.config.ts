// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/vuetify@latest/dist/vuetify.min.css',
        },
      ],
    },
  },
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
    plugins: [],
    server: {
      // PCスリープ後のタイムアウトエラーを防ぐ設定
      hmr: {
        timeout: 30000 // 30秒に延長
      },
      // WebSocketの再接続設定を無効化（問題がある場合）
      ws: false,
      proxy: {
        '/api': {
          target: 'http://localhost/pokedex-online-deno',
          changeOrigin: true
        }
      }
    },
    // モジュール解決のタイムアウトを延長
    optimizeDeps: {
      // 依存関係の事前バンドル設定
      include: [],
      // 強制的な依存関係の再バンドル
      force: true
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