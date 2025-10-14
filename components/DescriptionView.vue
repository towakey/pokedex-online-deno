<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const config = useRuntimeConfig()

const props = defineProps(["description", "title", "openVersionDialog"])

const { settings } = useSettings()

// 統一された言語設定
const currentLanguage = computed(() => {
  return (settings.value?.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
})

// ゲームバージョン名の多言語対応
const getVersionName = (versionKey: string) => {
  // app.config.tsの翻訳キーを使用
  const translation = appConfig.translation[versionKey as keyof typeof appConfig.translation]
  if (translation && typeof translation === 'object' && 'jpn' in translation && 'eng' in translation) {
    return translation[currentLanguage.value]
  }
  // フォールバック: verDescriptionのshortTitleまたはversionKey自体
  const descriptions = appConfig.verDescription as Record<string, any>
  return descriptions[versionKey]?.shortTitle || versionKey
}

// バージョンアイコン取得（_kanji版のフォールバック対応）
const getVersionIcon = (versionKey: string) => {
  // まず該当するバージョンのアイコンがあるかチェック
  const icons = appConfig.verIcon as Record<string, string>
  if (icons[versionKey]) {
    return icons[versionKey]
  }
  
  // _kanjiが含まれている場合は、_kanjiを取り除いたバージョンのアイコンを試す
  if (versionKey.includes('_kanji')) {
    const baseVersion = versionKey.replace('_kanji', '')
    if (icons[baseVersion]) {
      return icons[baseVersion]
    }
  }
  
  return null
}

// バージョン説明取得（_kanji版のフォールバック対応）
const getVersionDescription = (versionKey: string) => {
  // まず該当するバージョンの説明があるかチェック
  const descriptions = appConfig.verDescription as Record<string, any>
  if (descriptions[versionKey]) {
    return descriptions[versionKey]
  }
  
  // _kanjiが含まれている場合は、_kanjiを取り除いたバージョンの説明を試す
  if (versionKey.includes('_kanji')) {
    const baseVersion = versionKey.replace('_kanji', '')
    if (descriptions[baseVersion]) {
      return descriptions[baseVersion]
    }
  }
  
  return null
}

const shareOptions = [
  { title: 'Twitter', icon: 'mdi-twitter', network: 'twitter' },
  { title: 'Mastodon', icon: 'mdi-mastodon', network: 'mastodon' },
  { title: 'Bluesky', icon: 'mdi-web', network: 'bluesky' },
  // 他のSNSオプションを追加できます
];

const shareOn = (network: string, textContent: string) => {
  const urlObject = (process.client && typeof window !== 'undefined')
    ? new URL(window.location.href)
    : new URL(`${(config.public && (config.public as any).siteUrl) || ''}${route.fullPath}`)
  urlObject.hash = ''
  const currentUrl = `${urlObject.toString()}`
  const text = encodeURIComponent(`${textContent}\n${props.title}\n`);
  const url = encodeURIComponent(currentUrl);
  
  let shareUrl;
  switch (network) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      break;
    case 'mastodon':
      // マストドンの場合、ユーザーにインスタンスURLを入力してもらう必要があります
      const instance = prompt('マストドンのインスタンスURLを入力してください');
      if (instance) {
        shareUrl = `${instance}/share?text=${text} ${url}`;
      }
      break;
      case 'bluesky': // Blueskyの処理を追加
      shareUrl = `https://bsky.app/intent/compose?text=${text}%20${url}`;
      break;
    // 他のSNSの場合分けをここに追加
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=550,height=420');
  }
};

// _kanji の無効値（空、null、undefined、空白のみ、「じょうほう なし」など）を除外するフィルタ
const isEmptyOrInvalid = (desc: unknown): boolean => {
  const s = typeof desc === 'string' ? desc : ''
  return (
    !s ||
    s.trim() === '' ||
    s === 'じょうほう なし' ||
    s === 'null' ||
    s === 'undefined' ||
    /^\s*$/.test(s)
  )
}

// 描画用に _kanji の無効説明を除外したマップを生成
const filteredDescription = computed<Record<string, any>>(() => {
  const src = (props as any)?.description as Record<string, any> | null | undefined
  if (!src || typeof src !== 'object') return {}
  const out: Record<string, any> = {}
  for (const [key, value] of Object.entries(src)) {
    if (key.includes('_kanji')) {
      const jpn = (value as any)?.jpn
      if (isEmptyOrInvalid(jpn)) {
        continue
      }
    }
    out[key] = value
  }
  return out
})

</script>
<template>
  <v-card
  variant="outlined"
  style="margin-top: 20px;"
  :id="`description`"
  >
    <v-list
    lines="two"
    >
      <v-list-item
        v-for="(ver, index) in filteredDescription" :key="index"
      >
        <v-list-item-title>
          <h3>
            <img
              v-if="getVersionIcon(String(index))"
              :src="`${config.app.baseURL || '/'}img/version/${getVersionIcon(String(index))}`"
              :alt="getVersionDescription(String(index))?.shortTitle || String(index)"
              style="height: 20px; width: 20px; vertical-align: middle; margin-right: 4px; cursor: pointer;"
              @click="props.openVersionDialog && props.openVersionDialog({ver: String(index), verJpn: getVersionDescription(String(index))?.shortTitle || String(index), description: ver.jpn})"
            />
            {{ getVersionName(String(index)) }}
          <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
            variant="plain"
            icon="mdi-share-variant"
            size="small"
            class="share-btn"
            v-bind="props"
            />
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in shareOptions"
              :key="index"
              @click="shareOn(item.network, ver?.jpn || '')"
            >
              <v-list-item-title>
                <v-icon :icon="item.icon" size="small" class="mr-2" />
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        </h3>
        </v-list-item-title>
        <v-list-item-subtitle class="wrap-text" style="color: #000;" v-if="ver && ver[currentLanguage] && ver[currentLanguage] !== ''"><p>{{ ver[currentLanguage] }}</p></v-list-item-subtitle>
        <v-list-item-subtitle class="wrap-text" style="color: #000;" v-else>{{ currentLanguage === 'eng' ? 'No information available' : 'じょうほう なし' }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>
