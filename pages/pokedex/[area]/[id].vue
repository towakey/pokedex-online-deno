<template>
  <!-- duplicate isVersionDialogVisible dialog removed; unified dialog exists at the bottom of this template -->
  <div
  v-if="route.params.area == 'global'">
    <ClientOnly>
      <v-dialog
      v-model="nameDialog"
      >
        <v-container>
          <v-card>
            <v-card-title v-if="pokedex.result.length > 0">
              {{ pokedex.result[Number(model)]?.name?.[personal.language] }}
            </v-card-title>
            <v-card-text v-if="pokedex.result.length > 0">
              <v-row
              v-for='(name, key) in (pokedex.result[Number(model)]?.name || {})'
              :key='name'
              >
                <v-col>
                  <!-- {{ appConfig.lang_eng2jpn[key] }} -->
                </v-col>
                <v-col>
                  {{ name }}
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>
      </v-dialog>
    </ClientOnly>
    <v-container>
      <AppBreadcrumbs :items="breadcrumbs" />
      <div style="display: flex; justify-content: space-between;padding: 0px;">
        <div style="flex: 1; display: flex; justify-content: flex-start;">
          <v-btn
            v-if="prev.result.length > 0 && prev.result[0].name.jpn !== '不明'"
            :to='{path: `/pokedex/${route.params.area}/${prev.result[0].no}`}'
            style="background-color: white; width: 120px;"
            variant="outlined"
            >{{ prev.result[0].name[personal.language] }}</v-btn>
        </div>
        <div style="flex: 1; display: flex; justify-content: center;">
          <v-btn
            :to='{path: `/pokedex/${route.params.area}`}'
            style="background-color: white; width: 70px;"
            variant="outlined"
            >TOP</v-btn>
        </div>
        <div style="flex: 1; display: flex; justify-content: flex-end;">
          <v-btn
            v-if="next.result.length > 0 && next.result[0].name.jpn !== '不明'"
            :to='{path: `/pokedex/${route.params.area}/${next.result[0].no}`}'
            style="background-color: white; width: 120px;"
            variant="outlined"
            >{{ next.result[0].name[personal.language] }}</v-btn>
        </div>
      </div>
      <v-carousel
      :show-arrows="false"
      hide-delimiters
      v-model="model" 
      height="auto"
      style="margin-top: 20px;"
      >
        <v-carousel-item
          v-for="(item, index) in pokedex.result" :key="index"
        >
          <v-row>
            <v-col :cols="7">
              <v-card elevation="0" width="100%" variant="outlined" style="background-color: white;margin-top: 5px;">
                <v-card-title @click="nameDialog = true" width="auto">
                  <h2 class="responsive-text-name">{{ item.name[personal.language] }}</h2>
                </v-card-title>
                <v-card-text width="auto">
                  <div class="responsive-text">分類　　　　{{ item.classification[personal.language] }}</div>
                  <!-- <div class="responsive-text">図鑑番号　　　No.{{ ('0000' + item.no).slice(-4) }}</div> -->
                  <div class="responsive-text">図鑑番号　　No.{{ ('0000' + item.globalNo).slice(-4) }}</div>
                  <div class="responsive-text">たかさ　　　{{ item.height }} m</div>
                  <div class="responsive-text">おもさ　　　{{ item.weight }} kg</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col :cols="5">
              <v-card elevation="0" variant="outlined" style="background-color: white;">
                <v-img width="100%" height="100%" :aspect-ratio="1/1" :src="`${item.src}`" ></v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <v-carousel
      :show-arrows="false"
      hide-delimiters
      v-model="model" 
      height="auto"
      style="margin-top: 20px;"
      >
        <v-carousel-item
          v-for="(item, index) in pokedex.result" :key="index"
        >
          <!-- 各バージョンの図鑑説明とリンクを表示 -->
          <!-- <DescriptionView
            v-if="item?.id != null && descriptionRows[String(item.id)] && descriptionRows[String(item.id)].length"
            :description="getGlobalDescriptionMap(item.id)"
            :title="metaTitle"
            :openVersionDialog="openVersionDialog"
          /> -->
        </v-carousel-item>
      </v-carousel>
      <v-card
      v-if="pokedex.result.length > 1"
      elevation="0"
      style="margin-top: 20px;background-color: white;"
      variant="outlined"
      >
        <v-card-actions>
          <v-btn @click="prevModel()">＜</v-btn>
          <v-spacer />
          <h2>{{ 
            (pokedex.result[Number(model)]?.gigantamax && pokedex.result[Number(model)]?.form) ? `${pokedex.result[Number(model)]?.gigantamax} ${pokedex.result[Number(model)]?.form}` : 
            (pokedex.result[Number(model)]?.region && pokedex.result[Number(model)]?.form) ? `${pokedex.result[Number(model)]?.region} ${pokedex.result[Number(model)]?.form}` : 
            (pokedex.result[Number(model)]?.mega_evolution) ? pokedex.result[Number(model)]?.mega_evolution : 
            (pokedex.result[Number(model)]?.gigantamax) ? pokedex.result[Number(model)]?.gigantamax : 
            (pokedex.result[Number(model)]?.region) ? pokedex.result[Number(model)]?.region : 
            (pokedex.result[Number(model)]?.form) ? pokedex.result[Number(model)]?.form : 
            (pokedex.result[Number(model)]?.name?.jpn || '')
          }}</h2>
          <v-spacer />
          <v-btn @click="nextModel()">＞</v-btn>
        </v-card-actions>
      </v-card>
      <PokedexVersionDescription
        :existsPokedex="(pokedex.result.length && existsPokedex[String(pokedex.result[Number(model)]?.id)]) ? existsPokedex[String(pokedex.result[Number(model)]?.id)] : {}"
        :getDescriptionLines="(area: string) => getDescriptionLines(area, String(pokedex.result[Number(model)]?.id))"
        :openVersionDialog="openVersionDialog"
      />
      <AdSenseCard 
      slot-type="banner"
      :width="728"
      :height="90"
      label-type="sponsored"
      variant="outlined"
      color="surface"
      />
    </v-container>
  </div>

  <!-- global以外 -->
  <div
  style="background-color: #f2f2f2;"
  v-else>
  <ClientOnly>
    <v-dialog
    v-model="nameDialog"
    >
      <v-container>
        <v-card>
          <v-card-title v-if="pokedex.result.length > 0">
            {{ pokedex.result[Number(model)]?.name?.[personal.language] ?? '' }}
          </v-card-title>
          <v-card-text v-if="pokedex.result.length > 0">
            <v-row
            v-for='(name, key) in (pokedex.result[Number(model)]?.name ?? {})'
            :key='name'
            >
              <v-col>
                <!-- {{ appConfig.lang_eng2jpn[key] }} -->
              </v-col>
              <v-col>
                {{ name }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-dialog>
  </ClientOnly>
  <v-container>
  <v-row>
    <v-col
    cols="12"
    md="12"
    >
    <v-container>
      <AppBreadcrumbs :items="breadcrumbs" />
      <div style="display: flex; justify-content: space-between;padding: 0px;">
        <div style="flex: 1; display: flex; justify-content: flex-start;">
          <v-btn
            v-if="prev.result.length > 0 && prev.result[0].name.jpn !== '不明'"
            :to='{path: `/pokedex/${route.params.area}/${prev.result[0].no}`}'
            style="background-color: white; width: 120px;"
            variant="outlined"
            >{{ prev.result[0].name[personal.language] }}</v-btn>
        </div>
        <div style="flex: 1; display: flex; justify-content: center;">
          <v-btn
            :to='{path: `/pokedex/${route.params.area}`}'
            style="background-color: white; width: 70px;"
            variant="outlined"
            >TOP</v-btn>
        </div>
        <div style="flex: 1; display: flex; justify-content: flex-end;">
          <v-btn
            v-if="next.result.length > 0 && next.result[0].name.jpn !== '不明'"
            :to='{path: `/pokedex/${route.params.area}/${next.result[0].no}`}'
            style="background-color: white; width: 120px;"
            variant="outlined"
            >{{ next.result[0].name[personal.language] }}</v-btn>
        </div>
      </div>
      <v-carousel
      :show-arrows="false"
      hide-delimiters
      v-model="model"
      height="auto"
      style="margin-top: 20px;"
      >
        <v-carousel-item
          v-if="pokedex.result.length > 0"
          v-for="(item, index) in pokedex.result" :key="index"
        >
          <v-row>
            <v-col
            :cols="7"
            >
              <v-card
              elevation="0"
              width="100%"
              variant="outlined"
              style="background-color: white;margin-top: 5px;"
              >
                <v-card-title
                width="auto"
                class=""
                >
                  <h2 class="responsive-text-name" @click="nameDialog = true"
                  >{{ item.name[personal.language] }}</h2>
                  <div class="responsive-text">分類　　　　　{{ item.classification[personal.language] }}</div>
                  <div class="responsive-text">図鑑番号　　　No.{{ ('0000' + item.no).slice(-4) }}</div>
                  <NuxtLink class="nuxtlink" :to="{path: `/pokedex/global/${item.globalNo}`}">
                    <div class="responsive-text">全国図鑑番号　No.{{ ('0000' + item.globalNo).slice(-4) }}</div>
                  </NuxtLink>
                  <div class="responsive-text">たかさ　　　　{{ item.height }} m</div>
                  <div class="responsive-text">おもさ　　　　{{ item.weight }} kg</div>
                </v-card-title>
              </v-card>
            </v-col>
            <v-col
            :cols="5"
            >
              <v-card
              elevation="0"
              style="background-color: white;"
              variant="outlined"
              >
              <v-img
              width="100%"
              height="100%"
              :aspect-ratio="1/1"
              :src="pokedex.result.length > 0 && pokedex.result[Number(model)]?.src ? String(pokedex.result[Number(model)]?.src) : ''"
              ></v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <v-card
      v-if="pokedex.result.length > 1"
      elevation="0"
      style="margin-top: 20px;background-color: white;"
      variant="outlined"
      >
        <v-card-actions>
          <v-btn
          @click="prevModel()"
          >＜</v-btn>
          <v-spacer />
          <h2>{{ 
            pokedex.result[model].gigantamax && pokedex.result[model].form ? `${pokedex.result[model].gigantamax} ${pokedex.result[model].form}` : 
            pokedex.result[model].region && pokedex.result[model].form ? `${pokedex.result[model].region} ${pokedex.result[model].form}` : 
            pokedex.result[model].mega_evolution ? pokedex.result[model].mega_evolution : 
            pokedex.result[model].gigantamax ? pokedex.result[model].gigantamax : 
            pokedex.result[model].region ? pokedex.result[model].region : 
            pokedex.result[model].form ? pokedex.result[model].form : 
            pokedex.result[model].name?.jpn || ''
          }}</h2>
          <v-spacer />
          <v-btn
          @click="nextModel()"
          >＞</v-btn>
        </v-card-actions>
      </v-card>
      <v-carousel
      :show-arrows="false" 
      hide-delimiters 
      v-model="model" 
      height="auto"
      >
        <v-carousel-item
          v-if="pokedex.result.length > 0"
          v-for="(item, index) in pokedex.result" :key="index"
        >
          <TypeView :pokedex="pokedex.result[index]" :area="route.params.area" />
                    <StatusChart v-if="pokedex.result[index]" :statusData="{
            hp: Number(pokedex.result[index].hp),
            attack: Number(pokedex.result[index].attack),
            defense: Number(pokedex.result[index].defense),
            special_attack: Number(pokedex.result[index].special_attack),
            special_defense: Number(pokedex.result[index].special_defense),
            speed: Number(pokedex.result[index].speed)
          }" />
          <AbilityView :pokedex="pokedex.result[index]" :area="String(route.params.area)" />
          <DescriptionView :description="pokedex.result[index].description" :title="metaTitle" :openVersionDialog="openVersionDialog" />
          <!-- <wazaView :wazaData="pokedex.result[index]" :area="route.params.area" /> -->
          <!-- <evolveView :evolveData="pokedex.result[index]" :area="route.params.area" /> -->
        </v-carousel-item>
      </v-carousel>
      <PokedexVersionDescription
        :existsPokedex="(pokedex.result.length && existsPokedex[String(pokedex.result[Number(model)]?.id)]) ? existsPokedex[String(pokedex.result[Number(model)]?.id)] : {}"
        :getDescriptionLines="(area: string) => getDescriptionLines(area, String(pokedex.result[Number(model)]?.id))"
        :openVersionDialog="openVersionDialog"
      />
      <AdSenseCard
        :ad-client="'ca-pub-xxxxxxxxxxxxxxxx'"
        :ad-slot="'1234567890'"
        :test-mode="true"
        :width="'100%'"
        :height="250"
        label-text="スポンサードリンク"
        variant="outlined"
        color="grey-lighten-5"
      />
    </v-container>
    </v-col>
  </v-row>
