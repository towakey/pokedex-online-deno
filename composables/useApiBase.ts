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

  // クライアント側では常に '/api' を使用
  const { port } = window.location
  const isDevServer = port === '3001'

  // 開発サーバでも本番サーバでも '/api' を使用
  // 本番では静的生成時に api ディレクトリがルートにコピーされるため
  const apiBase = '/api'
  const buildUrl = (path: string) => {
    const p = path.startsWith('/') ? path : `/${path}`
    return `${apiBase}${p}`
  }

  return { apiBase, buildUrl }
}
