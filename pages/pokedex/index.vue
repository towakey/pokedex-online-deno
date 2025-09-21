<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />
    <v-row>
      <v-col
      cols="12"
      sm="6"
      v-for="item in regionPokedexOrder" :key="item"
      >
        <NuxtLink
        :to="{path: `/pokedex/${item}`}"
        class="nuxtlink"
        >
          <v-card
          elevation="0"
          variant="outlined"
          style="background-color: white; width: 100%;"
          >
            <v-card-title>{{ getRegionDisp(item as RegionPokedexKey) }}</v-card-title>
            <v-card-text style="min-height: 32px; padding-top: 0;">
              <div class="d-flex flex-wrap gap-1">
                <template v-for="version in getRegionVersions(item as RegionPokedexKey)" :key="version">
                  <img
                    v-if="getVersionIcon(version)"
                    :src="`/img/version/${getVersionIcon(version)}`"
                    :alt="version"
                    :title="version"
                    style="width: 24px; height: 24px; object-fit: contain;"
                  >
                </template>
              </div>
            </v-card-text>
          </v-card>
        </NuxtLink>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import type { RegionPokedexKey } from '~~/types/region'
import { computed, inject, onMounted, watch } from 'vue'
// import { useAppConfig } from '#app'

definePageMeta({
  pageTitle: 'ポケモン図鑑'
})

const { settings } = useSettings()
const appConfig = useAppConfig()

const regionPokedexOrder = computed<RegionPokedexKey[]>(() => appConfig.regionPokedexOrder as RegionPokedexKey[])

// 「ポケモン図鑑」タイトルの多言語化
const breadcrumbPokedexTitle = computed(() => {
  const lang = settings.value.language
  const dispKey = (lang === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
  const t = appConfig.translation as Record<string, { jpn: string; eng: string }>
  return t?.pokedex?.[dispKey] ?? 'ポケモン図鑑'
})

// 地域図鑑の表示名（多言語）取得（型安全に）
const getRegionDisp = (item: RegionPokedexKey) => {
  const lang = (settings.value.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
  const region = (appConfig.regionPokedex as Record<RegionPokedexKey, { disp: { jpn: string; eng: string } }>)[item]
  return region?.disp?.[lang] ?? ''
}

// 地域図鑑のゲームバージョン一覧を取得
const getRegionVersions = (item: RegionPokedexKey) => {
  const region = (appConfig.regionPokedex as Record<RegionPokedexKey, { gameVersion: string[] }>)[item]
  return region?.gameVersion ?? []
}

// バージョン名からアイコンファイル名を取得
const getVersionIcon = (version: string) => {
  const verIcon = appConfig.verIcon as Record<string, string>
  return verIcon[version] ?? ''
}

// レイアウトAppBarのタイトルを更新（多言語対応）
const pageTitleState = inject('pageTitle', { title: 'Pokédex-Online' })
const pageTitle = computed(() => pageTitleState.title)
const updatePageTitle = () => {
  pageTitleState.title = breadcrumbPokedexTitle.value
}
onMounted(() => updatePageTitle())
watch(() => settings.value.language, () => updatePageTitle())

// SEO タイトルも同期
useSeoMeta({
  title: pageTitle
})

// パンくず（多言語対応）
const breadcrumbs = computed(() => [
  { title: (settings.value.language === 'eng' ? 'Home' : 'Home'), disabled: false, to: '/' },
  { title: breadcrumbPokedexTitle.value, disabled: true, to: '/pokedex' },
])
</script>