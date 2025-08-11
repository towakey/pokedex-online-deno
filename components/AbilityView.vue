<script setup lang="ts">
const props = defineProps<{ 
  pokedex: any, 
  area: string 
}>()

// 設定管理composableを使用
const { settings } = useSettings()
</script>
<template>
  <div
  v-if='props.pokedex.ability1 !== ""'
  >
  <v-card
  variant="outlined"
  style="margin-top: 20px;"
  :id="`ability`"
  >
    <v-card
    elevation="0"
    v-if='props.pokedex.ability1 !== ""'>
      <!-- <v-card-title>とくせい1 : <NuxtLink class="nuxtlink" :to="{path: `/ability/${props.area}`, hash: `#${props.pokedex.ability1}`}">{{ props.pokedex.ability1 }}</NuxtLink></v-card-title> -->
      <v-card-title>とくせい1 : {{ props.pokedex.ability1 }}</v-card-title>
    <v-card-text>{{ props.pokedex.ability1_description[settings.language] }}</v-card-text>
    </v-card>
    <v-card 
    elevation="0"
    v-if='props.pokedex.ability2 !== ""'>
      <!-- <v-card-title>とくせい2 : <NuxtLink class="nuxtlink" :to="{path: `/ability/${props.area}`, hash: `#${props.pokedex.ability2}`}">{{ props.pokedex.ability2 }}</NuxtLink></v-card-title> -->
      <v-card-title>とくせい2 : {{ props.pokedex.ability2 }}</v-card-title>
      <v-card-text>{{ props.pokedex.ability2_description[settings.language] }}</v-card-text>
    </v-card>
    <v-card 
    elevation="0"
    v-if='props.pokedex.dream_ability !== ""'>
      <!-- <v-card-title>かくれとくせい : <NuxtLink class="nuxtlink" :to="{path: `/ability/${props.area}`, hash: `#${props.pokedex.dream_ability}`}">{{ props.pokedex.dream_ability }}</NuxtLink></v-card-title> -->
      <v-card-title>かくれとくせい : {{ props.pokedex.dream_ability }}</v-card-title>
      <v-card-text>{{ props.pokedex.dream_ability_description[settings.language] }}</v-card-text>
    </v-card>
  </v-card>
  </div>
</template>
