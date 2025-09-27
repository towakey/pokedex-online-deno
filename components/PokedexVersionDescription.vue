<template>
  <v-card
    elevation="0"
    variant="outlined"
    style="margin-top: 20px;"
  >
    <!-- Global用の新しい表示ロジック -->
    <div v-if="area === 'global' && currentGlobalGroups.length > 0">
      <div
        v-for="(group, index) in currentGlobalGroups"
        :key="group.key"
        class="global-group"
      >
        <v-card-text
          class="global-group__card-text"
          tabindex="0"
          @click="toggleGroup(group.key)"
          @keyup.enter.prevent="toggleGroup(group.key)"
          @keyup.space.prevent="toggleGroup(group.key)"
          role="button"
          :aria-expanded="expandedPanels.includes(group.key)"
        >
          <!-- 複数バージョンのアイコンを表示 -->
          <div class="global-group__icon-row">
            <span
              v-for="version in group.versionNames"
              :key="`${group.key}-${version}`"
              class="version-icon-wrapper"
            >
              <img
                v-if="getVersionIconPath(version)"
                :src="getVersionIconPath(version)"
                :alt="getVersionLabel(version)"
                class="version-icon"
                @click.stop="openVersionDialog({
                  ver: version,
                  verJpn: getVersionLabel(version),
                  description: group.descriptions[currentLanguage] || group.descriptions.jpn || group.displayDescription
                })"
              />
            </span>
          </div>
          <!-- 言語に応じた説明文を表示 -->
          <div v-if="group.descriptions[currentLanguage]">
            <span v-html="group.descriptions[currentLanguage]"></span>
          </div>
          <div v-else-if="group.descriptions.jpn">
            <span v-html="group.descriptions.jpn"></span>
          </div>
          <div v-else-if="group.displayDescription">
            <span v-html="group.displayDescription"></span>
          </div>
          <div v-else>
            {{ currentLanguage === 'eng' ? 'No description available' : '説明文がありません' }}
          </div>

          <v-expansion-panels
            v-model="expandedPanels"
            multiple
            class="global-group__panels mt-3"
            @click.stop
          >
            <v-expansion-panel :value="group.key" elevation="0">
              <v-expansion-panel-title hide-actions class="sr-only">
                {{ currentLanguage === 'eng' ? 'Version descriptions' : 'バージョン別説明' }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div
                  v-for="entry in group.versionEntries"
                  :key="entry.key"
                  class="version-entry mb-4"
                >
                  <div class="version-entry__icons mb-2">
                    <span
                      v-for="versionName in entry.names"
                      :key="`${entry.key}-${versionName}`"
                      class="version-icon-wrapper"
                    >
                      <img
                        v-if="getVersionIconPath(versionName)"
                        :src="getVersionIconPath(versionName)"
                        :alt="getVersionLabel(versionName)"
                        class="version-icon"
                        @click.stop="openVersionDialog({
                          ver: versionName,
                          verJpn: getVersionLabel(versionName),
                          description: entry.descriptions[currentLanguage] || entry.descriptions.jpn || entry.descriptions.eng || group.displayDescription
                        })"
                      />
                      <span class="version-label">{{ getVersionLabel(versionName) }}</span>
                    </span>
                  </div>
                  <div class="version-entry__description">
                    <div v-if="entry.descriptions[currentLanguage]" v-html="entry.descriptions[currentLanguage]"></div>
                    <div v-else-if="entry.descriptions.jpn" v-html="entry.descriptions.jpn"></div>
                    <div v-else-if="entry.descriptions.eng" v-html="entry.descriptions.eng"></div>
                    <div v-else>
                      {{ currentLanguage === 'eng' ? 'No description available' : '説明文がありません' }}
                    </div>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-divider v-if="index !== currentGlobalGroups.length - 1"></v-divider>
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
interface GlobalVersionEntry {
  key: string
  groupKey: string
  names: string[]
  versionKey: string
  descriptions: Record<string, string>
}

interface GlobalVersionGroupEntry {
  key: string
  versionNames: string[]
  descriptions: Record<string, string>
  displayDescription: string
  versionEntries: GlobalVersionEntry[]
  raw: Record<string, any>
}

