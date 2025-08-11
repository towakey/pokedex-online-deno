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
          <v-list-item-avatar>
            <img src="/icon.png" alt="App icon" :width="40" :height="40" />
          </v-list-item-avatar>
          <v-list-item-title class="text-h6 font-weight-bold">
            {{ appConfig.site.name }}
          </v-list-item-title>
        </v-list-item>
        
        <v-divider></v-divider>
        
        <!-- メニューアイテム（カテゴリごとに分類） -->
        <template v-for="category in Object.keys(appConfig.menus.categories)" :key="category">
          <v-list-subheader class="text-uppercase font-weight-bold">
            {{ appConfig.menus.categories[category] }}
          </v-list-subheader>
          
          <template v-for="item in getMenuItemsByCategory(category)" :key="item.path">
            <v-list-item
              :to="item.path"
              color="primary"
              rounded="xl"
              class="mx-2 mb-1"
              @click="drawer = false"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
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
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-icon v-if="!isLoading">
          <img src="/icon.png" alt="Nav icon" :width="40" :height="40" />
        </v-icon>
        <img v-else src="/img/loading/polygon_loading_2.gif" alt="Loading..." :width="30" :height="30" />
      </v-app-bar-nav-icon>
      <v-app-bar-title>
        <NuxtLink
        :to="{path: `/`}"
        class="nuxtlink"
        style="color: white;"
        >
        {{ pageTitle }}
        </NuxtLink>
      </v-app-bar-title>
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
const nuxtApp = useNuxtApp()
const appConfig = useAppConfig()
const isLoading = ref(false)
const drawer = ref(false)

// リアクティブなページタイトル管理
const pageTitleState = reactive({ title: 'Pokédex-Online' })
provide('pageTitle', pageTitleState)
const pageTitle = computed(() => pageTitleState.title)

// カテゴリごとのメニューアイテムを取得する関数
const getMenuItemsByCategory = (category: string) => {
  return appConfig.menus.main.filter((item: any) => item.category === category)
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