</v-container>
</div>
<v-dialog v-model="isVersionDialogVisible" max-width="500">
  <v-card v-if="selectedVersionInfo">
    <v-card-title class="text-h5">
      {{ selectedVersionInfo.verJpn || selectedVersionInfo.ver }}
    </v-card-title>
    <v-card-text>
      <p>{{ selectedVersionInfo.description }}</p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="isVersionDialogVisible = false">閉じる</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

const isVersionDialogVisible = ref(false)
const selectedVersionInfo = ref<any>(null)

// バージョン情報ダイアログを開く（呼び出し元の型差異を吸収）
const openVersionDialog = (input: any) => {
  const info = {
    ver: String(input?.ver ?? ''),
    description: String(input?.description ?? ''),
    verJpn: typeof input?.verJpn === 'string' ? input.verJpn : String(input?.ver ?? '')
  }
  selectedVersionInfo.value = info
  isVersionDialogVisible.value = true
}

// ポケモン図鑑存在情報保持用（ポケモンID・リージョン別）
const existsPokedex = reactive<{ [pokemonId: string]: { [area: string]: any } }>({})

// ポケモン詳細データの型定義
interface PokemonStatus {
  id?: string | number;
  no: number;
  globalNo: number;
  classification: string;
  height: string;
  weight: string;
  form: string;
  region: string;
  mega_evolution: string;
  gigantamax: string;
  name: {
    jpn: string;
    eng: string;
    [key: string]: string;
  };
  type1: string;
  type2: string;
  type_compatibility: { [key: string]: string };
  hp: string;
  attack: string;
  defense: string;
  special_attack: string;
  special_defense: string;
  speed: string;
  ability1: string;
  ability1_description: string;
  ability2: string;
  ability2_description: string;
  dream_ability: string;
  dream_ability_description: string;
  description: string;
  waza: {
    lvup?: { [key: string]: string };
    "わざマシン"?: { [key: string]: string };
    [key: string]: any;
  };
  evolve: any;
  src?: string;
}

