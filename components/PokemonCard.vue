<template>
  <v-card
    elevation="0"
    class="pokemon-card"
  >
    <div class="d-flex gap-10">
      <v-avatar size="120" tile class="flex-shrink-0">
        <img
          :src="imgSrc"
          alt=""
          width="120"
          height="120"
          style="object-fit: cover; width: 120px; height: 120px;"
        />
      </v-avatar>
      <div class="flex-grow-1 overflow-hidden ms-2">
        <div class="no-label">{{ noLabel }}</div>
        <div class="main-name text-truncate">{{ mainName }}</div>
        <div v-if="subName" class="sub-name text-truncate">{{ subName }}</div>
        <div class="d-flex mt-1">
          <TypeIcon
            v-if="pokemon.status[0].type1"
            :type="pokemon.status[0].type1"
            :mode="'icon'"
            class="me-1"
          />
          <TypeIcon
            v-if="pokemon.status[0].type2"
            :type="pokemon.status[0].type2"
            :mode="'icon'"
          />
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'

interface PokemonStatus {
  weight: string
  height: string
  name?: { jpn: string }
  type1?: string
  type2?: string
  form?: string | string[]
  region?: string | string[]
  mega_evolution?: string | string[]
  gigantamax?: string | string[]
}

interface Pokemon {
  no: string
  id?: string
  globalNo: string
  name: string | { jpn: string }
  status: PokemonStatus[]
}

const props = defineProps({
  pokemon: {
    type: Object as PropType<Pokemon>,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
})

const appConfig = useAppConfig()

const imgSrc = computed(() => {
  // 画像ファイル名を決定
  // 優先度: id（完全なファイル名） > globalNo > no
  const id = props.pokemon.id
  if (id && id.length > 4) {
    // idが完全なファイル名パターンの場合（例: 0082_00000000_5_000_0）
    return `/img/pokedex/${id}.png`
  }
  
  // フォールバック: globalNoまたはnoを使用して基本パターンを試行
  const globalNo = props.pokemon.globalNo || props.pokemon.no
  const imageNo = `0000${globalNo}`.slice(-4)
  
  // 基本パターンを試行（例: 0082_00000000_0_000_0.png）
  return `/img/pokedex/${imageNo}_00000000_0_000_0.png`
})

const noLabel = computed(() => {
  const serial = `0000${props.pokemon.no}`.slice(-4)
  if (props.area === 'global') {
    return `全国図鑑No.${serial}`
  }
  // appConfigから地域名を取得
  const regionName = appConfig.regionPokedex?.[props.area]?.name?.jpn || props.area;
  return `${regionName}No.${serial}`
})

const mainName = computed(() => {
  if (props.area === 'global') {
    return typeof props.pokemon.name === 'string' ? props.pokemon.name : (props.pokemon.name as any).jpn
  }
  return props.pokemon.status[0].name?.jpn ?? ''
})

const subName = computed(() => {
  const status = props.pokemon.status[0] || {}
  const fields = ['region', 'form', 'mega_evolution', 'gigantamax'] as const
  const parts: string[] = []
  fields.forEach((key) => {
    const val = (status as any)[key]
    if (val !== undefined && val !== null && val !== '') {
      if (Array.isArray(val)) {
        parts.push(...val.filter(v => v))
      } else {
        parts.push(String(val))
      }
    }
  })
  if (parts.length === 0 && (status as any).name?.jpn) {
    return '　'
  }
  return parts.join('・')
})
</script>

<style scoped>
.pokemon-card {
  border: 4px solid #bcd9ff;
  border-radius: 16px;
  padding: 8px;
  background-color: white;
}
.no-label {
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
}
.main-name {
  font-size: 1.2rem;
  font-weight: 700;
}
.sub-name {
  font-size: 0.9rem;
  color: #555;
}
</style>
