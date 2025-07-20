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
            <v-card-title>{{ appConfig.regionPokedex[item].name.jpn }}</v-card-title>
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
import { useAppConfig } from '#app'

definePageMeta({
  pageTitle: 'ポケモン図鑑'
})
useHead({
  title: 'ポケモン図鑑',
  meta: [
    { name: 'description', content: 'Nuxt.js で作成されたポケモン図鑑アプリケーション' }
  ]
})

const appConfig = useAppConfig()

const regionPokedexOrder = computed(() => appConfig.regionPokedexOrder)

const breadcrumbs = ref([
  { title: 'ホーム', disabled: false, to: '/' },
  { title: 'ポケモン図鑑', disabled: true, to: '/pokedex' },
])
</script>