interface PokedexResponse {
  query: {
    id: string;
    area: string;
    mode: string;
  };
  result: PokemonStatus[];
}

interface ExistsResponse {
  query: {
    no: string;
    region: string;
    mode: string;
  };
  result: number;
}

const config = useRuntimeConfig()
const appConfig = useAppConfig()
const route = useRoute()
const router = useRouter()
route.meta.title = route.params.area

const personal = appConfig.personal

// 共通のフェッチラッパー（タイムアウト・リトライ）
const { fetchWithRetry } = useApiClient()

interface RawPokedexResponse {
  success: boolean;
  data: Record<string, PokemonStatus[]>;
  region: string | null;
}

// API取得機能
const fetchPokedex = async (area: string, id: number | string) => {
  const noParam = String(id).padStart(4, '0')
  
  // SSR時はプレースホルダーを返して、クライアント側で再取得
  if (process.server) {
    console.log(`[fetchPokedex] SSR mode - returning placeholder for ${area}/${id}`)
    const placeholder: PokemonStatus = {
      no: Number(id),
      globalNo: Number(id),
      classification: '',
      height: '',
      weight: '',
      form: '',
      region: '',
      mega_evolution: '',
      gigantamax: '',
      name: { jpn: '不明', eng: 'Unknown' },
      type1: '',
      type2: '',
      type_compatibility: {},
      hp: '',
      attack: '',
      defense: '',
      special_attack: '',
      special_defense: '',
      speed: '',
      ability1: '',
      ability1_description: '',
      ability2: '',
      ability2_description: '',
      dream_ability: '',
      dream_ability_description: '',
      description: '',
      waza: {},
      evolve: {},
      src: '/img/pokedex/0000.png'
    }
    return { query: { id: String(id), area: String(area), mode: 'details' }, result: [placeholder] } as PokedexResponse
  }
  
  try {
    const baseUrl = process.server ? config.public.baseUrl || 'http://localhost:3001' : ''
    const apiUrl = `${baseUrl}/api/pokedex/pokedex.php?region=${area}&no=${noParam}`
    
    console.log(`[fetchPokedex] Client mode - Fetching from: ${apiUrl}`)
    
    const res = await fetchWithRetry<RawPokedexResponse>(apiUrl, { timeoutMs: 7000, retries: 2 })
    
    console.log(`[fetchPokedex] API Response:`, JSON.stringify(res, null, 2))
    console.log(`[fetchPokedex] Response type:`, typeof res)
    console.log(`[fetchPokedex] Response success:`, res?.success)
    console.log(`[fetchPokedex] Response data:`, res?.data)
    
    if (!res || !res.success) {
      const placeholder: PokemonStatus = {
        no: Number(id),
        globalNo: Number(id),
        classification: '',
        height: '',
        weight: '',
        form: '',
        region: '',
        mega_evolution: '',
        gigantamax: '',
        name: { jpn: '不明', eng: 'Unknown' },
        type1: '',
        type2: '',
        type_compatibility: {},
        hp: '',
        attack: '',
        defense: '',
        special_attack: '',
        special_defense: '',
        speed: '',
        ability1: '',
        ability1_description: '',
        ability2: '',
        ability2_description: '',
        dream_ability: '',
        dream_ability_description: '',
        description: '',
        waza: {},
        evolve: {},
        src: '/img/pokedex/0000.png'
      }
      return { query: { id: String(id), area: String(area), mode: 'details' }, result: [placeholder] } as PokedexResponse
    }
    
    console.log(`[fetchPokedex] Processing data:`, res.data)
    let resultArray = Object.values(res.data).flat() as PokemonStatus[]
    console.log(`[fetchPokedex] ResultArray:`, resultArray)
    console.log(`[fetchPokedex] ResultArray length:`, resultArray.length)
    
    if (resultArray.length === 0) {
      resultArray = [{
        no: Number(id),
        globalNo: Number(id),
        classification: '',
        height: '',
        weight: '',
        form: '',
        region: '',
        mega_evolution: '',
        gigantamax: '',
        name: { jpn: '不明', eng: 'Unknown' },
        type1: '',
        type2: '',
        type_compatibility: {},
        hp: '',
        attack: '',
        defense: '',
        special_attack: '',
        special_defense: '',
        speed: '',
        ability1: '',
        ability1_description: '',
        ability2: '',
        ability2_description: '',
        dream_ability: '',
        dream_ability_description: '',
        description: '',
        waza: {},
        evolve: {},
        src: '/img/pokedex/0000.png'
      }]
    }
    return { query: { id: String(id), area: String(area), mode: 'details' }, result: resultArray } as PokedexResponse
  } catch (error) {
    console.error('ポケモンデータの取得に失敗しました:', error)
    const placeholder: PokemonStatus = {
      no: Number(id),
      globalNo: Number(id),
      classification: '',
      height: '',
      weight: '',
      form: '',
      region: '',
      mega_evolution: '',
      gigantamax: '',
      name: { jpn: '不明', eng: 'Unknown' },
      type1: '',
      type2: '',
      type_compatibility: {},
      hp: '',
      attack: '',
      defense: '',
      special_attack: '',
      special_defense: '',
      speed: '',
      ability1: '',
      ability1_description: '',
      ability2: '',
      ability2_description: '',
      dream_ability: '',
      dream_ability_description: '',
      description: '',
      waza: {},
      evolve: {},
      src: '/img/pokedex/0000.png'
    }
    return { query: { id: String(id), area: String(area), mode: 'details' }, result: [placeholder] } as PokedexResponse
  }
}

