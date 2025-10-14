<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />

    <h2 class="text-h5 mb-4">{{ tr.pageTitle }}</h2>

    <v-tabs v-model="activeTab" class="mb-4">
      <v-tab value="create">{{ tr.tabCreate }}</v-tab>
      <v-tab value="scan">{{ tr.tabScan }}</v-tab>
    </v-tabs>

    <template v-if="activeTab === 'create'">
      <template v-if="createMode === 'card'">
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-card-account-details</v-icon>
            {{ tr.previewTitle }}
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary" @click="createMode = 'form'">
              <v-icon class="mr-1">mdi-pencil</v-icon>
              {{ tr.edit }}
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-column align-center">
              <!-- 印刷対象のラッパ（カード+QRをまとめて印刷可能に） -->
              <div class="print-area">
                <div class="card-image-wrap">
                  <img :src="cardImageUrl" alt="Membership Card" class="card-img" />
                </div>
                <div v-if="qrVisible" class="qr-wrap mt-4">
                  <img :key="qrProviderIndex" :src="qrImageUrl" alt="QR Code" width="240" height="240" referrerpolicy="no-referrer" crossorigin="anonymous" decoding="async" @error="onQrError" />
                </div>
              </div>

              <div class="d-flex mt-4">
                <v-btn color="info" class="mr-2" @click="toggleQr">
                  <v-icon class="mr-1">mdi-qrcode</v-icon>
                  {{ qrVisible ? tr.hideQr : tr.showQr }}
                </v-btn>
                <v-btn variant="outlined" color="primary" class="mr-2" @click="handleSaveImage">
                  <v-icon class="mr-1">mdi-download</v-icon>
                  {{ tr.saveImage }}
                </v-btn>
                <!-- <v-btn variant="outlined" color="secondary" @click="handlePrint">
                  <v-icon class="mr-1">mdi-printer</v-icon>
                  {{ tr.print }}
                </v-btn> -->
              </div>
            </div>
          </v-card-text>
        </v-card>
      </template>

      <template v-else>
      <!-- 入力フォーム -->
      <v-card class="mb-6">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-card-account-details-outline</v-icon>
          {{ tr.formTitle }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleCreate">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.name"
                  :label="tr.name"
                  variant="outlined"
                  clearable
                  :rules="nameRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.region"
                  :label="tr.region"
                  variant="outlined"
                  clearable
                />
              </v-col>
            </v-row>
            <v-row class="mt-1">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.issuedAt"
                  :label="tr.issuedAt"
                  type="date"
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <v-row class="mt-1">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.twitter"
                  :label="tr.twitter"
                  prefix="@"
                  variant="outlined"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.bluesky"
                  :label="tr.bluesky"
                  prefix="@"
                  variant="outlined"
                  clearable
                />
              </v-col>
            </v-row>
            <!-- <v-row class="mt-1">
              <v-col cols="12" md="6" class="d-flex align-center">
                <v-switch
                  v-model="printIncludeQr"
                  inset
                  :label="tr.printIncludeQr"
                />
              </v-col>
            </v-row> -->
            <div class="d-flex gap-2">
              <v-btn color="primary" type="submit" :disabled="!canCreate">
                <v-icon class="mr-1">mdi-check</v-icon>
                {{ tr.create }}
              </v-btn>
              <v-btn color="secondary" variant="outlined" type="button" @click="handleReset">
                <v-icon class="mr-1">mdi-restore</v-icon>
                {{ tr.reset }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- 作成プレビューモーダル -->
      <v-dialog v-model="showDialog" max-width="680">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-card-account-details</v-icon>
            {{ tr.previewTitle }}
            <v-spacer></v-spacer>
            <v-btn variant="text" icon @click="showDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-column align-center">
              <!-- 印刷対象のラッパ（カード+QRをまとめて印刷可能に） -->
              <div class="print-area">
                <div class="card-image-wrap">
                  <img :src="cardImageUrl" alt="Membership Card" class="card-img" />
                </div>
                <div v-if="qrVisible" class="qr-wrap mt-4">
                  <img :key="qrProviderIndex" :src="qrImageUrl" alt="QR Code" width="240" height="240" referrerpolicy="no-referrer" crossorigin="anonymous" decoding="async" @error="onQrError" />
                </div>
              </div>

              <div class="d-flex mt-4">
                <v-btn color="info" class="mr-2" @click="toggleQr">
                  <v-icon class="mr-1">mdi-qrcode</v-icon>
                  {{ qrVisible ? tr.hideQr : tr.showQr }}
                </v-btn>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="no-print">
            <v-spacer />
            <v-btn variant="outlined" color="primary" class="mr-2" @click="handleSaveImage">
              <v-icon class="mr-1">mdi-download</v-icon>
              {{ tr.saveImage }}
            </v-btn>
            <v-btn variant="outlined" color="secondary" @click="handlePrint">
              <v-icon class="mr-1">mdi-printer</v-icon>
              {{ tr.print }}
            </v-btn>
            <v-btn color="primary" @click="showDialog = false">{{ tr.close }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      </template>
    </template>

    <template v-else>
      <!-- 読取タブ -->
      <v-card class="mb-6">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-qrcode-scan</v-icon>
          {{ tr.scanTitle }}
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="startScan">
            <v-icon class="mr-1">mdi-camera</v-icon>
            {{ tr.scanStart }}
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="d-flex flex-column align-center">
            <div v-if="selectedScan" class="mb-6">
              <div class="card-image-wrap">
                <img :src="selectedCardImageUrl" alt="Scanned Card" class="card-img" />
              </div>
              <!-- SNSリンク（クリック可能） -->
              <div class="sns-links mt-2">
                <div v-if="selectedScan.twitter">
                  <a :href="getTwitterUrl(selectedScan.twitter)" target="_blank" rel="noopener">
                    {{ '@' + normalizeHandle(selectedScan.twitter) }} ({{ tr.twitter }})
                  </a>
                </div>
                <div v-if="selectedScan.bluesky">
                  <a :href="getBlueskyUrl(selectedScan.bluesky)" target="_blank" rel="noopener">
                    {{ '@' + normalizeHandle(selectedScan.bluesky) }} ({{ tr.bluesky }})
                  </a>
                </div>
              </div>
            </div>

            <div class="w-100">
              <h3 class="text-subtitle-1 mb-2">{{ tr.scanList }}</h3>
              <v-list density="compact" v-if="scanList.length">
                <v-list-item
                  v-for="item in scanList"
                  :key="item.id"
                  @click="selectSaved(item.id)"
                  class="cursor-pointer"
                >
                  <v-list-item-title>{{ item.name || item.id }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.region ? getRegionDisplay(item.region) : '' }}
                    <span v-if="item.issuedAt"> · {{ item.issuedAt }}</span>
                  </v-list-item-subtitle>
                  <template #append>
                    <v-btn size="small" variant="text" @click.stop="selectSaved(item.id)">{{ tr.show }}</v-btn>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="text-body-2 text-medium-emphasis">{{ tr.noSaved }}</div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- カメラ読み取りダイアログ -->
      <v-dialog v-model="scanDialog" max-width="680">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-qrcode-scan</v-icon>
            {{ tr.scanStart }}
            <v-spacer></v-spacer>
            <v-btn variant="text" icon @click="stopScan">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <video ref="scanVideoRef" autoplay playsinline muted class="scan-video"></video>
            <div class="text-caption mt-2">カメラが起動しない場合はブラウザの権限をご確認ください。</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="secondary" variant="outlined" @click="stopScan">{{ tr.scanStop }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <v-snackbar v-model="snackbar" :timeout="2200">
      {{ tr.saved }}
    </v-snackbar>
    <v-dialog v-model="confirmResetDialog" max-width="420">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-alert</v-icon>
          {{ tr.confirmTitle }}
        </v-card-title>
        <v-card-text>{{ tr.confirmReset }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="secondary" @click="onCancelReset">{{ tr.cancel }}</v-btn>
          <v-btn color="error" @click="onConfirmReset">
            <v-icon class="mr-1">mdi-restore</v-icon>
            {{ tr.reset }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, inject, watch, nextTick } from 'vue'

// 設定・アプリ設定
const appConfig = useAppConfig()
const { settings } = useSettings()
const currentLanguage = computed(() => (settings.value?.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng')

// 翻訳
const translations = {
  jpn: {
    pageTitle: '会員証作成',
    formTitle: '入力フォーム',
    memberId: '会員ID（ユニークキー）',
    name: '名前',
    region: '地方名',
    issuedAt: '発行日',
    twitter: 'Twitter',
    bluesky: 'Bluesky',
    create: '作成',
    reset: 'リセット',
    edit: '編集',
    previewTitle: 'カードプレビュー',
    cardTitle: '携帯獣研究開発機構',
    showQr: 'QRを表示',
    hideQr: 'QRを隠す',
    close: '閉じる',
    print: '印刷',
    saveImage: '画像を保存',
    printIncludeQr: 'QRも印刷',
    saved: '保存しました',
    tabCreate: '作成',
    tabScan: '読取',
    scanTitle: '読取',
    scanStart: '読み取り',
    scanStop: '停止',
    scanList: '保存済み',
    noSaved: '保存データはありません',
    show: '表示',
    confirmReset: 'IDがリセットされます。よろしいですか？',
    confirmTitle: '確認',
    cancel: 'キャンセル',
  },
  eng: {
    pageTitle: 'Membership Card Generator',
    formTitle: 'Input Form',
    memberId: 'Member ID (Unique Key)',
    name: 'Name',
    region: 'Region',
    issuedAt: 'Issued Date',
    twitter: 'Twitter',
    bluesky: 'Bluesky',
    create: 'Create',
    reset: 'Reset',
    edit: 'Edit',
    previewTitle: 'Card Preview',
    cardTitle: 'Pokemon R&D Organization',
    showQr: 'Show QR',
    hideQr: 'Hide QR',
    close: 'Close',
    print: 'Print',
    saveImage: 'Save Image',
    printIncludeQr: 'Print QR too',
    saved: 'Saved',
    tabCreate: 'Create',
    tabScan: 'Scan',
    scanTitle: 'Scan',
    scanStart: 'Scan',
    scanStop: 'Stop',
    scanList: 'Saved',
    noSaved: 'No saved data',
    show: 'Show',
    confirmReset: 'Member ID will be reset. Are you sure?',
    confirmTitle: 'Confirm',
    cancel: 'Cancel',
  },
} as const
const tr = computed(() => translations[currentLanguage.value])

// パンくず
const breadcrumbs = computed(() => [
  { title: (appConfig.translation.top as any)[currentLanguage.value] || 'Home', disabled: false, href: '/' },
  { title: tr.value.pageTitle, disabled: true, href: '/webapp/membership_card_generater' },
])

// レイアウト(AppBar)のタイトル同期
const pageTitleState = inject('pageTitle', { title: 'Pokédex-Online' }) as { title: string }
const pageTitle = computed(() => pageTitleState.title)
const updatePageTitle = () => { pageTitleState.title = tr.value.pageTitle }
onMounted(() => updatePageTitle())
watch(() => settings.value?.language, () => updatePageTitle())

// SEO タイトル
useSeoMeta({ title: pageTitle })

// 入力フォーム状態
const activeTab = ref<'create' | 'scan'>('create')
const createMode = ref<'card' | 'form'>('form')
const runtimeConfig = useRuntimeConfig()
const iconUrl = computed(() => {
  const base = String((runtimeConfig as any)?.public?.appBaseURL || '/')
  return (base.endsWith('/') ? base : base + '/') + 'icon.png'
})
// 当日日付(YYYY-MM-DD)
const todayDateStr = () => {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}
// UUID v4 生成（ブラウザ対応 / フォールバック）
const generateUUID = () => {
  const gCrypto: any = (globalThis as any)?.crypto
  if (gCrypto && typeof gCrypto.randomUUID === 'function') {
    return gCrypto.randomUUID()
  }
  const rnd = (n = 16) => {
    if (gCrypto && typeof gCrypto.getRandomValues === 'function') {
      const arr = new Uint8Array(n)
      gCrypto.getRandomValues(arr)
      return Array.from(arr)
    }
    return Array.from({ length: n }, () => Math.floor(Math.random() * 256))
  }
  const hex = (v: number) => v.toString(16).padStart(2, '0')
  const r = rnd(16)
  // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  r[6] = ((r[6] ?? 0) & 0x0f) | 0x40
  r[8] = ((r[8] ?? 0) & 0x3f) | 0x80
  const h = r.map(hex).join('')
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20,32)}`
}

const form = ref({
  memberId: '',
  name: '',
  region: '',
  issuedAt: todayDateStr(),
  twitter: '',
  bluesky: '',
})

// 地方表示（自由入力値 + 接尾辞）
const getRegionDisplay = (value: string) => {
  const v = (value || '').trim()
  if (!v) return ''
  return currentLanguage.value === 'eng' ? `${v} Region` : `${v}地方`
}

// SNSリンク生成ユーティリティ
function normalizeHandle(v?: string | null): string {
  return String(v || '').replace(/^@+/, '').trim()
}
function getTwitterUrl(v?: string | null): string {
  const h = normalizeHandle(v)
  return h ? `https://twitter.com/${h}` : ''
}
function getBlueskyUrl(v?: string | null): string {
  const h = normalizeHandle(v)
  return h ? `https://bsky.app/profile/${h}` : ''
}

// 作成ボタンの活性条件（名前のみ必須）
const canCreate = computed(() => !!form.value.name?.trim())

// モーダルとQR
const showDialog = ref(false)
const qrVisible = ref(false)
const qrProviders = ['qrserver', 'quickchart', 'google'] as const
const qrProviderIndex = ref(0)
const qrImageUrl = computed(() => {
  const payload = {
    v: 1,
    type: 'membership',
    data: {
      id: form.value.memberId,
      name: form.value.name,
      region: form.value.region || undefined,
      issuedAt: form.value.issuedAt || undefined,
      twitter: form.value.twitter || undefined,
      bluesky: form.value.bluesky || undefined,
    },
    ts: Date.now(),
  }
  const json = JSON.stringify(payload)
  const encoded = encodeURIComponent(json)
  const provider = qrProviders[qrProviderIndex.value]
  if (provider === 'qrserver') {
    // goqr.me (qrserver.com)
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encoded}`
  } else if (provider === 'quickchart') {
    return `https://quickchart.io/qr?text=${encoded}&size=240`
  } else {
    return `https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=${encoded}`
  }
})

// ===== カード画像（Canvas描画） =====
const cardImageUrl = ref<string>('')
const selectedCardImageUrl = ref<string>('')

// 角丸矩形
const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

const ensureIconImage = async (): Promise<HTMLImageElement | null> => {
  if (typeof window === 'undefined') return null
  return new Promise((resolve) => {
    const img = new Image()
    // 同一オリジンのためcrossOriginは省略（CORS汚染回避）
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = iconUrl.value
  })
}

type Lang = 'jpn' | 'eng'
type CardPayload = { id: string; name?: string; region?: string; issuedAt?: string; twitter?: string; bluesky?: string }

const drawCardToDataUrl = async (payload: CardPayload, lang: Lang): Promise<string> => {
  if (typeof window === 'undefined') return ''
  const W = 420
  const H = 264
  const scale = 2 // 高解像度描画でRetinaでもくっきり
  const canvas = document.createElement('canvas')
  canvas.width = W * scale
  canvas.height = H * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)

  // 背景（グラデーション）
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#1976d2')
  grad.addColorStop(1, '#42a5f5')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  const paddingX = 20
  const paddingY = 16

  // 透かし（アイコン）
  try {
    const icon = await ensureIconImage()
    if (icon) {
      const wmScale = 0.6
      const wmW = W * wmScale
      const wmH = wmW // 正方形として扱う
      const wmX = (W - wmW) / 2
      const wmY = (H - wmH) / 2
      ctx.save()
      ctx.globalAlpha = 0.3
      ctx.drawImage(icon, wmX, wmY, wmW, wmH)
      ctx.restore()
    }
  } catch {}

  // ヘッダー（タイトルと地方）
  const t = translations[lang]
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 18px system-ui, -apple-system, \"Segoe UI\", \"Noto Sans JP\", sans-serif'
  ctx.textBaseline = 'top'
  const title = t.cardTitle
  ctx.fillText(title, paddingX, paddingY)

  const regionText = payload.region ? (lang === 'eng' ? `${payload.region.trim()} Region` : `${payload.region.trim()}地方`) : ''
  if (regionText) {
    ctx.font = '500 13px system-ui, -apple-system, \"Segoe UI\", \"Noto Sans JP\", sans-serif'
    const rW = ctx.measureText(regionText).width
    ctx.fillText(regionText, W - paddingX - rW, paddingY + 2)
  }

  // 本文ボックス
  const bodyX = paddingX
  const bodyY = paddingY + 30
  const bodyW = W - paddingX * 2
  const bodyH = H - bodyY - 40
  ctx.save()
  ctx.globalAlpha = 0.14
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, bodyX, bodyY, bodyW, bodyH, 6)
  ctx.fill()
  ctx.restore()

  // 行描画（名前、SNS）
  const labelW = 120
  let rowY = bodyY + 24
  const rowGap = 24
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'alphabetic'

  // 名前
  ctx.font = '600 14px system-ui, -apple-system, \"Segoe UI\", \"Noto Sans JP\", sans-serif'
  ctx.fillText(`${t.name}:`, bodyX + 14, rowY)
  ctx.font = '500 14px system-ui, -apple-system, \"Segoe UI\", \"Noto Sans JP\", sans-serif'
  const nameText = payload.name || ''
  ctx.fillText(nameText, bodyX + 14 + labelW, rowY)
  rowY += rowGap

  // SNS（任意）
  if (payload.twitter) {
    const twHandle = String(payload.twitter).replace(/^@+/, '')
    const twUrl = `https://twitter.com/${twHandle}`
    ctx.font = '600 14px system-ui, -apple-system, \"Segoe UI\", \"Noto Sans JP\", sans-serif'
    ctx.fillText(`${t.twitter}:`, bodyX + 14, rowY)
    ctx.font = '500 14px system-ui, -apple-system, \"Segoe UI\", \"Noto Sans JP\", sans-serif'
    ctx.fillText(twUrl, bodyX + 14 + labelW, rowY)
    rowY += rowGap
  }
  if (payload.bluesky) {
    const bsHandle = String(payload.bluesky).replace(/^@+/, '')
    const bsUrl = `https://bsky.app/profile/${bsHandle}`
    ctx.font = '600 14px system-ui, -apple-system, \"Segoe UI\", \"Noto Sans JP\", sans-serif'
    ctx.fillText(`${t.bluesky}:`, bodyX + 14, rowY)
    ctx.font = '500 14px system-ui, -apple-system, \"Segoe UI\", \"Noto Sans JP\", sans-serif'
    ctx.fillText(bsUrl, bodyX + 14 + labelW, rowY)
    rowY += rowGap
  }

  // フッター（ID）
  const idText = (payload.id || '').toLowerCase()
  if (idText) {
    ctx.font = '500 11px system-ui, -apple-system, \"Segoe UI\", monospace'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillText(idText, W - 14, H - 8)
  }

  // 左下に発行日（小さく）
  if (payload.issuedAt) {
    ctx.font = '500 10px system-ui, -apple-system, \"Segoe UI\", \"Noto Sans JP\", sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillText(`${t.issuedAt}: ${payload.issuedAt}`, 14, H - 8)
  }

  return canvas.toDataURL('image/png')
}

const updateCardImage = async () => {
  const url = await drawCardToDataUrl({
    id: form.value.memberId,
    name: form.value.name,
    region: form.value.region,
    issuedAt: form.value.issuedAt,
    twitter: form.value.twitter,
    bluesky: form.value.bluesky,
  }, currentLanguage.value)
  cardImageUrl.value = url
}

const updateSelectedCardImage = async () => {
  const s = selectedScan.value
  if (!s) { selectedCardImageUrl.value = ''; return }
  const url = await drawCardToDataUrl({
    id: s.id,
    name: s.name,
    region: s.region,
    issuedAt: s.issuedAt,
    twitter: s.twitter,
    bluesky: s.bluesky,
  }, currentLanguage.value)
  selectedCardImageUrl.value = url
}

// watchers are moved below after selectedScan declaration to avoid TS hoist issues
const onQrError = () => {
  if (qrProviderIndex.value < qrProviders.length - 1) {
    qrProviderIndex.value++
  }
}
const toggleQr = () => { qrVisible.value = !qrVisible.value }
const printIncludeQr = ref(true)
const snackbar = ref(false)
const confirmResetDialog = ref(false)

// ローカルストレージ
const LS_KEY = 'membership_card_form_v1'
const saveToLocalStorage = () => {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(LS_KEY, JSON.stringify(form.value))
  } catch (e) {
    console.error('Failed to save form to LocalStorage:', e)
  }
}
const loadFromLocalStorage = (): boolean => {
  try {
    if (typeof window === 'undefined') return false
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const data = JSON.parse(raw) as Partial<typeof form.value>
      if (data.memberId) form.value.memberId = data.memberId
      if (typeof data.name === 'string') form.value.name = data.name
      if (typeof data.region === 'string') form.value.region = data.region
      if (typeof data.issuedAt === 'string' && data.issuedAt) form.value.issuedAt = data.issuedAt
      if (typeof (data as any).twitter === 'string') form.value.twitter = (data as any).twitter
      if (typeof (data as any).bluesky === 'string') form.value.bluesky = (data as any).bluesky
      const hasMeaningful = !!(
        (data.name && String(data.name).trim()) ||
        (data.region && String(data.region).trim()) ||
        (data.issuedAt && String(data.issuedAt).trim()) ||
        ((data as any).twitter && String((data as any).twitter).trim()) ||
        ((data as any).bluesky && String((data as any).bluesky).trim())
      )
      return hasMeaningful
    }
  } catch (e) {
    console.error('Failed to load form from LocalStorage:', e)
  }
  return false
}

