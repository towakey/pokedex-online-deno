<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />
    
    <!-- 検索フォーム -->
    <v-card class="mb-6">
      <v-card-title>
        <v-icon class="mr-2">mdi-magnify</v-icon>
        検索
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="searchDescriptions">
          <v-row>
            <v-col cols="12" md="9">
              <v-text-field
                v-model="searchWord"
                label="検索ワードを入力してください"
                placeholder="例: 炎、水、森、空など"
                variant="outlined"
                clearable
                :disabled="isLoading"
                @keyup.enter="searchDescriptions"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="isLoading"
                :disabled="!searchWord || searchWord.trim().length === 0"
              >
                <v-icon class="mr-2">mdi-magnify</v-icon>
                検索
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
          検索結果: {{ searchResults.length }}件
          <v-chip v-if="searchedWord" class="ml-2" color="primary" size="small">
            "{{ searchedWord }}"
          </v-chip>
        </v-card-title>
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
                  :src="getPokemonImageSrc(result.id)"
                  :alt="`ポケモンID: ${result.id}`"
                  width="80"
                  height="80"
                  style="object-fit: cover; width: 80px; height: 80px;"
                  @error="handleImageError"
                />
              </v-avatar>
              <div class="flex-grow-1 ml-3">
                <h2>{{ result.name.jpn }}</h2>
                <div class="pokemon-id-label">
                  {{ getPokedexDisplayName(result.pokedex) }}No.{{ `0000${result.no}`.slice(-4) }}
                </div>
                <div class="d-flex flex-wrap gap-2 mt-1">
                  <v-chip color="primary" size="small">
                    ID: {{ result.id }}
                  </v-chip>
                  <v-chip v-if="result.ver" color="secondary" size="small">
                    {{ getVersionDisplayName(result.ver) }}
                  </v-chip>
                  <v-chip v-if="result.language" color="info" size="small">
                    {{ getLanguageDisplayName(result.language) }}
                  </v-chip>
                </div>
              </div>
            </div>
            
            <!-- 図鑑説明 -->
            <v-card-text class="pt-0">
              <div class="text-subtitle-2 mb-2 text-grey-darken-1">
                <v-icon size="small" class="mr-1">mdi-book-open-page-variant</v-icon>
                図鑑説明
              </div>
              <div class="description-text">
                {{ result.description }}
              </div>
            </v-card-text>
            
            <!-- アクションボタン -->
            <v-card-actions class="pt-0">
              <v-btn 
                variant="outlined" 
                color="primary"
                size="small"
                :to="`/pokedex/${getPokedexAreaName(result.pokedex, result.ver)}/${result.no || result.id}`"
                block
              >
                <v-icon class="mr-1">mdi-eye</v-icon>
                詳細を見る
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
        <h3 class="text-h6 mb-2">検索結果が見つかりませんでした</h3>
        <p class="text-body-2 text-grey">
          「{{ searchedWord }}」に関連する図鑑説明は見つかりませんでした。<br>
          別のキーワードで検索してみてください。
        </p>
      </v-card-text>
    </v-card>

    <!-- 検索前の説明 -->
    <v-card v-else-if="!hasSearched && !isLoading" class="text-center py-8">
      <v-card-text>
        <v-icon size="64" color="primary" class="mb-4">
          mdi-book-search
        </v-icon>
        <h3 class="text-h6 mb-2">図鑑説明検索</h3>
        <p class="text-body-2 text-grey">
          ポケモンの図鑑説明から検索ワードを含む内容を探すことができます。<br>
          上の検索ボックスにキーワードを入力して検索してください。
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
        <h3 class="text-h6 mb-2">検索中...</h3>
        <p class="text-body-2 text-grey">
          「{{ searchWord }}」を検索しています
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
definePageMeta({
  pageTitle: '検索'
})
useHead({
  title: '検索',
  meta: [
    { name: 'description', content: '検索' }
  ]
})
import { ref } from 'vue'
import { useApiBase, useApiClient } from '#imports'

const breadcrumbs = ref([
  { title: 'Home', disabled: false, href: '/' },
  { title: '検索', disabled: true, href: '/search' },
])

// リアクティブな状態管理
const searchWord = ref('')
const searchedWord = ref('')
const searchResults = ref<any[]>([])
const isLoading = ref(false)
const hasSearched = ref(false)

// API ベースURLユーティリティ
const { buildUrl } = useApiBase()
// タイムアウト・リトライ付きフェッチ
const { fetchWithRetry } = useApiClient()

