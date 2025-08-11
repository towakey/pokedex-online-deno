<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />
    <h2 class="text-h5 mb-4">設定</h2>
    
    <!-- 現在の設定値表示 -->
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="info">mdi-information</v-icon>
        現在の設定状況
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-subtitle2 mb-2">現在の設定値</div>
            <v-chip
              :color="hasChanges ? 'warning' : 'success'"
              variant="outlined"
              class="mb-2"
            >
              <v-icon class="mr-1">
                {{ hasChanges ? 'mdi-pencil' : 'mdi-check' }}
              </v-icon>
              {{ hasChanges ? '変更あり' : '保存済み' }}
            </v-chip>
            <div class="mt-2">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2">表示言語:</span>
                <strong>{{ getCurrentLanguageName(settings.language) }}</strong>
              </div>
            </div>
          </v-col>
          
          <v-col cols="12" md="6">
            <div class="text-subtitle2 mb-2">デフォルト設定</div>
            <v-chip
              color="secondary"
              variant="outlined"
              class="mb-2"
            >
              <v-icon class="mr-1">mdi-restore</v-icon>
              初期値
            </v-chip>
            <div class="mt-2">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2">表示言語:</span>
                <span class="text-medium-emphasis">{{ getCurrentLanguageName(appConfig.personal.language) }}</span>
              </div>
            </div>
          </v-col>
        </v-row>
        
        <!-- 設定保存状態の詳細 -->
        <v-divider class="my-3" />
        <div class="d-flex align-center text-caption text-medium-emphasis">
          <v-icon class="mr-1" size="small">mdi-clock-outline</v-icon>
          最終更新: {{ lastSavedTime || '未保存' }}
        </div>
      </v-card-text>
    </v-card>
    
    <v-card class="mb-4">
      <v-card-title>個人設定</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSave">
          <!-- 言語設定 -->
          <v-select
            v-model="localSettings.language"
            :items="languageOptions"
            item-title="text"
            item-value="value"
            label="表示言語"
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
              設定を保存
            </v-btn>
            
            <v-btn
              color="secondary"
              @click="handleReset"
              :disabled="saving"
            >
              リセット
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
    
    <v-card>
      <v-card-title>設定について</v-card-title>
      <v-card-text>
        <p>この設定はブラウザのローカルストレージに保存されます。</p>
        <p>別のデバイスやブラウザでは設定は共有されません。</p>
      </v-card-text>
    </v-card>

    <!-- 保存完了スナックバー -->
    <v-snackbar
      v-model="showSaveMessage"
      :timeout="3000"
      color="success"
    >
      設定を保存しました
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showSaveMessage = false"
        >
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

const breadcrumbs = [
  { title: 'Home', disabled: true, href: '/' },
  { title: '設定', disabled: false, href: '/setting' },
]

// 設定管理composableを使用
const { settings, updateSettings, saveSettings, resetSettings } = useSettings()

// ローカルな設定状態（編集用）
const localSettings = ref({ ...settings.value })

// UI状態
const saving = ref(false)
const showSaveMessage = ref(false)
const lastSavedTime = ref<string>('')

// 言語選択肢
const languageOptions = computed(() => {
  return Object.entries(appConfig.lang_eng2jpn).map(([key, value]) => ({
    value: key,
    text: value
  }))
})

// 現在の設定と編集中の設定を比較して変更があるかチェック
const hasChanges = computed(() => {
  return JSON.stringify(settings.value) !== JSON.stringify(localSettings.value)
})

// 言語コードから表示名を取得
const getCurrentLanguageName = (languageCode: string) => {
  return (appConfig.lang_eng2jpn as Record<string, string>)[languageCode] || languageCode
}

// 最終保存時刻を更新
const updateLastSavedTime = () => {
  const now = new Date()
  lastSavedTime.value = now.toLocaleString('ja-JP', {
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