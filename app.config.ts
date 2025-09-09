// 型をインポート
import type { RegionPokedexKey, RegionPokedex, RegionPokedexItem } from './types/region'
// JSONファイルから設定を読み込み
import pokedexConfig from './api/pokedex/config/pokedex_config.json'

// local_pokedex_mappingからverDescriptionを生成する関数
function generateVerDescriptionFromMapping() {
  const verDescription: Record<string, any> = {}
  
  // local_pokedex_mappingの各ゲームグループを処理
  Object.values(pokedexConfig.local_pokedex_mapping).forEach((gameGroup) => {
    if (gameGroup.version) {
      // 各ゲームグループのversionデータをverDescriptionに追加
      Object.assign(verDescription, gameGroup.version)
    }
  })
  
  return verDescription
}

// アプリケーション全体で使用する設定値
export default defineAppConfig({
  // サイト基本情報
  site: {
    name: 'Pokédex-Online',
    description: 'ポケモン図鑑',
  },

  personal: {
    // 共通設定
    language: 'jpn',    
  },

  // リージョン図鑑データ
  regionPokedex: {
    global: {
      disp: {
        jpn: '全国図鑑',
        eng: 'National Pokédex'
      },
      name: {
        jpn: '全国図鑑',
        eng: 'global'
      },
      gameVersion: [],
    },
    kanto: {
      disp: {
        jpn: 'カントー図鑑',
        eng: 'Kanto Pokédex'
      },
      name: {
        jpn: 'カントー図鑑',
        eng: 'kanto'
      },
      gameVersion: ["red", "green", "blue", "pikachu"],
    },
    johto: {
      disp: {
        jpn: 'ジョウト図鑑',
        eng: 'Johto Pokédex'
      },
      name: {
        jpn: 'ジョウト図鑑',
        eng: 'johto'
      },
      gameVersion: ["gold", "silver", "crystal"],
    },
    hoenn: {
      disp:   {
        jpn: 'ホウエン図鑑',
        eng: 'Hoenn Pokédex'
      },
      name: {
        jpn: 'ホウエン図鑑',
        eng: 'hoenn'
      },
      gameVersion: ["ruby", "sapphire", "emerald"],
    },
    kanto_frlg: {
      disp: {
        jpn: 'カントー図鑑(ファイアレッド・リーフグリーン)',
        eng: 'Kanto Pokédex(firered / leafgreen)'
      },
      name: {
        jpn: 'カントー図鑑',
        eng: 'kanto'
      },
      gameVersion: ["firered", "leafgreen"],
    },
    sinnoh: {
      disp: {
        jpn: 'シンオウ図鑑',
        eng: 'Sinnoh Pokédex'
      },
      name: {
        jpn: 'シンオウ図鑑',
        eng: 'sinnoh'
      },
      gameVersion: ["diamond", "pearl", "platinum"],
    },
    johto_hgss: {
      disp: {
        jpn: 'ジョウト図鑑(ハートゴールド・ソウルシルバー)',
        eng: 'Johto Pokédex(heartgold / soulsilver)'
      },
      name: {
        jpn: 'ジョウト図鑑',
        eng: 'johto'
      },
      gameVersion: ["heartgold", "soulsilver"],
    },
    unova_bw: {
      disp: {
        jpn: 'イッシュ図鑑',
        eng: 'Unova Pokédex(black / white)'
      },
      name: {
        jpn: 'イッシュ図鑑',
        eng: 'unova'
      },
      gameVersion: ["black", "white"],
    },
    unova_b2w2: {
      disp: {
        jpn: 'イッシュ図鑑(ブラック2・ホワイト2)',
        eng: 'Unova Pokédex(black2 / white2)'
      },
      name: {
        jpn: 'イッシュ図鑑',
        eng: 'unova'
      },
      gameVersion: ["black2", "white2"],
    },
    central_kalos: {
      disp: {
        jpn: 'セントラルカロス図鑑',
        eng: 'Central Kalos Pokédex'
      },
      name: {
        jpn: 'セントラルカロス図鑑',
        eng: 'central_kalos'
      },
      gameVersion: ["x", "x_kanji", "y", "y_kanji"],
    },
    coast_kalos: {
      disp: {
        jpn: 'コーストカロス図鑑',
        eng: 'Coast Kalos Pokédex'
      },
      name: {
        jpn: 'コーストカロス図鑑',
        eng: 'coast_kalos'
      },
      gameVersion: ["x", "x_kanji", "y", "y_kanji"],
    },
    mountain_kalos: {
      disp: {
        jpn: 'マウンテンカロス図鑑',
        eng: 'Mountain Kalos Pokédex'
      },
      name: {
        jpn: 'マウンテンカロス図鑑',
        eng: 'mountain_kalos'
      },
      gameVersion: ["x", "x_kanji", "y", "y_kanji"],
    },
    alola_sm: {
      disp: {
        jpn: 'アローラ図鑑',
        eng: 'Alola Pokédex(sun / moon)'
      },
      name: {
        jpn: 'アローラ図鑑',
        eng: 'alola'
      },
      gameVersion: ["sun", "moon"],
    },
    alola_usum: {
      disp: {
        jpn: 'アローラ図鑑(ウルトラサン・ウルトラムーン)',
        eng: 'Alola Pokédex(ultra_sun / ultra_moon)'
      },
      name: {
        jpn: 'アローラ図鑑',
        eng: 'alola'
      },
      gameVersion: ["ultrasun", "ultramoon"],
    },
    galar: {
      disp: {
        jpn: 'ガラル図鑑',
        eng: 'Galar Pokédex'
      },
      name: {
        jpn: 'ガラル図鑑',
        eng: 'galar'
      },
      gameVersion: ["sword", "shield"],
    },
    isle_of_armor: {
      disp: {
        jpn: 'ヨロイ島図鑑',
        eng: 'Isle of Armor Pokédex'
      },
      name: {
        jpn: 'ヨロイ島図鑑',
        eng: 'isle_of_armor'
      },
      gameVersion: ["sword", "shield"],
    },
    crown_tundra: {
      disp: {
        jpn: 'カンムリ雪原図鑑',
        eng: 'Crown Tundra Pokédex'
      },
      name: {
        jpn: 'カンムリ雪原図鑑',
        eng: 'crown_tundra'
      },
      gameVersion: ["sword", "shield"],
    },
    hisui: {
      disp: {
        jpn: 'ヒスイ図鑑',
        eng: 'Hisui Pokédex'
      },
      name: {
        jpn: 'ヒスイ図鑑',
        eng: 'hisui'
      },
      gameVersion: ["legendsarceus"],
    },
    paldea: {
      disp: {
        jpn: 'パルデア図鑑',
        eng: 'Paldea Pokédex'
      },
      name: {
        jpn: 'パルデア図鑑',
        eng: 'paldea'
      },
      gameVersion: ["scarlet", "violet"],
    },
    kitakami: {
      disp: {
        jpn: 'キタカミ図鑑',
        eng: 'Kitakami Pokédex'
      },
      name: {
        jpn: 'キタカミ図鑑',
        eng: 'kitakami'
      },
      gameVersion: ["scarlet", "violet"],
    },
    blueberry: {
      disp: {
        jpn: 'ブルーベリー図鑑',
        eng: 'Blueberry Pokédex'
      },
      name: {
        jpn: 'ブルーベリー図鑑',
        eng: 'blueberry'
      },
      gameVersion: ["scarlet", "violet"],
    }
  } satisfies RegionPokedex,

  // リージョン図鑑の順序
  regionPokedexOrder: [
    'global',
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
    ノーマル: { jpn: 'ノーマル', eng: 'normal', color: '#dcdcdc' },
    ほのお: { jpn: 'ほのお', eng: 'fire', color: '#ff0000' },
    みず: { jpn: 'みず', eng: 'water', color: '#0000ff' },
    でんき: { jpn: 'でんき', eng: 'electric', color: '#f5c842' },
    くさ: { jpn: 'くさ', eng: 'grass', color: '#32cd32' },
    こおり: { jpn: 'こおり', eng: 'ice', color: '#87ceeb' },
    かくとう: { jpn: 'かくとう', eng: 'fighting', color: '#8b4513' },
    どく: { jpn: 'どく', eng: 'poison', color: '#9932cc' },
    じめん: { jpn: 'じめん', eng: 'ground', color: '#daa520' },
    ひこう: { jpn: 'ひこう', eng: 'flying', color: '#87ceeb' },
    エスパー: { jpn: 'エスパー', eng: 'psychic', color: '#ff1493' },
    むし: { jpn: 'むし', eng: 'bug', color: '#9acd32' },
    いわ: { jpn: 'いわ', eng: 'rock', color: '#8b4513' },
    ゴースト: { jpn: 'ゴースト', eng: 'ghost', color: '#6a5acd' },
    ドラゴン: { jpn: 'ドラゴン', eng: 'dragon', color: '#4169e1' },
    あく: { jpn: 'あく', eng: 'dark', color: '#4b0082' },
    はがね: { jpn: 'はがね', eng: 'steel', color: '#b0c4de' },
    フェアリー: { jpn: 'フェアリー', eng: 'fairy', color: '#ee82ee' }
  } satisfies Record<string, { readonly jpn: string; readonly eng: string; readonly color: string }>,

  

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
  
  // ゲームバージョン情報: region2game / game2jpn は未使用のため削除
  
  // メニュー設定
  menus: {
    // メインカテゴリ
    categories: {
      pokemon_data: {jpn: 'ポケモンデータ', eng: 'Pokemon Data'},
      tools: {jpn: 'ツール', eng: 'Tools'},
      useful_information: {jpn: '情報', eng: 'Information'},
      gallery: {jpn: 'ギャラリー', eng: 'Gallery'},
      setting: {jpn: '設定', eng: 'Setting'}
    },
    
    // メインメニュー
    main: [
      { title: {jpn: 'ポケモン図鑑', eng: 'Pokedex'}, path: '/pokedex', category: 'pokemon_data', img: '/icon.png' },
      // { title: 'わざ', path: '/waza', category: 'pokemon_data', img: '/icon.png' },
      // { title: 'とくせい', path: '/ability', category: 'pokemon_data', img: '/icon.png' },
      // { title: '図鑑カメラ', path: '/camera', category: 'tools_gallery', img: '/icon.png' },
      { title: {jpn: '検索', eng: 'Search'}, path: '/search', category: 'tools', img: '/icon.png' },
      { title: {jpn: 'ギャラリー', eng: 'Gallery'}, path: '/gallery', category: 'gallery', img: '/icon.png' },
      { title: {jpn: 'リーフ', eng: 'leaf'}, path: '/leaf', category: 'gallery', img: '/icon.png' },
      { title: {jpn: '会員証作成', eng: 'Membership Card'}, path: '/webapp/membership_card_generater', category: 'tools', img: '/icon.png' },
      { title: {jpn: '3Dフィールドビュー', eng: '3D Field Viewer'}, path: '/webapp/stadium_view', category: 'tools', img: '/icon.png' },
      // { title: 'pokedex.json', path: '/pokedexjson', category: 'useful_information', img: '/icon.png' },
      // { title: '年表', path: '/pokemon_history', category: 'useful_information', img: '/icon.png' },
      // { title: 'チートシート', path: '/cheatsheet', category: 'useful_information', img: '/icon.png' }
      { title: {jpn: '設定', eng: 'Setting'}, path: '/setting', category: 'setting', img: '/icon.png' },
    ]
  },

 
  translation: {
    jpn: {jpn: '日本語', eng: 'Japanese'},
    eng: {jpn: '英語', eng: 'English'},
    ger: {jpn: 'ドイツ語', eng: 'German'},
    spa: {jpn: 'スペイン語', eng: 'Spanish'},
    fre: {jpn: 'フランス語', eng: 'French'},
    ita: {jpn: 'イタリア語', eng: 'Italian'},
    kor: {jpn: '韓国語', eng: 'Korean'},
    chs: {jpn: '中国語(簡体)', eng: 'Chinese (Simplified)'},
    cht: {jpn: '中国語(繁体)', eng: 'Chinese (Traditional)'},
    pokedex: {jpn: 'ポケモン図鑑', eng: 'Pokédex'},
    classification: {jpn: '分類', eng: 'Classification'},
    height: {jpn: '高さ', eng: 'Height'},
    weight: {jpn: '重さ', eng: 'Weight'},
    no: {jpn: '図鑑番号', eng: 'No.'},
    globalNo: {jpn: '全国図鑑番号', eng: 'Global No.'},
    top: {jpn: 'Home', eng: 'Home'},
    gallery: {jpn: 'ギャラリー', eng: 'Gallery'},
    prev: {jpn: '前', eng: 'Previous'},
    next: {jpn: '次', eng: 'Next'},
    name: {jpn: '名前', eng: 'Name'},
    hp: {jpn: 'HP', eng: 'HP'},
    attack: {jpn: 'こうげき', eng: 'Attack'},
    defense: {jpn: 'ぼうぎょ', eng: 'Defense'},
    spAttack: {jpn: 'とくこう', eng: 'Special Attack'},
    spDefense: {jpn: 'とくぼう', eng: 'Special Defense'},
    speed: {jpn: 'すばやさ', eng: 'Speed'},
    ability1: {jpn: 'とくせい1', eng: 'Ability 1'},
    ability2: {jpn: 'とくせい2', eng: 'Ability 2'},
    hiddenAbility: {jpn: 'かくれとくせい', eng: 'Hidden Ability'},
    red: {jpn: '赤', eng: 'Red'},
    green: {jpn: '緑', eng: 'Green'},
    blue: {jpn: '青', eng: 'Blue'},
    pikachu: {jpn: 'ピカチュウ', eng: 'Pikachu'},
    gold: {jpn: '金', eng: 'Gold'},
    silver: {jpn: '銀', eng: 'Silver'},
    crystal: {jpn: 'クリスタル', eng: 'Crystal'},
    ruby: {jpn: 'ルビー', eng: 'Ruby'},
    sapphire: {jpn: 'サファイア', eng: 'Sapphire'},
    emerald: {jpn: 'エメラルド', eng: 'Emerald'},
    firered: {jpn: 'ファイアーレッド', eng: 'Fire Red'},
    leafgreen: {jpn: 'リーフグリーン', eng: 'Leaf Green'},
    diamond: {jpn: 'ダイヤモンド', eng: 'Diamond'},
    pearl: {jpn: 'パール', eng: 'Pearl'},
    platinum: {jpn: 'プラチナ', eng: 'Platinum'},
    heartgold: {jpn: 'ハートゴールド', eng: 'Heart Gold'},
    soulsilver: {jpn: 'ソウルシルバー', eng: 'Soul Silver'},
    black: {jpn: 'ブラック', eng: 'Black'},
    white: {jpn: 'ホワイト', eng: 'White'},
    black2: {jpn: 'ブラック2', eng: 'Black 2'},
    white2: {jpn: 'ホワイト2', eng: 'White 2'},
    x: {jpn: 'X', eng: 'X'},
    x_kanji: {jpn: 'X(漢字)', eng: 'X'},
    y: {jpn: 'Y', eng: 'Y'},
    y_kanji: {jpn: 'Y(漢字)', eng: 'Y'},
    sun: {jpn: 'サン', eng: 'Sun'},
    sun_kanji: {jpn: 'サン(漢字)', eng: 'Sun'},
    moon: {jpn: 'ムーン', eng: 'Moon'},
    moon_kanji: {jpn: 'ムーン(漢字)', eng: 'Moon'},
    ultrasun: {jpn: 'ウルトラサン', eng: 'Ultra Sun'},
    ultrasun_kanji: {jpn: 'ウルトラサン(漢字)', eng: 'Ultra Sun'},
    ultramoon: {jpn: 'ウルトラムーン', eng: 'Ultra Moon'},
    ultramoon_kanji: {jpn: 'ウルトラムーン(漢字)', eng: 'Ultra Moon'},
    sword: {jpn: 'ソード', eng: 'Sword'},
    sword_kanji: {jpn: 'ソード(漢字)', eng: 'Sword'},
    shield: {jpn: 'シールド', eng: 'Shield'},
    shield_kanji: {jpn: 'シールド(漢字)', eng: 'Shield'},
    legendsarceus: {jpn: 'レジェンズ アルセウス', eng: 'Legends Arceus'},
    scarlet: {jpn: 'スカーレット', eng: 'Scarlet'},
    scarlet_kanji: {jpn: 'スカーレット(漢字)', eng: 'Scarlet'},
    violet: {jpn: 'バイオレット', eng: 'Violet'},
    violet_kanji: {jpn: 'バイオレット(漢字)', eng: 'Violet'},
  },
  // 言語名変換
  // lang_eng2jpn: {
  //   jpn: '日本語',
  //   eng: '英語',
  //   ger: 'ドイツ語',
  //   spa: 'スペイン語',
  //   fre: 'フランス語',
  //   ita: 'イタリア語',
  //   kor: '韓国語',
  //   chs: '中国語(簡体)',
  //   cht: '中国語(繁体)'
  // },

  typeList: {
    'kanto': 1,
    'johto': 2,
    'hoenn': 2,
    'kanto_frlg': 2,
    'sinnoh': 2,
    'unova_bw': 2,
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
  },
  verIcon: {
    "red": "ver01_00_Red_JP.png",
    "green": "ver01_01_Green_JP.png",
    "blue": "ver01_10_Blue_JP.png",
    "pikachu": "ver01_20_Pikachu_JP.png",
    "gold": "ver02_00_Gold.png",
    "silver": "ver02_01_Silver.png",
    "crystal": "ver02_10_Crystal.png",
    "ruby": "ver03_00_Ruby.png",
    "sapphire": "ver03_00_Sapphire.png",
    "emerald": "ver03_20_Emerald.png",
    "firered": "ver03_10_FireRed.png",
    "leafgreen": "ver03_11_LeafGreen.png",
    "diamond": "ver04_00_Diamond.png",
    "pearl": "ver04_01_Pearl.png",
    "platinum": "ver04_10_Platinum.png",
    "heartgold": "ver04_20_HeartGold.png",
    "soulsilver": "ver04_21_SoulSilver.png",
    "black": "ver05_00_Black.png",
    "white": "ver05_01_White.png",
    "black2": "ver05_10_Black2.png",
    "white2": "ver05_11_White2.png",
    "x": "ver06_00_X.png",
    "y": "ver06_01_Y.png",
    "sun": "ver07_00_Sun.png",
    "moon": "ver07_01_Moon.png",
    "ultrasun": "ver07_10_UltraSun.png",
    "ultramoon": "ver07_11_UltraMoon.png",
    "sword": "ver08_00_Sword.png",
    "shield": "ver08_01_Shield.png",
    "legendsarceus": "ver08_20_LegendsArceus.png",
    "scarlet": "ver09_00_Scarlet.png",
    "violet": "ver09_01_Violet.png",
  },
  verDescription: generateVerDescriptionFromMapping(),
})