// 読取データ永続化
type ScannedCard = { id: string; name?: string; region?: string; issuedAt?: string; twitter?: string; bluesky?: string; savedAt?: number }
const SCANS_KEY = 'membership_card_scans_v1'
const scansMap = ref<Record<string, ScannedCard>>({})
const scanList = computed(() => Object.values(scansMap.value).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0)))
const selectedScan = ref<ScannedCard | null>(null)

const loadScansFromLS = () => {
  try {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(SCANS_KEY)
    if (raw) {
      const data = JSON.parse(raw) as Record<string, ScannedCard>
      if (data && typeof data === 'object') scansMap.value = data
    }
  } catch (e) {
    console.error('Failed to load scans from LocalStorage:', e)
  }
}
const saveScansToLS = () => {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(SCANS_KEY, JSON.stringify(scansMap.value))
  } catch (e) {
    console.error('Failed to save scans to LocalStorage:', e)
  }
}
const selectSaved = (id: string) => {
  const item = scansMap.value[id]
  selectedScan.value = item ? { ...item } : null
}

// 画像再生成用ウォッチャ（selectedScan の宣言以降に配置）
watch([
  () => form.value.memberId,
  () => form.value.name,
  () => form.value.region,
  () => form.value.issuedAt,
  () => form.value.twitter,
  () => form.value.bluesky,
  currentLanguage,
], () => { updateCardImage() }, { immediate: true })
watch([selectedScan, currentLanguage], () => { updateSelectedCardImage() }, { immediate: true })