const fetchTypeCompatibility = async (type1: string, type2: string, region: string) => {
  try {
    const params = new URLSearchParams({ type1: type1, region: region })
    if (type2 && type2 !== '') {
      params.append('type2', type2)
    }
    
    // SSR時は絶対URLを使用
    const baseUrl = process.server ? config.public.baseUrl || 'http://localhost:3001' : ''
    const apiUrl = `${baseUrl}/api/pokedex/type.php?${params.toString()}`
    
    console.log(`[fetchTypeCompatibility] Fetching from: ${apiUrl} (server: ${process.server})`)
    const data = await fetchWithRetry<{ data: { rates: { [key: string]: string } } }>(
      apiUrl,
      { timeoutMs: 7000, retries: 2 }
    )
    const rawRates = data?.data?.rates ?? {}
    const rates: { [key: string]: string } = {}
    for (const [k, v] of Object.entries(rawRates)) {
      rates[k] = String(v)
    }
    return rates
  } catch (error) {
    console.error('タイプ相性の取得に失敗しました', error)
    return {}
  }
}

const fetchType = async (type1: string, type2: string) => {
  const baseUrl = process.server ? config.public.baseUrl || 'http://localhost:3001' : ''
  try {
    const data = await fetchWithRetry(
      `${baseUrl}/api/pokedex/type.php?mode=type&type1=${type1}&type2=${type2}`,
      { timeoutMs: 7000, retries: 2 }
    )
    return data
  } catch (error) {
    console.error('[Main] fetchType error:', error)
    return null
  }
}

