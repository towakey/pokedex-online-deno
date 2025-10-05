<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />
    
    <v-card class="mt-4" variant="outlined">
      <v-card-title class="text-h5">
        {{ tr.compare }}
      </v-card-title>
      
      <v-card-text>
        <v-row>
          <!-- ポケモンA選択 -->
          <v-col cols="12" md="6">
            <v-card variant="outlined" style="background-color: white; border: 2px solid #2196F3;">
              <v-card-subtitle class="font-weight-bold" style="color: #1976D2;">
                {{ tr.pokemonA }}
              </v-card-subtitle>
              <v-card-text>
                <v-select
                  v-model="selectedRegionA"
                  :items="regionOptions"
                  item-title="label"
                  item-value="value"
                  :label="tr.selectRegion"
                  variant="outlined"
                  density="comfortable"
                  @update:model-value="onRegionChangeA"
                ></v-select>
                
                <v-autocomplete
                  v-model="selectedPokemonNoA"
                  :items="pokemonListA"
                  item-title="displayName"
                  item-value="no"
                  :label="tr.selectPokemon"
                  variant="outlined"
                  density="comfortable"
                  :disabled="!selectedRegionA || loadingListA"
                  :loading="loadingListA"
                  clearable
                  class="mt-2"
                ></v-autocomplete>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- ポケモンB選択 -->
          <v-col cols="12" md="6">
            <v-card variant="outlined" style="background-color: white; border: 2px solid #F44336;">
              <v-card-subtitle class="font-weight-bold" style="color: #D32F2F;">
                {{ tr.pokemonB }}
              </v-card-subtitle>
              <v-card-text>
                <v-select
                  v-model="selectedRegionB"
                  :items="regionOptions"
                  item-title="label"
                  item-value="value"
                  :label="tr.selectRegion"
                  variant="outlined"
                  density="comfortable"
                  @update:model-value="onRegionChangeB"
                ></v-select>
                
                <v-autocomplete
                  v-model="selectedPokemonNoB"
                  :items="pokemonListB"
                  item-title="displayName"
                  item-value="no"
                  :label="tr.selectPokemon"
                  variant="outlined"
                  density="comfortable"
                  :disabled="!selectedRegionB || loadingListB"
                  :loading="loadingListB"
                  clearable
                  class="mt-2"
                ></v-autocomplete>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- 比較ボタン -->
        <v-row>
          <v-col class="text-center">
            <v-btn
              color="primary"
              size="large"
              :disabled="!canCompare"
              :loading="comparing"
              @click="handleCompare"
              prepend-icon="mdi-compare"
            >
              {{ tr.compareButton }}
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- エラー表示 -->
        <v-row v-if="errorMessage">
          <v-col>
            <v-alert type="error" variant="outlined" closable @click:close="errorMessage = ''">
              {{ errorMessage }}
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <!-- 比較結果 -->
    <div v-if="comparisonResult">
      <!-- 種族値比較グラフ -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card variant="outlined" style="background-color: white;">
            <v-card-title class="text-h6">
              種族値比較
            </v-card-title>
            <v-card-text>
              <ClientOnly>
                <StatusChart
                  :statusList="[
                    {
                      label: comparisonResult.pokemonA.name[currentLanguage],
                      color: '#2196F3',
                      data: {
                        hp: Number(comparisonResult.pokemonA.hp),
                        attack: Number(comparisonResult.pokemonA.attack),
                        defense: Number(comparisonResult.pokemonA.defense),
                        special_attack: Number(comparisonResult.pokemonA.special_attack),
                        special_defense: Number(comparisonResult.pokemonA.special_defense),
                        speed: Number(comparisonResult.pokemonA.speed)
                      }
                    },
                    {
                      label: comparisonResult.pokemonB.name[currentLanguage],
                      color: '#F44336',
                      data: {
                        hp: Number(comparisonResult.pokemonB.hp),
                        attack: Number(comparisonResult.pokemonB.attack),
                        defense: Number(comparisonResult.pokemonB.defense),
                        special_attack: Number(comparisonResult.pokemonB.special_attack),
                        special_defense: Number(comparisonResult.pokemonB.special_defense),
                        speed: Number(comparisonResult.pokemonB.speed)
                      }
                    }
                  ]"
                />
              </ClientOnly>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- 詳細情報 -->
      <v-row class="mt-4">
        <!-- ポケモンA詳細 -->
        <v-col cols="12" md="6">
        <v-card variant="outlined" style="background-color: white; border: 2px solid #2196F3;">
          <v-card-title class="text-h6" style="color: #1976D2;">
            {{ comparisonResult.pokemonA.name[currentLanguage] }}
          </v-card-title>
          
          <v-card-text>
            <!-- 画像 -->
            <v-img
              v-if="comparisonResult.pokemonA.src"
              :src="comparisonResult.pokemonA.src"
              :alt="comparisonResult.pokemonA.name[currentLanguage]"
              max-height="200"
              contain
              class="mb-4"
            ></v-img>
            
            <!-- 基本情報 -->
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>{{ tr.no }}</v-list-item-title>
                <v-list-item-subtitle>No.{{ ('0000' + comparisonResult.pokemonA.no).slice(-4) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ tr.globalNo }}</v-list-item-title>
                <v-list-item-subtitle>No.{{ ('0000' + comparisonResult.pokemonA.globalNo).slice(-4) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ tr.classification }}</v-list-item-title>
                <v-list-item-subtitle>{{ comparisonResult.pokemonA.classification[currentLanguage] }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ tr.height }}</v-list-item-title>
                <v-list-item-subtitle>{{ comparisonResult.pokemonA.height }} m</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ tr.weight }}</v-list-item-title>
                <v-list-item-subtitle>{{ comparisonResult.pokemonA.weight }} kg</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            
            <!-- タイプ -->
            <div class="mt-3">
              <div class="text-subtitle-2 mb-2">タイプ</div>
              <div class="d-flex gap-2">
                <TypeIcon
                  v-if="comparisonResult.pokemonA.type1"
                  :type="comparisonResult.pokemonA.type1"
                  :mode="'icon'"
                />
                <TypeIcon
                  v-if="comparisonResult.pokemonA.type2"
                  :type="comparisonResult.pokemonA.type2"
                  :mode="'icon'"
                />
              </div>
            </div>
            
            <!-- 特性 -->
            <v-card variant="outlined" class="mt-4">
              <v-card-subtitle class="font-weight-bold">特性</v-card-subtitle>
              <v-card-text>
                <div v-if="comparisonResult.pokemonA.ability1" class="mb-2">
                  <div class="font-weight-medium">{{ comparisonResult.pokemonA.ability1 }}</div>
                  <div class="text-caption">{{ comparisonResult.pokemonA.ability1_description }}</div>
                </div>
                <div v-if="comparisonResult.pokemonA.ability2" class="mb-2">
                  <div class="font-weight-medium">{{ comparisonResult.pokemonA.ability2 }}</div>
                  <div class="text-caption">{{ comparisonResult.pokemonA.ability2_description }}</div>
                </div>
                <div v-if="comparisonResult.pokemonA.dream_ability">
                  <div class="font-weight-medium">{{ comparisonResult.pokemonA.dream_ability }} (隠れ特性)</div>
                  <div class="text-caption">{{ comparisonResult.pokemonA.dream_ability_description }}</div>
                </div>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- ポケモンB詳細 -->
      <v-col cols="12" md="6">
        <v-card variant="outlined" style="background-color: white; border: 2px solid #F44336;">
          <v-card-title class="text-h6" style="color: #D32F2F;">
            {{ comparisonResult.pokemonB.name[currentLanguage] }}
          </v-card-title>
          
          <v-card-text>
            <!-- 画像 -->
            <v-img
              v-if="comparisonResult.pokemonB.src"
              :src="comparisonResult.pokemonB.src"
              :alt="comparisonResult.pokemonB.name[currentLanguage]"
              max-height="200"
              contain
              class="mb-4"
            ></v-img>
            
            <!-- 基本情報 -->
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>{{ tr.no }}</v-list-item-title>
                <v-list-item-subtitle>No.{{ ('0000' + comparisonResult.pokemonB.no).slice(-4) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ tr.globalNo }}</v-list-item-title>
                <v-list-item-subtitle>No.{{ ('0000' + comparisonResult.pokemonB.globalNo).slice(-4) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ tr.classification }}</v-list-item-title>
                <v-list-item-subtitle>{{ comparisonResult.pokemonB.classification[currentLanguage] }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ tr.height }}</v-list-item-title>
                <v-list-item-subtitle>{{ comparisonResult.pokemonB.height }} m</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ tr.weight }}</v-list-item-title>
                <v-list-item-subtitle>{{ comparisonResult.pokemonB.weight }} kg</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            
            <!-- タイプ -->
            <div class="mt-3">
              <div class="text-subtitle-2 mb-2">タイプ</div>
              <div class="d-flex gap-2">
                <TypeIcon
                  v-if="comparisonResult.pokemonB.type1"
                  :type="comparisonResult.pokemonB.type1"
                  :mode="'icon'"
                />
                <TypeIcon
                  v-if="comparisonResult.pokemonB.type2"
                  :type="comparisonResult.pokemonB.type2"
                  :mode="'icon'"
                />
              </div>
            </div>
            
            <!-- 特性 -->
            <v-card variant="outlined" class="mt-4">
              <v-card-subtitle class="font-weight-bold">特性</v-card-subtitle>
              <v-card-text>
                <div v-if="comparisonResult.pokemonB.ability1" class="mb-2">
                  <div class="font-weight-medium">{{ comparisonResult.pokemonB.ability1 }}</div>
                  <div class="text-caption">{{ comparisonResult.pokemonB.ability1_description }}</div>
                </div>
                <div v-if="comparisonResult.pokemonB.ability2" class="mb-2">
                  <div class="font-weight-medium">{{ comparisonResult.pokemonB.ability2 }}</div>
                  <div class="text-caption">{{ comparisonResult.pokemonB.ability2_description }}</div>
                </div>
                <div v-if="comparisonResult.pokemonB.dream_ability">
                  <div class="font-weight-medium">{{ comparisonResult.pokemonB.dream_ability }} (隠れ特性)</div>
                  <div class="text-caption">{{ comparisonResult.pokemonB.dream_ability_description }}</div>
                </div>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { RegionPokedexKey } from '~/types/region'

