<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />
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
    <!-- <div class="api-test">
      <v-btn color="primary" @click="callApi">APIテスト</v-btn>
      <p v-if="apiMessage">{{ apiMessage }}</p>
    </div> -->
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
const currentLanguage = computed(() => settings.value.language)

// レイアウトのページタイトル制御（ホームは常にサイト名固定表示）
const pageTitleState = inject('pageTitle', { title: appConfig.site.name })
const pageTitle = computed(() => pageTitleState.title)
const updatePageTitle = () => {
  pageTitleState.title = appConfig.site.name
}
onMounted(() => updatePageTitle())
watch(() => settings.value.language, () => updatePageTitle())

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
  const lang = (settings.value.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
  Object.keys(appConfig.menus.categories).forEach(key => {
    const cat = (appConfig.menus.categories as Record<string, { jpn: string; eng: string }>)[key]
    titles[key] = cat?.[lang] ?? key
  })
  return titles
})

</script>
<style scoped>
</style>