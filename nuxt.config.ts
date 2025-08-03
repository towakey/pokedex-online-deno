// https://nuxt.com/docs/api/configuration/nuxt-config
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

export default defineNuxtConfig({
  app: {
    // XAMPP環境用のbaseURL設定（一時的）
    baseURL: '/pokedex-online/',
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

  // 静的生成時にAPIディレクトリをコピーするためのフック
  hooks: {
    'nitro:build:public-assets': async (nitro) => {
      // APIディレクトリを.output/publicにコピー
      const sourceApiDir = join(process.cwd(), 'api')
      const targetApiDir = join(nitro.options.output.publicDir, 'api')
      
      if (existsSync(sourceApiDir)) {
        console.log('APIディレクトリを静的生成出力にコピー中...')
        copyDirectoryRecursive(sourceApiDir, targetApiDir)
        console.log('APIディレクトリのコピーが完了しました')
      }
    }
  },

  image: {
    // 静的生成用の設定 - IPX処理を完全無効化
    provider: 'static',
    domains: [],
    // 静的アセットの直接配信
    dir: 'public',
    // ベースURLを考慮した設定
    baseURL: process.env.NODE_ENV === 'production' ? '/pokedex-online/' : '/',
    // IPXを無効化して直接画像配信
    screens: {},
    presets: {},
    // 静的生成時は最適化処理をスキップ
    format: ['webp', 'png', 'jpg'],
    quality: 100
  }
})

// ディレクトリを再帰的にコピーするヘルパー関数
function copyDirectoryRecursive(source: string, target: string) {
  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true })
  }

  const files = readdirSync(source)
  
  for (const file of files) {
    const sourcePath = join(source, file)
    const targetPath = join(target, file)
    
    const stat = statSync(sourcePath)
    
    if (stat.isDirectory()) {
      copyDirectoryRecursive(sourcePath, targetPath)
    } else {
      copyFileSync(sourcePath, targetPath)
    }
  }
}