const fetchExists = async (pokeId: number | string) => {
  for (const item of appConfig.regionPokedexOrder) {
    if (item === 'global') continue
    try {
      const baseUrl = process.server ? config.public.baseUrl || 'http://localhost:3001' : ''
      const data = await fetchWithRetry(
        `${baseUrl}/api/pokedex/pokedex.php?mode=exists&region=${item}&id=${pokeId}`,
        { timeoutMs: 7000, retries: 2 }
      )
      // pokeId ごとに area データを格納
      if (!existsPokedex[pokeId]) {
        existsPokedex[pokeId] = {}
      }
      existsPokedex[pokeId][item] = {
        query: { id: String(pokeId), region: item, mode: 'exists' },
        result: data?.result ?? -1
      }
    } catch (error) {
      if (!existsPokedex[pokeId]) {
        existsPokedex[pokeId] = {}
      }
      existsPokedex[pokeId][item] = {
        query: { id: String(pokeId), region: item, mode: 'exists' },
        result: null,
        error: true
      }
    }
  }
}

const fetchDescription = async (pokeId: number | string) => {
  try {
    const baseUrl = process.server ? config.public.baseUrl || 'http://localhost:3001' : ''
    const data = await fetchWithRetry(
      `${baseUrl}/api/pokedex/pokedex.php?mode=description&id=${pokeId}&language=jpn`,
      { timeoutMs: 8000, retries: 2 }
    )
    
    // data と data.data のバリデーション（description モードのレスポンス構造）
    if (!data || !data.success || !Array.isArray(data.data)) {
      console.warn(`[Main] fetchDescription: Invalid data format for pokeId ${pokeId}`, data)
      // 無効なデータの場合、空の配列で descriptionRows をクリア
      descriptionRows[String(pokeId)] = []
      return { result: [] }
    }
    console.log(`[Main] fetchDescription: Data for pokeId ${pokeId}`, data)
    // descriptionRows にポケモンIDごとにデータを設定
    descriptionRows[String(pokeId)] = [...data.data]
    
    // descriptions にデータを設定（グループごと）
    const groups: { [key: string]: string } = {}
    for (const row of data.data) {
      const group = getGameGroup(row.ver)
      if (group && !groups[group]) {
        groups[group] = row.description
      }
    }
    Object.assign(descriptions, groups)
    
    return data
  } catch (error) {
    console.error('[Main] fetchDescription error:', error)
    // エラー時も空の配列で descriptionRows をクリア
    descriptionRows[String(pokeId)] = []
    return { result: [] }
  }
}

