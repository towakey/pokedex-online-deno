<template>
  <v-layout>
    <v-app-bar
    color="primary"
    prominent
    >
      <v-app-bar-nav-icon>
        <img v-if="!isLoading" src="/public/icon.png" alt="Nav icon" :width="50" :height="50" />
        <img v-else src="/img/loading/polygon_loading_2.gif" alt="Loading..." :width="50" :height="50" />
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
import { useNuxtApp } from 'nuxt/app'
const nuxtApp = useNuxtApp()
const isLoading = ref(false)

// リアクティブなページタイトル管理
const pageTitleState = reactive({ title: 'Pokédex-Online' })
provide('pageTitle', pageTitleState)
const pageTitle = computed(() => pageTitleState.title)

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