// カメラ読み取り
const scanDialog = ref(false)
const scanVideoRef = ref<HTMLVideoElement | null>(null)
const scanning = ref(false)
let scanStream: MediaStream | null = null
let scanRafId = 0
let barcodeDetector: any = null
let jsqr: any = null
let offCanvas: HTMLCanvasElement | null = null
let offCtx: CanvasRenderingContext2D | null = null
let lastScanTs = 0

// ダイアログが閉じられたら確実に停止
watch(scanDialog, (v) => { if (!v) stopScan() })

const stopScan = () => {
  scanning.value = false
  if (scanRafId) cancelAnimationFrame(scanRafId)
  try { scanStream?.getTracks()?.forEach(t => t.stop()) } catch {}
  scanStream = null
  scanDialog.value = false
  offCanvas = null
  offCtx = null
}

const tryParseCard = (text: string): ScannedCard | null => {
  let payload = text
  try { payload = decodeURIComponent(payload) } catch {}
  try {
    const obj = JSON.parse(payload)
    if (obj && obj.type === 'membership' && obj.data && obj.data.id) {
      const data = obj.data
      const card: ScannedCard = {
        id: String(data.id),
        name: typeof data.name === 'string' ? data.name : '',
        region: typeof data.region === 'string' ? data.region : '',
        issuedAt: typeof data.issuedAt === 'string' ? data.issuedAt : '',
        twitter: typeof data.twitter === 'string' ? data.twitter : '',
        bluesky: typeof data.bluesky === 'string' ? data.bluesky : '',
        savedAt: Date.now(),
      }
      return card
    }
  } catch {}
  // URLの中にデータが含まれる場合のフォールバック（QR仕様差異に備える）
  try {
    const u = new URL(text)
    const q = u.searchParams.get('data') || u.searchParams.get('chl')
    if (q) return tryParseCard(q)
  } catch {}
  return null
}

