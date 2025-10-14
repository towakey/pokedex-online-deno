<script setup lang="ts">
import { ref, computed } from 'vue'
const appConfig = useAppConfig()
const props = defineProps(["pokedex", "area"])
const typeDialog = ref(false)

const { settings } = useSettings()

// 統一された言語設定
const currentLanguage = computed(() => {
  return (settings.value?.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
})

// タイプ名の多言語対応ヘルパー
const getTypeName = (typeKey: string) => {
  const typeInfo = appConfig.type[typeKey as keyof typeof appConfig.type]
  if (typeInfo) {
    return typeInfo[currentLanguage.value]
  }
  return typeKey // フォールバック
}

// タイプ用CSSクラス名を取得
const getTypeClass = (typeKey: string) => {
  const typeInfo = appConfig.type[typeKey as keyof typeof appConfig.type]
  if (typeInfo) {
    return `type_${typeInfo.eng.charAt(0).toUpperCase() + typeInfo.eng.slice(1)}`
  }
  return `type_${typeKey}`
}

// ポケモンのタイプ1の表示用computed
const type1Display = computed(() => {
  if (!props.pokedex?.type1) return null
  return {
    name: getTypeName(props.pokedex.type1),
    className: getTypeClass(props.pokedex.type1)
  }
})

// ポケモンのタイプ2の表示用computed
const type2Display = computed(() => {
  if (!props.pokedex?.type2 || props.pokedex.type2 === '') return null
  return {
    name: getTypeName(props.pokedex.type2),
    className: getTypeClass(props.pokedex.type2)
  }
})


let typeList: string[]
if( props.area == 'johto' 
      || props.area == 'hoenn' 
      || props.area == 'kanto_frlg' 
      || props.area == 'sinnoh' 
      || props.area == 'johto_hgss' 
      || props.area == 'unova_bw' 
      || props.area == 'unova_b2w2' )
{
  typeList = appConfig.type_list['2']
}
else if( props.area == 'central_kalos' 
      || props.area == 'coast_kalos' 
      || props.area == 'mountain_kalos' 
      || props.area == 'alola_sm' 
      || props.area == 'alola_usum' 
      || props.area == 'galar' 
      || props.area == 'isle_of_armor' 
      || props.area == 'crown_tundra' 
      || props.area == 'hisui' 
      || props.area == 'paldea' 
      || props.area == 'kitakami' 
      || props.area == 'blueberry' )
{
  typeList = appConfig.type_list['3']
}
else
{
  typeList = appConfig.type_list['1']
}

// 旧ロジック用の配列は廃止。computed で動的生成するため不要。

// type_compatibility が無い場合は空オブジェクトでフォールバック
const typeRates = computed(() => props.pokedex?.type_compatibility ?? {})
// 各倍率ごとのタイプ一覧を動的に計算
// 指定が無いタイプは 1 倍とみなす
const getRate = (type: string): number => {
  const r = typeRates.value[type]
  return r !== undefined ? Number(r) : 1
}

const damage0   = computed(() => typeList.filter(t => getRate(t) === 0))
const damage025 = computed(() => typeList.filter(t => getRate(t) === 0.25))
const damage05  = computed(() => typeList.filter(t => getRate(t) === 0.5))
const damage1   = computed(() => typeList.filter(t => getRate(t) === 1))
const damage2   = computed(() => typeList.filter(t => getRate(t) === 2))
const damage4   = computed(() => typeList.filter(t => getRate(t) === 4))


</script>

<template>
  <v-card @click="typeDialog = true" style="margin-top: 20px" variant="outlined" :id="`type`">
    <v-card-title style="display:flex;padding:0px;">
      <div v-if="type1Display" :class="`${type1Display.className} type_view`">{{ type1Display.name }}</div>
      <div v-if="type2Display" :class="`${type2Display.className} type_view`">{{ type2Display.name }}</div>
    </v-card-title>
  </v-card>

  <ClientOnly>
    <v-dialog
    v-model="typeDialog"
    style="width: 90%;"
    >
      <v-container>
        <v-card
        variant="outlined"
        style="background-color: rgba(255,255,255,0.9);"
        >
          <v-card-item>
            <h3>{{ currentLanguage === 'eng' ? 'Super Effective (4x)' : 'こうかはばつぐんだ(4倍)' }}</h3>
            <div v-if="damage4.length === 0" class="no-type">{{ currentLanguage === 'eng' ? 'None' : 'なし' }}</div>
            <div v-else>
            <div
            v-for="val in damage4"
            :key="val"
            style="display: inline-block;"
            >
              <div :class="`${getTypeClass(val)} type_icon`">{{ getTypeName(val) }}</div>
            </div>
            </div>

            <h3>{{ currentLanguage === 'eng' ? 'Super Effective (2x)' : 'こうかはばつぐんだ(2倍)' }}</h3>
            <div v-if="damage2.length === 0" class="no-type">{{ currentLanguage === 'eng' ? 'None' : 'なし' }}</div>
            <div v-else>
            <div
            v-for="val in damage2"
            :key="val"
            style="display: inline-block;"
            >
              <div :class="`${getTypeClass(val)} type_icon`">{{ getTypeName(val) }}</div>
            </div>
            </div>

            <h3>{{ currentLanguage === 'eng' ? 'Normal Effective (1x)' : 'こうかはふつうのようだ' }}</h3>
            <div v-if="damage1.length === 0" class="no-type">{{ currentLanguage === 'eng' ? 'None' : 'なし' }}</div>
            <div v-else>
            <div
            v-for="val in damage1"
            :key="val"
            style="display: inline-block;"
            >
              <div :class="`${getTypeClass(val)} type_icon`">{{ getTypeName(val) }}</div>
            </div>
            </div>

            <h3>{{ currentLanguage === 'eng' ? 'Not Very Effective (0.5x)' : 'こうかはいまひとつのようだ(0.5倍)' }}</h3>
            <div v-if="damage05.length === 0" class="no-type">{{ currentLanguage === 'eng' ? 'None' : 'なし' }}</div>
            <div v-else>
            <div
            v-for="val in damage05"
            :key="val"
            style="display: inline-block;"
            >
              <div :class="`${getTypeClass(val)} type_icon`">{{ getTypeName(val) }}</div>
            </div>
            </div>

            <h3>{{ currentLanguage === 'eng' ? 'Not Very Effective (0.25x)' : 'こうかはいまひとつのようだ(0.25倍)' }}</h3>
            <div v-if="damage025.length === 0" class="no-type">{{ currentLanguage === 'eng' ? 'None' : 'なし' }}</div>
            <div v-else>
            <div
            v-for="val in damage025"
            :key="val"
            style="display: inline-block;"
            >
              <div :class="`${getTypeClass(val)} type_icon`">{{ getTypeName(val) }}</div>
            </div>
            </div>

            <h3>{{ currentLanguage === 'eng' ? 'No Effect (0x)' : 'こうかはないようだ' }}</h3>
            <div v-if="damage0.length === 0" class="no-type">{{ currentLanguage === 'eng' ? 'None' : 'なし' }}</div>
            <div v-else>
            <div
            v-for="val in damage0"
            :key="val"
            style="display: inline-block;"
            >
              <div :class="`${getTypeClass(val)} type_icon`">{{ getTypeName(val) }}</div>
            </div>
            </div>

          </v-card-item>
          <v-card-actions>
            <v-btn block @click="typeDialog = false">{{ currentLanguage === 'eng' ? 'Close' : 'とじる' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>
  </ClientOnly>
</template>

