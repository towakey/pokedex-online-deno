<template>
  <v-row style="margin-top: 20px;">
    <v-col
      v-for="(versions, area) in appConfig.pokedex2gameVersion"
      :key="area"
      cols="12"
      sm="12"
    >
    {{ existsPokedex[area] }}
      <template v-if="area === 'global' || existsPokedex[area]?.result > -1">
        <v-card
          elevation="0"
          variant="outlined"
          style="background-color: white;"
        >
          <v-card-title>
            <NuxtLink
              :to="{ path: `/pokedex/${area}/${('0000' + existsPokedex[area]?.result).slice(-4)}` }"
              class="nuxtlink"
            >
              {{ appConfig.games.region2jpn[area] ?? appConfig.regionPokedex[area]?.name?.jpn ?? area }}
            </NuxtLink>
          </v-card-title>
          <v-card-text>
            <div v-if="getDescriptionLines(area).length">
              <div v-for="line in getDescriptionLines(area)" :key="line.ver">
                <img
                  v-if="appConfig.verIcon[line.ver]"
                  :src="`/img/version/${appConfig.verIcon[line.ver]}`"
                  :alt="line.verJpn"
                  style="height: 20px; width: 20px; vertical-align: middle; margin-right: 4px; cursor: pointer;"
                  @click="openVersionDialog(line)"
                />
                {{ line.description }}
              </div>
            </div>
            <div v-else>
              <img
                v-if="appConfig.verIcon[appConfig.games.region2game[area]]"
                :src="`/img/version/${appConfig.verIcon[appConfig.games.region2game[area]]}`"
                :alt="appConfig.games.region2game[area]"
                style="height: 20px; width: 20px; vertical-align: middle; margin-right: 4px;"
              />
              図鑑説明文は存在しません。
            </div>
          </v-card-text>
        </v-card>
      </template>
      <template v-else>
        <v-card
          elevation="0"
          disabled
          variant="outlined"
          style="background-color: #f2f2f2;"
        >
          <v-card-title>{{ appConfig.regionPokedex[area]?.name?.jpn ?? area }}</v-card-title>
          <v-card-text class="responsive-text">
            <div v-if="getDescriptionLines(area).length">
              <div v-for="line in getDescriptionLines(area)" :key="line.ver">
                <img
                  v-if="appConfig.verIcon[line.ver]"
                  :src="`/img/version/${appConfig.verIcon[line.ver]}`"
                  :alt="line.verJpn"
                  style="height: 20px; width: 20px; vertical-align: middle; margin-right: 4px; cursor: pointer;"
                  @click="openVersionDialog(line)"
                />
                {{ line.description }}
              </div>
            </div>
            <div v-else>
              <img
                v-if="appConfig.games.region2game[area] && appConfig.verIcon[appConfig.games.region2game[area]]"
                :src="`/img/version/${appConfig.verIcon[appConfig.games.region2game[area]]}`"
                :alt="appConfig.games.region2game[area]"
                style="height: 20px; width: 20px; vertical-align: middle; margin-right: 4px;"
              />
              図鑑説明文は存在しません
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const appConfig = useAppConfig()

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
