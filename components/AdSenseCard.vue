<template>
  <v-card
    :class="[cardClass, { 'adsense-outlined': variant === 'outlined' }]"
    :elevation="elevation"
    :variant="variant"
    :color="color"
    :style="cardStyle"
  >
    <v-card-subtitle v-if="showLabel" class="text-caption text-center pa-1">
      {{ actualLabel }}
    </v-card-subtitle>
    
    <v-card-text class="pa-2">
      <!-- Google AdSense広告 -->
      <div class="adsense-container" :style="containerStyle">
        <ins
          class="adsbygoogle"
          :style="adStyle"
          :data-ad-client="actualClient"
          :data-ad-slot="actualSlot"
          :data-ad-format="actualAdFormat"
          :data-full-width-responsive="actualFullWidthResponsive"
          :data-ad-layout="adLayout"
          :data-ad-layout-key="adLayoutKey"
        ></ins>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useAdSense } from '~/composables/useAdSense'

// Props定義
interface Props {
  slotType?: string // 広告スロットの種類（rectangle, banner, square, large_banner, mobile_banner）
  adClient?: string // Google AdSenseのクライアントID（オーバーライド用）
  adSlot?: string // 広告ユニットのスロットID（オーバーライド用）
  adFormat?: string // 広告フォーマット（auto, rectangle, etc.）
  adLayout?: string // 広告レイアウト
  adLayoutKey?: string // 広告レイアウトキー
  fullWidthResponsive?: string // レスポンシブ設定
  width?: string | number // 広告の幅
  height?: string | number // 広告の高さ
  showLabel?: boolean // 「広告」ラベルの表示
  labelType?: 'advertisement' | 'sponsored' | 'promotion' // ラベルの種類
  labelText?: string // ラベルテキスト（オーバーライド用）
  elevation?: number // カードのエレベーション
  variant?: 'elevated' | 'flat' | 'text' | 'tonal' | 'outlined' | 'plain' // カードのバリアント
  color?: string // カードの色
  cardClass?: string // カードの追加クラス
  forceTestMode?: boolean // テストモードの強制有効化
}

const props = withDefaults(defineProps<Props>(), {
  slotType: 'rectangle', // デフォルトスロット
  adFormat: 'auto',
  width: '100%',
  height: 'auto',
  showLabel: true,
  labelType: 'advertisement',
  elevation: 1,
  variant: 'elevated',
  color: 'surface',
  cardClass: '',
  forceTestMode: false
})

// AdSense composableを使用
const {
  config,
  configLoaded,
  isTestMode,
  clientId,
  initializeConfig,
  getSlot,
  getLabel,
  debugInfo
} = useAdSense()

// リアクティブ変数
const isAdLoaded = ref(false)
const adError = ref(false)

// 計算プロパティ
const cardStyle = computed(() => ({
  width: '100%',
  maxWidth: typeof props.width === 'number' ? `${props.width}px` : props.width
}))

const containerStyle = computed(() => ({
  textAlign: 'center' as const,
  minHeight: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

const adStyle = computed(() => ({
  display: 'block',
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

// 動的な値の計算
const actualClient = computed(() => props.adClient || clientId.value)
const actualSlot = computed(() => props.adSlot || getSlot(props.slotType))
const actualLabel = computed(() => props.labelText || getLabel(props.labelType))
const actualTestMode = computed(() => props.forceTestMode || isTestMode.value)
const actualFullWidthResponsive = computed(() => props.fullWidthResponsive || config.value.settings.fullWidthResponsive)
const actualAdFormat = computed(() => props.adFormat || config.value.settings.adFormat)

// AdSenseの初期化
const initializeAdSense = () => {
  try {
    // テストモードの場合は実際の広告を読み込まない
    if (actualTestMode.value) {
      console.log('AdSense テストモード: 広告の読み込みをスキップ')
      return
    }

    // AdSenseスクリプトが読み込まれているかチェック
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      // 広告を読み込み
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      isAdLoaded.value = true
    } else {
      console.warn('AdSenseスクリプトが読み込まれていません')
      adError.value = true
    }
  } catch (error) {
    console.error('AdSense初期化エラー:', error)
    adError.value = true
  }
}

// コンポーネントマウント時
onMounted(() => {
  // クライアントサイドでのみ実行
  if (process.client) {
    // AdSenseスクリプトの読み込みを待つ
    const checkAdSense = () => {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        initializeAdSense()
      } else {
        // スクリプトがまだ読み込まれていない場合は少し待つ
        setTimeout(checkAdSense, 100)
      }
    }
    
    // 少し遅らせて初期化（DOMの準備を待つ）
    setTimeout(checkAdSense, 500)
  }
})

// コンポーネントのエクスポート（TypeScript用）
export interface AdSenseCardInstance {
  initializeAdSense: () => void
  isAdLoaded: boolean
  adError: boolean
}
</script>

<style scoped>
/* Outlined variant border fix */
.adsense-outlined {
  border: 1px solid #9e9e9e !important;
}

.adsense-container {
  overflow: hidden;
}

.adsbygoogle {
  background: transparent;
}

/* 広告読み込み中のスタイル */
.v-card:not(.ad-loaded) .adsense-container {
  background: linear-gradient(90deg, #f0f0f0 25%, transparent 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* レスポンシブ対応 */
@media (max-width: 600px) {
  .adsense-container {
    max-width: 100%;
  }
}

/* ダークテーマ対応 */
.v-theme--dark .v-card:not(.ad-loaded) .adsense-container {
  background: linear-gradient(90deg, #333 25%, transparent 50%, #333 75%);
  background-size: 200% 100%;
}
</style>
