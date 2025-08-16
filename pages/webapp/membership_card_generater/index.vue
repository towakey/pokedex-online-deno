<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />

    <h2 class="text-h5 mb-4">{{ tr.pageTitle }}</h2>

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
                v-model="form.memberId"
                :label="tr.memberId"
                variant="outlined"
                readonly
                :rules="idRules"
                required
              />
            </v-col>
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
            <v-col cols="12" md="6" class="d-flex align-center">
              <v-switch
                v-model="printIncludeQr"
                inset
                :label="tr.printIncludeQr"
              />
            </v-col>
          </v-row>
          <div class="d-flex gap-2">
            <v-btn color="primary" type="submit" :disabled="!canCreate">
              <v-icon class="mr-1">mdi-check</v-icon>
              {{ tr.create }}
            </v-btn>
            <v-btn color="secondary" variant="outlined" @click="handleReset">
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
              <!-- 仮のカードサイズプレビュー -->
              <div class="card-preview">
              <div class="card-watermark" :style="{ backgroundImage: 'url(' + iconUrl + ')' }"></div>
              <div class="card-header">
                <span class="card-title">{{ tr.cardTitle }}</span>
                <span class="card-region">{{ getRegionDisplay(form.region) }}</span>
              </div>
              <div class="card-body">
                <div class="card-content">
                  <div class="card-right">
                    <div class="card-row">
                      <span class="label">{{ tr.name }}:</span>
                      <span class="value">{{ form.name }}</span>
                    </div>
                    <!-- <div class="card-row">
                      <span class="label">{{ tr.region }}:</span>
                      <span class="value">{{ getRegionDisplay(form.region) }}</span>
                    </div> -->
                    <div class="card-row" v-if="form.issuedAt">
                      <span class="label">{{ tr.issuedAt }}:</span>
                      <span class="value">{{ form.issuedAt }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer">{{ form.memberId }}</div>
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
          <v-btn variant="outlined" color="secondary" @click="handlePrint">
            <v-icon class="mr-1">mdi-printer</v-icon>
            {{ tr.print }}
          </v-btn>
          <v-btn color="primary" @click="showDialog = false">{{ tr.close }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="2200">
      {{ tr.saved }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, watch, nextTick } from 'vue'

// 設定・アプリ設定
const appConfig = useAppConfig()
const { settings } = useSettings()
const currentLanguage = computed(() => (settings.value.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng')

// 翻訳
const translations = {
  jpn: {
    pageTitle: '会員証作成',
    formTitle: '入力フォーム',
    memberId: '会員ID（ユニークキー）',
    name: '名前',
    region: '地方名',
    issuedAt: '発行日',
    create: '作成',
    reset: 'リセット',
    previewTitle: 'カードプレビュー',
    cardTitle: '携帯獣研究開発機構',
    showQr: 'QRを表示',
    hideQr: 'QRを隠す',
    close: '閉じる',
    print: '印刷',
    printIncludeQr: 'QRも印刷',
    saved: '保存しました',
  },
  eng: {
    pageTitle: 'Membership Card Generator',
    formTitle: 'Input Form',
    memberId: 'Member ID (Unique Key)',
    name: 'Name',
    region: 'Region',
    issuedAt: 'Issued Date',
    create: 'Create',
    reset: 'Reset',
    previewTitle: 'Card Preview',
    cardTitle: 'Pokemon R&D Organization',
    showQr: 'Show QR',
    hideQr: 'Hide QR',
    close: 'Close',
    print: 'Print',
    printIncludeQr: 'Print QR too',
    saved: 'Saved',
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
watch(() => settings.value.language, () => updatePageTitle())

// SEO タイトル
useSeoMeta({ title: pageTitle })

// 入力フォーム状態
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
})

// 地方表示（自由入力値 + 接尾辞）
const getRegionDisplay = (value: string) => {
  const v = (value || '').trim()
  if (!v) return ''
  return currentLanguage.value === 'eng' ? `${v} Region` : `${v}地方`
}

// 作成ボタンの活性条件（IDと名前のみ必須）
const canCreate = computed(() => !!form.value.memberId?.trim() && !!form.value.name?.trim())

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
const onQrError = () => {
  if (qrProviderIndex.value < qrProviders.length - 1) {
    qrProviderIndex.value++
  }
}
const toggleQr = () => { qrVisible.value = !qrVisible.value }
const printIncludeQr = ref(true)
const snackbar = ref(false)

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
const loadFromLocalStorage = () => {
  try {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const data = JSON.parse(raw) as Partial<typeof form.value>
      if (data.memberId) form.value.memberId = data.memberId
      if (typeof data.name === 'string') form.value.name = data.name
      if (typeof data.region === 'string') form.value.region = data.region
      if (typeof data.issuedAt === 'string' && data.issuedAt) form.value.issuedAt = data.issuedAt
    }
  } catch (e) {
    console.error('Failed to load form from LocalStorage:', e)
  }
}

onMounted(() => {
  loadFromLocalStorage()
  if (!form.value.memberId) form.value.memberId = generateUUID()
})

// ハンドラ
const handleCreate = () => {
  saveToLocalStorage()
  qrVisible.value = false
  showDialog.value = true
  snackbar.value = true
}
const handleReset = () => {
  form.value = { memberId: generateUUID(), name: '', region: '', issuedAt: todayDateStr() }
}

// 入力ルール
const idRules = [
  (v: string) => !!(v && v.trim()) || (currentLanguage.value === 'eng' ? 'Member ID is required' : '会員IDは必須です'),
]
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
</script>

<style scoped>
.card-preview {
  width: 420px; /* 物理カード比率(85.6x53.98mm ≒ 1.586)に近い比率 */
  height: 264px;
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
.qr-wrap img {
  border: 8px solid #f5f5f5;
  border-radius: 0;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
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
