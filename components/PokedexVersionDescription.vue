<template>
  <v-row style="margin-top: 20px;">
    <v-col
      v-for="(versions, area) in appConfig.regionPokedex"
      :key="area"
      v-if="area !== 'global'"
      cols="12"
      sm="12"
    >
      <v-card
        v-if="area !== 'global'"
        elevation="0"
        :variant="(typeof existsPokedex[area]?.result === 'number' && existsPokedex[area]?.result > -1) ? 'outlined' : 'outlined'"
        :style="(typeof existsPokedex[area]?.result === 'number' && existsPokedex[area]?.result > -1) ? 'background-color: white;' : 'background-color: #f2f2f2;'"
      >
        <v-card-title>
          <NuxtLink
            v-if="typeof existsPokedex[area]?.result === 'number' && existsPokedex[area]?.result > -1"
            :to="{ path: `/pokedex/${area}/${('0000' + existsPokedex[area]?.result).slice(-4)}` }"
            class="nuxtlink"
          >
            {{ appConfig.regionPokedex[area]?.disp[currentLanguage] }}
          </NuxtLink>
          <span v-else>
            {{ appConfig.regionPokedex[area]?.disp[currentLanguage] }}
          </span>
        </v-card-title>
        <v-card-text>
          <div v-if="getDescriptionLines(area).length">
            <div v-for="line in getDescriptionLines(area)" :key="line.ver">
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
              v-if="appConfig.regionPokedex[area]?.gameVersion && appConfig.regionPokedex[area].gameVersion.length > 0 && appConfig.verIcon[appConfig.regionPokedex[area].gameVersion[0]]"
              :src="`${config.app.baseURL || '/'}img/version/${appConfig.verIcon[appConfig.regionPokedex[area].gameVersion[0]]}`"
              :alt="appConfig.verDescription[appConfig.regionPokedex[area].gameVersion[0]]?.shortTitle || appConfig.regionPokedex[area].gameVersion[0]"
              style="height: 20px; width: 20px; vertical-align: middle; margin-right: 4px;"
            />
            {{ currentLanguage === 'eng' ? 'No Pokédex description available' : '図鑑説明文は存在しません' }}
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
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
const props = defineProps({
  existsPokedex: {
    type: Object as () => { [key: string]: any },
    required: true
  },
  getDescriptionLines: {
    type: Function as (area: string) => Array<{ ver: string; version: string; pokedex: string; description: string; verJpn: string }>,
    required: true
  },
  openVersionDialog: {
    type: Function as (line: any) => void,
    required: true
  }
})
</script>

<style scoped>
.responsive-text {
  font-size: clamp(0.75rem, 2vw, 1.3rem);
}
</style>
