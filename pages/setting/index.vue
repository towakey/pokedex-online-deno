<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />
    <h2 class="text-h5 mb-4">{{ tr.pageTitle }}</h2>
    
    <!-- 現在の設定値表示 -->
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="info">mdi-information</v-icon>
        {{ tr.currentStatusTitle }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-subtitle2 mb-2">{{ tr.currentValues }}</div>
            <v-chip
              :color="hasChanges ? 'warning' : 'success'"
              variant="outlined"
              class="mb-2"
            >
              <v-icon class="mr-1">
                {{ hasChanges ? 'mdi-pencil' : 'mdi-check' }}
              </v-icon>
              {{ hasChanges ? tr.changed : tr.saved }}
            </v-chip>
            <div class="mt-2">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2">{{ tr.displayLanguage }}:</span>
                <strong>{{ getCurrentLanguageName(settings.language) }}</strong>
              </div>
            </div>
          </v-col>
          
          <v-col cols="12" md="6">
            <div class="text-subtitle2 mb-2">{{ tr.defaultsTitle }}</div>
            <v-chip
              color="secondary"
              variant="outlined"
              class="mb-2"
            >
              <v-icon class="mr-1">mdi-restore</v-icon>
              {{ tr.initialValue }}
            </v-chip>
            <div class="mt-2">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2">{{ tr.displayLanguage }}:</span>
                <span class="text-medium-emphasis">{{ getCurrentLanguageName(appConfig.personal.language) }}</span>
              </div>
            </div>
          </v-col>
        </v-row>
        
        <!-- 設定保存状態の詳細 -->
        <v-divider class="my-3" />
        <div class="d-flex align-center text-caption text-medium-emphasis">
          <v-icon class="mr-1" size="small">mdi-clock-outline</v-icon>
          {{ tr.lastUpdated }}: {{ lastSavedTime || tr.notSaved }}
        </div>
      </v-card-text>
    </v-card>
    
    <v-card class="mb-4">
      <v-card-title>{{ tr.personalSettings }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSave">
          <!-- 言語設定 -->
          <v-select
            v-model="localSettings.language"
            :items="languageOptions"
            item-title="text"
            item-value="value"
            :label="tr.displayLanguage"
            outlined
            class="mb-4"
            @update:model-value="handleLanguageChange"
          />
          
          <div class="d-flex gap-2">
            <v-btn
              color="primary"
              type="submit"
              :loading="saving"
            >
              {{ tr.saveSettings }}
            </v-btn>
            
            <v-btn
              color="secondary"
              @click="handleReset"
              :disabled="saving"
            >
              {{ tr.reset }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
    
    <v-card>
      <v-card-title>{{ tr.aboutSettings }}</v-card-title>
      <v-card-text>
        <p>{{ tr.info1 }}</p>
        <p>{{ tr.info2 }}</p>
      </v-card-text>
    </v-card>

    <!-- 保存完了スナックバー -->
    <v-snackbar
      v-model="showSaveMessage"
      :timeout="3000"
      color="success"
    >
      {{ tr.savedToast }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showSaveMessage = false"
        >
          {{ tr.close }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, inject, onMounted } from 'vue'
const appConfig = useAppConfig()

// 設定管理composableを使用
const { settings, updateSettings, saveSettings, resetSettings } = useSettings()

// 現在の言語と翻訳テーブル
const currentLanguage = computed(() => settings.value.language)
const translations = {
  jpn: {
    pageTitle: '設定',
    currentStatusTitle: '現在の設定状況',
    currentValues: '現在の設定値',
    changed: '変更あり',
    saved: '保存済み',
    displayLanguage: '表示言語',
    defaultsTitle: 'デフォルト設定',
    initialValue: '初期値',
    lastUpdated: '最終更新',
    notSaved: '未保存',
    personalSettings: '個人設定',
    saveSettings: '設定を保存',
    reset: 'リセット',
    aboutSettings: '設定について',
    info1: 'この設定はブラウザのローカルストレージに保存されます。',
    info2: '別のデバイスやブラウザでは設定は共有されません。',
    savedToast: '設定を保存しました',
    close: '閉じる',
  },
  eng: {
    pageTitle: 'Setting',
    currentStatusTitle: 'Current status',
    currentValues: 'Current values',
    changed: 'Unsaved changes',
    saved: 'Saved',
    displayLanguage: 'Display language',
    defaultsTitle: 'Default settings',
    initialValue: 'Initial value',
    lastUpdated: 'Last updated',
    notSaved: 'Not saved',
    personalSettings: 'Personal settings',
    saveSettings: 'Save settings',
    reset: 'Reset',
    aboutSettings: 'About settings',
    info1: 'These settings are stored in your browser’s local storage.',
    info2: 'Settings are not shared across devices or browsers.',
    savedToast: 'Settings saved',
    close: 'Close',
  },
} as const
const tr = computed(() => translations[currentLanguage.value as keyof typeof translations] ?? translations.jpn)

// パンくず（言語対応）
const breadcrumbs = computed(() => [
  { title: appConfig.translation.top[currentLanguage.value] || 'Top', disabled: false, href: '/' },
  { title: (appConfig.menus.categories.setting as any)[currentLanguage.value] || tr.value.pageTitle, disabled: true, href: '/setting' },
])

// レイアウト(AppBar)のタイトルを設定ページ名に同期
const pageTitleState = inject('pageTitle', { title: 'Pokédex-Online' })
const pageTitle = computed(() => pageTitleState.title)
const settingTitle = computed(() => {
  const lang = (settings.value.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
  const menuItem = (appConfig.menus?.main as any[] | undefined)?.find((m: any) => m.path === '/setting')
  const titleObj = menuItem?.title as { jpn: string; eng: string } | undefined
  return titleObj?.[lang] ?? (lang === 'eng' ? 'Setting' : '設定')
})
const updatePageTitle = () => {
  pageTitleState.title = settingTitle.value
}
onMounted(() => updatePageTitle())
watch(() => settings.value.language, () => updatePageTitle())

// SEO タイトルも同期
useSeoMeta({
  title: pageTitle
})

// ローカルな設定状態（編集用）
const localSettings = ref({ ...settings.value })

// UI状態
const saving = ref(false)
const showSaveMessage = ref(false)
const lastSavedTime = ref<string>('')

// 言語選択肢
const languageOptions = computed(() => {
  const t = appConfig.translation as Record<string, { jpn: string; eng: string }>
  const dispKey = (settings.value.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
  const allowed = ['jpn', 'eng'] as const
  return allowed.map((key) => ({
    value: key,
    text: t[key]?.[dispKey] ?? key
  }))
})

// 一時制限: 選択可能言語が jpn/eng のみのため、外れている場合は jpn に強制
const allowedLangs = ['jpn', 'eng'] as const
watchEffect(() => {
  const current = localSettings.value.language
  if (!allowedLangs.includes(current as any)) {
    localSettings.value.language = 'jpn'
  }
})

// 現在の設定と編集中の設定を比較して変更があるかチェック
const hasChanges = computed(() => {
  return JSON.stringify(settings.value) !== JSON.stringify(localSettings.value)
})

// 言語コードから表示名を取得（translationに対応）
const getCurrentLanguageName = (languageCode: string) => {
  const t = appConfig.translation as Record<string, { jpn: string; eng: string }>
  const dispKey = (settings.value.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
  return t?.[languageCode]?.[dispKey] || languageCode
}

// 最終保存時刻を更新
const updateLastSavedTime = () => {
  const now = new Date()
  const localeForDatetime = currentLanguage.value === 'eng' ? 'en-US' : 'ja-JP'
  lastSavedTime.value = now.toLocaleString(localeForDatetime, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 言語変更ハンドラー
const handleLanguageChange = (newLanguage: string) => {
  localSettings.value.language = newLanguage
}

// 保存ハンドラー
const handleSave = async () => {
  saving.value = true
  try {
    // settingsを更新
    updateSettings(localSettings.value)
    // ローカルストレージに保存
    saveSettings()
    // 最終更新時刻を更新
    updateLastSavedTime()
    // 成功メッセージ表示
    showSaveMessage.value = true
  } catch (error) {
    console.error('設定の保存に失敗しました:', error)
  } finally {
    saving.value = false
  }
}

// リセットハンドラー
const handleReset = () => {
  resetSettings()
  localSettings.value = { ...settings.value }
  showSaveMessage.value = true
}

// 設定が変更された時にlocalSettingsを更新
watch(settings, (newSettings) => {
  localSettings.value = { ...newSettings }
}, { deep: true })
</script>