<template>
  <v-card
    elevation="0"
    variant="outlined"
    style="margin-top: 20px;"
  >
    <!-- Global用の新しい表示ロジック -->
    <div v-if="area === 'global' && globalDescriptionMap && Object.keys(globalDescriptionMap).length > 0">
      <div v-for="(versionGroup, versionGroupKey) in getCurrentPokemonDescriptions()" :key="versionGroupKey">
        <v-card-text>
          <!-- 複数バージョンのアイコンを表示 -->
          <div style="margin-bottom: 8px;">
            <span v-for="version in String(versionGroupKey).split(',')" :key="version" style="margin-right: 2px;">
              <img
                v-if="appConfig.verIcon && appConfig.verIcon[version.trim()]"
                :src="`${config.app.baseURL || '/'}img/version/${appConfig.verIcon[version.trim()]}`"
                :alt="version.trim()"
                style="height: 20px; width: 20px; vertical-align: middle; margin-right: 2px; cursor: pointer;"
                @click="openVersionDialog({ver: version.trim(), verJpn: version.trim(), description: versionGroup[currentLanguage] || versionGroup.jpn})"
              />
            </span>
          </div>
          <!-- 言語に応じた説明文を表示 -->
          <div v-if="versionGroup[currentLanguage]">
            <span v-html="versionGroup[currentLanguage]"></span>
          </div>
          <div v-else-if="versionGroup.jpn">
            <span v-html="versionGroup.jpn"></span>
          </div>
          <div v-else>
            {{ currentLanguage === 'eng' ? 'No description available' : '説明文がありません' }}
          </div>
        </v-card-text>
        <v-divider v-if="Object.keys(globalDescriptionMap).length > 1 && versionGroupKey !== Object.keys(globalDescriptionMap).pop()"></v-divider>
      </div>
    </div>

    <!-- 既存の地方図鑑表示ロジック -->
    <div v-else>
      <div
        v-for="(versions, areaKey) in appConfig.regionPokedex"
        :key="areaKey"
        v-if="areaKey !== 'global' && areaKey && existsPokedex[areaKey]"
        :style="(typeof existsPokedex[areaKey]?.result === 'number' && existsPokedex[areaKey]?.result > -1) ? 'background-color: white;' : 'background-color: #f2f2f2;'"
      >
        <v-card-title>
          <NuxtLink
            v-if="typeof existsPokedex[areaKey]?.result === 'number' && existsPokedex[areaKey]?.result > -1"
            :to="{ path: `/pokedex/${areaKey}/${('0000' + existsPokedex[areaKey]?.result).slice(-4)}` }"
            class="nuxtlink"
          >
            {{ appConfig.regionPokedex[areaKey]?.disp[currentLanguage] }}
          </NuxtLink>
          <span v-else>
            {{ appConfig.regionPokedex[areaKey]?.disp[currentLanguage] }}
          </span>
        </v-card-title>
        <v-card-text>
          <div v-if="getDescriptionLines(areaKey).length">
            <div v-for="line in getDescriptionLines(areaKey)" :key="line.ver">
              <img
                v-if="appConfig.verIcon[line.ver]"
                :src="`${config.app.baseURL || '/'}img/version/${appConfig.verIcon[line.ver]}`"
                :alt="line.verJpn"
                style="height: 20px; width: 20px; vertical-align: middle; margin-right: 4px; cursor: pointer;"
                @click="openVersionDialog(line)"
              />
              {{ line.description }}
            </div>
          </div>
          <div v-else>
            <img
              v-if="appConfig.regionPokedex[areaKey]?.gameVersion && appConfig.regionPokedex[areaKey].gameVersion.length > 0 && appConfig.verIcon[appConfig.regionPokedex[areaKey].gameVersion[0]]"
              :src="`${config.app.baseURL || '/'}img/version/${appConfig.verIcon[appConfig.regionPokedex[areaKey].gameVersion[0]]}`"
              :alt="appConfig.verDescription[appConfig.regionPokedex[areaKey].gameVersion[0]]?.shortTitle || appConfig.regionPokedex[areaKey].gameVersion[0]"
              style="height: 20px; width: 20px; vertical-align: middle; margin-right: 4px;"
            />
            {{ currentLanguage === 'eng' ? 'No Pokédex description available' : '図鑑説明文は存在しません' }}
          </div>
        </v-card-text>
        <v-divider v-if="areaKey !== Object.keys(appConfig.regionPokedex).filter(a => a !== 'global').pop()"></v-divider>
      </div>
    </div>
  </v-card>
</template>
<script setup lang="ts">
const appConfig = useAppConfig()
const config = useRuntimeConfig()
const { settings } = useSettings()

// 統一された言語設定
const currentLanguage = computed(() => {
  return (settings.value.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
})

// propsの定義
const props = defineProps<{
  existsPokedex: { [key: string]: any }
  getDescriptionLines: (area: string) => Array<{ ver: string; version: string; pokedex: string; description: string; verJpn: string }>
  openVersionDialog: (line: any) => void
  globalDescriptionMap?: { [key: string]: any }
  currentPokemonId?: string
  area?: string
}>()

// 現在のポケモンの説明データを取得する関数
const getCurrentPokemonDescriptions = () => {
  if (!props.globalDescriptionMap || !props.currentPokemonId) {
    return {}
  }
  
  // currentPokemonIdに一致するデータを返す
  return props.globalDescriptionMap[props.currentPokemonId] || {}
}

// デバッグ用
watchEffect(() => {
  if (props.area === 'global' && props.globalDescriptionMap) {
    console.log('[PokedexVersionDescription] globalDescriptionMap:', props.globalDescriptionMap)
    console.log('[PokedexVersionDescription] globalDescriptionMap keys:', Object.keys(props.globalDescriptionMap))
    console.log('[PokedexVersionDescription] currentPokemonId:', props.currentPokemonId)
    console.log('[PokedexVersionDescription] getCurrentPokemonDescriptions():', getCurrentPokemonDescriptions())
  }
})
</script>

<style scoped>
.responsive-text {
  font-size: clamp(0.75rem, 2vw, 1.3rem);
}
</style>