definePageMeta({
  title: "Pokedex-Online"
})
let nameDialog = ref(false)
let model = ref(0)

// 初回マウント時に存在情報を取得
onMounted(() => {
  // fetchExists は pokedex データ取得後に実行する必要がある
  // ここではまだ pokedex.result[0]?.id が未定なので、watch に任せる
})

watch(() => [route.params.area, route.params.id], async () => {
  // ページ遷移時は図鑑存在情報と図鑑説明を再取得
  console.log(`[Watch] Route changed to area: ${route.params.area}, id: ${route.params.id}`)
  
  // モデルをリセット
  model.value = 0
  
  // ポケモンデータを再取得
  if (route.params.id) {
    console.log(`[Watch] Refreshing pokedex data for ${route.params.id}`)
    await refresh()
    
    // ポケモンデータ取得後に存在情報と図鑑説明を再取得
    if (pokedex.result.length > 0) {
      for (const pokemon of pokedex.result) {
        if (pokemon?.id) {
          console.log(`[Watch] Fetching exists for ${pokemon.id}`)
          fetchExists(pokemon.id)
          console.log(`[Watch] Fetching description for ${pokemon.id}`)
          fetchDescription(pokemon.id)
        }
      }
    }
  }
  
  // 前後のポケモンデータも再取得
  console.log(`[Watch] Refreshing prev/next data`)
  await refreshPrev()
  await refreshNext()
})

function createEmptyPokedexResponse(): PokedexResponse {
  return {
    query: {},
    result: [],
  };
}

const { data: pokedexData, pending, error, refresh } = await useAsyncData<PokedexResponse>(
  `pokedex-${route.params.area}-${route.params.id}`,
  () => fetchPokedex(route.params.area as string, route.params.id as string),
  {
    default: () => createEmptyPokedexResponse(),
    server: false  // サーバー側実行を無効化
  }
);

const { data: prevData, refresh: refreshPrev } = await useAsyncData<PokedexResponse>(
  `pokedex-${route.params.area}-${route.params.id}-prev`,
  () => fetchPokedex(route.params.area as string, (Number(route.params.id) - 1).toString()),
  {
    default: () => createEmptyPokedexResponse(),
    server: false  // サーバー側実行を無効化
  }
);

const { data: nextData, refresh: refreshNext } = await useAsyncData<PokedexResponse>(
  `pokedex-${route.params.area}-${route.params.id}-next`,
  () => fetchPokedex(route.params.area as string, (Number(route.params.id) + 1).toString()),
  {
    default: () => createEmptyPokedexResponse(),
    server: false  // サーバー側実行を無効化
  }
);

// バージョンキーからゲームグループ名を取得
// バージョンキーからゲームグループ名を取得
const getGameGroup = (verKey: string): string => {
  // appConfig.regionPokedex の各リージョンを走査し、該当バージョンを含むリージョンキーを返す
  for (const [area, info] of Object.entries(appConfig.regionPokedex)) {
    if (area === 'global') continue
    const versions = info?.gameVersion ?? []
    if (versions.some(v => v.toLowerCase() === verKey.toLowerCase())) {
      return area
    }
  }
  return ''
}

// area からゲームグループ名を取得
const getGroupByArea = (area: string): string => {
  // regionPokedex から area に対応するゲームバージョンキーを取得
  const rp = appConfig.regionPokedex as Record<string, { gameVersion?: string[] }>
  const versions = rp[area]?.gameVersion;
  if (!versions || versions.length === 0) return '';
  
  // 最初のバージョンキーからゲームグループを取得
  return getGameGroup(versions[0]);
};

