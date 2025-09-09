// https://nuxt.com/docs/api/configuration/nuxt-config
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

const APP_BASE_URL = process.env.NUXT_PUBLIC_APP_BASE_URL || (process.env.NODE_ENV === 'production' ? '/pokedex-online/' : '/')

export default defineNuxtConfig({
  app: {
    // 開発時は'/'、静的生成時は'/pokedex-online/'を使用
    baseURL: APP_BASE_URL,
    head: {
      meta: [
        // 軽度なキャッシュ制御（静的アセットは除外）
        { name: 'version', content: `${Date.now()}` }
      ],
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
      script: [
        {
          // Google AdSenseスクリプト
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2849970156029655',
          async: true,
          crossorigin: 'anonymous',
          // 実際のクライアントIDに置き換えてください
        },
      ],
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // .env から読み込むランタイム設定
  runtimeConfig: {
    public: {
      // クライアントでも参照可能
      appBaseURL: APP_BASE_URL
    }
  },
  
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
        },
        // analytics(PHP) も開発サーバからXAMPPへプロキシ
        '/analytics': {
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
    // アセットファイル名にハッシュを自動追加
    minify: true,
    devProxy: {
      '/api': {
        target: 'http://localhost/pokedex-online-deno',
        prependPath: true,
        changeOrigin: true
      },
      // analytics(PHP) も開発サーバからXAMPPへプロキシ
      '/analytics': {
        target: 'http://localhost/pokedex-online-deno',
        prependPath: true,
        changeOrigin: true
      }
    },
    // 動的ルートの事前生成設定
    prerender: {
      routes: [
        '/pokedex/central_kalos',
        '/pokedex/coast_kalos',
        '/pokedex/mountain_kalos',
        '/pokedex/alola',
        '/pokedex/melemele',
        '/pokedex/akala',
        '/pokedex/ulaula',
        '/pokedex/poni',
        '/pokedex/galar',
        '/pokedex/isle_of_armor',
        '/pokedex/crown_tundra',
        '/pokedex/paldea',
        '/pokedex/kitakami',
        '/pokedex/blueberry',
        '/pokedex/national',
        '/pokedex/kanto',
        '/pokedex/johto',
        '/pokedex/hoenn',
        '/pokedex/sinnoh',
        '/pokedex/unova',
        // リーフページのルート
        '/leaf',
        '/leaf/leaf/1',
        '/leaf/leaf/2',
        '/leaf/leaf/3',
        '/leaf/leaf/4',
        '/leaf/leaf/5',
        '/leaf/leaf/6',
        '/leaf/leaf/7',
        '/leaf/leaf/8',
        '/leaf/leaf/9',
        '/leaf/leaf/10',
        '/leaf/leaf/11',
        '/leaf/leaf/12',
        '/leaf/leaf/13',
        '/leaf/leaf/14',
        '/leaf/leaf/16',
        '/leaf/leaf/17',
        '/leaf/leaf/18'
      ]
    }
  },

  modules: ['@nuxt/image'],

  // 動的ルートのハイブリッド設定 - リロード時の正しいルート表示を確保
  routeRules: {
    // ルートレベルは事前レンダリング
    '/': { prerender: true },
    '/pokedex': { prerender: true },
    // リーフページは事前レンダリング
    '/leaf': { prerender: true },
    '/leaf/**': { prerender: true },
    // 動的エリアページは事前レンダリング + CSR
    '/pokedex/global': { prerender: true, ssr: false },
    '/pokedex/central_kalos': { prerender: true, ssr: false },
    '/pokedex/coast_kalos': { prerender: true, ssr: false },
    '/pokedex/mountain_kalos': { prerender: true, ssr: false },
    '/pokedex/alola': { prerender: true, ssr: false },
    '/pokedex/melemele': { prerender: true, ssr: false },
    '/pokedex/akala': { prerender: true, ssr: false },
    '/pokedex/ulaula': { prerender: true, ssr: false },
    '/pokedex/poni': { prerender: true, ssr: false },
    '/pokedex/galar': { prerender: true, ssr: false },
    '/pokedex/isle_of_armor': { prerender: true, ssr: false },
    '/pokedex/crown_tundra': { prerender: true, ssr: false },
    '/pokedex/paldea': { prerender: true, ssr: false },
    '/pokedex/kitakami': { prerender: true, ssr: false },
    '/pokedex/blueberry': { prerender: true, ssr: false },
    '/pokedex/national': { prerender: true, ssr: false },
    '/pokedex/kanto': { prerender: true, ssr: false },
    '/pokedex/johto': { prerender: true, ssr: false },
    '/pokedex/hoenn': { prerender: true, ssr: false },
    '/pokedex/sinnoh': { prerender: true, ssr: false },
    '/pokedex/unova': { prerender: true, ssr: false },
    // 個別ポケモンページはSPA化（数が多すぎるため）
    '/pokedex/**': { prerender: false, ssr: false }
  },

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

      // analyticsディレクトリも.output/publicにコピー（PHPエンドポイント配置）
      const sourceAnalyticsDir = join(process.cwd(), 'analytics')
      const targetAnalyticsDir = join(nitro.options.output.publicDir, 'analytics')

      if (existsSync(sourceAnalyticsDir)) {
        console.log('analyticsディレクトリを静的生成出力にコピー中...')
        copyDirectoryRecursive(sourceAnalyticsDir, targetAnalyticsDir)
        console.log('analyticsディレクトリのコピーが完了しました')
      }

      // ルートまたはpublic配下の .htaccess を .output/public にコピー
      const publicDir = nitro.options.output.publicDir
      const rootHtaccess = join(process.cwd(), '.htaccess')
      const publicHtaccess = join(process.cwd(), 'public', '.htaccess')
      const targetHtaccess = join(publicDir, '.htaccess')

      try {
        if (existsSync(rootHtaccess)) {
          console.log('.htaccess をプロジェクトルートから静的生成出力にコピー中...')
          copyFileSync(rootHtaccess, targetHtaccess)
          console.log('.htaccess のコピーが完了しました（ルート）')
        } else if (existsSync(publicHtaccess)) {
          console.log('.htaccess をpublic/から静的生成出力にコピー中...')
          copyFileSync(publicHtaccess, targetHtaccess)
          console.log('.htaccess のコピーが完了しました（public/）')
        } else {
          console.log('.htaccess が見つかりませんでした（ルートまたはpublic/）。スキップします。')
        }
      } catch (e) {
        console.error('.htaccess のコピー中にエラーが発生しました:', e)
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
    baseURL: APP_BASE_URL,
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