// 明示的にインポート
const appConfig = useAppConfig()
const { settings } = useSettings()
const { fetchWithRetry } = useApiClient()
const { buildUrl } = useApiBase()

// ポケモン詳細データの型定義
interface PokemonStatus {
  id?: string | number
  no: number
  globalNo: number
  classification: {
    jpn: string
    eng: string
    [key: string]: string
  }
  height: string
  weight: string
  form: string
  region: string
  mega_evolution: string
  gigantamax: string
  name: {
    jpn: string
    eng: string
    [key: string]: string
  }
  forms: {
    jpn: string
    eng: string
    [key: string]: string
  }
  type1: string
  type2: string
  type_compatibility: { [key: string]: string }
  hp: string
  attack: string
  defense: string
  special_attack: string
  special_defense: string
  speed: string
  ability1: string
  ability1_description: string
  ability2: string
  ability2_description: string
  dream_ability: string
  dream_ability_description: string
  description: string
  waza: {
    lvup?: { [key: string]: string }
    "わざマシン"?: { [key: string]: string }
    [key: string]: any
  }
  evolve: any
  src?: string
  egg: string[]
}

interface RawPokedexResponse {
  success: boolean
  data: Record<string, PokemonStatus[]>
  region: string | null
}

interface PokemonListItem {
  no: string
  globalNo: string
  name: string | { jpn: string; eng: string }
  displayName: string
}

