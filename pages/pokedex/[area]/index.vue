<template>
  <v-container>
    <AppBreadcrumbs :items="breadcrumbs" />
    
    <!-- 検索ボタン -->
    <v-row>
      <v-col>
        <v-btn
          color="primary"
          @click="searchModalOpen = true"
          prepend-icon="mdi-magnify"
          variant="outlined"
          block
        >
          詳細検索
        </v-btn>
      </v-col>
    </v-row>
    
    <!-- 検索モーダル -->
    <v-dialog
      v-model="searchModalOpen"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="text-h5">
          詳細検索
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="searchModalOpen = false"></v-btn>
        </v-card-title>
        
        <v-card-text>
          <v-container>
            <!-- テキスト検索 -->
            <v-row>
              <v-col>
                <v-text-field
                  v-model="searchText"
                  label="図鑑No・名前で検索"
                  variant="outlined"
                  bg-color="white"
                  clearable
                  prepend-inner-icon="mdi-magnify"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <!-- タイプフィルター -->
            <v-row>
              <v-col v-if="area != 'global'">
                <div class="text-subtitle-1 mb-2">タイプで絞り込み</div>
                <div class="d-flex flex-wrap gap-1">
                  <v-btn
                    v-for="type in allTypes"
                    :key="type"
                    :style="{
                      backgroundColor: selectedTypes.includes(type) ? '#dcdcdc' : getTypeColor(type),
                      color: selectedTypes.includes(type) ? 'black' : 'white'
                    }"
                    class="ma-1"
                    variant="elevated"
                    size="small"
                    @click="toggleType(type)"
                  >
                    {{ appConfig.type[type]?.jpn || type }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            
            <!-- 選択されているタイプ表示 -->
            <v-row v-if="selectedTypes.length > 0">
              <v-col>
                <v-chip-group>
                  <v-chip
                    v-for="type in selectedTypes"
                    :key="type"
                    closable
                    color="#dcdcdc"
                    text-color="black"
                    @click:close="toggleType(type)"
                  >
                    {{ appConfig.type[type]?.jpn || type }}
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="searchText = ''; selectedTypes = []"
          >
            クリア
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="searchModalOpen = false"
          >
            完了
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- ポケモンカード一覧 -->
    <v-row>
      <v-col
        cols="12"
        sm="6"
        v-for="pokemon in pokelist"
        :key="pokemon.no"
      >
        <NuxtLink
          :to="generateLink(pokemon)"
          class="nuxtlink"
        >
          <PokemonCard :pokemon="pokemon" :area="area" />
        </NuxtLink>
      </v-col>
    </v-row>
    
    <!-- ローディング表示 -->
    <v-row v-if="pending">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <div class="mt-2">データを読み込んでいます...</div>
      </v-col>
    </v-row>
    
    <!-- エラー表示 -->
    <v-row v-if="error">
      <v-col>
        <v-alert type="error" variant="outlined">
          データの取得に失敗しました: {{ error }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import PokemonCard from '~/components/PokemonCard.vue'

// Nuxt 4では以下は自動インポートされるため、importは不要
// useRoute, useAppConfig, useSeoMeta, computed, onMounted, inject

const appConfig = useAppConfig();
const route = useRoute();
const area = route.params.area as string;

// ポケモンデータの型を定義
interface Pokemon {
  no: string;
  id?: string;  // グローバルエリアで使用
  globalNo: string;  // 画像表示用のグローバル図鑑No
  name: string | { jpn: string };  // グローバルエリアではstring、その他ではオブジェクト
  status: Array<{
    weight: string;
    height: string;
    name?: { jpn: string };  // 地域別エリアで使用
    type1?: string;
    type2?: string;
    form?: string | string[];
    region?: string | string[];
    mega_evolution?: string | string[];
    gigantamax?: string | string[];
  }>;
}

interface RawPokedexResponse {
  success: boolean;
  data: Record<string, any[]>;
  region: string | null;
}

// レイアウトから提供されたページタイトル状態を取得
const pageTitleState = inject('pageTitle', { title: 'ポケモン図鑑' });
const pageTitle = computed(() => pageTitleState.title);

// APIからデータを取得
const { data: pokedex, pending, error } = await useAsyncData(
  `pokedex-index-${area}`,
  async () => {
    try {
      let res: RawPokedexResponse;
      
      // APIからデータを取得
      res = await $fetch<RawPokedexResponse>(
        `http://localhost/pokedex/pokedex.php`,
        { query: { region: area } }
      );
      
      if (!res || !res.success) {
        console.error(`Data request failed for area: ${area}`);
        throw new Error(`Failed to fetch pokedex data for area: ${area}`);
      }

      // デバッグログ
      console.log(`[DEBUG] API Response for ${area}:`, res);
      console.log(`[DEBUG] Data keys count:`, Object.keys(res.data).length);

      const pokedexArray: Pokemon[] = [];
      Object.values(res.data).forEach((statusArray: any) => {
        if (!Array.isArray(statusArray) || statusArray.length === 0) return;
        statusArray.forEach((s: any) => {
          const statusObj = {
            weight: s.weight,
            height: s.height,
            name: s.name ? { jpn: s.name.jpn } : undefined,
            type1: s.type1,
            type2: s.type2,
            form: s.form,
            region: s.region,
            mega_evolution: s.mega_evolution,
            gigantamax: s.gigantamax
          };
          const pokemonName = area === 'global' ? (s.name?.jpn ?? '') : s.name;
          const pokemon = {
            no: s.no,
            id: s.id,
            globalNo: s.globalNo,
            name: pokemonName,
            status: [statusObj]
          };
          
          pokedexArray.push(pokemon);
        });
      });
      
      // 図鑑番号順に並べ替え
      pokedexArray.sort((a, b) => Number(a.no) - Number(b.no));

      // 図鑑番号が空の場合は globalNo を代替として設定
      if (area !== 'global') {
        pokedexArray.forEach(pokemon => {
          if (!pokemon.no || pokemon.no === '') {
            pokemon.no = String(pokemon.globalNo ?? '');
          }
        });
      }
      
      console.log(`[DEBUG] Final pokedexArray for ${area}:`, {
        length: pokedexArray.length,
        first3: pokedexArray.slice(0, 3)
      });
      
      return pokedexArray;
    } catch (error) {
      console.error(`Failed to fetch pokedex data for area ${area}:`, error);
      throw error;
    }
  },
  { default: () => [] }
);

// コンポーネントマウント後にappConfigを取得してページタイトル更新
onMounted(async () => {
  try {
    if (appConfig.regionPokedex && appConfig.regionPokedex[area as keyof typeof appConfig.regionPokedex]) {
      pageTitleState.title = appConfig.regionPokedex[area as keyof typeof appConfig.regionPokedex].name.jpn;
    }
  } catch (error) {
    console.error('AppConfig取得エラー:', error);
    // フォールバック値を使用
    pageTitleState.title = `${area} 図鑑`;
  }
});

// 検索モーダル関連の状態
const searchModalOpen = ref(false);
const searchText = ref('');
const selectedTypes = ref<string[]>([]);

// 全ポケモンタイプを取得
const allTypes = Object.keys(appConfig.type || {});

// リンク用ハッシュ生成
function getFirstString(val: string | string[] | undefined): string {
  if (typeof val === 'string') return val;
  if (Array.isArray(val) && val.length > 0) return val[0];
  return '';
}

function getHashForPokemon(pokemon: Pokemon): string {
  if (!pokemon.status || pokemon.status.length === 0) return '';
  const status = pokemon.status[0];
  const parts = [];
  if (status.form && status.form !== '') parts.push(getFirstString(status.form));
  if (status.region && status.region !== '') parts.push(getFirstString(status.region));
  if (status.mega_evolution && status.mega_evolution !== '') parts.push(getFirstString(status.mega_evolution));
  if (status.gigantamax && status.gigantamax !== '') parts.push(getFirstString(status.gigantamax));
  return parts.length > 0 ? '#' + parts.join('-') : '';
}

// NuxtLink の生成
function generateLink(pokemon: Pokemon): string {
  const hash = getHashForPokemon(pokemon);
  return `/pokedex/${area}/${pokemon.globalNo}${hash}`;
}

// タイプ選択の切り替え
function toggleType(type: string) {
  const index = selectedTypes.value.indexOf(type);
  if (index > -1) {
    selectedTypes.value.splice(index, 1);
  } else {
    selectedTypes.value.push(type);
  }
}

// タイプの色の定義
const typeColors: Record<string, string> = {
  'ノーマル': '#dcdcdc',
  'ほのお': '#ff0000',
  'みず': '#0000ff',
  'でんき': '#f5c842',
  'くさ': '#32cd32',
  'こおり': '#87ceeb',
  'かくとう': '#8b4513',
  'どく': '#9932cc',
  'じめん': '#daa520',
  'ひこう': '#87ceeb',
  'エスパー': '#ff1493',
  'むし': '#9acd32',
  'いわ': '#8b4513',
  'ゴースト': '#6a5acd',
  'ドラゴン': '#4169e1',
  'あく': '#4b0082',
  'はがね': '#b0c4de',
  'フェアリー': '#ee82ee'
};

// タイプに応じた色を取得する関数
function getTypeColor(type: string): string {
  return typeColors[type] || '#dcdcdc';
}

// フィルタリングされたポケモンリスト
const pokelist = computed(() => {
  if (!pokedex.value) return [];
  let filteredList = pokedex.value;
  
  // テキスト検索でフィルタリング
  if (searchText.value) {
    const searchRegex = new RegExp(searchText.value, 'i');
    filteredList = filteredList.filter(pokemon => {
      // 図鑑番号での検索
      if (searchRegex.test(String(pokemon.no))) return true;
      
      // 名前での検索
      if (area === 'global') {
        const name = typeof pokemon.name === 'string' ? pokemon.name : pokemon.name?.jpn;
        return searchRegex.test(String(name));
      } else {
        return pokemon.status.some(status => 
          status.name && searchRegex.test(String(status.name.jpn)));
      }
    });
  }
  
  // タイプでフィルタリング
  if (selectedTypes.value.length > 0) {
    filteredList = filteredList.filter(pokemon => {
      return pokemon.status.some(status => {
        return selectedTypes.value.some(selectedType => 
          status.type1 === selectedType || status.type2 === selectedType
        );
      });
    });
  }
  
  return filteredList;
});

// SEOメタデータを設定
useSeoMeta({
  title: pageTitle
});

// ページメタデータを設定（静的）
definePageMeta({
  layout: 'default'
});

const breadcrumbs = computed(() => [
  { title: 'Home', disabled: false, href: '/' },
  { title: 'ポケモン図鑑', disabled: false, href: '/pokedex' },
  { title: pageTitle.value, disabled: true, href: '/pokedex/' + area },
]);

</script>

<style scoped>
.nuxtlink {
  text-decoration: none;
  color: inherit;
}
</style>
