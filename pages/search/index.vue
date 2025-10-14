<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />
    
    <!-- 検索フォーム -->
    <v-card class="mb-6">
      <v-card-title>
        <v-icon class="mr-2">mdi-magnify</v-icon>
        {{ tr.searchTitle }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="searchDescriptions">
          <v-row>
            <!-- 検索ワード入力 -->
            <v-col cols="12">
              <v-text-field
                v-model="searchWord"
                :label="tr.searchLabel"
                :placeholder="tr.searchPlaceholder"
                variant="outlined"
                clearable
                :disabled="isLoading"
                @keyup.enter="searchDescriptions"
              />
            </v-col>

            <!-- 検索項目チェックボックス -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">{{ tr.searchItemsLabel }}</div>
              <v-checkbox
                v-model="searchItems"
                value="description"
                :label="tr.descriptionLabel"
                density="compact"
                hide-details
                :disabled="isLoading"
              />
              <v-checkbox
                v-model="searchItems"
                value="name"
                :label="tr.nameLabel"
                density="compact"
                hide-details
                :disabled="isLoading"
              />
              <v-checkbox
                v-model="searchItems"
                value="classification"
                :label="tr.classificationLabel"
                density="compact"
                hide-details
                :disabled="isLoading"
              />
            </v-col>

            <!-- 言語選択 -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">{{ tr.languageLabel }}</div>
              <v-radio-group
                v-model="searchLanguage"
                density="compact"
                hide-details
                :disabled="isLoading"
              >
                <v-radio value="all" :label="tr.allLanguagesLabel" />
                <v-radio value="jpn" :label="tr.japaneseLabel" />
                <v-radio value="eng" :label="tr.englishLabel" />
              </v-radio-group>
            </v-col>

            <!-- 検索ボタン -->
            <v-col cols="12">
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="isLoading"
                :disabled="!searchWord || searchWord.trim().length === 0 || searchItems.length === 0"
              >
                <v-icon class="mr-2">mdi-magnify</v-icon>
                {{ tr.searchButton }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- 検索結果の表示 -->
    <div v-if="searchResults.length > 0">
      <v-card class="mb-4">
        <v-card-title>
          <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
          {{ tr.resultsTitle }}: {{ searchResults.length }}{{ tr.resultsCount }}
          <v-chip v-if="searchedWord" class="ml-2" color="primary" size="small">
            "{{ searchedWord }}"
          </v-chip>
        </v-card-title>
        <v-card-subtitle v-if="searchedItems.length > 0">
          {{ tr.searchItemsPrefix }}: {{ searchedItems.map((i: string) => (tr as any)[i + 'Label']).join(', ') }} | {{ tr.languagePrefix }}: {{ searchedLanguage === 'all' ? tr.allLanguagesLabel : (searchedLanguage === 'jpn' ? tr.japaneseLabel : tr.englishLabel) }}
        </v-card-subtitle>
      </v-card>

      <v-row>
        <v-col 
          v-for="(result, index) in searchResults" 
          :key="index"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card class="h-100 pokemon-result-card" elevation="2">
            <!-- ポケモン画像とヘッダー情報 -->
            <div class="d-flex pa-4">
              <v-avatar size="80" tile class="flex-shrink-0 pokemon-image">
                <img
                  :src="getPokemonImageSrc(result.imageId || result.id)"
                  :alt="`ポケモンID: ${result.id}`"
                  width="80"
                  height="80"
                  style="object-fit: cover; width: 80px; height: 80px;"
                  @error="handleImageError"
                />
              </v-avatar>
              <div class="flex-grow-1 ml-3">
                <h2>{{ result.name[currentLanguage] || result.name.jpn }}</h2>
                <div class="pokemon-id-label">
                  {{ getPokedexDisplayName(result.pokedex) }}No.{{ result.no ? `0000${result.no}`.slice(-4) : 'N/A' }}
                </div>
                <div class="d-flex flex-wrap gap-2 mt-1">
                  <v-chip color="primary" size="small">
                    ID: {{ result.id }}
                  </v-chip>
                  <v-chip v-if="result.ver" color="secondary" size="small">
                    {{ getVersionDisplayName(result.ver) }}
                  </v-chip>
                  <v-chip v-if="result.language && result.language !== 'all'" color="info" size="small">
                    {{ getLanguageDisplayName(result.language) }}
                  </v-chip>
                  <v-chip v-if="result.matched_fields && result.matched_fields.length > 0" color="success" size="small">
                    {{ tr.matchedLabel }}: {{ result.matched_fields.map((f: string) => (tr as any)[f + 'Label']).join(', ') }}
                  </v-chip>
                </div>
              </div>
            </div>
            
            <!-- 図鑑説明とマッチ情報 -->
            <v-card-text class="pt-0">
              <div v-if="result.description" class="mb-3">
                <div class="text-subtitle-2 mb-2 text-grey-darken-1">
                  <v-icon size="small" class="mr-1">mdi-book-open-page-variant</v-icon>
                  {{ tr.descriptionLabel }}
                </div>
                <div class="description-text">
                  <RubyText :text="result.description" :highlightWord="searchedWord" />
                </div>
              </div>
              <div v-if="result.matched_name" class="mb-2">
                <div class="text-subtitle-2 mb-1 text-grey-darken-1">
                  <v-icon size="small" class="mr-1">mdi-tag</v-icon>
                  {{ tr.matchedNameLabel }}
                </div>
                <div class="text-body-2">
                  <RubyText :text="result.matched_name" :highlightWord="searchedWord" />
                </div>
              </div>
              <div v-if="result.matched_classification">
                <div class="text-subtitle-2 mb-1 text-grey-darken-1">
                  <v-icon size="small" class="mr-1">mdi-tag-text</v-icon>
                  {{ tr.matchedClassificationLabel }}
                </div>
                <div class="text-body-2">
                  <RubyText :text="result.matched_classification" :highlightWord="searchedWord" />
                </div>
              </div>
            </v-card-text>
            
            <!-- アクションボタン -->
            <v-card-actions class="pt-0">
              <v-btn 
                variant="outlined" 
                color="primary"
                size="small"
                :to="`/pokedex/global/${result.globalNo || result.id}`"
                block
              >
                <v-icon class="mr-1">mdi-eye</v-icon>
                {{ tr.viewDetailsButton }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- 検索結果なしの表示 -->
    <v-card v-else-if="hasSearched && !isLoading" class="text-center py-8">
      <v-card-text>
        <v-icon size="64" color="grey-lighten-1" class="mb-4">
          mdi-magnify-close
        </v-icon>
        <h3 class="text-h6 mb-2">{{ tr.noResultsTitle }}</h3>
        <p class="text-body-2 text-grey">
          {{ tr.noResultsMessage1 }}「{{ searchedWord }}」{{ tr.noResultsMessage2 }}<br>
          {{ tr.noResultsMessage3 }}
        </p>
      </v-card-text>
    </v-card>

    <!-- 検索前の説明 -->
    <v-card v-else-if="!hasSearched && !isLoading" class="text-center py-8">
      <v-card-text>
        <v-icon size="64" color="primary" class="mb-4">
          mdi-book-search
        </v-icon>
        <h3 class="text-h6 mb-2">{{ tr.welcomeTitle }}</h3>
        <p class="text-body-2 text-grey">
          {{ tr.welcomeMessage1 }}<br>
          {{ tr.welcomeMessage2 }}
        </p>
      </v-card-text>
    </v-card>

    <!-- ローディング表示 -->
    <v-card v-if="isLoading" class="text-center py-8">
      <v-card-text>
        <v-progress-circular 
          size="64" 
          width="6" 
          color="primary" 
          indeterminate
          class="mb-4"
        />
        <h3 class="text-h6 mb-2">{{ tr.loadingTitle }}</h3>
        <p class="text-body-2 text-grey">
          {{ tr.loadingMessage }}「{{ searchWord }}」{{ tr.loadingSuffix }}
        </p>
      </v-card-text>
    </v-card>
    
    <!-- スクロールボタン -->
    <v-fab-transition>
      <v-btn
        v-show="showScrollButtons"
        icon="mdi-chevron-up"
        color="primary"
        size="small"
        class="scroll-to-top-btn"
        @click="scrollToTop"
        elevation="4"
      >
      </v-btn>
    </v-fab-transition>
    
    <v-fab-transition>
      <v-btn
        v-show="showScrollButtons"
        icon="mdi-chevron-down"
        color="primary"
        size="small"
        class="scroll-to-bottom-btn"
        @click="scrollToBottom"
        elevation="4"
      >
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  pageTitle: '検索'
})
import { ref, computed, watch, onMounted, nextTick, inject } from 'vue'
import { useApiBase, useApiClient } from '#imports'

// ルート情報とナビゲーション
const route = useRoute()
const router = useRouter()

// レイアウトのページタイトル制御（多言語対応）
const appConfig = useAppConfig()
const { settings } = useSettings()
const pageTitleState = inject('pageTitle', { title: 'Pokédex-Online' })
const pageTitle = computed(() => pageTitleState.title)

// 現在の言語設定
const currentLanguage = computed(() => {
  return settings.value?.language === 'eng' ? 'eng' : 'jpn'
})

// 多言語翻訳
const tr = computed(() => {
  const lang = currentLanguage.value
  return {
    searchTitle: lang === 'eng' ? 'Search' : '検索',
    searchLabel: lang === 'eng' ? 'Enter search term' : '検索ワードを入力してください',
    searchPlaceholder: lang === 'eng' ? 'e.g., fire, water, forest, sky' : '例: 炎、水、森、空など',
    searchItemsLabel: lang === 'eng' ? 'Search in:' : '検索項目:',
    descriptionLabel: lang === 'eng' ? 'Description' : '図鑑説明',
    nameLabel: lang === 'eng' ? 'Name' : '名前',
    classificationLabel: lang === 'eng' ? 'Classification' : '分類',
    languageLabel: lang === 'eng' ? 'Language:' : '検索言語:',
    allLanguagesLabel: lang === 'eng' ? 'All Languages' : '指定なし（全言語）',
    japaneseLabel: lang === 'eng' ? 'Japanese' : '日本語',
    englishLabel: lang === 'eng' ? 'English' : '英語',
    searchButton: lang === 'eng' ? 'Search' : '検索',
    resultsTitle: lang === 'eng' ? 'Search Results' : '検索結果',
    resultsCount: lang === 'eng' ? ' results' : '件',
    searchItemsPrefix: lang === 'eng' ? 'Searched in' : '検索項目',
    languagePrefix: lang === 'eng' ? 'Language' : '言語',
    matchedLabel: lang === 'eng' ? 'Matched' : 'マッチ',
    matchedNameLabel: lang === 'eng' ? 'Matched Name' : 'マッチした名前',
    matchedClassificationLabel: lang === 'eng' ? 'Matched Classification' : 'マッチした分類',
    viewDetailsButton: lang === 'eng' ? 'View Details' : '詳細を見る',
    noResultsTitle: lang === 'eng' ? 'No Results Found' : '検索結果が見つかりませんでした',
    noResultsMessage1: lang === 'eng' ? 'No results found for ' : '',
    noResultsMessage2: lang === 'eng' ? '.' : 'に関連する内容は見つかりませんでした。',
    noResultsMessage3: lang === 'eng' ? 'Please try a different search term.' : '別のキーワードで検索してみてください。',
    welcomeTitle: lang === 'eng' ? 'Pokédex Search' : 'ポケモン図鑑検索',
    welcomeMessage1: lang === 'eng' ? 'Search for Pokémon by description, name, or classification.' : 'ポケモンの図鑑説明、名前、分類から検索できます。',
    welcomeMessage2: lang === 'eng' ? 'Enter a keyword in the search box above to get started.' : '上の検索ボックスにキーワードを入力して検索してください。',
    loadingTitle: lang === 'eng' ? 'Searching...' : '検索中...',
    loadingMessage: lang === 'eng' ? 'Searching for ' : '',
    loadingSuffix: lang === 'eng' ? '...' : 'を検索しています'
  }
})

// 検索ページのタイトル（言語依存）を app.config.menus.main から取得
const searchTitle = computed(() => {
  const lang = currentLanguage.value
  const menuItem = (appConfig.menus?.main as any[] | undefined)?.find((m: any) => m.path === '/search')
  const titleObj = menuItem?.title as { jpn: string; eng: string } | undefined
  return titleObj?.[lang] ?? (lang === 'eng' ? 'Search' : '検索')
})

const updatePageTitle = () => {
  pageTitleState.title = searchTitle.value
}

// 設定変更時に同期
watch(() => settings.value?.language, () => updatePageTitle())

// リアクティブな状態管理
const searchWord = ref('')
const searchedWord = ref('')
const searchItems = ref<string[]>(['description']) // デフォルトで図鑑説明を検索
const searchedItems = ref<string[]>([])
const searchLanguage = ref<string>('all') // デフォルトで全言語
const searchedLanguage = ref<string>('all')
const searchResults = ref<any[]>([])
const isLoading = ref(false)
const hasSearched = ref(false)

// URLクエリパラメータから検索条件を初期化
const initializeFromQuery = () => {
  const query = route.query.q as string
  const items = route.query.items as string
  const lang = route.query.lang as string
  
  if (query && query.trim()) {
    searchWord.value = query.trim()
  }
  
  if (items) {
    searchItems.value = items.split(',')
  }
  
  if (lang) {
    searchLanguage.value = lang
  }
  
  // 初期化時に自動検索を実行
  if (searchWord.value) {
    nextTick(() => {
      searchDescriptions()
    })
  }
}

// URLクエリパラメータを更新する関数
const updateQueryParam = (word: string, items: string[], lang: string) => {
  const query: Record<string, string> = {}
  
  if (word && word.trim()) {
    query.q = word.trim()
  }
  
  if (items.length > 0) {
    query.items = items.join(',')
  }
  
  if (lang) {
    query.lang = lang
  }
  
  router.replace({
    path: route.path,
    query
  })
}

// ルート変更時の監視（戻る/進む対応）
watch(() => [route.query.q, route.query.items, route.query.lang], ([newQuery, newItems, newLang]) => {
  const queryValue = newQuery as string
  const itemsValue = newItems as string
  const langValue = newLang as string
  
  let needsUpdate = false
  
  if (queryValue !== searchWord.value) {
    searchWord.value = queryValue || ''
    needsUpdate = true
  }
  
  if (itemsValue) {
    const items = itemsValue.split(',')
    if (JSON.stringify(items) !== JSON.stringify(searchItems.value)) {
      searchItems.value = items
      needsUpdate = true
    }
  }
  
  if (langValue && langValue !== searchLanguage.value) {
    searchLanguage.value = langValue
    needsUpdate = true
  }
  
  if (needsUpdate && queryValue && queryValue.trim()) {
    nextTick(() => {
      searchDescriptions()
    })
  } else if (!queryValue) {
    // クエリパラメータが空の場合は検索結果をクリア
    searchWord.value = ''
    searchedWord.value = ''
    searchResults.value = []
    hasSearched.value = false
  }
})

// SEO タイトルも同期
useSeoMeta({
  title: pageTitle
})

const breadcrumbs = computed(() => ([
  { title: 'Home', disabled: false, href: '/' },
  { title: searchTitle.value, disabled: true, href: '/search' },
]))

// API ベースURLユーティリティ
const { buildUrl } = useApiBase()
// タイムアウト・リトライ付きフェッチ
const { fetchWithRetry } = useApiClient()

// 検索処理
const searchDescriptions = async () => {
  if (!searchWord.value || searchWord.value.trim().length === 0) {
    return
  }
  
  if (searchItems.value.length === 0) {
    return
  }

  isLoading.value = true
  searchResults.value = []
  searchedWord.value = searchWord.value
  searchedItems.value = [...searchItems.value]
  searchedLanguage.value = searchLanguage.value
  hasSearched.value = true

  // URLクエリパラメータを更新
  updateQueryParam(searchWord.value, searchItems.value, searchLanguage.value)

  try {
    const params = new URLSearchParams({
      mode: 'search',
      items: searchItems.value.join(','),
      word: searchWord.value.trim(),
      language: searchLanguage.value
    })

    const endpoint = buildUrl('/pokedex/pokedex.php')
    const data = await fetchWithRetry(`${endpoint}?${params.toString()}`, { 
      timeoutMs: 30000,  // 30秒に延長（検索結果が多い場合に対応）
      retries: 2 
    })

    if (data.success) {
      searchResults.value = data.data || []
      console.log('検索結果の構造:', searchResults.value[0])
      console.log('検索結果のポケモン名:', searchResults.value[0]?.name?.jpn)
    } else {
      console.error('検索エラー:', data.error)
      searchResults.value = []
    }
  } catch (error) {
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

// バージョン名の表示用変換
const getVersionDisplayName = (version: string): string => {
  const versionMap: { [key: string]: string } = {
    // 単体バージョン
    'red': 'レッド', 'green': 'グリーン', 'blue': 'ブルー', 'yellow': 'イエロー', 'pikachu': 'ピカチュウ',
    'gold': 'ゴールド', 'silver': 'シルバー', 'crystal': 'クリスタル',
    'ruby': 'ルビー', 'sapphire': 'サファイア', 'emerald': 'エメラルド',
    'firered': 'ファイアレッド', 'leafgreen': 'リーフグリーン',
    'diamond': 'ダイヤモンド', 'pearl': 'パール', 'platinum': 'プラチナ',
    'heartgold': 'ハートゴールド', 'soulsilver': 'ソウルシルバー',
    'black': 'ブラック', 'white': 'ホワイト', 'black2': 'ブラック2', 'white2': 'ホワイト2',
    'x': 'X', 'y': 'Y', 'omegaruby': 'オメガルビー', 'alphasapphire': 'アルファサファイア',
    'sun': 'サン', 'moon': 'ムーン', 'ultrasun': 'ウルトラサン', 'ultramoon': 'ウルトラムーン',
    'sword': 'ソード', 'shield': 'シールド', 'scarlet': 'スカーレット', 'violet': 'バイオレット',
    'legendsarceus': 'レジェンズアルセウス',
    
    // 世代グループバージョン
    'red_green_blue_pikachu': '赤・緑・青・ピカチュウ',
    'gold_silver_crystal': '金・銀・クリスタル',
    'ruby_sapphire_emerald': 'ルビー・サファイア・エメラルド',
    'firered_leafgreen': 'ファイアレッド・リーフグリーン',
    'diamond_pearl_platinum': 'ダイヤモンド・パール・プラチナ',
    'heartgold_soulsilver': 'ハートゴールド・ソウルシルバー',
    'black_white': 'ブラック・ホワイト',
    'black2_white2': 'ブラック2・ホワイト2',
    'x_y': 'X・Y',
    'omegaruby_alphasapphire': 'オメガルビー・アルファサファイア',
    'sun_moon': 'サン・ムーン',
    'ultrasun_ultramoon': 'ウルトラサン・ウルトラムーン',
    'sword_shield': 'ソード・シールド',
    'scarlet_violet': 'スカーレット・バイオレット'
  }
  return versionMap[version] || version
}

// 言語名の表示用変換
const getLanguageDisplayName = (language: string): string => {
  const languageMap: { [key: string]: string} = {
    'jpn': '日本語', 'eng': '英語', 'fra': 'フランス語', 'ger': 'ドイツ語',
    'spa': 'スペイン語', 'ita': 'イタリア語', 'kor': '韓国語',
    'chs': '中国語（簡体字）', 'cht': '中国語（繁体字）'
  }
  return languageMap[language] || language
}

// ポケモン画像のソースパスを生成
const getPokemonImageSrc = (pokemonId: string | number): string => {
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL || '/'
  
  const id = String(pokemonId)
  
  if (id && id.length > 4) {
    return `${baseURL}img/pokedex/${id}.png`
  }
  
  const imageNo = `0000${id}`.slice(-4)
  return `${baseURL}img/pokedex/${imageNo}_00000000_0_000_0.png`
}

// 画像読み込みエラー時の処理
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    // エラーが発生した場合は透明な1x1のdata URLを使用
    target.onerror = null // 無限ループを防ぐ
    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'
    target.style.backgroundColor = '#f5f5f5'
  }
}

// pokedex情報から図鑑表示名（日本語）を取得
const getPokedexDisplayName = (pokedex: string): string => {
  if (!pokedex || pokedex === 'global') {
    return '全国図鑑'
  }
  
  const regionPokedex = appConfig.regionPokedex as Record<string, any>
  
  for (const regionInfo of Object.values(regionPokedex)) {
    if (regionInfo?.name?.jpn === pokedex || regionInfo?.disp === pokedex) {
      return regionInfo.name.jpn
    }
  }
  
  return pokedex
}

// スクロールボタンの制御
const showScrollButtons = ref(false)

// スクロールイベントのハンドラ
const handleScroll = () => {
  // 100px以上スクロールしたらボタンを表示
  showScrollButtons.value = window.scrollY > 100
}

// ページトップにスクロール
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// ページボトムにスクロール
const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  })
}

// マウント時にスクロールイベントリスナーを追加
onMounted(() => {
  updatePageTitle()
  initializeFromQuery()
  window.addEventListener('scroll', handleScroll)
})

// アンマウント時にイベントリスナーを削除
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.description-text {
  line-height: 1.6;
  word-break: break-word;
  font-size: 0.9rem;
}

.pokemon-result-card {
  transition: transform 0.2s ease-in-out;
  border: 2px solid #e3f2fd;
  border-radius: 12px;
}

.pokemon-result-card:hover {
  transform: translateY(-2px);
  border-color: #2196f3;
}

.pokemon-image {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.pokemon-id-label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.v-btn {
  transition: all 0.2s ease-in-out;
}

.v-chip {
  font-size: 0.7rem;
}

/* スクロールボタンのスタイル */
.scroll-to-top-btn {
  position: fixed;
  bottom: 80px;
  right: 16px;
  z-index: 1000;
}

.scroll-to-bottom-btn {
  position: fixed;
  bottom: 20px;
  right: 16px;
  z-index: 1000;
}
</style>
