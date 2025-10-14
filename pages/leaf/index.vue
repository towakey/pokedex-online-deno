<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />
    
    <!-- メインコンテンツカード -->
    <v-card class="mb-6" v-if="leafContent">
      <v-card-title>
        <v-icon class="mr-2">mdi-leaf</v-icon>
        {{ leafTitle }}
      </v-card-title>
      <v-card-text>
        <MarkdownRenderer :content="leafContent" />
      </v-card-text>
    </v-card>

    <!-- ローディング表示 -->
    <v-card class="mb-6" v-else-if="isLoading">
      <v-card-text class="text-center py-8">
        <v-progress-circular 
          size="64" 
          width="6" 
          color="primary" 
          indeterminate
          class="mb-4"
        />
        <h3 class="text-h6 mb-2">{{ tr.loading }}</h3>
      </v-card-text>
    </v-card>

    <!-- 画像ギャラリー -->
    <v-card class="mb-6" v-if="pictures.length > 0">
      <v-card-title>
        <v-icon class="mr-2">mdi-image-multiple</v-icon>
        {{ tr.gallery }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col 
            v-for="(picture, index) in pictures" 
            :key="picture.filename"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <v-card 
              class="picture-card" 
              elevation="2"
              @click="openImageDialog(picture, index)"
              hover
            >
              <v-img
                :src="picture.src"
                :alt="picture.alt"
                aspect-ratio="1"
                cover
                class="cursor-pointer"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular 
                      indeterminate 
                      color="grey-lighten-5"
                    />
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- エピソード一覧 -->
    <v-card v-if="episodes.length > 0">
      <v-card-title>
        <v-icon class="mr-2">mdi-book-open-variant</v-icon>
        {{ tr.episodes }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col 
            v-for="episode in episodes" 
            :key="episode.filename"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card 
              class="episode-card h-100" 
              elevation="2"
              :to="episode.path"
              hover
            >
              <v-card-title class="text-subtitle-1">
                {{ episode.title }}
              </v-card-title>
              <v-card-subtitle class="text-body-2 text-grey-darken-1">
                {{ episode.subtitle }}
              </v-card-subtitle>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                  size="small" 
                  color="primary" 
                  variant="text"
                >
                  {{ tr.readMore }}
                  <v-icon class="ml-1">mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- エラー表示 -->
    <v-card v-if="error" class="mb-6">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="error" class="mb-4">
          mdi-alert-circle
        </v-icon>
        <h3 class="text-h6 mb-2">{{ tr.error }}</h3>
        <p class="text-body-2 text-grey">
          {{ error }}
        </p>
      </v-card-text>
    </v-card>

    <!-- 画像拡大表示ダイアログ -->
    <v-dialog v-model="imageDialog" max-width="90vw" max-height="90vh">
      <v-card v-if="selectedImage">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ selectedImage.alt }}</span>
          <v-btn
            icon
            @click="imageDialog = false"
            variant="text"
            size="small"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-img
            :src="selectedImage.src"
            :alt="selectedImage.alt"
            contain
            class="d-block mx-auto"
            style="max-height: 80vh;"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="imageDialog = false"
          >
            {{ tr.close }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import { computed, inject, onMounted, watch, ref } from 'vue'
import { useSettings } from '#imports'

definePageMeta({
  pageTitle: 'リーフ'
})

// アプリ設定と個人設定の取得
const appConfig = useAppConfig()
const { settings } = useSettings()

// レイアウトのページタイトル制御（多言語対応）
const pageTitleState = inject('pageTitle', { title: 'Pokédex-Online' })
const pageTitle = computed(() => pageTitleState.title)

// リーフページのタイトル（言語依存）を app.config.menus.main から取得
const leafTitle = computed(() => {
  const lang = (settings.value?.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
  const menuItem = (appConfig.menus?.main as any[] | undefined)?.find((m: any) => m.path === '/leaf')
  const titleObj = menuItem?.title as { jpn: string; eng: string } | undefined
  return titleObj?.[lang] ?? (lang === 'eng' ? 'Leaf' : 'リーフ')
})

// 多言語対応のテキスト
const tr = computed(() => {
  const lang = settings.value?.language === 'eng' ? 'eng' : 'jpn'
  return {
    loading: lang === 'eng' ? 'Loading...' : '読み込み中...',
    gallery: lang === 'eng' ? 'Picture Gallery' : '画像ギャラリー',
    episodes: lang === 'eng' ? 'Episode Collection' : 'エピソード集',
    readMore: lang === 'eng' ? 'Read More' : '続きを読む',
    error: lang === 'eng' ? 'Error' : 'エラー',
    close: lang === 'eng' ? 'Close' : '閉じる'
  }
})

// リアクティブな状態管理
const leafContent = ref('')
const episodes = ref<Array<{filename: string, title: string, subtitle: string, path: string}>>([])
const pictures = ref<Array<{filename: string, src: string, alt: string}>>([])
const isLoading = ref(false)
const error = ref('')

// 画像ダイアログの状態管理
const imageDialog = ref(false)
const selectedImage = ref<{filename: string, src: string, alt: string} | null>(null)

// ランタイム設定
const config = useRuntimeConfig()

// エピソード一覧の静的定義
const episodeList = [
  { num: 1, subtitle: '頂への伝言' },
  { num: 2, subtitle: 'アイドルとの出会い' },
  { num: 3, subtitle: 'フラムとの絆' },
  { num: 4, subtitle: 'チャンピオンの重み' },
  { num: 5, subtitle: 'メガシンカの秘密' },
  { num: 6, subtitle: '遺跡探索への想い' },
  { num: 7, subtitle: 'レッドへの複雑な気持ち' },
  { num: 8, subtitle: 'エーフィの心配' },
  { num: 9, subtitle: 'グリーンとの再会' },
  { num: 10, subtitle: 'ポケモンとの対話' },
  { num: 11, subtitle: '強がりな性格' },
  { num: 12, subtitle: 'シロナとの情報交換' },
  { num: 13, subtitle: '手持ちポケモンの物語' },
  { num: 14, subtitle: 'バトルスタイルの原点' },
  { num: 16, subtitle: 'ニドクインとの出会い' },
  { num: 17, subtitle: 'ピクシーとの絆' },
  { num: 18, subtitle: 'チームの結束' }
].map(ep => ({
  filename: `episode${ep.num}.md`,
  title: `エピソード${ep.num}`,
  subtitle: ep.subtitle,
  path: `/leaf/leaf/episode${ep.num}`
}))

// 画像一覧の静的定義
const pictureList = [
  { filename: '1.jpg', alt: 'リーフの画像 1' },
  { filename: '2.jpg', alt: 'リーフの画像 2' },
  { filename: '3.jpg', alt: 'リーフの画像 3' }
]

// 画像ダイアログを開く関数
const openImageDialog = (picture: {filename: string, src: string, alt: string}, index: number) => {
  selectedImage.value = picture
  imageDialog.value = true
}

// コンテンツ読み込み
const loadContent = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const config = useRuntimeConfig()
    const baseURL = config.app.baseURL || '/'
    
    // メインコンテンツ（leaf.md）を読み込み
    const leafResponse = await fetch(`${baseURL}leaf/leaf.md`)
    if (leafResponse.ok) {
      leafContent.value = await leafResponse.text()
    } else {
      throw new Error('leaf.mdの読み込みに失敗しました')
    }
    
    // エピソード一覧を設定
    episodes.value = episodeList
    
    // 画像一覧を設定
    pictures.value = pictureList.map(pic => ({
      filename: pic.filename,
      src: `${baseURL}leaf/picture/${pic.filename}`,
      alt: pic.alt
    }))
  } catch (err) {
    console.error('コンテンツの読み込みに失敗しました:', err)
    error.value = 'コンテンツの読み込みに失敗しました'
  } finally {
    isLoading.value = false
  }
}

// ページタイトルの更新
const updatePageTitle = () => {
  pageTitleState.title = leafTitle.value
}

onMounted(async () => {
  updatePageTitle()
  await loadContent()
})
watch(() => settings.value?.language, () => updatePageTitle())

// SEO タイトルも同期
useSeoMeta({
  title: pageTitle
})

// パンくずリスト
const breadcrumbs = computed(() => ([
  { 
    title: appConfig.translation.top[settings.value?.language === 'eng' ? 'eng' : 'jpn'], 
    disabled: false, 
    href: '/' 
  },
  { 
    title: leafTitle.value, 
    disabled: true, 
    href: '/leaf' 
  },
]))
</script>
<style scoped>
.picture-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.picture-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.episode-card {
  transition: transform 0.2s ease-in-out;
}

.episode-card:hover {
  transform: translateY(-1px);
}
</style>