// 言語設定
const currentLanguage = computed(() => (settings.value.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng')

// 翻訳
const tr = computed(() => {
  const lang = currentLanguage.value
  return {
    compare: appConfig.translation.compare[lang],
    selectRegion: appConfig.translation.selectRegion[lang],
    selectPokemon: appConfig.translation.selectPokemon[lang],
    compareButton: appConfig.translation.compareButton[lang],
    pokemonA: appConfig.translation.pokemonA[lang],
    pokemonB: appConfig.translation.pokemonB[lang],
    loading: appConfig.translation.loading[lang],
    selectBothPokemon: appConfig.translation.selectBothPokemon[lang],
    errorLoadingData: appConfig.translation.errorLoadingData[lang],
    no: appConfig.translation.no[lang],
    globalNo: appConfig.translation.globalNo[lang],
    classification: appConfig.translation.classification[lang],
    height: appConfig.translation.height[lang],
    weight: appConfig.translation.weight[lang],
  }
})

// パンくず
const breadcrumbs = computed(() => [
  { title: appConfig.translation.top[currentLanguage.value], disabled: false, href: '/' },
  { title: tr.value.compare, disabled: true, href: '/compare' },
])

// 地方選択オプション
const regionOptions = computed(() => {
  return appConfig.regionPokedexOrder
    .filter((key: RegionPokedexKey) => key !== 'global')
    .map((key: RegionPokedexKey) => ({
      value: key,
      label: appConfig.regionPokedex[key].disp[currentLanguage.value]
    }))
})

// 状態管理
const selectedRegionA = ref<string>('')
const selectedRegionB = ref<string>('')
const selectedPokemonNoA = ref<string>('')
const selectedPokemonNoB = ref<string>('')

const pokemonListA = ref<PokemonListItem[]>([])
const pokemonListB = ref<PokemonListItem[]>([])

const loadingListA = ref(false)
const loadingListB = ref(false)

const comparing = ref(false)
const errorMessage = ref('')

const comparisonResult = ref<{
  pokemonA: PokemonStatus
  pokemonB: PokemonStatus
} | null>(null)

// ポケモンリストキャッシュ
const pokemonListCache = reactive<Record<string, PokemonListItem[]>>({})

// 地方別ポケモン一覧を取得
async function fetchPokemonList(region: string): Promise<PokemonListItem[]> {
  // キャッシュチェック
  if (pokemonListCache[region]) {
    return pokemonListCache[region]
  }

  try {
    const apiUrl = buildUrl('/pokedex/pokedex.php')
    const res = await fetchWithRetry<RawPokedexResponse>(apiUrl, {
      query: { region },
      timeoutMs: 30000,
      retries: 1
    })

    if (!res || !res.success) {
      throw new Error('Failed to fetch pokemon list')
    }

    const list: PokemonListItem[] = []
    Object.values(res.data).forEach((statusArray: any) => {
      if (!Array.isArray(statusArray) || statusArray.length === 0) return
      statusArray.forEach((s: any) => {
        const displayName = typeof s.name === 'string'
          ? s.name
          : `No.${('0000' + s.no).slice(-4)} ${s.name?.jpn || s.name?.eng || ''}`
        
        list.push({
          no: s.no,
          globalNo: s.globalNo,
          name: s.name,
          displayName
        })
      })
    })

    // 図鑑番号順にソート
    list.sort((a, b) => Number(a.no) - Number(b.no))

    // キャッシュに保存
    pokemonListCache[region] = list
    return list
  } catch (error) {
    console.error('Failed to fetch pokemon list:', error)
    throw error
  }
}

// ポケモン詳細を取得
async function fetchPokemonDetail(region: string, no: string): Promise<PokemonStatus> {
  try {
    const noParam = String(no).padStart(4, '0')
    const apiUrl = buildUrl('/pokedex/pokedex.php')
    
    const res = await fetchWithRetry<RawPokedexResponse>(apiUrl, {
      query: { region, no: noParam },
      timeoutMs: 7000,
      retries: 2
    })

    if (!res || !res.success) {
      throw new Error('Failed to fetch pokemon detail')
    }

    const resultArray = Object.values(res.data).flat() as PokemonStatus[]
    
    if (resultArray.length === 0) {
      throw new Error('Pokemon not found')
    }

    return resultArray[0]
  } catch (error) {
    console.error('Failed to fetch pokemon detail:', error)
    throw error
  }
}

// 地方変更時の処理
async function onRegionChangeA() {
  selectedPokemonNoA.value = ''
  pokemonListA.value = []
  
  if (!selectedRegionA.value) return
  
  loadingListA.value = true
  try {
    pokemonListA.value = await fetchPokemonList(selectedRegionA.value)
  } catch (error) {
    errorMessage.value = `${tr.value.errorLoadingData} (${selectedRegionA.value})`
  } finally {
    loadingListA.value = false
  }
}

async function onRegionChangeB() {
  selectedPokemonNoB.value = ''
  pokemonListB.value = []
  
  if (!selectedRegionB.value) return
  
  loadingListB.value = true
  try {
    pokemonListB.value = await fetchPokemonList(selectedRegionB.value)
  } catch (error) {
    errorMessage.value = `${tr.value.errorLoadingData} (${selectedRegionB.value})`
  } finally {
    loadingListB.value = false
  }
}

// 比較可能かどうか
const canCompare = computed(() => {
  return selectedRegionA.value && selectedRegionB.value && 
         selectedPokemonNoA.value && selectedPokemonNoB.value
})

// 比較実行
async function handleCompare() {
  if (!canCompare.value) {
    errorMessage.value = tr.value.selectBothPokemon
    return
  }

  comparing.value = true
  errorMessage.value = ''
  comparisonResult.value = null

  try {
    const [pokemonA, pokemonB] = await Promise.all([
      fetchPokemonDetail(selectedRegionA.value, selectedPokemonNoA.value),
      fetchPokemonDetail(selectedRegionB.value, selectedPokemonNoB.value)
    ])

    comparisonResult.value = {
      pokemonA,
      pokemonB
    }

    // 結果表示位置までスクロール
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  } catch (error) {
    console.error('Comparison failed:', error)
    errorMessage.value = tr.value.errorLoadingData
  } finally {
    comparing.value = false
  }
}

// SEO設定
useSeoMeta({
  title: tr.value.compare
})

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
