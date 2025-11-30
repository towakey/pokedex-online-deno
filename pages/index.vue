<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />
    
    <!-- ランダムポケモン表示セクション -->
    <v-card
      v-if="randomPokemon"
      class="mb-6"
      elevation="0"
      style="background-color: #f2f2f2;"
    >
      <v-card-title class="text-white">
        <!-- <v-icon class="me-2" color="white">mdi-dice-5</v-icon> -->
        <!-- {{ tr.randomPokemonTitle }} -->
      </v-card-title>
      <v-card-text class="pa-4">
        <NuxtLink
          :to="`/pokedex/global/${formatPokemonNo(randomPokemon)}`"
          style="text-decoration: none;"
        >
          <PokemonCard
            :pokemon="randomPokemon"
            area="global"
            style="cursor: pointer; transition: transform 0.2s;"
            @mouseenter="$event.currentTarget.style.transform = 'scale(1.02)'"
            @mouseleave="$event.currentTarget.style.transform = 'scale(1)'"
          />
        </NuxtLink>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn
          color="primary"
          variant="outlined"
          @click="fetchRandomPokemon"
          :loading="loadingRandom"
          prepend-icon="mdi-refresh"
          elevation-0
        >
          {{ tr.rerollButton }}
        </v-btn>
      </v-card-actions>
    </v-card>
    
    <div v-for="(items, category) in groupedMenu" :key="category">
      <h2 class="text-h5 mb-4">{{ categoryTitles[category] || category }}</h2>
      <v-row>
        <v-col v-for="item in items" :key="item.title" cols="12" md="4">
          <v-card
          elevation-0
          variant="outlined"
          style="background-color: white;"
          :to="item.path"
          nuxt
          >
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-text>{{ item.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script setup lang="ts">
// ページのメタデータを設定
definePageMeta({
  pageTitle: 'Pokédex-Online'
})
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useApiBase, useApiClient, useSettings } from '#imports'
import appConfig from '~/app.config'

const { settings } = useSettings()
const currentLanguage = computed(() => settings.value?.language ?? 'jpn')

// レイアウトのページタイトル制御（ホームは常にサイト名固定表示）
const pageTitleState = inject('pageTitle', { title: appConfig.site.name })
const pageTitle = computed(() => pageTitleState.title)
const updatePageTitle = () => {
  pageTitleState.title = appConfig.site.name
}
onMounted(() => updatePageTitle())
watch(() => settings.value?.language, () => updatePageTitle())

// SEO タイトルも同期
useSeoMeta({
  title: pageTitle
})

const breadcrumbs = computed(() => [
  (() => {
    const lang = (currentLanguage.value === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
    return { title: appConfig.translation.top?.[lang] ?? (lang === 'eng' ? 'Top' : 'TOP'), disabled: true, href: '/' }
  })(),
])

const apiMessage = ref('')

async function callApi() {
  try {
    // const res = await fetchWithRetry('/api/sample.php?name=pikachu', { timeoutMs: 7000, retries: 2 })
    const { buildUrl } = useApiBase()
    const { fetchWithRetry } = useApiClient()
    const endpoint = buildUrl('/pokedex/pokedex.php')
    const res = await fetchWithRetry(endpoint, { timeoutMs: 7000, retries: 2 })
    apiMessage.value = JSON.stringify(res)
  } catch (e) {
    apiMessage.value = 'API Error: ' + (e instanceof Error ? e.message : String(e))
  }
}

const mainMenu = appConfig.menus.main

const groupedMenu = computed(() => {
  const groups: { [key: string]: any[] } = {}
  const lang = (currentLanguage.value === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
  mainMenu.forEach((item: any) => {
    const localizedItem = {
      ...item,
      title: item.title?.[lang] ?? item.title
    }
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category]!.push(localizedItem)
  })
  return groups
})
// カテゴリ情報を追加
// const categoryTitles: Record<string, string> = {
//   pokemon_data: 'ポケモン関連データ',
//   tools_gallery: 'ツールとギャラリー',
//   useful_information: 'Information'
// }
const categoryTitles = computed(() => {
  const titles: Record<string, string> = {}
  const lang = (settings.value?.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
  Object.keys(appConfig.menus.categories).forEach(key => {
    const cat = (appConfig.menus.categories as Record<string, { jpn: string; eng: string }>)[key]
    titles[key] = cat?.[lang] ?? key
  })
  return titles
})

// 多言語対応の翻訳
const tr = computed(() => {
  const lang = currentLanguage.value
  return {
    randomPokemonTitle: lang === 'eng' ? 'Random Pokémon' : 'ランダムポケモン',
    rerollButton: lang === 'eng' ? 'Reroll' : '再表示'
  }
})

// ランダムポケモン機能
interface PokemonStatus {
  weight: string
  height: string
  name?: { jpn: string; eng?: string }
  type1?: string
  type2?: string
  form?: string | string[]
  region?: string | string[]
  mega_evolution?: string | string[]
  gigantamax?: string | string[]
}

interface Pokemon {
  no: string
  id?: string
  globalNo: string
  name: string | { jpn: string }
  status: PokemonStatus[]
}

const randomPokemon = ref<Pokemon | null>(null)
const loadingRandom = ref(false)

// 1-1024の範囲でランダムな番号を生成
function generateRandomPokemonNo(): string {
  const randomNo = Math.floor(Math.random() * 1024) + 1
  return `0000${randomNo}`.slice(-4)
}

// ポケモンNoを4桁にフォーマット
function formatPokemonNo(pokemon: Pokemon) {
  const no = pokemon.globalNo || pokemon.no
  return `0000${no}`.slice(-4)
}

// ランダムポケモンを取得（1匹だけ）
async function fetchRandomPokemon() {
  loadingRandom.value = true
  try {
    const { buildUrl } = useApiBase()
    const { fetchWithRetry } = useApiClient()
    const randomNo = generateRandomPokemonNo()
    const endpoint = buildUrl('/pokedex/pokedex.php')
    
    const res = await fetchWithRetry(endpoint, {
      query: { 
        region: 'global',
        no: randomNo
      },
      timeoutMs: 30000,
      retries: 1
    }) as any
    
    if (res && res.success && res.data) {
      // res.dataは { "0001": [...] } の形式なので最初のキーの配列を取得
      const firstKey = Object.keys(res.data)[0]
      const statusArray = res.data[firstKey]
      
      if (Array.isArray(statusArray) && statusArray.length > 0) {
        const s = statusArray[0]
        const statusObj = {
          weight: s.weight,
          height: s.height,
          name: s.name ? { jpn: s.name.jpn, eng: s.name.eng } : undefined,
          type1: s.type1,
          type2: s.type2,
          form: s.form,
          region: s.region,
          mega_evolution: s.mega_evolution,
          gigantamax: s.gigantamax
        }
        randomPokemon.value = {
          no: s.no,
          id: s.id,
          globalNo: s.globalNo,
          name: s.name?.jpn ?? '',
          status: [statusObj]
        }
      }
    }
  } catch (e) {
    console.error('Failed to fetch random pokemon:', e)
  } finally {
    loadingRandom.value = false
  }
}

// 初期化時にランダムポケモンを取得
onMounted(async () => {
  await fetchRandomPokemon()
})

</script>
<style scoped>
</style>