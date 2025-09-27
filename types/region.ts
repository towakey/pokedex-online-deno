// リージョン図鑑のキーの配列
export const regionPokedexKeys = [
  'global', 'kanto', 'johto', 'hoenn', 'kanto_frlg', 'sinnoh', 'johto_hgss',
  'unova_bw', 'unova_b2w2', 'central_kalos', 'coast_kalos', 'mountain_kalos',
  'alola_sm', 'alola_usum', 'galar', 'isle_of_armor', 'crown_tundra',
  'hisui', 'paldea', 'kitakami', 'blueberry', 'newpokemonsnap'
] as const;

// リージョン図鑑のキー型
export type RegionPokedexKey = typeof regionPokedexKeys[number];

// リージョン図鑑の値の型
export interface RegionPokedexItem {
  disp: {
    jpn: string
    eng: string
  }
  name: {
    jpn: string
    eng: string
  }
  gameVersion: string[]
}

export type RegionPokedex = Record<RegionPokedexKey, RegionPokedexItem>