// 指定リージョン(area) とポケモンIDから図鑑説明を取得するヘルパー（最初の1行）
const getDescriptionLines = (area: string, pokemonId?: string) => {
  // ポケモンIDが指定されていない場合は空配列を返す
  if (!pokemonId || !descriptionRows[pokemonId]) {
    console.warn(`[getDescriptionLines] No description data for pokemonId: ${pokemonId}`)
    return []
  }
  
  // area に対応するregionPokedexのgameVersion配列と日本語名を取得
  const rp2 = appConfig.regionPokedex as Record<string, { gameVersion?: string[]; name?: { jpn?: string } }>
  const areaGameVersions = rp2[area]?.gameVersion
  const areaJpnName = rp2[area]?.name?.jpn
  
  // global 特例: バージョン配列チェックはバイパスしつつ、図鑑名は『全国図鑑』に限定
  if (area === 'global') {
    const globalJpn = rp2[area]?.name?.jpn
    console.log(`[getDescriptionLines] Special case 'global': filter by pokedex='${globalJpn}' for pokemonId: ${pokemonId}`)
    return descriptionRows[pokemonId]
      .filter(r => r.pokedex === globalJpn)
      .map(r => ({
        ver: r.ver,
        verJpn: r.ver,
        pokedex: r.pokedex,
        description: r.description,
      }))
  }
  
  if (!areaGameVersions || !Array.isArray(areaGameVersions)) {
    console.warn(`[getDescriptionLines] No gameVersion array found for area: ${area}`)
    return []
  }
  
  if (!areaJpnName) {
    console.warn(`[getDescriptionLines] No regionPokedex entry found for area: ${area}`)
    return []
  }
  
  // 指定されたポケモンIDの descriptionRows から該当する行をフィルタリング
  console.log(`[getDescriptionLines] Description data for ${pokemonId}:`, descriptionRows[pokemonId])
  console.log(`[getDescriptionLines] Filtering for area: ${area}, gameVersions:`, areaGameVersions, 'areaJpnName:', areaJpnName)
  
  return descriptionRows[pokemonId]
    .filter(r => {
      // 1. line.verがappConfig.regionPokedex[area].gameVersion配列に含まれるかチェック
      const isVersionMatched = areaGameVersions.includes(r.ver)
      if (!isVersionMatched) {
        console.log(`[getDescriptionLines] Version not in gameVersions: ${r.ver} not in`, areaGameVersions)
        return false
      }
      
      // 2. pokedex値とappConfig.regionPokedex[area]?.name?.jpnが一致するかチェック
      if (r.pokedex !== areaJpnName) {
        console.log(`[getDescriptionLines] Pokedex mismatch: ${r.pokedex} !== ${areaJpnName}`)
        return false
      }
      
      return true
    })
    .map(r => ({
      ver: r.ver,
      // verJpn: appConfig.verJpnMap[r.ver] ?? r.ver,
      verJpn: r.ver,
      pokedex: r.pokedex,
      description: r.description
    }))
}

// global 用: DescriptionView に渡す { [ver]: { jpn: string } } 形式へ変換
const getGlobalDescriptionMap = (pokemonId?: string | number) => {
  const key = String(pokemonId ?? '')
  if (!key || !descriptionRows[key]) {
    console.warn(`[getGlobalDescriptionMap] No description data for pokemonId: ${pokemonId}`)
    return {}
  }
  const map: Record<string, { jpn: string }> = {}
  const globalJpn = appConfig.regionPokedex.global?.name?.jpn
  for (const r of descriptionRows[key]) {
    if (r.pokedex !== globalJpn) continue
    if (!map[r.ver]) {
      map[r.ver] = { jpn: r.description }
    }
  }
  return map
}

console.log(`[Main] pokedexData.value:`, pokedexData.value)
console.log(`[Main] Creating reactive states...`)

const pokedex = reactive(pokedexData.value ?? createEmptyPokedexResponse());
const prev = reactive(prevData.value ?? createEmptyPokedexResponse());
const next = reactive(nextData.value ?? createEmptyPokedexResponse());

console.log(`[Main] Reactive pokedex:`, pokedex)
console.log(`[Main] Reactive pokedex.result:`, pokedex.result)
console.log(`[Main] Reactive pokedex.result.length:`, pokedex.result.length)

