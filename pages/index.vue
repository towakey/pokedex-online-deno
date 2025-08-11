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

useHead({
  title: 'Pokédex-Online',
  meta: [
    { name: 'description', content: 'Nuxt.js で作成されたポケデックスアプリケーション' }
  ]
})

import { ref } from 'vue'
import { useApiBase, useApiClient } from '#imports'
import appConfig from '~/app.config'

const breadcrumbs = ref([
  { title: 'Home', disabled: true, href: '/' },
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
// const mainMenu = ref([
  // { title: 'ポケモン図鑑', path: '/pokedex', img: '/icon.png', category: 'pokemon_data' },
  // { title: '検索', path: '/search', img: '/icon.png', category: 'pokemon_data' },
  // { title: 'わざ', path: '/waza', img: '/icon.png', category: 'pokemon_data' },
  // { title: 'わざマシン', path: '/waza_machine', img: '/icon.png', category: 'pokemon_data' },
  // { title: 'とくせい', path: '/ability', img: '/icon.png', category: 'pokemon_data' },
  // { title: '図鑑カメラ', path: '/camera', img: '/camera.png', category: 'tools_gallery' },
  // { title: '検索', path: '/search', img: '/icon.png', category: 'tools_gallery' },
  // { title: 'pokedex.jsonについて', path: '/pokedexjson', img: '/icon.png', category: 'useful_information' },
  // { title: '年表', path: '/pokemon_history', img: '/icon.png', category: 'useful_information' },
  // { title: 'WebApp', path: '/webapp', img: '/icon.png', category: 'tools_gallery' },
  // { title: 'チートシート', path: '/cheatsheet', img: '/blog.png', category: 'useful_information' },
  // { title: 'リンク', path: '/link', img: '/icon.png', category: 'useful_information' },
  // { title: 'リーフ', path: '/leaf', img: '/icon.png', category: 'tools_gallery' },
  // { title: 'ギャラリー', path: '/gallery', img: '/icon.png', category: 'tools_gallery' },
// ])

const groupedMenu = computed(() => {
  const groups: { [key: string]: any[] } = {}
  mainMenu.forEach(item => {
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category]!.push(item)
  })
  return groups
})
// カテゴリ情報を追加
const categoryTitles: Record<string, string> = {
  pokemon_data: 'ポケモン関連データ',
  tools_gallery: 'ツールとギャラリー',
  useful_information: 'Information'
}

</script>
<style scoped>
</style>