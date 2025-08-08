import { ref, computed } from 'vue'

// AdSense設定の型定義
export interface AdSenseConfig {
  description?: string
  client: string
  slots: {
    rectangle: string
    banner: string
    square: string
    large_banner: string
    mobile_banner: string
    [key: string]: string
  }
  settings: {
    testMode: boolean
    fullWidthResponsive: string
    adFormat: string
  }
  labels: {
    advertisement: string
    sponsored: string
    promotion: string
  }
}

// デフォルト設定（フォールバック用）
const defaultConfig: AdSenseConfig = {
  client: 'ca-pub-xxxxxxxxxxxxxxxx',
  slots: {
    rectangle: '1234567890',
    banner: '0987654321',
    square: '1111111111',
    large_banner: '2222222222',
    mobile_banner: '3333333333'
  },
  settings: {
    testMode: true,
    fullWidthResponsive: 'true',
    adFormat: 'auto'
  },
  labels: {
    advertisement: '広告',
    sponsored: 'スポンサードリンク',
    promotion: 'PR'
  }
}

// グローバルな設定状態
const adSenseConfig = ref<AdSenseConfig | null>(null)
const configLoaded = ref(false)
const configError = ref<string | null>(null)

// AdSense設定を読み込む関数
async function loadAdSenseConfig(): Promise<AdSenseConfig> {
  if (adSenseConfig.value && configLoaded.value) {
    return adSenseConfig.value
  }

  try {
    // サーバーサイドでは設定ファイルから直接読み込み
    if (process.server) {
      try {
        const fs = await import('fs')
        const path = await import('path')
        
        const configPath = path.resolve(process.cwd(), 'adsense.config.json')
        
        if (fs.existsSync(configPath)) {
          const configData = fs.readFileSync(configPath, 'utf-8')
          const config = JSON.parse(configData) as AdSenseConfig
          adSenseConfig.value = config
          configLoaded.value = true
          console.log('AdSense設定をサーバーサイドで読み込みました')
          return config
        } else {
          console.warn('adsense.config.jsonが見つかりません。デフォルト設定を使用します')
          adSenseConfig.value = defaultConfig
          configLoaded.value = true
          return defaultConfig
        }
      } catch (fsError) {
        console.error('ファイルシステムからの設定読み込みに失敗:', fsError)
        adSenseConfig.value = defaultConfig
        configLoaded.value = true
        return defaultConfig
      }
    }

    // クライアントサイドでは API経由で読み込み
    try {
      const response = await fetch('/api/adsense-config')
      if (response.ok) {
        const config = await response.json() as AdSenseConfig
        adSenseConfig.value = config
        configLoaded.value = true
        console.log('AdSense設定をクライアントサイドで読み込みました')
        return config
      } else {
        throw new Error(`設定API呼び出し失敗: ${response.status}`)
      }
    } catch (apiError) {
      console.warn('AdSense設定APIの呼び出しに失敗しました。デフォルト設定を使用します:', apiError)
      adSenseConfig.value = defaultConfig
      configLoaded.value = true
      configError.value = `設定読み込みエラー: ${apiError}`
      return defaultConfig
    }
  } catch (error) {
    console.error('AdSense設定の読み込みに失敗しました:', error)
    adSenseConfig.value = defaultConfig
    configLoaded.value = true
    configError.value = `予期しないエラー: ${error}`
    return defaultConfig
  }
}

// useAdSenseコンポーザブル
export function useAdSense() {
  // 設定の初期化
  const initializeConfig = async () => {
    if (!configLoaded.value) {
      await loadAdSenseConfig()
    }
  }

  // 計算プロパティ
  const config = computed(() => adSenseConfig.value || defaultConfig)
  const isTestMode = computed(() => config.value.settings.testMode)
  const clientId = computed(() => config.value.client)

  // スロット取得関数
  const getSlot = (slotName: keyof AdSenseConfig['slots'] | string): string => {
    return config.value.slots[slotName] || config.value.slots.rectangle
  }

  // ラベル取得関数
  const getLabel = (labelType: keyof AdSenseConfig['labels']): string => {
    return config.value.labels[labelType] || config.value.labels.advertisement
  }

  // AdSenseスクリプトURL生成
  const getScriptUrl = computed(() => {
    return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.value.client}`
  })

  // デバッグ情報
  const debugInfo = computed(() => ({
    loaded: configLoaded.value,
    error: configError.value,
    testMode: isTestMode.value,
    client: clientId.value?.substring(0, 15) + '...' // 一部だけ表示
  }))

  return {
    // 状態
    config,
    configLoaded: readonly(configLoaded),
    configError: readonly(configError),
    
    // 計算プロパティ
    isTestMode,
    clientId,
    scriptUrl: getScriptUrl,
    
    // メソッド
    initializeConfig,
    getSlot,
    getLabel,
    
    // デバッグ
    debugInfo
  }
}


