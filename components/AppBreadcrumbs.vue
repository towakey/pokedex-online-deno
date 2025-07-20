<template>
  <v-breadcrumbs :items="items">
    <template #item="{ item }">
      <v-breadcrumbs-item
        exact
        :disabled="item.disabled"
        :to="item.href || item.to"
        nuxt
      >
        {{ item.title }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
interface AppBreadcrumbItem {
  title: string
  disabled?: boolean
  href?: string
  to?: any
}

defineProps<{ items: AppBreadcrumbItem[] }>()
</script>
