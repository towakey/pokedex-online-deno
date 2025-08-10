// Reusable API client utilities: timeout and retry wrapper for $fetch
// Nuxt auto-imports composables under /composables

/**
 * Simple delay helper
 */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Determine whether we should retry for a given error.
 * - Retry on AbortError (timeout)
 * - Retry on network-like errors (no statusCode)
 * - Retry on 5xx
 */
function shouldRetryDefault(err: any): boolean {
  const status = (err && (err.status || err.statusCode)) ?? 0
  const name = err && err.name
  if (name === 'AbortError') return true
  if (!status) return true // network-like error (no response)
  return status >= 500
}

export function useApiClient() {
  /**
   * fetchWithRetry wraps $fetch with AbortController-based timeout and retry logic.
   * @param url Request URL
   * @param options $fetch options plus timeoutMs/retries/retryDelayMs/retryOn
   */
  async function fetchWithRetry<T = any>(
    url: string,
    options: any = {}
  ): Promise<T> {
    const {
      timeoutMs = 7000,
      retries = 2,
      retryDelayMs = 500,
      retryOn
    } = options

    // Remove our custom fields so they won't be passed to $fetch
    const { timeoutMs: _t, retries: _r, retryDelayMs: _d, retryOn: _ro, ...fetchOpts } = options

    let lastError: any
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      try {
        const res = await $fetch<T>(url, {
          ...fetchOpts,
          signal: controller.signal
        })
        clearTimeout(timer)
        return res
      } catch (err: any) {
        clearTimeout(timer)
        lastError = err
        const should = typeof retryOn === 'function' ? await retryOn(err, attempt) : shouldRetryDefault(err)
        const doRetry = attempt < retries && should
        if (!doRetry) break
        // Exponential backoff
        const wait = retryDelayMs * Math.pow(2, attempt)
        await delay(wait)
      }
    }
    throw lastError
  }

  return { fetchWithRetry }
}
