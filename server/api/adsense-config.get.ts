import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// AdSense設定の型定義
interface AdSenseConfig {
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

export default defineEventHandler(async (event) => {
  try {
    const configPath = resolve(process.cwd(), 'adsense.config.json')
    
    // 設定ファイルが存在するかチェック
    if (existsSync(configPath)) {
      try {
        const configData = readFileSync(configPath, 'utf-8')
        const config = JSON.parse(configData) as AdSenseConfig
        
        console.log('AdSense設定をファイルから読み込みました')
        
        // セキュリティのため、機密情報の一部をマスク（ログ用）
        const maskedConfig = {
          ...config,
          client: config.client.substring(0, 15) + '...'
        }
        console.log('読み込んだ設定（マスク済み）:', maskedConfig)
        
        return config
      } catch (parseError) {
        console.error('AdSense設定ファイルのパースに失敗しました:', parseError)
        
        // パースエラーの場合はデフォルト設定を返す
        console.warn('デフォルト設定を使用します')
        return defaultConfig
      }
    } else {
      console.warn('adsense.config.jsonが見つかりません。デフォルト設定を使用します')
      console.log('設定ファイルの作成方法: adsense.config.example.jsonをadsense.config.jsonにコピーして編集してください')
      
      return defaultConfig
    }
  } catch (error) {
    console.error('AdSense設定の読み込みで予期しないエラーが発生しました:', error)
    
    // エラーが発生した場合もデフォルト設定を返す
    return defaultConfig
  }
})
