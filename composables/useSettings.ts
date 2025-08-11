// 個人設定を管理するcomposable
export const useSettings = () => {
  const appConfig = useAppConfig()

  // デフォルト設定値（app.config.tsから取得）
  const defaultSettings = reactive({ ...appConfig.personal })

  // ローカルストレージのキー
  const STORAGE_KEY = 'pokedex-online-settings'

  // 設定値のリアクティブな状態
  const settings = ref({
    ...defaultSettings
  })

  // ローカルストレージから設定を読み込み
  const loadSettings = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsedSettings = JSON.parse(stored)
          // デフォルト設定とマージして新しい設定項目に対応
          settings.value = { ...defaultSettings, ...parsedSettings }
          console.log('設定をローカルストレージから読み込みました:', settings.value)
        } else {
          // ローカルストレージにデータがない場合は明示的にデフォルト値を設定
          settings.value = { ...defaultSettings }
          console.log('ローカルストレージにデータがないため、app.config.tsのデフォルト値を使用:', settings.value)
        }
      } catch (error) {
        console.error('設定の読み込みに失敗しました:', error)
        // エラー時もデフォルト値を設定
        settings.value = { ...defaultSettings }
      }
    } else {
      // サーバーサイドではデフォルト値を設定
      settings.value = { ...defaultSettings }
    }
  }

  // 設定を更新
  const updateSettings = (newSettings: typeof settings.value) => {
    settings.value = { ...settings.value, ...newSettings }
  }

  // 設定をローカルストレージに保存
  const saveSettings = () => {
    if (process.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
        console.log('設定をローカルストレージに保存しました:', settings.value)
      } catch (error) {
        console.error('設定の保存に失敗しました:', error)
      }
    }
  }

  // 設定をリセット（デフォルト値に戻す）
  const resetSettings = () => {
    settings.value = { ...defaultSettings }
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // 初期化時に設定を読み込み
  loadSettings()

  return {
    settings: readonly(settings),
    updateSettings,
    saveSettings,
    resetSettings,
    loadSettings
  }
}
