export function useApiBase() {
  const config = useRuntimeConfig()

  // SSR（Nitro）側では絶対URLを返す
  if (process.server) {
    const base = (config.public && (config.public as any).baseUrl) || 'http://localhost:3001'
    const apiBase = `${String(base).replace(/\/$/, '')}/api`
    const buildUrl = (path: string) => {
      const p = path.startsWith('/') ? path : `/${path}`
      return `${apiBase}${p}`
    }
    return { apiBase, buildUrl }
  }

  // クライアント側ではベースのマウントパスを動的に算出
  const { port, pathname } = window.location
  const isDevServer = port === '3001'

  // 開発サーバでは Vite/Nitro のプロキシに合わせて '/api' をそのまま使う
  // 本番（XAMPP 配下）では先頭セグメント（例: '/pokedex-online-deno'）を付与
  let baseMount = ''
  if (!isDevServer) {
    const segments = pathname.split('/').filter(Boolean)
    baseMount = segments.length > 0 ? `/${segments[0]}` : ''
  }

  const apiBase = `${baseMount}/api`
  const buildUrl = (path: string) => {
    const p = path.startsWith('/') ? path : `/${path}`
    return `${apiBase}${p}`
  }

  return { apiBase, buildUrl }
}