const handleDecoded = (raw: string) => {
  const card = tryParseCard(raw)
  if (!card) {
    stopScan()
    return
  }
  // 保存（IDでユニーク）
  scansMap.value[card.id] = card
  saveScansToLS()
  selectedScan.value = { ...card }
  snackbar.value = true
  stopScan()
}

const scanLoop = async () => {
  if (!scanning.value || !scanVideoRef.value) return
  try {
    if (barcodeDetector) {
      const codes = await barcodeDetector.detect(scanVideoRef.value)
      if (codes && codes.length) {
        const val = codes[0].rawValue || codes[0].raw || ''
        if (val) return handleDecoded(val)
      }
    } else if (jsqr) {
      const v = scanVideoRef.value as HTMLVideoElement
      const vw = v.videoWidth
      const vh = v.videoHeight
      if (!vw || !vh) { scanRafId = requestAnimationFrame(scanLoop); return }
      const now = performance.now()
      if (now - lastScanTs < 180) { scanRafId = requestAnimationFrame(scanLoop); return }
      lastScanTs = now
      if (!offCanvas) {
        offCanvas = document.createElement('canvas')
        offCtx = offCanvas.getContext('2d')
      }
      const maxW = 640
      const scale = Math.min(1, maxW / vw)
      offCanvas!.width = Math.floor(vw * scale)
      offCanvas!.height = Math.floor(vh * scale)
      if (offCtx) {
        offCtx.drawImage(v, 0, 0, offCanvas!.width, offCanvas!.height)
        const img = offCtx.getImageData(0, 0, offCanvas!.width, offCanvas!.height)
        const res = jsqr(img.data, img.width, img.height)
        const val = res?.data || ''
        if (val) return handleDecoded(val)
      }
    }
  } catch {}
  scanRafId = requestAnimationFrame(scanLoop)
}