const expandedPanels = ref<string[]>([])

const isRecord = (value: unknown): value is Record<string, any> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const isPotentialGroupKey = (key: string): boolean => {
  return /\d/.test(key)
}

const collectLanguageMap = (source: Record<string, any>): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const [lang, text] of Object.entries(source)) {
    if (typeof text === 'string' && text.trim() !== '') {
      result[lang] = text
    }
  }
  return result
}

const toggleGroup = (key: string) => {
  const index = expandedPanels.value.indexOf(key)
  if (index > -1) {
    expandedPanels.value.splice(index, 1)
  } else {
    expandedPanels.value.push(key)
  }
}

const extractVersionGroupContainer = (input: unknown, depth = 0): Record<string, any> | null => {
  if (!input || typeof input !== 'object' || Array.isArray(input) || depth > 4) {
    return null
  }

  const record = input as Record<string, any>
  const entries = Object.entries(record)
  if (!entries.length) {
    return null
  }

  const isGroupContainer = entries.every(([, value]) => isRecord(value)) && entries.some(([key]) => isPotentialGroupKey(key))

  if (isGroupContainer) {
    return record
  }

  for (const value of Object.values(record)) {
    const nested = extractVersionGroupContainer(value, depth + 1)
    if (nested) {
      return nested
    }
  }

  return null
}

const resolveGroupDescription = (descriptions: Record<string, string>): string => {
  const preferredOrder = [currentLanguage.value, 'jpn', 'jpn_kanji', 'jpn_kana', 'eng']
  for (const key of preferredOrder) {
    if (descriptions[key]) {
      return descriptions[key]
    }
  }
  const firstValue = Object.values(descriptions).find((value) => typeof value === 'string' && value.trim())
  return firstValue ?? ''
}

const normalizeVersionName = (version: string): string => {
  return String(version || '').trim()
}

const parseVersionNames = (value: any): string[] => {
  if (!value) {
    return []
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' || typeof item === 'number') ? normalizeVersionName(String(item)) : '')
      .filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(/[,_]/)
      .map((part) => normalizeVersionName(part))
      .filter(Boolean)
  }
  return []
}

const toVersionNames = (groupKey: string, value: Record<string, any>): string[] => {
  if (Array.isArray(value?.version_names) && value.version_names.length) {
    return parseVersionNames(value.version_names)
  }
  if (value?.version_names) {
    return parseVersionNames(value.version_names)
  }
  const rawNames = parseVersionNames(groupKey)
  if (rawNames.length) {
    return rawNames
  }
  if (Array.isArray(value?.version_keys)) {
    return parseVersionNames(value.version_keys)
  }
  return []
}

