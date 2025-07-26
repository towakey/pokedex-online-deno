<script setup lang="ts">
import { ref, computed } from 'vue'
const appConfig = useAppConfig()
const props = defineProps(["pokedex", "area"])
const typeDialog = ref(false)

let typeList: string[]
typeList = appConfig.type_list[appConfig.typeList[props.area]]
console.log(typeList)

// type_compatibility が無い場合は空オブジェクトでフォールバック
const typeRates = computed(() => props.pokedex?.type_compatibility ?? {})
// 指定が無いタイプは 1 倍とみなす
const getRate = (type: string): number => {
  const r = typeRates.value[type]
  return r !== undefined ? Number(r) : 1
}

const damage0 = computed(() => typeList.filter(t => getRate(t) === 0))
const damage025 = computed(() => typeList.filter(t => getRate(t) === 0.25))
const damage05 = computed(() => typeList.filter(t => getRate(t) === 0.5))
const damage1 = computed(() => typeList.filter(t => getRate(t) === 1))
const damage2 = computed(() => typeList.filter(t => getRate(t) === 2))
const damage4 = computed(() => typeList.filter(t => getRate(t) === 4))
</script>

<template>
  <v-card @click="typeDialog = true" style="margin-top: 20px" variant="outlined" :id="`type`">
    <v-card-title style="display:flex;padding:0px;">
      <!-- type1 -->
      <div v-if='pokedex.type1 === "ノーマル"' class="type_Normal type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "ほのお"' class="type_Fire type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "みず"' class="type_Water type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "でんき"' class="type_Electric type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "くさ"' class="type_Grass type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "こおり"' class="type_Ice type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "かくとう"' class="type_Fighting type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "どく"' class="type_Poison type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "じめん"' class="type_Ground type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "ひこう"' class="type_Flying type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "エスパー"' class="type_Psychic type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "むし"' class="type_Bug type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "いわ"' class="type_Rock type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "ゴースト"' class="type_Ghost type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "ドラゴン"' class="type_Dragon type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "あく"' class="type_Dark type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "はがね"' class="type_Steel type_view">{{ pokedex.type1 }}</div>
      <div v-else-if='pokedex.type1 === "フェアリー"' class="type_Fairy type_view">{{ pokedex.type1 }}</div>

      <!-- type2 -->
      <div v-if='pokedex.type2 && pokedex.type2 === "ノーマル"' class="type_Normal type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "ほのお"' class="type_Fire type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "みず"' class="type_Water type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "でんき"' class="type_Electric type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "くさ"' class="type_Grass type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "こおり"' class="type_Ice type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "かくとう"' class="type_Fighting type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "どく"' class="type_Poison type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "じめん"' class="type_Ground type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "ひこう"' class="type_Flying type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "エスパー"' class="type_Psychic type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "むし"' class="type_Bug type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "いわ"' class="type_Rock type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "ゴースト"' class="type_Ghost type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "ドラゴン"' class="type_Dragon type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "あく"' class="type_Dark type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "はがね"' class="type_Steel type_view">{{ pokedex.type2 }}</div>
      <div v-else-if='pokedex.type2 === "フェアリー"' class="type_Fairy type_view">{{ pokedex.type2 }}</div>
    </v-card-title>
  </v-card>

  <ClientOnly>
    <v-dialog v-model="typeDialog" style="width:90%;">
      <v-container>
        <v-card variant="outlined" style="background-color:rgba(255,255,255,0.9);">
          <v-card-item>
            <template v-for="(list,label) in [[damage4,'こうかはばつぐんだ(4倍)'],[damage2,'こうかはばつぐんだ(2倍)'],[damage1,'こうかはふつうのようだ'],[damage05,'こうかはいまひとつのようだ(0.5倍)'],[damage025,'こうかはいまひとつのようだ(0.25倍)'],[damage0,'こうかはないようだ']]">
              <h3>{{ label }}</h3>
              <div v-if="list.length===0" class="no-type">なし</div>
              <div v-else>
                <div v-for="val in list" :key="val" style="display:inline-block;">
                  <div :class="['type_icon', typeClass(val)]">{{ val }}</div>
                </div>
              </div>
            </template>
          </v-card-item>
          <v-card-actions>
            <v-btn block @click="typeDialog = false">とじる</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>
  </ClientOnly>
</template>

<script lang="ts">
export default {
  methods: {
    typeClass(val: string) {
      const map: Record<string,string> = {
        'ノーマル':'type_Normal','ほのお':'type_Fire','みず':'type_Water','でんき':'type_Electric','くさ':'type_Grass','こおり':'type_Ice','かくとう':'type_Fighting','どく':'type_Poison','じめん':'type_Ground','ひこう':'type_Flying','エスパー':'type_Psychic','むし':'type_Bug','いわ':'type_Rock','ゴースト':'type_Ghost','ドラゴン':'type_Dragon','あく':'type_Dark','はがね':'type_Steel','フェアリー':'type_Fairy'
      }
      return map[val] ?? ''
    }
  }
}
</script>

<style scoped>
/*.type_view{padding:4px 8px;margin-right:4px;border-radius:4px;font-weight:bold;color:#fff;font-size:14px;}
.type_icon{padding:4px 8px;margin:2px;border-radius:4px;font-weight:bold;color:#fff;font-size:12px;}
.no-type{margin-bottom:8px;}*/
/* 各タイプ色は既存の class(type_*) に依存 */
</style>