const startScan = async () => {
  if (typeof window === 'undefined') return
  try {
    scanDialog.value = true
    await nextTick()
    scanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
    if (scanVideoRef.value) {
      ;(scanVideoRef.value as HTMLVideoElement).srcObject = scanStream
      await (scanVideoRef.value as HTMLVideoElement).play()
    }
    scanning.value = true
    barcodeDetector = (window as any).BarcodeDetector ? new (window as any).BarcodeDetector({ formats: ['qr_code'] }) : null
    if (!barcodeDetector) {
      try {
        const mod: any = await import('https://esm.sh/jsqr@1.4.0')
        jsqr = mod?.default || mod
      } catch (e) {
        console.warn('jsQR fallback load failed:', e)
      }
    }
    scanRafId = requestAnimationFrame(scanLoop)
  } catch (e) {
    console.error('Failed to start camera:', e)
    stopScan()
  }
}

onBeforeUnmount(() => {
  stopScan()
})

onMounted(() => {
  const existed = loadFromLocalStorage()
  loadScansFromLS()
  if (!form.value.memberId) form.value.memberId = generateUUID()
  createMode.value = existed ? 'card' : 'form'
})

// ハンドラ
const handleCreate = () => {
  saveToLocalStorage()
  qrVisible.value = false
  showDialog.value = true
  snackbar.value = true
  createMode.value = 'card'
}
const handleReset = () => {
  // Vuetifyの確認ダイアログを開く
  confirmResetDialog.value = true
}