const currentGlobalGroups = computed<GlobalVersionGroupEntry[]>(() => {
  if (props.area !== 'global' || !props.globalDescriptionMap) {
    return []
  }

  const container = extractVersionGroupContainer(props.globalDescriptionMap)
  if (!container) {
    return []
  }

  const groups: GlobalVersionGroupEntry[] = []
  for (const [groupKey, groupValue] of Object.entries(container)) {
    if (!groupValue || typeof groupValue !== 'object') {
      continue
    }

    const versionNames = toVersionNames(groupKey, groupValue as Record<string, any>)

    const commonDescriptions = isRecord(groupValue.common) ? collectLanguageMap(groupValue.common as Record<string, any>) : {}
    let groupDescriptions = Object.keys(commonDescriptions).length ? commonDescriptions : {}

    const versionEntries: GlobalVersionEntry[] = []

    const pushVersionEntry = (entryKey: string, entryValue: Record<string, any>) => {
      const descriptions = collectLanguageMap(entryValue)
      if (!Object.keys(descriptions).length) {
        return
      }

      const normalizedKey = normalizeVersionName(entryKey)
      const explicitNames = parseVersionNames(entryValue.version_names ?? entryKey)
      const fallbackNames = explicitNames.length ? explicitNames : parseVersionNames(entryKey)
      const namesToUse = fallbackNames.length ? fallbackNames : [normalizedKey]

      versionEntries.push({
        key: `${groupKey}:${entryKey}`,
        groupKey,
        names: namesToUse,
        versionKey: entryKey,
        descriptions
      })
    }

    if (isRecord(groupValue.versions)) {
      for (const [groupVersionKey, versionValue] of Object.entries(groupValue.versions as Record<string, any>)) {
        if (!isRecord(versionValue)) {
          continue
        }
        pushVersionEntry(groupVersionKey, versionValue)
      }
    }

    if (!versionEntries.length) {
      const reservedKeys = new Set(['common', 'version_names', 'version_ids', 'ver_ids', 'representative_ver_id', 'raw_ver_group'])
      for (const [entryKey, entryValue] of Object.entries(groupValue as Record<string, any>)) {
        if (reservedKeys.has(entryKey)) {
          continue
        }
        if (!isRecord(entryValue)) {
          continue
        }
        pushVersionEntry(entryKey, entryValue)
      }
    }

    if (!versionEntries.length) {
      const fallbackDescriptions = Object.keys(groupDescriptions).length
        ? groupDescriptions
        : collectLanguageMap(groupValue as Record<string, any>)

      if (Object.keys(fallbackDescriptions).length) {
        const fallbackNames = versionNames.length ? versionNames : parseVersionNames(groupKey)
        const namesToUse = fallbackNames.length ? fallbackNames : [normalizeVersionName(groupKey)]
        versionEntries.push({
          key: `${groupKey}:fallback`,
          groupKey,
          names: namesToUse,
          versionKey: groupKey,
          descriptions: fallbackDescriptions
        })
      }
    }

    if (!Object.keys(groupDescriptions).length) {
      const firstEntryDescriptions = versionEntries[0]?.descriptions ?? {}
      groupDescriptions = Object.keys(firstEntryDescriptions).length ? firstEntryDescriptions : {}
    }

    const displayDescription = resolveGroupDescription(groupDescriptions)

    groups.push({
      key: groupKey,
      versionNames,
      descriptions: groupDescriptions,
      displayDescription,
      versionEntries,
      raw: groupValue as Record<string, any>
    })
  }

  return groups
})

const getVersionIconPath = (version: string): string => {
  const normalized = normalizeVersionName(version)
  if (!normalized) {
    return ''
  }

  const iconKey = Object.keys(appConfig.verIcon || {}).find((key) => key.toLowerCase() === normalized.toLowerCase())
  if (!iconKey) {
    return ''
  }

  return `${config.app.baseURL || '/'}img/version/${appConfig.verIcon[iconKey]}`
}

const getVersionLabel = (version: string): string => {
  const normalized = normalizeVersionName(version)
  if (!normalized) {
    return ''
  }

  const verDescription = appConfig.verDescription || {}
  const matchedKey = Object.keys(verDescription).find((key) => key.toLowerCase() === normalized.toLowerCase())
  if (matchedKey) {
    const target = verDescription[matchedKey] as Record<string, any>
    return (
      target?.shortTitle ||
      target?.title?.jpn ||
      target?.title?.eng ||
      matchedKey
    )
  }

  return normalized
}

// デバッグ用
watchEffect(() => {
  if (props.area === 'global' && props.globalDescriptionMap) {
    console.log('[PokedexVersionDescription] globalDescriptionMap:', props.globalDescriptionMap)
    console.log('[PokedexVersionDescription] currentPokemonId:', props.currentPokemonId)
    console.log('[PokedexVersionDescription] currentGlobalGroups:', currentGlobalGroups.value)
    console.log('[PokedexVersionDescription] expandedPanels:', expandedPanels.value)
  }
})
</script>

<style scoped>
.responsive-text {
  font-size: clamp(0.75rem, 2vw, 1.3rem);
}
.global-group__card-text {
  cursor: pointer;
}
.global-group__icon-row,
.version-entry__icons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}
.version-icon-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.version-icon {
  height: 20px;
  width: 20px;
}
.version-label {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}
.version-entry__description :deep(p) {
  margin-bottom: 0.25rem;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
