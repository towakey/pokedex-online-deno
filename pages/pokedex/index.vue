<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />
    <v-row>
      <v-col
      cols="12"
      sm="6"
      v-for="item in appConfig.regionPokedexOrder" :key="item"
      >
        <NuxtLink
        :to="{path: `/pokedex/${item}`}"
        class="nuxtlink"
        >
          <v-card
          elevation-0
          variant="outlined"
          style="background-color: white; width: 100%;"
          >
            <v-card-title>{{ appConfig.regionPokedex[item].disp[settings.language] }}</v-card-title>
            <!-- <v-card-text style="min-height: 24px; display: block; width: 100%;">
              <div style="min-width: 150px;">
                {{ appConfig.regionPokedex[item].name.eng || '\u00A0\u00A0\u00A0\u00A0\u00A0' }}
              </div>
            </v-card-text> -->
          </v-card>
        </NuxtLink>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import type { RegionPokedexKey } from '~~/types/region'
import { computed } from 'vue'
// import { useAppConfig } from '#app'

definePageMeta({
  pageTitle: 'ポケモン図鑑'
})
useHead({
  title: 'ポケモン図鑑',
  meta: [
    { name: 'description', content: 'Nuxt.js で作成されたポケモン図鑑アプリケーション' }
  ]
})

const { settings } = useSettings()
const appConfig = useAppConfig()

const regionPokedexOrder = computed(() => appConfig.regionPokedexOrder)

// 「ポケモン図鑑」タイトルの多言語化
const breadcrumbPokedexTitle = computed(() => {
  const lang = settings.value.language
  const dispKey = (lang === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
  const t = appConfig.translation as Record<string, { jpn: string; eng: string }>
  return t?.pokedex?.[dispKey] ?? 'ポケモン図鑑'
})

// パンくず（多言語対応）
const breadcrumbs = computed(() => [
  { title: (settings.value.language === 'eng' ? 'Home' : 'ホーム'), disabled: false, to: '/' },
  { title: breadcrumbPokedexTitle.value, disabled: true, to: '/pokedex' },
])
</script>