const onConfirmReset = () => {
  // 実際のリセット処理
  form.value = { memberId: generateUUID(), name: '', region: '', issuedAt: todayDateStr(), twitter: '', bluesky: '' }
  saveToLocalStorage()
  confirmResetDialog.value = false
  snackbar.value = true
  createMode.value = 'form'
}

const onCancelReset = () => {
  // 何もせずにダイアログを閉じる
  confirmResetDialog.value = false
}

const nameRules = [
  (v: string) => !!(v && v.trim()) || (currentLanguage.value === 'eng' ? 'Name is required' : '名前は必須です'),
]

// 印刷
const handlePrint = async () => {
  const prev = qrVisible.value
  if (printIncludeQr.value && !qrVisible.value) {
    qrVisible.value = true
    await nextTick()
  } else if (!printIncludeQr.value && qrVisible.value) {
    qrVisible.value = false
    await nextTick()
  }
  window.print()
  // 印刷ダイアログ終了後に元の状態へ戻す
  qrVisible.value = prev
}

// 画像保存（File System Access API 優先、フォールバックでアンカー）
const handleSaveImage = async () => {
  try {
    if (typeof window === 'undefined') return
    const url = cardImageUrl.value
    if (!url) return
    const sanitize = (s: string) => s.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '_').slice(0, 60)
    const parts: string[] = []
    if (form.value.name && form.value.name.trim()) parts.push(sanitize(form.value.name.trim()))
    if (form.value.memberId) parts.push(sanitize(String(form.value.memberId)).slice(0, 8))
    let filename = parts.length ? `membership_card_${parts.join('_')}` : 'membership_card'
    if (!/\.png$/i.test(filename)) filename += '.png'
    const dataUrlToBlob = (dataUrl: string): Blob => {
      try {
        const commaIndex = dataUrl.indexOf(',')
        if (commaIndex < 0) return new Blob([], { type: 'image/png' })
        const header = dataUrl.slice(0, commaIndex)
        const data = dataUrl.slice(commaIndex + 1)
        const mimeMatch = header.match(/data:(.*?);base64/)
        const mime = mimeMatch ? mimeMatch[1] : 'image/png'
        const bin = atob(data)
        const len = bin.length
        const arr = new Uint8Array(len)
        for (let i = 0; i < len; i++) arr[i] = bin.charCodeAt(i)
        return new Blob([arr], { type: mime })
      } catch {
        return new Blob([], { type: 'image/png' })
      }
    }
    const blob = dataUrlToBlob(url)

    const w: any = window as any
    if (w && typeof w.showSaveFilePicker === 'function') {
      try {
        const handle = await w.showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: 'PNG Image', accept: { 'image/png': ['.png'] } }],
          excludeAcceptAllOption: true,
        })
        const stream = await handle.createWritable()
        await stream.write(blob)
        await stream.close()
        return
      } catch (e) {
        // ユーザーがキャンセルした場合などはフォールバックへ
      }
    }

    // 旧 Edge (EdgeHTML) フォールバック
    const navAny: any = navigator as any
    if (navAny && typeof navAny.msSaveOrOpenBlob === 'function') {
      navAny.msSaveOrOpenBlob(blob, filename)
      return
    }

    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    // すぐにrevokeするとブラウザによってはダウンロード名が不安定になる場合があるため遅延
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
  } catch (e) {
    console.error('Failed to save image:', e)
  }
}
</script>

