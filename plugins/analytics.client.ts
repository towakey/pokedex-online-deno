export default defineNuxtPlugin((nuxtApp) => {
  const computeEndpoint = (): string => {
    const config = useRuntimeConfig()
    // NuxtのbaseURLに追従（開発時は'/'、静的生成時は'/pokedex-online/'など）
    const baseURL = (config.app && (config.app as any).baseURL) || '/'
    // 開発サーバではVite/Nitroのプロキシ（/analytics -> XAMPP）を使用
    const isDevServer = window.location.port === '3001' || import.meta.dev
    if (isDevServer) {
      return '/analytics/analytics.php'
    }
    // 本番は app.baseURL を優先し、なければパス名から先頭セグメントを推定
    let basePrefix = String(baseURL || '/').replace(/\/$/, '')
    if (!basePrefix || basePrefix === '/') {
      const segments = window.location.pathname.split('/').filter(Boolean)
      basePrefix = segments.length > 0 ? `/${segments[0]}` : ''
    }
    return `${basePrefix}/analytics/analytics.php`
  }

  const send = () => {
    try {
      const endpoint = computeEndpoint()
      const payload = {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        browser: navigator.userAgent,
        referrer: document.referrer || ''
      }

      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      const ok = navigator.sendBeacon(endpoint, blob)
      if (!ok) {
        // sendBeaconが失敗した場合のフォールバック
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
          mode: 'cors',
          cache: 'no-store'
        }).catch(() => {})
      }
    } catch {
      // 失敗時は無視（分析用途のためUXに影響させない）
    }
  }

  // 初回ロード時
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    send()
  } else {
    window.addEventListener('DOMContentLoaded', send, { once: true })
  }

  // ルート遷移時
  try {
    const router = useRouter()
    router.afterEach(() => {
      send()
    })
  } catch {
    // 念のためNuxtのフックでも送信
    nuxtApp.hook('page:finish', () => send())
  }
})
