export default defineNuxtPlugin((nuxtApp) => {
  const computeEndpoint = (): string => {
    const { protocol, port, origin, pathname } = window.location
    // 開発サーバ（:3001）からXAMPP（:80/443）へ送信するためのオリジン
    const isDevServer = port === '3001'
    const phpOrigin = isDevServer ? `${protocol}//localhost` : origin
    let baseMount = ''
    if (isDevServer) {
      baseMount = '/pokedex-online-deno'
    } else {
      const segments = pathname.split('/').filter(Boolean)
      baseMount = segments.length > 0 ? `/${segments[0]}` : ''
    }
    return `${phpOrigin}${baseMount}/analytics/analytics.php`
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
  if (nuxtApp.$router) {
    nuxtApp.$router.afterEach(() => {
      send()
    })
  } else {
    // 念のためNuxtのフックでも送信
    nuxtApp.hook('page:finish', () => send())
  }
})