// 検索処理
const searchDescriptions = async () => {
  if (!searchWord.value || searchWord.value.trim().length === 0) {
    return
  }

  isLoading.value = true
  searchResults.value = []
  searchedWord.value = searchWord.value
  hasSearched.value = true

  try {
    const params = new URLSearchParams({
      mode: 'search',
      item: 'description',
      word: searchWord.value.trim()
    })

    const endpoint = buildUrl('/pokedex/pokedex.php')
    const data = await fetchWithRetry(`${endpoint}?${params.toString()}`, { timeoutMs: 7000, retries: 2 })

    if (data.success) {
      searchResults.value = data.data || []
    } else {
      console.error('検索エラー:', data.error)
      // エラー処理: ユーザーには分かりやすいメッセージを表示
      searchResults.value = []
    }
  } catch (error) {
    console.error('API呼び出しエラー:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

// バージョン名の表示用変換
const getVersionDisplayName = (version: string): string => {
  const versionMap: { [key: string]: string } = {
    'red': 'レッド',
    'green': 'グリーン',
    'blue': 'ブルー',
    'yellow': 'イエロー',
    'gold': 'ゴールド',
    'silver': 'シルバー',
    'crystal': 'クリスタル',
    'ruby': 'ルビー',
    'sapphire': 'サファイア',
    'emerald': 'エメラルド',
    'firered': 'ファイアレッド',
    'leafgreen': 'リーフグリーン',
    'diamond': 'ダイヤモンド',
    'pearl': 'パール',
    'platinum': 'プラチナ',
    'heartgold': 'ハートゴールド',
    'soulsilver': 'ソウルシルバー',
    'black': 'ブラック',
    'white': 'ホワイト',
    'black2': 'ブラック2',
    'white2': 'ホワイト2',
    'x': 'X',
    'y': 'Y',
    'omegaruby': 'オメガルビー',
    'alphasapphire': 'アルファサファイア',
    'sun': 'サン',
    'moon': 'ムーン',
    'ultrasun': 'ウルトラサン',
    'ultramoon': 'ウルトラムーン',
    'sword': 'ソード',
    'shield': 'シールド'
  }
  return versionMap[version] || version
}

// 言語名の表示用変換
const getLanguageDisplayName = (language: string): string => {
  const languageMap: { [key: string]: string } = {
    'jpn': '日本語',
    'eng': '英語',
    'fra': 'フランス語',
    'ger': 'ドイツ語',
    'spa': 'スペイン語',
    'ita': 'イタリア語',
    'kor': '韓国語',
    'chs': '中国語（簡体字）',
    'cht': '中国語（繁体字）'
  }
  return languageMap[language] || language
}

// ポケモン画像のソースパスを生成
const getPokemonImageSrc = (pokemonId: string | number): string => {
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL || '/'
  
  // IDを文字列として処理
  const id = String(pokemonId)
  
  // IDが4文字以上で複雑なファイル名パターンの場合（例: 0082_00000000_5_000_0）
  if (id && id.length > 4) {
    return `${baseURL}img/pokedex/${id}.png`
  }
  
  // フォールバック: 基本的な4桁のIDを使用して基本パターンを試行
  const imageNo = `0000${id}`.slice(-4)
  
  // 基本パターンを試行（例: 0082_00000000_0_000_0.png）
  return `${baseURL}img/pokedex/${imageNo}_00000000_0_000_0.png`
}

// 画像読み込みエラー時の処理
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    // エラー時はデフォルト画像またはプレースホルダーを表示
    const config = useRuntimeConfig()
    const baseURL = config.app.baseURL || '/'
    target.src = `${baseURL}img/pokemon-placeholder.png`
    target.onerror = null // 無限ループを防ぐ
  }
}

// pokedex情報から地方名（英語）を取得（version情報も考慮）
const getPokedexAreaName = (pokedex: string, version?: string): string => {
  const appConfig = useAppConfig()
  
  // pokedexがnullや未定義の場合はglobalを使用
  if (!pokedex) {
    return 'global'
  }
  
  // 日本語の図鑑名から対応する英語キーを逆引き検索
  const regionPokedex = appConfig.regionPokedex as Record<string, any>
  
  // version情報がある場合は、gameVersionも考慮して最適なマッチを探す
  if (version) {
    const candidates: { key: string; priority: number }[] = []
    
    for (const [englishKey, regionInfo] of Object.entries(regionPokedex)) {
      if (regionInfo?.name?.jpn === pokedex || regionInfo?.disp === pokedex) {
        // gameVersionとversionの一致度を計算
        const gameVersions = regionInfo.gameVersion || []
        let priority = 0
        
        // version文字列からゲーム名を抽出（例: "black2_white2" → ["black2", "white2"]）
        const versionParts = version.toLowerCase().split('_')
        
        for (const gameName of gameVersions) {
          if (versionParts.includes(gameName.toLowerCase())) {
            priority += 10 // 完全一致には高い優先度
          }
          // 部分一致もチェック（例: "black" と "black2"）
          for (const part of versionParts) {
            if (gameName.toLowerCase().includes(part) || part.includes(gameName.toLowerCase())) {
              priority += 1
            }
          }
        }
        
        candidates.push({ key: englishKey, priority })
      }
    }
    
    // 最も優先度の高いものを返す
    if (candidates.length > 0) {
      candidates.sort((a, b) => b.priority - a.priority)
      return candidates[0].key
    }
  }
  
  // version情報がない場合、または一致するものが見つからない場合は従来のロジック
  for (const [englishKey, regionInfo] of Object.entries(regionPokedex)) {
    if (regionInfo?.name?.jpn === pokedex) {
      return englishKey
    }
    if (regionInfo?.disp === pokedex) {
      return englishKey
    }
  }
  
  // 旧形式設定はコメントアウトされたため、regionPokedexのみで逆引き検索
  
  // フォールバック: globalを使用
  return 'global'
}

// pokedex情報から図鑑表示名（日本語）を取得
const getPokedexDisplayName = (pokedex: string): string => {
  const appConfig = useAppConfig()
  
  // pokedexがnullや未定義の場合は全国図鑑を使用
  if (!pokedex) {
    return '全国図鑑'
  }
  
  // APIから既に日本語の図鑑名が返ってくる場合はそのまま使用
  if (pokedex && typeof pokedex === 'string') {
    // 念のため、app.configの設定と照合して正規化
    const regionPokedex = appConfig.regionPokedex as Record<string, any>
    
    // 直接一致する設定があるか確認
    for (const regionInfo of Object.values(regionPokedex)) {
      if (regionInfo?.name?.jpn === pokedex || regionInfo?.disp === pokedex) {
        return regionInfo.name.jpn
      }
    }
    
    // 旧形式設定はコメントアウトされたため、regionPokedexのみで確認
    
    // そのまま返す（APIから既に適切な日本語名が返ってきている場合）
    return pokedex
  }
  
  // フォールバック
  return '全国図鑑'
}
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
</style>