// ポケモンデータが取得されたらリアクティブ状態を更新
watch(pokedexData, (newData) => {
  console.log(`[Watch] pokedexData changed:`, newData)
  if (newData && newData.result && newData.result.length > 0) {
    console.log(`[Watch] Updating reactive state with new data:`, newData.result)
    Object.assign(pokedex, newData)
    // 画像パス(src)を最新データに合わせて再設定する
    for (const status of pokedex.result) {
      status.src = `${config.app.baseURL || '/'}img/pokedex/${status.id}.png`
    }
    
    // pokedex データ取得後に、すべてのポケモンに対して存在情報と図鑑説明を再取得
    for (const pokemon of pokedex.result) {
      if (pokemon?.id) {
        console.log(`[Watch] Fetching exists for ${pokemon.id}`)
        fetchExists(pokemon.id)
        console.log(`[Watch] Fetching description for ${pokemon.id}`)
        fetchDescription(pokemon.id)
      }
    }
  }
}, { immediate: true })

// prevData が更新されたら prev のリアクティブ状態を更新
watch(prevData, (newData) => {
  if (newData && newData.result && newData.result.length > 0) {
    Object.assign(prev, newData)
    for (const status of prev.result) {
      status.src = `${config.app.baseURL || '/'}img/pokedex/${status.id}.png`
    }
  }
}, { immediate: true })

// nextData が更新されたら next のリアクティブ状態を更新
watch(nextData, (newData) => {
  if (newData && newData.result && newData.result.length > 0) {
    Object.assign(next, newData)
    for (const status of next.result) {
      status.src = `${config.app.baseURL || '/'}img/pokedex/${status.id}.png`
    }
  }
}, { immediate: true })

if (pokedexData.value) {
  console.log(`[Main] Processing type compatibility for ${pokedex.result.length} items`)
  for (const status of pokedex.result) {
    status.type_compatibility = await fetchTypeCompatibility(status.type1, status.type2, route.params.area as string)
  }
}

const hasPokedexData = computed(() => pokedex.result && pokedex.result.length > 0 && pokedex.result[0].name.jpn !== '不明');
let src = '';
if (pokedex.result.length > 0) {
  src = (config.app.baseURL || '/') + "img/pokedex/" + pokedex.result[0].id + ".png";
}

const globalNo = computed(() => route.params.area === 'global'
  ? Number(route.params.id)
  : (pokedex.result[0]?.globalNo ?? Number(route.params.id)))

const id = computed(() => pokedex.result[0]?.id ?? Number(route.params.id))
// const paddedId = String(id).padStart(4, '0')

const breadcrumbs = computed(() => {
  const area = route.params.area as string;
  const areaJpn = appConfig.regionPokedex[area]?.name.jpn ?? '';
  // const areaJpn = area ?? '';
  const pokemonName = pokedex.result[0]?.name[personal.language] ?? String(route.params.id);

  return [
    { title: 'TOP', disabled: false, href: '/' },
    { title: 'ポケモン図鑑', disabled: false, href: '/pokedex' },
    { title: areaJpn, disabled: false, href: `/pokedex/${area}` },
    { title: pokemonName, disabled: true, href: '' }
  ]
});

for(let pokedex_status in pokedex.result){
  pokedex.result[pokedex_status].src = (config.app.baseURL || '/') + 'img/pokedex/' + pokedex.result[pokedex_status].id + '.png'
}

// バージョンごとの図鑑説明を保持（グループ版）
const descriptions = reactive<{ [key: string]: string }>({})
// API で取得した行データを保持（ポケモンIDごと、ver 単位）
const descriptionRows = reactive<{ [pokemonId: string]: Array<{ ver: string; version: string; pokedex: string; description: string }> }>({})

const metaImage = ref('');
if (pokedex.result.length) {
  metaImage.value = "https://pokedex-online.jp/img/pokedex/" + pokedex.result[0].id + ".png";
}

const metaTitle = computed(() => 
  hasPokedexData.value
    ? `${pokedex.result[0].name[personal.language]} - ポケモンずかん`
    : `ポケモンずかん`
);

// const updateMetadata = inject('updateMetadata') as (title: string) => void
// updateMetadata(metaTitle.value)

useHead({
  title: metaTitle,
  meta: [
    {
      property: 'og:title',
      content: metaTitle
    },
    {
      name: 'twitter:card',
      content: 'summary'
    },
    {
      name: 'twitter:title',
      content: metaTitle
    },
    {
      name: 'twitter:image',
      content: metaImage
    }
  ]
})

const nextModel = () => {
  if((pokedex.result.length - 1) <= model.value)
  {
    model.value = 0
  }
  else
  {
    model.value++
  }
}

const prevModel = () => {
  if(model.value == 0)
  {
    model.value = pokedex.result.length - 1
  }
  else
  {
    model.value--
  }
}

</script>
<style scoped>
.responsive-text-name {
  font-size: clamp(0.75rem, 2vw, 1.5rem);
}
.responsive-text {
  font-size: clamp(0.75rem, 2vw, 1.3rem);
}
</style>
