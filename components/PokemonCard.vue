<template>
  <v-card
    elevation="0"
    class="pokemon-card"
  >
    <div class="d-flex gap-10">
      <v-avatar size="120" tile class="flex-shrink-0">
        <img
          v-if="!imageError"
          :src="imgSrc"
          alt=""
          width="120"
          height="120"
          style="object-fit: cover; width: 120px; height: 120px;"
          @error="handleImageError"
        />
        <div
          v-else
          class="no-image-placeholder d-flex align-center justify-center"
        >
          <span class="no-image-text">No Image</span>
        </div>
      </v-avatar>
      <div class="flex-grow-1 overflow-hidden ms-2">
        <div class="no-label">{{ noLabel }}</div>
        <div class="main-name text-truncate">{{ mainName }}</div>
        <div v-if="subName" class="sub-name text-truncate">{{ subName }}</div>
        <div class="d-flex mt-1">
          <TypeIcon
            v-if="pokemon.status[0]?.type1"
            :type="pokemon.status[0].type1"
            :mode="'icon'"
            class="me-1"
          />
          <TypeIcon
            v-if="pokemon.status[0]?.type2"
            :type="pokemon.status[0].type2"
            :mode="'icon'"
          />
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'

interface PokemonStatus {
  weight: string
  height: string
  name?: { jpn: string; eng?: string }
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

const { settings } = useSettings()
const appConfig = useAppConfig()
const currentLanguage = computed(() => settings.value?.language ?? 'jpn')

// 画像エラー状態を管理
const imageError = ref(false)

// 画像読み込みエラー時の処理
const handleImageError = () => {
  imageError.value = true
}

const imgSrc = computed(() => {
  // baseURLを取得
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL || '/'
  
  // 画像ファイル名を決定
  // 優先度: id（完全なファイル名） > globalNo > no
  const id = props.pokemon.id
  if (id && id.length > 4) {
    // idが完全なファイル名パターンの場合（例: 0082_00000000_5_000_0）
    return `${baseURL}img/pokedex/${id}.png`
  }
  
  // フォールバック: globalNoまたはnoを使用して基本パターンを試行
  const globalNo = props.pokemon.globalNo || props.pokemon.no
  const imageNo = `0000${globalNo}`.slice(-4)
  
  // 基本パターンを試行（例: 0082_00000000_0_000_0.png）
  return `${baseURL}img/pokedex/${imageNo}_00000000_0_000_0.png`
})

const noLabel = computed(() => {
  const serial = `0000${props.pokemon.no}`.slice(-4)
  const lang = currentLanguage.value as 'jpn' | 'eng'
  if (props.area === 'global') {
    return `${appConfig.translation.globalNo[lang]} ${serial}`
  }
  // appConfigから地域名を取得（settingsに基づき言語を選択）
  const regionPokedex = appConfig.regionPokedex as any
  const disp = regionPokedex?.[props.area]?.disp
  const regionName = (disp && disp[lang]) || props.area
  return `${regionName} ${appConfig.translation.no[lang]}${serial}`
})

const mainName = computed(() => {
  if (props.area === 'global') {
    return typeof props.pokemon.name === 'string' ? props.pokemon.name : (props.pokemon.name as any).jpn
  }
  return props.pokemon.status[0]?.name?.[currentLanguage.value as 'jpn' | 'eng'] ?? '???'
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
.no-image-placeholder {
  width: 120px;
  height: 120px;
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 8px;
}
.no-image-text {
  font-size: 0.85rem;
  color: #999;
  font-weight: 500;
}
</style>
