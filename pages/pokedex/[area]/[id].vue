<template>
  <!-- duplicate isVersionDialogVisible dialog removed; unified dialog exists at the bottom of this template -->
  <div
  v-if="route.params.area == 'global'">
    <ClientOnly>
      <v-dialog
      >
        <v-container>
          <v-card>
            <v-card-title v-if="pokedex.result.length > 0">
              {{ pokedex.result[Number(model)]?.name?.[currentLanguage] }}
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
            >{{ prev.result[0].name[currentLanguage] }}</v-btn>
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
            >{{ next.result[0].name[currentLanguage] }}</v-btn>
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
                  <h2 class="responsive-text-name">{{ item.name[currentLanguage] }}</h2>
                </v-card-title>
                <v-card-text width="auto">
                  <!-- フォーム名表示 -->
                  <div v-if="pokedex.result.length > 1" class="responsive-text mb-2" style="font-weight: bold;">
                    <span class="d-flex align-center">
                      <!-- フォームアイコン表示 -->
                      <!-- <img 
                        v-if="pokedex.result[Number(model)]?.forms?.eng?.startsWith('Mega')"
                        src="/img/icon/f01.png"
                        alt="Mega Evolution"
                        style="width: 16px; height: 16px; margin-right: 4px;"
                      />
                      <img 
                        v-else-if="pokedex.result[Number(model)]?.forms?.eng === 'Gigantamax'"
                        src="/img/icon/f02.png"
                        alt="Gigantamax"
                        style="width: 16px; height: 16px; margin-right: 4px;"
                      />
                      <img 
                        v-else-if="pokedex.result[Number(model)]?.forms?.eng === 'Stellar Form'"
                        src="/img/icon/f03.png"
                        alt="Stellar/Terastal Form"
                        style="width: 16px; height: 16px; margin-right: 4px;"
                      /> -->
                      
                      {{ 
                        (pokedex.result[Number(model)]?.gigantamax && pokedex.result[Number(model)]?.form) ? `${pokedex.result[Number(model)]?.gigantamax} ${pokedex.result[Number(model)]?.form}` : 
                        (pokedex.result[Number(model)]?.region && pokedex.result[Number(model)]?.form) ? `${pokedex.result[Number(model)]?.region} ${pokedex.result[Number(model)]?.form}` : 
                        (pokedex.result[Number(model)]?.mega_evolution) ? pokedex.result[Number(model)]?.mega_evolution : 
                        (pokedex.result[Number(model)]?.gigantamax) ? pokedex.result[Number(model)]?.gigantamax : 
                        (pokedex.result[Number(model)]?.region) ? pokedex.result[Number(model)]?.region : 
                        (pokedex.result[Number(model)]?.form) ? pokedex.result[Number(model)]?.form : 
                        (pokedex.result[Number(model)]?.forms?.[currentLanguage] || '')
                      }}
                    </span>
                  </div>
                  <!-- <div class="responsive-text">{{ appConfig.translation.classification[currentLanguage] }}　　　　{{ item.classification[currentLanguage] }}</div> -->
                  <div class="responsive-text">{{ item.classification[currentLanguage] }}</div>
                  <!-- <div class="responsive-text">{{ appConfig.translation.no[currentLanguage] }}　　　No.{{ ('0000' + item.no).slice(-4) }}</div> -->
                  <!-- <div class="responsive-text">{{ appConfig.translation.no[currentLanguage] }}　　No.{{ ('0000' + item.globalNo).slice(-4) }}</div>
                  <div class="responsive-text">{{ appConfig.translation.height[currentLanguage] }}　　　　{{ item.height }} m</div>
                  <div class="responsive-text">{{ appConfig.translation.weight[currentLanguage] }}　　　　{{ item.weight }} kg</div> -->
                  <div class="responsive-text">No.{{ ('0000' + item.globalNo).slice(-4) }}</div>
                  <div class="responsive-text">{{ item.height }} m</div>
                  <div class="responsive-text">{{ item.weight }} kg</div>
                  <!-- ここにitem.type1とitem.type2を表示 -->
                  <div class="d-flex mt-1">
                    <div 
                      v-if="item.type1" 
                      @click="openTypeDialog(item.type1)"
                      style="cursor: pointer;"
                    >
                      <TypeIcon
                        :type="item.type1"
                        :mode="'icon'"
                        class="me-1"
                      />
                    </div>
                    <div 
                      v-if="item.type2" 
                      @click="openTypeDialog(item.type2)"
                      style="cursor: pointer;"
                    >
                      <TypeIcon
                        :type="item.type2"
                        :mode="'icon'"
                      />
                    </div>
                  </div>
                  <div class="responsive-text d-flex align-center">
                    <!-- <span>{{ appConfig.translation.egg[currentLanguage] }}　　</span> -->
                    <div class="d-flex align-center flex-wrap" style="gap: 4px;">
                      <div v-for="(eggGroup, index) in item.egg" :key="index" class="d-flex align-center" style="margin-right: 8px;">
                        <img 
                          v-if="eggMapping[eggGroup]"
                          :src="`/img/icon/e${eggMapping[eggGroup].padStart(2, '0')}.gif`"
                          :alt="eggGroup"
                          style="width: 32px; height: 32px; margin-right: 2px; cursor: pointer;"
                          @click="openEggGroupDialog(eggGroup)"
                        />
                        <!-- <span>{{ eggGroup }}</span> -->
                      </div>
                    </div>
                  </div>
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
      <!-- デバッグ情報 -->
      <!-- <v-card v-if="route.params.area === 'global'" style="margin: 10px; padding: 10px; background-color: #ffffcc;">
        <div>Debug Info for Global Area:</div>
        <div v-for="(item, index) in pokedex.result" :key="`debug-${index}`">
          <div>Index: {{ index }}, ID: {{ item?.id }}</div>
          <div>Has descriptionRows[{{ String(item?.id) }}]: {{ !!descriptionRows[String(item?.id)] }}</div>
          <div>Description length: {{ descriptionRows[String(item?.id)]?.length || 0 }}</div>
          <div>v-if condition: {{ item?.id != null && descriptionRows[String(item.id)] && descriptionRows[String(item.id)].length > 0 }}</div>
          <div>getGlobalDescriptionMap result: {{ JSON.stringify(getGlobalDescriptionMap(item.id)) }}</div>
        </div>
      </v-card> -->
      
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
      <!-- フォーム切り替えアイコンボタン -->
      <v-card
      v-if="pokedex.result.length > 1"
      elevation="0"
      style="margin-top: 20px;background-color: white;"
      variant="outlined"
      >
        <v-card-text class="d-flex align-center py-4" style="width: 100%; padding: 16px;">
          <!-- 前へボタン -->
          <v-btn
            icon
            size="large"
            variant="outlined"
            @click="prevModel()"
            style="flex-shrink: 0;"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          
          <!-- フォームインジケーター表示（カルーセル風） -->
          <div class="flex-grow-1 text-center" :style="`position: relative; height: 60px; margin: 0 ${indicatorSizes.containerMargin}px;`">
            <div class="d-flex align-center justify-center" style="position: relative; height: 100%; width: 100%;">
              <!-- 表示するインジケーターを計算して配置 -->
              <div class="d-flex align-center justify-center" style="position: relative; width: 100%; height: 100%;">
                <v-btn
                  v-for="(item, index) in pokedex.result"
                  v-show="getCircularDistance(index, model, pokedex.result.length) <= 3"
                  :key="`indicator-${index}`"
                  icon
                  :size="index === model ? 'default' : 'small'"
                  variant="plain"
                  @click="model = index"
                  class="indicator-btn"
                  :data-offset="indicatorOffsets[index]"
                  :data-active="index === model"
                  :style="{
                    position: 'absolute',
                    transform: `translateX(${indicatorOffsets[index]}px) scale(${index === model ? 1.3 : 0.8})`,
                    opacity: index === model ? 1 : Math.max(0.3, 1 - getCircularDistance(index, model, pokedex.result.length) * 0.2),
                    zIndex: index === model ? 10 : 5 - getCircularDistance(index, model, pokedex.result.length),
                    transition: 'all 0.3s ease'
                  }"
                >
                  <!-- メガ進化アイコン -->
                  <img 
                    v-if="item?.forms?.eng?.startsWith('Mega')"
                    src="/img/icon/f01.png"
                    alt="Mega Evolution"
                    :style="`width: ${index === model ? indicatorSizes.activeIcon : indicatorSizes.inactiveIcon}px; height: ${index === model ? indicatorSizes.activeIcon : indicatorSizes.inactiveIcon}px;`"
                  />
                  <!-- ダイマックスアイコン -->
                  <img 
                    v-else-if="item?.forms?.eng === 'Gigantamax'"
                    src="/img/icon/f02.png"
                    alt="Gigantamax"
                    :style="`width: ${index === model ? indicatorSizes.activeIcon : indicatorSizes.inactiveIcon}px; height: ${index === model ? indicatorSizes.activeIcon : indicatorSizes.inactiveIcon}px;`"
                  />
                  <!-- ステラ/テラスタルアイコン -->
                  <img 
                    v-else-if="item?.forms?.eng === 'Stellar Form'"
                    src="/img/icon/f03.png"
                    alt="Stellar/Terastal Form"
                    :style="`width: ${index === model ? indicatorSizes.activeIcon : indicatorSizes.inactiveIcon}px; height: ${index === model ? indicatorSizes.activeIcon : indicatorSizes.inactiveIcon}px;`"
                  />
                  <!-- アンノーン用アルファベット表示 -->
                  <span 
                    v-else-if="item?.src && String(item.src).includes('0201')"
                    :style="`
                      font-size: ${index === model ? indicatorSizes.activeFontSize : indicatorSizes.inactiveFontSize}px;
                      font-weight: bold;
                      color: ${index === model ? '#1976d2' : '#666'};
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      width: ${index === model ? indicatorSizes.activeAlphabet : indicatorSizes.inactiveAlphabet}px;
                      height: ${index === model ? indicatorSizes.activeAlphabet : indicatorSizes.inactiveAlphabet}px;
                      border-radius: 50%;
                      background-color: ${index === model ? '#e3f2fd' : 'transparent'};
                      border: ${index === model ? '2px solid #1976d2' : '1px solid #ccc'};
                    `"
                  >
                    {{ getAlphabetSymbol(item) }}
                  </span>
                  <!-- 通常のドット -->
                  <v-icon 
                    v-else
                    :color="index === model ? 'primary' : 'grey'"
                    :size="index === model ? 'large' : 'default'"
                  >
                    {{ index === model ? 'mdi-circle' : 'mdi-circle-outline' }}
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </div>
          
          <!-- 次へボタン -->
          <v-btn
            icon
            size="large"
            variant="outlined"
            @click="nextModel()"
            style="flex-shrink: 0;"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
      <PokedexVersionDescription
        :existsPokedex="(pokedex.result.length && existsPokedex[String(pokedex.result[Number(model)]?.id)]) ? existsPokedex[String(pokedex.result[Number(model)]?.id)] : {}"
        :getDescriptionLines="(area: string) => getDescriptionLines(area, String(pokedex.result[Number(model)]?.id))"
        :openVersionDialog="openVersionDialog"
        :globalDescriptionMap="getGlobalDescriptionPayload(pokedex.result.length > 0 ? pokedex.result[Number(model)] : undefined)"
        :currentPokemonId="pokedex.result.length > 0 ? String(pokedex.result[Number(model)]?.id ?? '') : ''"
        :globalRegionalNumbers="getGlobalExistsPayload(pokedex.result.length > 0 ? pokedex.result[Number(model)] : undefined)"
        :area="String(route.params.area)"
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
            {{ pokedex.result[Number(model)]?.name?.[currentLanguage] ?? '' }}
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
            >{{ prev.result[0].name[currentLanguage] }}</v-btn>
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
            >{{ next.result[0].name[currentLanguage] }}</v-btn>
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
                  >{{ item.name[currentLanguage] }}</h2>
                  <!-- フォーム名表示 -->
                  <div v-if="pokedex.result.length > 1" class="responsive-text mb-2" style="font-weight: bold;">
                    {{ 
                      pokedex.result[model].gigantamax && pokedex.result[model].form ? `${pokedex.result[model].gigantamax} ${pokedex.result[model].form}` : 
                      pokedex.result[model].region && pokedex.result[model].form ? `${pokedex.result[model].region} ${pokedex.result[model].form}` : 
                      pokedex.result[model].mega_evolution ? pokedex.result[model].mega_evolution : 
                      pokedex.result[model].gigantamax ? pokedex.result[model].gigantamax : 
                      pokedex.result[model].region ? pokedex.result[model].region : 
                      pokedex.result[model].form ? pokedex.result[model].form : 
                      pokedex.result[model].forms?.[currentLanguage] || ''
                    }}
                  </div>
                  <div class="responsive-text">{{ appConfig.translation.classification[currentLanguage] }}　　　　　{{ item.classification[currentLanguage] }}</div>
                  <div class="responsive-text">{{ appConfig.translation.no[currentLanguage] }}　　　No.{{ ('0000' + item.no).slice(-4) }}</div>
                  <NuxtLink class="nuxtlink" :to="{path: `/pokedex/global/${item.globalNo}`}">
                    <div class="responsive-text">{{ appConfig.translation.globalNo[currentLanguage] }}　No.{{ ('0000' + item.globalNo).slice(-4) }}</div>
                  </NuxtLink>
                  <div class="responsive-text">{{ appConfig.translation.height[currentLanguage] }}　　　　　{{ item.height }} m</div>
                  <div class="responsive-text">{{ appConfig.translation.weight[currentLanguage] }}　　　　　{{ item.weight }} kg</div>
                  <!-- ここにitem.type1とitem.type2を表示 -->
                  <div class="d-flex mt-1">
                    <div 
                      v-if="item.type1" 
                      @click="openTypeDialog(item.type1)"
                      style="cursor: pointer;"
                    >
                      <TypeIcon
                        :type="item.type1"
                        :mode="'icon'"
                        class="me-1"
                      />
                    </div>
                    <div 
                      v-if="item.type2" 
                      @click="openTypeDialog(item.type2)"
                      style="cursor: pointer;"
                    >
                      <TypeIcon
                        :type="item.type2"
                        :mode="'icon'"
                      />
                    </div>
                  </div>
                  <div class="responsive-text d-flex align-center">
                    <!-- <span>{{ appConfig.translation.egg[currentLanguage] }}　　</span> -->
                    <div class="d-flex align-center flex-wrap" style="gap: 4px;">
                      <div v-for="(eggGroup, index) in item.egg" :key="index" class="d-flex align-center" style="margin-right: 8px;">
                        <img 
                          v-if="eggMapping[eggGroup]"
                          :src="`/img/icon/e${eggMapping[eggGroup].padStart(2, '0')}.gif`"
                          :alt="eggGroup"
                          style="width: 32px; height: 32px; margin-right: 2px; cursor: pointer;"
                          @click="openEggGroupDialog(eggGroup)"
                        />
                        <!-- <span>{{ eggGroup }}</span> -->
                      </div>
                    </div>
                  </div>
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
          <span style="font-size: 0.9em;">フォーム切り替え</span>
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
      <!-- <PokedexVersionDescription
        :existsPokedex="(pokedex.result.length && existsPokedex[String(pokedex.result[Number(model)]?.id)]) ? existsPokedex[String(pokedex.result[Number(model)]?.id)] : {}"
        :getDescriptionLines="(area: string) => getDescriptionLines(area, String(pokedex.result[Number(model)]?.id))"
        :openVersionDialog="openVersionDialog"
      /> -->
      <AdSenseCard 
      slot-type="banner"
      :width="728"
      :height="90"
      label-type="sponsored"
      variant="outlined"
      color="surface"
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
<v-dialog v-model="isEggGroupDialogVisible" max-width="400">
  <v-card v-if="selectedEggGroup">
    <v-card-title class="text-h5">
      {{ currentLanguage === 'jpn' ? 'タマゴグループ' : 'Egg Group' }}
    </v-card-title>
    <v-card-text>
      <p style="font-size: 1.2em;">
        {{ currentLanguage === 'jpn' ? selectedEggGroup.jpn : selectedEggGroup.eng }}
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="isEggGroupDialogVisible = false">{{ currentLanguage === 'jpn' ? '閉じる' : 'Close' }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
<v-dialog v-model="isTypeDialogVisible" max-width="400">
  <v-card v-if="selectedType">
    <v-card-title class="text-h5">
      {{ currentLanguage === 'jpn' ? 'タイプ' : 'Type' }}
    </v-card-title>
    <v-card-text>
      <p style="font-size: 1.2em;">
        {{ currentLanguage === 'jpn' ? selectedType.jpn : selectedType.eng }}
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="isTypeDialogVisible = false">{{ currentLanguage === 'jpn' ? '閉じる' : 'Close' }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed, inject } from 'vue'
import { useDisplay } from 'vuetify'
import type { RegionPokedexKey } from '~~/types/region'

const isVersionDialogVisible = ref(false)
const selectedVersionInfo = ref<any>(null)
const isEggGroupDialogVisible = ref(false)
const selectedEggGroup = ref<{ jpn: string; eng: string } | null>(null)
const isTypeDialogVisible = ref(false)
const selectedType = ref<{ jpn: string; eng: string } | null>(null)

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

// タマゴグループダイアログを開く
const openEggGroupDialog = (eggGroup: string) => {
  selectedEggGroup.value = eggGroupNames[eggGroup] || { jpn: eggGroup, eng: eggGroup }
  isEggGroupDialogVisible.value = true
}

// タイプダイアログを開く
const openTypeDialog = (type: string) => {
  const typeInfo = appConfig.type[type as keyof typeof appConfig.type]
  if (typeInfo) {
    selectedType.value = { jpn: typeInfo.jpn, eng: typeInfo.eng }
    isTypeDialogVisible.value = true
  }
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
  forms: {
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
  egg: string[];
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

const eggMapping: Record<string, string> = {
  '植物': '0',
  '虫': '1',
  '飛行': '2',
  '人型': '3',
  '怪獣': '4',
  '妖精': '5',
  '鉱物': '7',
  '陸上': '8',
  '不定形': '9',
  '水中１': '10',
  '水中３': '12',
  'タマゴ未発見': '14'
}

const eggGroupNames: Record<string, { jpn: string; eng: string }> = {
  '植物': { jpn: '植物', eng: 'Grass' },
  '虫': { jpn: '虫', eng: 'Bug' },
  '飛行': { jpn: '飛行', eng: 'Flying' },
  '人型': { jpn: '人型', eng: 'Human-Like' },
  '怪獣': { jpn: '怪獣', eng: 'Monster' },
  '妖精': { jpn: '妖精', eng: 'Fairy' },
  '鉱物': { jpn: '鉱物', eng: 'Mineral' },
  '陸上': { jpn: '陸上', eng: 'Field' },
  '不定形': { jpn: '不定形', eng: 'Amorphous' },
  '水中１': { jpn: '水中１', eng: 'Water 1' },
  '水中３': { jpn: '水中３', eng: 'Water 3' },
  'タマゴ未発見': { jpn: 'タマゴ未発見', eng: 'Undiscovered' }
}

// 設定管理composableを使用
const { settings } = useSettings()
const currentLanguage = computed(() => (settings.value?.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng')

// 画面サイズ検出（レスポンシブ対応）
const { smAndDown, xs } = useDisplay()

// インジケーターサイズのレスポンシブ設定
const indicatorSizes = computed(() => ({
  activeIcon: xs.value ? 40 : smAndDown.value ? 48 : 56,
  inactiveIcon: xs.value ? 24 : smAndDown.value ? 28 : 32,
  activeAlphabet: xs.value ? 32 : smAndDown.value ? 36 : 40,
  inactiveAlphabet: xs.value ? 20 : smAndDown.value ? 24 : 28,
  activeFontSize: xs.value ? 18 : smAndDown.value ? 21 : 24,
  inactiveFontSize: xs.value ? 12 : smAndDown.value ? 14 : 16,
  containerMargin: xs.value ? 8 : smAndDown.value ? 16 : 24,
  baseOffset: xs.value ? 30 : smAndDown.value ? 40 : 50,
}))

// 各インジケーターのオフセット値を計算するcomputed（modelの変更を確実に追跡）
const indicatorOffsets = computed(() => {
  const baseOffset = indicatorSizes.value.baseOffset
  const total = pokedex.result.length
  const currentModel = model.value
  
  return pokedex.result.map((_, index) => {
    if (total <= 1) return 0
    
    const directDistance = index - currentModel
    const absDirectDistance = Math.abs(directDistance)
    const circularDistance = total - absDirectDistance
    
    if (absDirectDistance <= circularDistance) {
      return directDistance * baseOffset
    } else {
      if (directDistance > 0) {
        return -(circularDistance) * baseOffset
      } else {
        return circularDistance * baseOffset
      }
    }
  })
})

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
      forms: { jpn: '', eng: '' },
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
      src: '/img/pokedex/0000.png',
      egg: []
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
        forms: { jpn: '', eng: '' },
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
        src: '/img/pokedex/0000.png',
        egg: []
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
        forms: { jpn: '', eng: '' },
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
        src: '/img/pokedex/0000.png',
        egg: []
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
      forms: { jpn: '', eng: '' },
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
      src: '/img/pokedex/0000.png',
      egg: []
    }
    return { query: { id: String(id), area: String(area), mode: 'details' }, result: [placeholder] } as PokedexResponse
  }
}

const fetchGlobalExistsRegionalNumbers = async (pokemon: PokemonStatus) => {
  if (process.server) {
    return
  }

  try {
    const baseUrl = process.server ? config.public.baseUrl || 'http://localhost:3001' : ''
    const candidateKeys = buildPokemonIdCandidates(pokemon)
    const normalizedGlobalNo = normalizeGlobalNo(pokemon.globalNo ?? pokemon.id ?? '')
    const hasExistingData = candidateKeys.some((candidate) => {
      const key = normalizeIdCandidate(candidate)
      return key && globalExistsRegionalNumbers[key]
    }) || (normalizedGlobalNo && globalExistsRegionalNumbers[normalizedGlobalNo])

    if (hasExistingData) {
      return
    }

    const globalNo = normalizedGlobalNo
    if (!globalNo) {
      console.warn(`[fetchGlobalExistsRegionalNumbers] Cannot determine globalNo for pokemon id=${pokemon.id}`)
      return
    }

    const apiUrl = `${baseUrl}/api/pokedex/pokedex.php?region=global&no=${globalNo}&mode=exists`
    console.log(`[fetchGlobalExistsRegionalNumbers] Fetching from: ${apiUrl}`)

    const data = await fetchWithRetry<GlobalExistsResponse>(
      apiUrl,
      { timeoutMs: 8000, retries: 2 }
    )

    console.log(`[fetchGlobalExistsRegionalNumbers] API Response for globalNo ${globalNo}:`, JSON.stringify(data, null, 2))

    if (!data || !data.success || !data.result || typeof data.result !== 'object') {
      console.warn(`[fetchGlobalExistsRegionalNumbers] Invalid data for globalNo ${globalNo}`, data)
      return
    }

    const storeRegionalMap = (key: string | null | undefined, map: Record<string, number>) => {
      const normalizedKey = normalizeIdCandidate(key ?? '')
      if (!normalizedKey) {
        return
      }
      globalExistsRegionalNumbers[normalizedKey] = { ...map }
    }

    for (const [formId, regionalMap] of Object.entries(data.result)) {
      if (regionalMap && typeof regionalMap === 'object') {
        storeRegionalMap(formId, regionalMap)
      }
    }

    for (const candidate of candidateKeys) {
      const normalized = normalizeIdCandidate(candidate)
      if (normalized && data.result[normalized]) {
        storeRegionalMap(normalized, data.result[normalized])
      }
    }

    if (!globalExistsRegionalNumbers[globalNo]) {
      const fallbackKey = normalizeIdCandidate(pokemon.id)
      const fallback = (fallbackKey && data.result[fallbackKey]) || Object.values(data.result)[0]
      if (fallback && typeof fallback === 'object') {
        storeRegionalMap(globalNo, fallback)
      }
    }
  } catch (error) {
    console.error('[fetchGlobalExistsRegionalNumbers] error:', error)
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
  const apiUrl = `${baseUrl}/api/pokedex/type.php?mode=type&type1=${type1}&type2=${type2}`
  console.log(`[fetchType] Fetching from: ${apiUrl}`)
  try {
    const data = await fetchWithRetry(
      apiUrl,
      { timeoutMs: 7000, retries: 2 }
    )
    console.log(`[fetchType] API Response for type1=${type1}, type2=${type2}:`, JSON.stringify(data, null, 2))
    return data
  } catch (error) {
    console.error('[Main] fetchType error:', error)
    return null
  }
}

const fetchExists = async (pokeId: number | string) => {
  for (const item of appConfig.regionPokedexOrder) {
    if (item === 'global') continue
    const baseUrl = process.server ? config.public.baseUrl || 'http://localhost:3001' : ''
    const apiUrl = `${baseUrl}/api/pokedex/pokedex.php?mode=exists&region=${item}&id=${pokeId}`
    console.log(`[fetchExists] Fetching from: ${apiUrl}`)
    try {
      const data = await fetchWithRetry(
        apiUrl,
        { timeoutMs: 7000, retries: 2 }
      )
      console.log(`[fetchExists] API Response for region=${item}, pokeId=${pokeId}:`, JSON.stringify(data, null, 2))
      // pokeId ごとに area データを格納
      if (!existsPokedex[pokeId]) {
        existsPokedex[pokeId] = {}
      }
      existsPokedex[pokeId][item] = {
        query: { id: String(pokeId), region: item, mode: 'exists' },
        result: data?.result ?? -1
      }
    } catch (error) {
      console.log(`[fetchExists] Error for region=${item}, pokeId=${pokeId}:`, error)
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
    const apiUrl = `${baseUrl}/api/pokedex/pokedex.php?mode=description&id=${pokeId}&language=${settings.value?.language ?? 'jpn'}`
    console.log(`[fetchDescription] Fetching from: ${apiUrl}`)
    const data = await fetchWithRetry(
      apiUrl,
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
    console.log(`[fetchDescription] Storing ${data.data.length} rows with key: ${String(pokeId)}`)
    // descriptionRows にポケモンIDごとにデータを設定
    descriptionRows[String(pokeId)] = [...data.data]
    console.log(`[fetchDescription] Current descriptionRows keys:`, Object.keys(descriptionRows))
    
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

// Global用の新しいdescription_map API取得関数
interface GlobalDescriptionMapResponse {
  success: boolean;
  data?: Record<string, any>;
  globalNo?: string;
}

interface GlobalExistsResponse {
  success: boolean;
  result?: Record<string, Record<string, number>>;
}

const normalizeIdCandidate = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return ''
  }
  return String(value).trim()
}

const normalizeDigitsOnly = (value: string): string => {
  return value.replace(/\D/g, '')
}

const stripLeadingZeros = (value: string): string => {
  if (!value) {
    return ''
  }
  const stripped = value.replace(/^0+/, '')
  return stripped.length > 0 ? stripped : (value ? '0' : '')
}

const matchesGroupKey = (rawKey: string, target: string): boolean => {
  if (!target) {
    return false
  }

  const keyLower = rawKey.toLowerCase()
  const targetLower = target.toLowerCase()
  if (keyLower === targetLower) {
    return true
  }
  if (targetLower.startsWith(keyLower) || keyLower.startsWith(targetLower)) {
    return true
  }

  const keyDigits = normalizeDigitsOnly(rawKey)
  const targetDigits = normalizeDigitsOnly(target)
  if (keyDigits && targetDigits) {
    if (keyDigits === targetDigits) {
      return true
    }
    const keyTrimmed = stripLeadingZeros(keyDigits)
    const targetTrimmed = stripLeadingZeros(targetDigits)
    if (keyTrimmed && targetTrimmed && keyTrimmed === targetTrimmed) {
      return true
    }
    if (targetTrimmed.startsWith(keyTrimmed) || keyTrimmed.startsWith(targetTrimmed)) {
      return true
    }
  }

  return false
}

const isGlobalGroupEntry = (value: unknown): value is Record<string, any> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }
  const record = value as Record<string, any>
  return 'common' in record || 'version_names' in record
}

const isGlobalGroupContainer = (node: unknown): node is Record<string, any> => {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    return false
  }
  return Object.values(node as Record<string, any>).some(isGlobalGroupEntry)
}

const findGroupContainerForTarget = (node: unknown, target: string, depth = 0): Record<string, any> | null => {
  if (depth > 8) {
    return null
  }

  if (!node) {
    return null
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findGroupContainerForTarget(item, target, depth + 1)
      if (found) {
        return found
      }
    }
    return null
  }

  if (typeof node !== 'object') {
    return null
  }

  if (isGlobalGroupContainer(node)) {
    return node as Record<string, any>
  }

  const entries = Object.entries(node as Record<string, any>)
  const prioritized = target
    ? entries.filter(([key]) => matchesGroupKey(key, target))
    : entries

  for (const [, value] of prioritized) {
    const found = findGroupContainerForTarget(value, target, depth + 1)
    if (found) {
      return found
    }
  }

  if (target) {
    for (const [key, value] of entries) {
      if (matchesGroupKey(key, target)) {
        continue
      }
      const found = findGroupContainerForTarget(value, target, depth + 1)
      if (found) {
        return found
      }
    }
  }

  return null
}

const tryResolveGroupContainer = (root: unknown, targets: string[]): Record<string, any> | null => {
  if (!root) {
    return null
  }

  for (const target of targets) {
    const found = findGroupContainerForTarget(root, target)
    if (found) {
      return found
    }
  }

  return findGroupContainerForTarget(root, '')
}

const buildPokemonIdCandidates = (pokemon: PokemonStatus): string[] => {
  const set = new Set<string>()

  const addCandidate = (value: string | number | null | undefined) => {
    const raw = normalizeIdCandidate(value)
    if (!raw) {
      return
    }
    if (!set.has(raw)) {
      set.add(raw)
    }

    const digits = normalizeDigitsOnly(raw)
    if (digits && !set.has(digits)) {
      set.add(digits)
    }

    const trimmed = stripLeadingZeros(digits)
    if (trimmed && !set.has(trimmed)) {
      set.add(trimmed)
    }

    if (raw.includes('_')) {
      const [head] = raw.split('_')
      if (head && !set.has(head)) {
        addCandidate(head)
      }
    }
  }

  addCandidate(pokemon.id)
  addCandidate(pokemon.globalNo)
  addCandidate(normalizeGlobalNo(pokemon.globalNo ?? pokemon.id ?? ''))

  return Array.from(set).filter(Boolean)
}

const normalizeGlobalNo = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return ''
  }
  const raw = String(value).trim()
  if (!raw) {
    return ''
  }
  if (raw.includes('_')) {
    const [head] = raw.split('_')
    if (!head) {
      return ''
    }
    return head.padStart(4, '0')
  }
  return raw.padStart(4, '0')
}

const fetchGlobalDescriptionMap = async (pokeId: number | string) => {
  if (process.server) {
    console.log(`[fetchGlobalDescriptionMap] SSR mode - skipping for ${pokeId}`)
    return { result: {} }
  }

  try {
    const baseUrl = process.server ? config.public.baseUrl || 'http://localhost:3001' : ''
    const normalizedGlobalNo = normalizeGlobalNo(pokeId)
    if (!normalizedGlobalNo) {
      console.warn(`[fetchGlobalDescriptionMap] Cannot determine globalNo for pokeId ${pokeId}`)
      return { result: {} }
    }
    const apiUrl = `${baseUrl}/api/pokedex/pokedex.php?region=global&no=${normalizedGlobalNo}&mode=description_map`
    console.log(`[fetchGlobalDescriptionMap] Fetching from: ${apiUrl}`)

    const data = await fetchWithRetry<GlobalDescriptionMapResponse>(
      apiUrl,
      { timeoutMs: 8000, retries: 2 }
    )

    console.log(`[fetchGlobalDescriptionMap] API Response for pokeId ${pokeId}:`, JSON.stringify(data, null, 2))

    if (!data || !data.success || !data.data) {
      console.warn(`[fetchGlobalDescriptionMap] Invalid data format for pokeId ${pokeId}`, data)
      globalDescriptionMap[normalizedGlobalNo] = {}
      return { result: {} }
    }

    const storageKey = data.globalNo ? normalizeGlobalNo(data.globalNo) : normalizedGlobalNo
    const payload = data.data ?? {}

    globalDescriptionMap[storageKey] = payload
    if (storageKey !== normalizedGlobalNo) {
      globalDescriptionMap[normalizedGlobalNo] = payload
    }
    const originalKey = String(pokeId)
    if (originalKey && !globalDescriptionMap[originalKey]) {
      globalDescriptionMap[originalKey] = payload
    }
    console.log(`[fetchGlobalDescriptionMap] Stored data for globalNo ${storageKey}:`, Object.keys(payload))

    return data
  } catch (error) {
    console.error('[fetchGlobalDescriptionMap] error:', error)
    const normalizedGlobalNo = normalizeGlobalNo(pokeId)
    if (normalizedGlobalNo) {
      globalDescriptionMap[normalizedGlobalNo] = {}
    }
    return { result: {} }
  }
}

// バージョンごとの図鑑説明を保持（グループ版）
const descriptions = reactive<{ [key: string]: string }>({})
// API で取得した行データを保持（ポケモンIDごと、ver 単位）
const descriptionRows = reactive<{ [pokemonId: string]: Array<{ ver: string; version: string; pokedex: string; description: string }> }>({})
// Global用の新しいdescription_map形式のデータを保持
const globalDescriptionMap = reactive<{ [pokemonId: string]: any }>({})
const resolvedGlobalDescriptionMap = reactive<{ [pokemonId: string]: Record<string, any> }>({})
const globalExistsRegionalNumbers = reactive<{ [pokemonId: string]: Record<string, number> }>({})

const getGlobalDescriptionPayload = (pokemon?: PokemonStatus | null): Record<string, any> => {
  if (!pokemon) {
    return {}
  }

  const idKey = normalizeIdCandidate(pokemon.id)
  if (idKey && resolvedGlobalDescriptionMap[idKey]) {
    return resolvedGlobalDescriptionMap[idKey]
  }

  const idCandidates = buildPokemonIdCandidates(pokemon)
  if (!idCandidates.length) {
    return {}
  }

  const datasetList: Record<string, any>[] = []
  const seen = new Set<Record<string, any>>()

  const pushDataset = (candidate: string) => {
    if (!candidate) {
      return
    }

    const direct = globalDescriptionMap[candidate]
    if (direct && typeof direct === 'object' && !seen.has(direct)) {
      datasetList.push(direct)
      seen.add(direct)
    }

    const normalized = normalizeGlobalNo(candidate)
    if (normalized) {
      const normalizedDataset = globalDescriptionMap[normalized]
      if (normalizedDataset && typeof normalizedDataset === 'object' && !seen.has(normalizedDataset)) {
        datasetList.push(normalizedDataset)
        seen.add(normalizedDataset)
      }
    }
  }

  for (const candidate of idCandidates) {
    pushDataset(candidate)
  }

  if (!datasetList.length) {
    for (const value of Object.values(globalDescriptionMap)) {
      if (value && typeof value === 'object' && !seen.has(value as Record<string, any>)) {
        datasetList.push(value as Record<string, any>)
        seen.add(value as Record<string, any>)
      }
    }
  }

  for (const dataset of datasetList) {
    const container = tryResolveGroupContainer(dataset, idCandidates)
    if (container && Object.keys(container).length > 0) {
      for (const candidate of idCandidates) {
        const key = normalizeIdCandidate(candidate)
        if (key && !resolvedGlobalDescriptionMap[key]) {
          resolvedGlobalDescriptionMap[key] = container
        }
      }
      if (idKey && !resolvedGlobalDescriptionMap[idKey]) {
        resolvedGlobalDescriptionMap[idKey] = container
      }
      return container
    }
  }

  for (const candidate of idCandidates) {
    const key = normalizeIdCandidate(candidate)
    if (key && globalDescriptionMap[key]) {
      const fallback = globalDescriptionMap[key]
      if (fallback && typeof fallback === 'object') {
        resolvedGlobalDescriptionMap[key] = fallback
        if (idKey && !resolvedGlobalDescriptionMap[idKey]) {
          resolvedGlobalDescriptionMap[idKey] = fallback
        }
        return fallback
      }
    }
  }

  return {}
}

const getGlobalExistsPayload = (pokemon?: PokemonStatus | null): Record<string, number> => {
  if (!pokemon) {
    return {}
  }

  const candidates = buildPokemonIdCandidates(pokemon)
  for (const candidate of candidates) {
    const key = normalizeIdCandidate(candidate)
    if (key && globalExistsRegionalNumbers[key]) {
      return globalExistsRegionalNumbers[key]
    }
  }

  const normalizedGlobalNo = normalizeGlobalNo(pokemon.globalNo ?? pokemon.id ?? '')
  if (normalizedGlobalNo && globalExistsRegionalNumbers[normalizedGlobalNo]) {
    return globalExistsRegionalNumbers[normalizedGlobalNo]
  }

  return {}
}

const hasGlobalDescriptionData = (candidate: string): boolean => {
  if (!candidate) {
    return false
  }
  if (globalDescriptionMap[candidate]) {
    return true
  }
  const normalized = normalizeGlobalNo(candidate)
  if (normalized && globalDescriptionMap[normalized]) {
    return true
  }
  return false
}

const ensureGlobalDescriptionData = (pokemon?: PokemonStatus) => {
  if (!pokemon) {
    return
  }
  const candidates = buildPokemonIdCandidates(pokemon)
  if (!candidates.length) {
    return
  }

  if (candidates.some(hasGlobalDescriptionData)) {
    return
  }

  const fetchTarget = candidates.find(Boolean)
  if (fetchTarget) {
    fetchGlobalDescriptionMap(fetchTarget)
  }
}

definePageMeta({
  title: "Pokedex-Online"
})
let nameDialog = ref(false)
let model = ref(0)

watch(model, (newIndex) => {
  if (String(route.params.area) !== 'global') {
    return
  }
  const indexNumber = typeof newIndex === 'number' ? newIndex : Number(newIndex)
  const pokemon = pokedex.result?.[indexNumber]
  if (pokemon) {
    ensureGlobalDescriptionData(pokemon)
    fetchGlobalExistsRegionalNumbers(pokemon)
  }
})

// 循環を考慮した距離を計算する関数
const getCircularDistance = (index1: number, index2: number, total: number): number => {
  const directDistance = Math.abs(index1 - index2)
  const circularDistance = total - directDistance
  return Math.min(directDistance, circularDistance)
}

// 循環を考慮したX座標オフセットを計算する関数
const getCircularOffset = (index: number, currentModel: number, total: number, baseOffset: number): number => {
  if (total <= 1) return 0
  
  const directDistance = index - currentModel
  const absDirectDistance = Math.abs(directDistance)
  const circularDistance = total - absDirectDistance
  
  // より短い距離の方向を選択
  if (absDirectDistance <= circularDistance) {
    return directDistance * baseOffset
  } else {
    // 循環の方が短い場合は、反対方向に配置
    if (directDistance > 0) {
      return -(circularDistance) * baseOffset
    } else {
      return circularDistance * baseOffset
    }
  }
}

// 0201ポケモンのフォーム番号からアルファベット/記号を取得する関数
const getAlphabetSymbol = (item: any): string => {
  if (!item?.src) {
    console.log('[getAlphabetSymbol] No src found:', item)
    return ''
  }
  
  const srcPath = String(item.src)
  console.log('[getAlphabetSymbol] Checking srcPath:', srcPath)
  
  // より柔軟なパターンマッチングを試行
  let match = srcPath.match(/0201_[0-9a-f]{8}_\d+_(\d{3})_\d+/)
  if (!match) {
    // 別のパターンも試す
    match = srcPath.match(/0201.*_(\d{3})_/)
  }
  if (!match) {
    console.log('[getAlphabetSymbol] No pattern match found for:', srcPath)
    return ''
  }
  
  const formNumber = parseInt(match[1], 10)
  console.log('[getAlphabetSymbol] Form number:', formNumber)
  
  // 0-25: A-Z, 26: ?, 27: !
  if (formNumber >= 0 && formNumber <= 25) {
    const result = String.fromCharCode(65 + formNumber) // A=65
    console.log('[getAlphabetSymbol] Returning alphabet:', result)
    return result
  } else if (formNumber === 26) {
    console.log('[getAlphabetSymbol] Returning ?')
    return '?'
  } else if (formNumber === 27) {
    console.log('[getAlphabetSymbol] Returning !')
    return '!'
  }
  
  console.log('[getAlphabetSymbol] Form number out of range:', formNumber)
  return ''
}

// IDが0201で始まるかチェックする関数
const is0201Pokemon = (item: any): boolean => {
  if (!item?.src) {
    console.log('[is0201Pokemon] No src found:', item)
    return false
  }
  const srcPath = String(item.src)
  const result = srcPath.includes('0201')
  console.log('[is0201Pokemon] srcPath:', srcPath, 'result:', result)
  return result
}

// 初回マウント時に存在情報を取得
onMounted(() => {
  console.log(`[onMounted] Component mounted, checking initial data...`)
  console.log(`[onMounted] pokedex.result:`, pokedex.result)
  console.log(`[onMounted] pokedex.result.length:`, pokedex.result.length)
  
  // 初期データがある場合は、存在情報と説明文を取得
  if (pokedex.result && pokedex.result.length > 0) {
    console.log(`[onMounted] Initial data found, fetching exists and descriptions...`)
    for (const pokemon of pokedex.result) {
      if (pokemon?.id) {
        console.log(`[onMounted] Fetching exists for ${pokemon.id}`)
        fetchExists(pokemon.id)
        
        // area=globalの場合は新しいAPIを使用
        if (route.params.area === 'global') {
          const targetId = pokemon.globalNo ?? pokemon.id
          console.log(`[onMounted] Fetching global description map for ${targetId}`)
          fetchGlobalDescriptionMap(targetId)
          ensureGlobalDescriptionData(pokemon)
          fetchGlobalExistsRegionalNumbers(pokemon)
        } else {
          console.log(`[onMounted] Fetching description for ${pokemon.id}`)
          fetchDescription(pokemon.id)
        }
        
        // DescriptionView の v-if 条件をデバッグ
        const idStr = String(pokemon.id)
        console.log(`[onMounted] Checking v-if condition for id: ${idStr}`)
        console.log(`[onMounted] descriptionRows[${idStr}]:`, descriptionRows[idStr])
        console.log(`[onMounted] descriptionRows[${idStr}]?.length:`, descriptionRows[idStr]?.length)
      }
    }
  }
})

// modelが変更されたときのアニメーション処理はCSSで自動的に行われる


watch(() => [route.params.area, route.params.id], async () => {
  // ページ遷移時は図鑑存在情報と図鑑説明を再取得
  console.log(`[Watch] Route changed to area: ${route.params.area}, id: ${route.params.id}`)
  
  // モデルをリセット
  model.value = 0
  
  // ポケモンデータを再取得
  if (route.params.id) {
    console.log(`[Watch] Refreshing pokedex data for ${route.params.id}`)
    await refresh()
    
    // ポケモンデータ取得後に、すべてのポケモンに対して存在情報と図鑑説明を再取得
    if (pokedex.result.length > 0) {
      for (const pokemon of pokedex.result) {
        if (pokemon?.id) {
          console.log(`[Watch] Fetching exists for ${pokemon.id}`)
          fetchExists(pokemon.id)
          
          // area=globalの場合は新しいAPIを使用
          if (route.params.area === 'global') {
            const targetId = pokemon.globalNo ?? pokemon.id
            console.log(`[Watch] Fetching global description map for ${targetId}`)
            fetchGlobalDescriptionMap(targetId)
            ensureGlobalDescriptionData(pokemon)
            fetchGlobalExistsRegionalNumbers(pokemon)
          } else {
            console.log(`[Watch] Fetching description for ${pokemon.id}`)
            fetchDescription(pokemon.id)
          }
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
  console.log(`[getDescriptionLines] Called with area: ${area}, pokemonId: ${pokemonId}`)
  console.log(`[getDescriptionLines] Available keys in descriptionRows:`, Object.keys(descriptionRows))
  
  // ポケモンIDが未指定なら空配列を返す（undefined を添字に使わない）
  if (!pokemonId) {
    console.warn(`[getDescriptionLines] No description data for pokemonId: ${pokemonId}`)
    return []
  }
  const key = String(pokemonId)
  if (!descriptionRows[key]) {
    console.warn(`[getDescriptionLines] descriptionRows[${key}] is empty or undefined`)
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
    return descriptionRows[key]
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
  console.log(`[getDescriptionLines] Description data for ${pokemonId}:`, descriptionRows[key])
  console.log(`[getDescriptionLines] Filtering for area: ${area}, gameVersions:`, areaGameVersions, 'areaJpnName:', areaJpnName)
  
  return descriptionRows[key]
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
      
      // 3. _kanjiバージョンの場合は、実際に有効なデータが存在する場合のみ表示
      if (r.ver.includes('_kanji')) {
        // 空値、null、undefined、空文字列、空白文字のみ、「じょうほう なし」を無効と判定
        const isEmptyOrInvalid = (desc: string | null | undefined): boolean => {
          return !desc || 
                 desc.trim() === '' || 
                 desc === 'じょうほう なし' ||
                 desc === 'null' ||
                 desc === 'undefined' ||
                 /^\s*$/.test(desc)
        }
        
        // 該当バージョンのデータが存在し、かつ有効な内容があるかチェック
        const kanjiData = descriptionRows[key].find(row => row.ver === r.ver)
        if (!kanjiData || isEmptyOrInvalid(kanjiData.description)) {
          console.log(`[getDescriptionLines] Kanji version has no valid data: ${r.ver} - data: ${kanjiData?.description}`)
          return false
        }
        
        // 現在処理中のデータr自体も同様にチェック
        if (isEmptyOrInvalid(r.description)) {
          console.log(`[getDescriptionLines] Current row has no valid data: ${r.ver} - data: ${r.description}`)
          return false
        }
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
  console.log(`[getGlobalDescriptionMap] Called with pokemonId: ${pokemonId}`)
  const key = String(pokemonId ?? '')
  console.log(`[getGlobalDescriptionMap] key: ${key}, descriptionRows[key]:`, descriptionRows[key])
  
  if (!key || !descriptionRows[key]) {
    console.warn(`[getGlobalDescriptionMap] No description data for pokemonId: ${pokemonId}`)
    return {}
  }
  const map: Record<string, { jpn: string }> = {}
  const globalJpn = appConfig.regionPokedex.global?.name?.jpn
  console.log(`[getGlobalDescriptionMap] globalJpn: ${globalJpn}`)
  
  for (const r of descriptionRows[key]) {
    console.log(`[getGlobalDescriptionMap] Checking row: ver=${r.ver}, pokedex=${r.pokedex}`)
    if (r.pokedex !== globalJpn) continue
    
    // _kanjiバージョンの場合は、実際に有効なデータが存在する場合のみ追加
    if (r.ver.includes('_kanji')) {
      // 空値、null、undefined、空文字列、空白文字のみ、「じょうほう なし」を無効と判定
      const isEmptyOrInvalid = (desc: string | null | undefined): boolean => {
        return !desc || 
               desc.trim() === '' || 
               desc === 'じょうほう なし' ||
               desc === 'null' ||
               desc === 'undefined' ||
               /^\s*$/.test(desc)
      }
      
      // 有効なデータがあるか詳細なチェック
      if (isEmptyOrInvalid(r.description)) {
        console.log(`[getGlobalDescriptionMap] Kanji version has no valid data: ${r.ver} - data: ${r.description}`)
        continue
      }
      
      // descriptionRows内にも同様のデータがあるか再確認
      const kanjiData = descriptionRows[key].find(row => row.ver === r.ver)
      if (!kanjiData || isEmptyOrInvalid(kanjiData.description)) {
        console.log(`[getGlobalDescriptionMap] Kanji version data not found in descriptionRows: ${r.ver} - data: ${kanjiData?.description}`)
        continue
      }
    }
    
    if (!map[r.ver]) {
      map[r.ver] = { jpn: r.description }
    }
  }
  console.log(`[getGlobalDescriptionMap] Returning map:`, map)
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
watch(() => pokedexData.value, (newData) => {
  console.log(`[Watch pokedexData] Data changed:`, newData)
  if (newData && newData.result && newData.result.length > 0) {
    console.log(`[Watch pokedexData] Updating reactive state with new data:`, newData.result)
    Object.assign(pokedex, newData)
    // 画像パス(src)を最新データに合わせて再設定する
    for (const status of pokedex.result) {
      status.src = `${config.app.baseURL || '/'}img/pokedex/${status.id}.png`
    }
    
    // pokedex データ取得後に、すべてのポケモンに対して存在情報と図鑑説明を再取得
    for (const pokemon of pokedex.result) {
      if (pokemon?.id) {
        console.log(`[Watch pokedexData] Fetching exists for ${pokemon.id}`)
        fetchExists(pokemon.id)
        
        // area=globalの場合は新しいdescription_map形式のAPIを呼び出し
        console.log(`[Watch pokedexData] Area check: ${String(route.params.area)}, pokemon object:`, pokemon)
        if (String(route.params.area) === 'global') {
          console.log('[Watch pokedexData] Area is global, checking globalNo:', pokemon.globalNo)
          const targetId = pokemon.globalNo ?? pokemon.id
          fetchGlobalDescriptionMap(targetId)
          ensureGlobalDescriptionData(pokemon)
          fetchGlobalExistsRegionalNumbers(pokemon)
        } else {
          console.log(`[Watch pokedexData] Fetching description for ${pokemon.id}`)
          fetchDescription(pokemon.id)
        }
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

const breadcrumbs = computed(() => {
  const lang = currentLanguage.value
  const area = route.params.area as string

  const t = appConfig.translation as Record<string, { jpn: string; eng: string }>
  const pokedexTitle = t?.pokedex?.[lang] ?? (lang === 'eng' ? 'Pokédex' : 'ポケモン図鑑')

  const list: { title: string; to?: string; disabled?: boolean }[] = [
    { title: (lang === 'eng' ? 'Home' : 'Home'), to: '/' },
    { title: pokedexTitle, to: '/pokedex' }
  ]

  if (area === 'global') {
    const dispGlobal = (appConfig.regionPokedex.global?.disp as Record<string, string> | undefined)?.[lang]
    list.push({ title: dispGlobal ?? (lang === 'eng' ? 'National Dex' : '全国図鑑'), to: '/pokedex/global' })
  } else {
    const disp = (appConfig.regionPokedex[area as RegionPokedexKey]?.disp as Record<string, string> | undefined)?.[lang]
    list.push({ title: disp ?? area, to: `/pokedex/${area}` })
  }

  const nameLang = pokedex.result[0]?.name?.[lang]
  const nameFallback = pokedex.result[0]?.name?.jpn || pokedex.result[0]?.name?.eng || ''
  const pokemonName = pokedex.result.length > 0 ? (nameLang ?? nameFallback) : ''
  list.push({ title: pokemonName, disabled: true })

  return list
})

// DescriptionViewのv-if条件をデバッグするcomputed
const descriptionViewDebug = computed(() => {
  const area = route.params.area as string
  const result = pokedex.result.map((item, index) => {
    const id = item?.id
    const idStr = String(id)
    const hasId = id != null
    const hasDescriptionRows = !!descriptionRows[idStr]
    const descriptionLength = descriptionRows[idStr]?.length || 0
    const shouldShow = hasId && hasDescriptionRows && descriptionLength > 0
    
    console.log(`[descriptionViewDebug] index: ${index}, id: ${id}, hasId: ${hasId}, hasDescriptionRows: ${hasDescriptionRows}, descriptionLength: ${descriptionLength}, shouldShow: ${shouldShow}`)
    console.log(`[descriptionViewDebug] descriptionRows[${idStr}]:`, descriptionRows[idStr])
    
    return {
      index,
      id,
      hasId,
      hasDescriptionRows,
      descriptionLength,
      shouldShow
    }
  })
  
  console.log(`[descriptionViewDebug] area: ${area}, total items: ${result.length}`)
  return result
})

const metaImage = ref('');
if (pokedex.result.length) {
  metaImage.value = "https://pokedex-online.jp/img/pokedex/" + pokedex.result[0].id + ".png";
}

const metaTitle = computed(() => {
  const lang = currentLanguage.value
  const t = appConfig.translation as Record<string, { jpn: string; eng: string }>
  const pokedexTitle = t?.pokedex?.[lang] ?? (lang === 'eng' ? 'Pokédex' : 'ポケモンずかん')
  if (hasPokedexData.value) {
    const name = pokedex.result[0]?.name?.[lang] ?? pokedex.result[0]?.name?.jpn ?? pokedex.result[0]?.name?.eng ?? ''
    return `${name} - ${pokedexTitle}`
  }
  return pokedexTitle
})

// レイアウト(AppBar)のタイトルを「地域別図鑑名（例: カントー図鑑 / Kanto Pokédex）」に設定
const pageTitleState = inject('pageTitle', { title: 'Pokédex-Online' })
const layoutRegionDexTitle = computed(() => {
  const lang = currentLanguage.value
  const area = route.params.area as string
  const region = appConfig.regionPokedex?.[area as keyof typeof appConfig.regionPokedex] as
    | { disp?: { jpn: string; eng: string } }
    | undefined
  if (region?.disp) {
    const key = (lang === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
    return region.disp[key] ?? (lang === 'eng' ? `${area} Pokédex` : `${area} 図鑑`)
  }
  return lang === 'eng' ? `${area} Pokédex` : `${area} 図鑑`
})
const updateLayoutTitle = () => {
  pageTitleState.title = layoutRegionDexTitle.value
}
onMounted(() => updateLayoutTitle())
watch(() => settings.value?.language, () => updateLayoutTitle())
watch(() => route.params.area, () => updateLayoutTitle())

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
