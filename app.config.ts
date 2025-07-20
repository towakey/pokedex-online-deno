// 型をインポート
import type { RegionPokedexKey, RegionPokedex, RegionPokedexItem } from './types/region'

// アプリケーション全体で使用する設定値
export default defineAppConfig({
  // サイト基本情報
  site: {
    name: 'Pokédex-Online',
    description: 'Nuxt.js で作成されたポケモン図鑑アプリケーション',
  },

  // リージョン図鑑データ
  regionPokedex: {
    kanto: {
      name: {
        jpn: 'カントー図鑑',
        eng: 'kanto'
      }
    },
    johto: {
      name: {
        jpn: 'ジョウト図鑑',
        eng: 'johto'
      }
    },
    hoenn: {
      name: {
        jpn: 'ホウエン図鑑',
        eng: 'hoenn'
      }
    },
    kanto_frlg: {
      name: {
        jpn: 'カントー図鑑(ファイアレッド・リーフグリーン)',
        eng: 'kanto(firered / leafgreen)'
      }
    },
    sinnoh: {
      name: {
        jpn: 'シンオウ図鑑',
        eng: 'sinnoh'
      }
    },
    johto_hgss: {
      name: {
        jpn: 'ジョウト図鑑(ハートゴールド・ソウルシルバー)',
        eng: 'johto(heartgold / soulsilver)'
      }
    },
    unova_bw: {
      name: {
        jpn: 'イッシュ図鑑(ブラック・ホワイト)',
        eng: 'unova(black / white)'
      }
    },
    unova_b2w2: {
      name: {
        jpn: 'イッシュ図鑑(ブラック2・ホワイト2)',
        eng: 'unova(black2 / white2)'
      }
    },
    central_kalos: {
      name: {
        jpn: 'セントラルカロス図鑑',
        eng: 'central_kalos'
      }
    },
    coast_kalos: {
      name: {
        jpn: 'コーストカロス図鑑',
        eng: 'coast_kalos'
      }
    },
    mountain_kalos: {
      name: {
        jpn: 'マウンテンカロス図鑑',
        eng: 'mountain_kalos'
      }
    },
    alola_sm: {
      name: {
        jpn: 'アローラ図鑑(サン・ムーン)',
        eng: 'alola(sun / moon)'
      }
    },
    alola_usum: {
      name: {
        jpn: 'アローラ図鑑(ウルトラサン・ウルトラムーン)',
        eng: 'alola(ultra_sun / ultra_moon)'
      }
    },
    galar: {
      name: {
        jpn: 'ガラル図鑑',
        eng: 'galar'
      }
    },
    isle_of_armor: {
      name: {
        jpn: 'ヨロイ島図鑑',
        eng: 'isle_of_armor'
      }
    },
    crown_tundra: {
      name: {
        jpn: 'カンムリ雪原図鑑',
        eng: 'crown_tundra'
      }
    },
    hisui: {
      name: {
        jpn: 'ヒスイ図鑑',
        eng: 'hisui'
      }
    },
    paldea: {
      name: {
        jpn: 'パルデア図鑑',
        eng: 'paldea'
      }
    },
    kitakami: {
      name: {
        jpn: 'キタカミ図鑑',
        eng: 'kitakami'
      }
    },
    blueberry: {
      name: {
        jpn: 'ブルーベリー図鑑',
        eng: 'blueberry'
      }
    }
  } satisfies RegionPokedex,

  // リージョン図鑑の順序
  regionPokedexOrder: [
    'kanto',
    'johto',
    'hoenn',
    'kanto_frlg',
    'sinnoh',
    'johto_hgss',
    'unova_bw',
    'unova_b2w2',
    'central_kalos',
    'coast_kalos',
    'mountain_kalos',
    'alola_sm',
    'alola_usum',
    'galar',
    'isle_of_armor',
    'crown_tundra',
    'hisui',
    'paldea',
    'kitakami',
    'blueberry'
  ] as const satisfies RegionPokedexKey[],

  type: {
    normal: { jpn: 'ノーマル', eng: 'normal' },
    fire: { jpn: 'ほのお', eng: 'fire' },
    water: { jpn: 'みず', eng: 'water' },
    electric: { jpn: 'でんき', eng: 'electric' },
    grass: { jpn: 'くさ', eng: 'grass' },
    ice: { jpn: 'こおり', eng: 'ice' },
    fighting: { jpn: 'かくとう', eng: 'fighting' },
    poison: { jpn: 'どく', eng: 'poison' },
    ground: { jpn: 'じめん', eng: 'ground' },
    flying: { jpn: 'ひこう', eng: 'flying' },
    psychic: { jpn: 'エスパー', eng: 'psychic' },
    bug: { jpn: 'むし', eng: 'bug' },
    rock: { jpn: 'いわ', eng: 'rock' },
    ghost: { jpn: 'ゴースト', eng: 'ghost' },
    dragon: { jpn: 'ドラゴン', eng: 'dragon' },
    dark: { jpn: 'あく', eng: 'dark' },
    steel: { jpn: 'はがね', eng: 'steel' },
    fairy: { jpn: 'フェアリー', eng: 'fairy' }
  } satisfies Record<string, { readonly jpn: string; readonly eng: string }>,
  
  // ゲームバージョン情報
  games: {
    // リージョン → ゲームタイトル
    region2game: {
      kanto: 'red-blue',
      johto: 'gold-silver',
      hoenn: 'ruby-sapphire',
      sinnoh: 'diamond-pearl',
      unova: 'black-white',
      kalos: 'x-y',
      alola: 'sun-moon',
      galar: 'sword-shield',
      hisui: 'legends-arceus',
      paldea: 'scarlet-violet'
    },
    
    // ゲームID → 日本語名
    game2jpn: {
      'red-blue': '赤・緑',
      'gold-silver': '金・銀',
      'ruby-sapphire': 'ルビー・サファイア',
      'diamond-pearl': 'ダイヤモンド・パール',
      'black-white': 'ブラック・ホワイト',
      'x-y': 'X・Y',
      'sun-moon': 'サン・ムーン',
      'sword-shield': 'ソード・シールド',
      'legends-arceus': 'Legends アルセウス',
      'scarlet-violet': 'スカーレット・バイオレット'
    },
    
    // リージョン → 日本語名
    region2jpn: {
      kanto: 'カントー',
      johto: 'ジョウト',
      hoenn: 'ホウエン',
      sinnoh: 'シンオウ',
      unova: 'イッシュ',
      kalos: 'カロス',
      alola: 'アローラ',
      galar: 'ガラル',
      hisui: 'ヒスイ',
      paldea: 'パルデア'
    }
  },
  
  // メニュー設定
  menus: {
    // メインカテゴリ
    categories: {
      pokemon_data: 'ポケモンデータ',
      tools_gallery: 'ツール・図鑑',
      useful_information: '便利情報'
    },
    
    // メインメニュー
    main: [
      { title: 'ポケモン図鑑', path: '/pokedex', category: 'pokemon_data' },
      { title: 'わざ', path: '/waza', category: 'pokemon_data' },
      { title: 'とくせい', path: '/ability', category: 'pokemon_data' },
      { title: '図鑑カメラ', path: '/camera', category: 'tools_gallery' },
      { title: '検索', path: '/search', category: 'tools_gallery' },
      { title: 'pokedex.json', path: '/pokedexjson', category: 'useful_information' },
      { title: '年表', path: '/pokemon_history', category: 'useful_information' },
      { title: 'チートシート', path: '/cheatsheet', category: 'useful_information' }
    ]
  }
})
