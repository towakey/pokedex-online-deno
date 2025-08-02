// リージョン図鑑のキー型
export type RegionPokedexKey = 'global' | 'kanto' | 'johto' | 'hoenn' | 'kanto_frlg' | 'sinnoh' | 'johto_hgss' | 
  'unova_bw' | 'unova_b2w2' | 'central_kalos' | 'coast_kalos' | 'mountain_kalos' | 
  'alola_sm' | 'alola_usum' | 'galar' | 'isle_of_armor' | 'crown_tundra' | 
  'hisui' | 'paldea' | 'kitakami' | 'blueberry'

// リージョン図鑑の値の型
export interface RegionPokedexItem {
  disp: string
  name: {
    jpn: string
    eng: string
  }
  gameVersion: string[]
}

export type RegionPokedex = Record<RegionPokedexKey, RegionPokedexItem>