<style scoped>
.card-preview {
  width: 100%; /* 画面幅に合わせてフィット */
  max-width: 420px; /* 上限 */
  aspect-ratio: 420 / 264; /* 高さは比率で決定 */
  margin: 0 auto; /* 横中央 */
  border-radius: 0;
  padding: 16px 20px;
  color: #ffffff;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}
.card-watermark {
  position: absolute;
  inset: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 60%;
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.card-region {
  font-size: 0.9rem;
  opacity: 0.9;
}
.card-body {
  background: rgba(255, 255, 255, 0.14);
  border-radius: 0;
  padding: 12px 14px;
  position: relative;
  z-index: 1;
  margin-bottom: 28px; /* フッターが白背景の外に来るよう余白を確保 */
}
.card-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-items: start;
}
.card-right { display: block; }
.card-row {
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin: 6px 0;
}
.label {
  width: 120px;
  font-weight: 600;
  opacity: 0.95;
}
.value {
  flex: 1;
  font-weight: 500;
}
.card-footer {
  position: absolute;
  bottom: 8px;
  left: 14px;
  right: 14px;
  font-size: 0.72rem;
  line-height: 1;
  opacity: 0.9;
  letter-spacing: 0.3px;
  text-align: right;
  text-transform: lowercase;
  z-index: 1;
}
/* 画像プレビュー（Canvas出力をレスポンシブ表示） */
.card-image-wrap {
  width: 100%;
  max-width: 420px; /* カード実サイズに合わせた上限 */
  aspect-ratio: 420 / 264; /* 正しい比率を維持 */
  margin: 0 auto; /* 横中央 */
}
.card-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.qr-wrap { /* QRを横中央 */
  display: flex;
  justify-content: center;
}
.qr-wrap img {
  max-width: 100%;
  height: auto;
  border: 8px solid #f5f5f5;
  border-radius: 0;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

/* 読み取りタブ: SNSリンク表示 */
.sns-links {
  width: 100%;
  max-width: 420px;
  margin: 8px auto 0;
  font-size: 0.9rem;
}
.sns-links a {
  color: var(--v-theme-primary);
  text-decoration: underline;
  word-break: break-all;
}
.sns-links > div + div { margin-top: 4px; }

/* カメラプレビュー */
.scan-video {
  width: 100%;
  background: #000;
  border-radius: 8px;
  object-fit: cover;
  aspect-ratio: 3 / 4;
  max-height: 70vh;
}
</style>

<style>
@media print {
  body * { visibility: hidden !important; }
  .print-area, .print-area * { visibility: visible !important; }
  .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
  .no-print { display: none !important; }
}
</style>
