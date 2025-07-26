// 型をインポート
import type { RegionPokedexKey, RegionPokedex, RegionPokedexItem } from './types/region'

// アプリケーション全体で使用する設定値
export default defineAppConfig({
  // サイト基本情報
  site: {
    name: 'Pokédex-Online',
    description: 'Nuxt.js で作成されたポケモン図鑑アプリケーション',
  },

  personal: {
    // 共通設定
    language: 'jpn',    
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

  type_list: {
    '1': [
      "ノーマル",
      "ほのお",
      "みず",
      "でんき",
      "くさ",
      "こおり",
      "かくとう",
      "どく",
      "じめん",
      "ひこう",
      "エスパー",
      "むし",
      "いわ",
      "ゴースト",
      "ドラゴン",  
    ],
    '2': [
      "ノーマル",
      "ほのお",
      "みず",
      "でんき",
      "くさ",
      "こおり",
      "かくとう",
      "どく",
      "じめん",
      "ひこう",
      "エスパー",
      "むし",
      "いわ",
      "ゴースト",
      "ドラゴン",
      "あく",
      "はがね",
    ],
    '3': [
      "ノーマル",
      "ほのお",
      "みず",
      "でんき",
      "くさ",
      "こおり",
      "かくとう",
      "どく",
      "じめん",
      "ひこう",
      "エスパー",
      "むし",
      "いわ",
      "ゴースト",
      "ドラゴン",
      "あく",
      "はがね",
      "フェアリー",
    ]
  },
  
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
  },

  // Vueファイルとの互換性のための旧形式設定
  pokedex_eng2jpn: {
    global: '全国図鑑',
    kanto: 'カントー図鑑',
    johto: 'ジョウト図鑑',
    hoenn: 'ホウエン図鑑',
    kanto_frlg: 'カントー図鑑(FRLG)',
    sinnoh: 'シンオウ図鑑',
    johto_hgss: 'ジョウト図鑑(HGSS)',
    unova_bw: 'イッシュ図鑑(BW)',
    unova_b2w2: 'イッシュ図鑑(B2W2)',
    central_kalos: 'セントラルカロス図鑑',
    coast_kalos: 'コーストカロス図鑑',
    mountain_kalos: 'マウンテンカロス図鑑',
    alola_sm: 'アローラ図鑑(SM)',
    alola_usum: 'アローラ図鑑(USUM)',
    galar: 'ガラル図鑑',
    isle_of_armor: 'ヨロイ島図鑑',
    crown_tundra: 'カンムリ雪原図鑑',
    hisui: 'ヒスイ図鑑',
    paldea: 'パルデア図鑑',
    kitakami: 'キタカミ図鑑',
    blueberry: 'ブルーベリー図鑑'
  },

  // ポケモン図鑑リスト
  pokedex_list: [
    { area: 'global', title: '全国図鑑', path: '/global' },
    { area: 'kanto', title: 'カントー図鑑', path: '/kanto' },
    { area: 'johto', title: 'ジョウト図鑑', path: '/johto' },
    { area: 'hoenn', title: 'ホウエン図鑑', path: '/hoenn' },
    { area: 'sinnoh', title: 'シンオウ図鑑', path: '/sinnoh' },
    { area: 'unova', title: 'イッシュ図鑑', path: '/unova' },
    { area: 'central_kalos', title: 'セントラルカロス図鑑', path: '/central_kalos' },
    { area: 'coast_kalos', title: 'コーストカロス図鑑', path: '/coast_kalos' },
    { area: 'mountain_kalos', title: 'マウンテンカロス図鑑', path: '/mountain_kalos' },
    { area: 'alola', title: 'アローラ図鑑', path: '/alola' },
    { area: 'galar', title: 'ガラル図鑑', path: '/galar' },
    { area: 'hisui', title: 'ヒスイ図鑑', path: '/hisui' },
    { area: 'paldea', title: 'パルデア図鑑', path: '/paldea' }
  ],

  // 言語名変換
  lang_eng2jpn: {
    jpn: '日本語',
    eng: '英語',
    ger: 'ドイツ語',
    spa: 'スペイン語',
    fre: 'フランス語',
    ita: 'イタリア語',
    kor: '韓国語',
    chs: '中国語(簡体)',
    cht: '中国語(繁体)'
  },

  // バージョン説明（ダミーデータ）
  verDescription: {
    green: {
      title: 'ポケットモンスター 緑',
      description: '初代ポケットモンスターの緑バージョン',
      image: 'green'
    }
  },

  typeList: {
    'kanto': 1,
    'johto': 2,
    'hoenn': 2,
    'kanto_frlg': 2,
    'sinnoh': 2,
    'unova': 2,
    'unova_b2w2': 2,
    'johto_hgss': 2,
    'central_kalos': 3,
    'coast_kalos': 3,
    'mountain_kalos': 3,
    'alola_sm': 3,
    'alola_usum': 3,
    'galar': 3,
    'isle_of_armor': 3,
    'crown_tundra': 3,
    'hisui': 3,
    'paldea': 3,
    'kitakami': 3,
    'blueberry': 3
  }
})
