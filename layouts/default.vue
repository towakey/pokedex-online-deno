<template>
  <v-layout>
    <!-- サイドナビゲーションドロワー -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="left"
      width="280"
    >
      <v-list>
        <!-- ヘッダー -->
        <v-list-item class="px-4 py-4">
          <template #prepend>
            <v-avatar :size="40">
              <img src="/icon.png" alt="App icon" width="40" height="40" />
            </v-avatar>
          </template>
          <v-list-item-title class="text-h6 font-weight-bold">
            {{ appConfig.site.name }}
          </v-list-item-title>
        </v-list-item>
        
        <v-divider></v-divider>
        
        <!-- メニューアイテム（カテゴリごとに分類） -->
        <template v-for="category in Object.keys(appConfig.menus.categories)" :key="category">
          <v-list-subheader class="text-uppercase font-weight-bold">
            {{ getCategoryLabel(category) }}
          </v-list-subheader>
          
          <template v-for="item in getMenuItemsByCategory(category)" :key="item.path">
            <v-list-item
              :to="item.path"
              color="primary"
              rounded="xl"
              class="mx-2 mb-1"
              @click="drawer = false"
            >
              <v-list-item-title>{{ getItemTitle(item) }}</v-list-item-title>
            </v-list-item>
          </template>
          
          <v-divider class="my-2"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>
    
    <v-app-bar
    color="primary"
    prominent
    >
      <v-app-bar-nav-icon
      @click.stop="drawer = !drawer"
      class="btn-fix"
      >
        <img
          v-if="!isLoading"
          src="/icon.png"
          alt="Nav icon"
          :width="50"
          :height="50"
        />
        <img
          v-else
          src="/img/loading/polygon_loading_2.gif"
          alt="Loading..."
          :width="50"
          :height="50"
        />
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        <NuxtLink
        :to="{path: `/`}" 
        class="nuxtlink"
        style="color: white;"
        >
        {{ pageTitle }}
        </NuxtLink>
      </v-toolbar-title>
    </v-app-bar>
    <v-main
    style="height: 100%;background-color: #f2f2f2;"
    >
      <slot></slot>
    </v-main>
  </v-layout>
</template>
<script setup lang="ts">
import { ref, onMounted, provide, reactive, computed } from 'vue'
import { useNuxtApp, useAppConfig } from 'nuxt/app'
import { useSettings } from '#imports'
const nuxtApp = useNuxtApp()
const appConfig = useAppConfig()
const isLoading = ref(false)
const drawer = ref(false)

// リアクティブなページタイトル管理（初期値はサイト名に統一）
const pageTitleState = reactive({ title: appConfig.site.name })
provide('pageTitle', pageTitleState)
const pageTitle = computed(() => pageTitleState.title)

// 設定（言語）
const { settings } = useSettings()
const currentLanguage = computed(() => (settings.value.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng')

// カテゴリごとのメニューアイテムを取得する関数
const getMenuItemsByCategory = (category: string) => {
  return appConfig.menus.main.filter((item: any) => item.category === category)
}

// カテゴリ名（多言語）
const getCategoryLabel = (key: string) => {
  const cat = (appConfig.menus.categories as Record<string, { jpn: string; eng: string }>)[key]
  return cat?.[currentLanguage.value] ?? key
}

// メニュー項目タイトル（多言語）
const getItemTitle = (item: any) => {
  const title = item?.title
  if (title && typeof title === 'object') {
    return (title as { jpn: string; eng: string })[currentLanguage.value] ?? ''
  }
  return String(title ?? '')
}

onMounted(() => {
  nuxtApp.hook('page:start', () => {
    console.log('Page start')
    isLoading.value = true
  })
  nuxtApp.hook('page:finish', () => {
    console.log('Page finish')
    isLoading.value = false
  })
})
</script>