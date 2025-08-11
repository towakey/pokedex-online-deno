// 型をインポート
import type { RegionPokedexKey, RegionPokedex, RegionPokedexItem } from './types/region'

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
      disp: "全国図鑑",
      name: {
        jpn: '全国図鑑',
        eng: 'global'
      },
      gameVersion: [],
    },
    kanto: {
      disp: "カントー図鑑",
      name: {
        jpn: 'カントー図鑑',
        eng: 'kanto'
      },
      gameVersion: ["red", "green", "blue", "pikachu"],
    },
    johto: {
      disp: "ジョウト図鑑",
      name: {
        jpn: 'ジョウト図鑑',
        eng: 'johto'
      },
      gameVersion: ["gold", "silver", "crystal"],
    },
    hoenn: {
      disp: "ホウエン図鑑",
      name: {
        jpn: 'ホウエン図鑑',
        eng: 'hoenn'
      },
      gameVersion: ["ruby", "sapphire", "emerald"],
    },
    kanto_frlg: {
      disp: "カントー図鑑(ファイアレッド・リーフグリーン)",
      name: {
        jpn: 'カントー図鑑',
        eng: 'kanto(firered / leafgreen)'
      },
      gameVersion: ["firered", "leafgreen"],
    },
    sinnoh: {
      disp: "シンオウ図鑑",
      name: {
        jpn: 'シンオウ図鑑',
        eng: 'sinnoh'
      },
      gameVersion: ["diamond", "pearl", "platinum"],
    },
    johto_hgss: {
      disp: "ジョウト図鑑(ハートゴールド・ソウルシルバー)",
      name: {
        jpn: 'ジョウト図鑑',
        eng: 'johto(heartgold / soulsilver)'
      },
      gameVersion: ["heartgold", "soulsilver"],
    },
    unova_bw: {
      disp: "イッシュ図鑑",
      name: {
        jpn: 'イッシュ図鑑',
        eng: 'unova(black / white)'
      },
      gameVersion: ["black", "white"],
    },
    unova_b2w2: {
      disp: "イッシュ図鑑(ブラック2・ホワイト2)",
      name: {
        jpn: 'イッシュ図鑑',
        eng: 'unova(black2 / white2)'
      },
      gameVersion: ["black2", "white2"],
    },
    central_kalos: {
      disp: "セントラルカロス図鑑",
      name: {
        jpn: 'セントラルカロス図鑑',
        eng: 'central_kalos'
      },
      gameVersion: ["x", "y"],
    },
    coast_kalos: {
      disp: "コーストカロス図鑑",
      name: {
        jpn: 'コーストカロス図鑑',
        eng: 'coast_kalos'
      },
      gameVersion: ["x", "y"],
    },
    mountain_kalos: {
      disp: "マウンテンカロス図鑑",
      name: {
        jpn: 'マウンテンカロス図鑑',
        eng: 'mountain_kalos'
      },
      gameVersion: ["x", "y"],
    },
    alola_sm: {
      disp: "アローラ図鑑",
      name: {
        jpn: 'アローラ図鑑',
        eng: 'alola(sun / moon)'
      },
      gameVersion: ["sun", "moon"],
    },
    alola_usum: {
      disp: "アローラ図鑑(ウルトラサン・ウルトラムーン)",
      name: {
        jpn: 'アローラ図鑑',
        eng: 'alola(ultra_sun / ultra_moon)'
      },
      gameVersion: ["ultrasun", "ultramoon"],
    },
    galar: {
      disp: "ガラル図鑑",
      name: {
        jpn: 'ガラル図鑑',
        eng: 'galar'
      },
      gameVersion: ["sword", "shield"],
    },
    isle_of_armor: {
      disp: "ヨロイ島図鑑",
      name: {
        jpn: 'ヨロイ島図鑑',
        eng: 'isle_of_armor'
      },
      gameVersion: ["sword", "shield"],
    },
    crown_tundra: {
      disp: "カンムリ雪原図鑑",
      name: {
        jpn: 'カンムリ雪原図鑑',
        eng: 'crown_tundra'
      },
      gameVersion: ["sword", "shield"],
    },
    hisui: {
      disp: "ヒスイ図鑑",
      name: {
        jpn: 'ヒスイ図鑑',
        eng: 'hisui'
      },
      gameVersion: ["legendsarceus"],
    },
    paldea: {
      disp: "パルデア図鑑",
      name: {
        jpn: 'パルデア図鑑',
        eng: 'paldea'
      },
      gameVersion: ["scarlet", "violet"],
    },
    kitakami: {
      disp: "キタカミ図鑑",
      name: {
        jpn: 'キタカミ図鑑',
        eng: 'kitakami'
      },
      gameVersion: ["scarlet", "violet"],
    },
    blueberry: {
      disp: "ブルーベリー図鑑",
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
    ノーマル: { jpn: 'ノーマル', eng: 'normal' },
    ほのお: { jpn: 'ほのお', eng: 'fire' },
    みず: { jpn: 'みず', eng: 'water' },
    でんき: { jpn: 'でんき', eng: 'electric' },
    くさ: { jpn: 'くさ', eng: 'grass' },
    こおり: { jpn: 'こおり', eng: 'ice' },
    かくとう: { jpn: 'かくとう', eng: 'fighting' },
    どく: { jpn: 'どく', eng: 'poison' },
    じめん: { jpn: 'じめん', eng: 'ground' },
    ひこう: { jpn: 'ひこう', eng: 'flying' },
    エスパー: { jpn: 'エスパー', eng: 'psychic' },
    むし: { jpn: 'むし', eng: 'bug' },
    いわ: { jpn: 'いわ', eng: 'rock' },
    ゴースト: { jpn: 'ゴースト', eng: 'ghost' },
    ドラゴン: { jpn: 'ドラゴン', eng: 'dragon' },
    あく: { jpn: 'あく', eng: 'dark' },
    はがね: { jpn: 'はがね', eng: 'steel' },
    フェアリー: { jpn: 'フェアリー', eng: 'fairy' }
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
  
  // ゲームバージョン情報: region2game / game2jpn は未使用のため削除
  
  // メニュー設定
  menus: {
    // メインカテゴリ
    categories: {
      pokemon_data: 'ポケモンデータ',
      tools_gallery: 'ツール・図鑑',
      useful_information: '便利情報',
      setting: '設定'
    },
    
    // メインメニュー
    main: [
      { title: 'ポケモン図鑑', path: '/pokedex', category: 'pokemon_data', img: '/icon.png' },
      // { title: 'わざ', path: '/waza', category: 'pokemon_data', img: '/icon.png' },
      // { title: 'とくせい', path: '/ability', category: 'pokemon_data', img: '/icon.png' },
      // { title: '図鑑カメラ', path: '/camera', category: 'tools_gallery', img: '/icon.png' },
      { title: '検索', path: '/search', category: 'tools_gallery', img: '/icon.png' },
      // { title: 'pokedex.json', path: '/pokedexjson', category: 'useful_information', img: '/icon.png' },
      // { title: '年表', path: '/pokemon_history', category: 'useful_information', img: '/icon.png' },
      // { title: 'チートシート', path: '/cheatsheet', category: 'useful_information', img: '/icon.png' }
      { title: '設定', path: '/setting', category: 'setting', img: '/icon.png' },
    ]
  },

 
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
  verDescription: {
    "red": {title: "ポケットモンスター 赤", shortTitle: "赤", description: "発売日：1996年02月27日"},
    "green": {title: "ポケットモンスター 緑", shortTitle: "緑", description: "発売日：1996年02月27日", image: "01_01"},
    "blue": {title: "ポケットモンスター 青", shortTitle: "青", description: "発売日：1996年10月15日"},
    "pikachu": {title: "ポケットモンスター ピカチュウ", shortTitle: "ピカチュウ", description: "発売日：1998年09月12日"},
    "gold": {title: "ポケットモンスター 金", shortTitle: "金", description: "発売日：1999年11月21日"},
    "silver": {title: "ポケットモンスター 銀", shortTitle: "銀", description: "発売日：1999年11月21日"},
    "crystal": {title: "ポケットモンスター クリスタル", shortTitle: "クリスタル", description: "発売日：2000年12月14日"},
    "ruby": {title: "ポケットモンスター ルビー", shortTitle: "ルビー", description: "発売日：2002年11月21日"},
    "sapphire": {title: "ポケットモンスター サファイア", shortTitle: "サファイア", description: "発売日：2002年11月21日"},
    "emerald": {title: "ポケットモンスター エメラルド", shortTitle: "エメラルド", description: "発売日：2004年09月16日"},
    "firered": {title: "ポケットモンスター ファイアレッド", shortTitle: "ファイアレッド", description: "発売日：2004年1月29日"},
    "leafgreen": {title: "ポケットモンスター リーフグリーン", shortTitle: "リーフグリーン", description: "発売日：2004年1月29日"},
    "diamond": {title: "ポケットモンスター ダイアモンド", shortTitle: "ダイアモンド", description: "発売日：2006年09月28日"},
    "pearl": {title: "ポケットモンスター パール", shortTitle: "パール", description: "発売日：2006年09月28日"},
    "platinum": {title: "ポケットモンスター プラチナ", shortTitle: "プラチナ", description: "発売日：2008年09月13日"},
    "heartgold": {title: "ポケットモンスター ハートゴールド", shortTitle: "ハートゴールド", description: "発売日：2009年09月12日"},
    "soulsilver": {title: "ポケットモンスター ソウルシルバー", shortTitle: "ソウルシルバー", description: "発売日：2009年09月12日"},
    "black": {title: "ポケットモンスター ブラック", shortTitle: "ブラック", description: "発売日：2010年09月18日"},
    "white": {title: "ポケットモンスター ホワイト", shortTitle: "ホワイト", description: "発売日：2010年09月18日"},
    "black2": {title: "ポケットモンスター ブラック2", shortTitle: "ブラック2", description: "発売日：2012年06月23日"},
    "white2": {title: "ポケットモンスター ホワイト2", shortTitle: "ホワイト2", description: "発売日：2012年06月23日"},
    "x": {title: "ポケットモンスター X", shortTitle: "X", description: "発売日：2013年10月12日"},
    "y": {title: "ポケットモンスター Y", shortTitle: "Y", description: "発売日：2013年10月12日"},
    "sun": {title: "ポケットモンスター サン", shortTitle: "サン", description: "発売日：2014年11月21日"},
    "moon": {title: "ポケットモンスター ムーン", shortTitle: "ムーン", description: "発売日：2014年11月21日"},
    "ultrasun": {title: "ポケットモンスター ウルトラサン", shortTitle: "ウルトラサン", description: "発売日：2016年11月18日"},
    "ultramoon": {title: "ポケットモンスター ウルトラムーン", shortTitle: "ウルトラムーン", description: "発売日：2016年11月18日"},
    "sword": {title: "ポケットモンスター ソード", shortTitle: "ソード", description: "発売日：2019年11月15日"},
    "shield": {title: "ポケットモンスター シールド", shortTitle: "シールド", description: "発売日：2019年11月15日"},
    "legendsarceus": {title: "ポケモン Legends アルセウス", shortTitle: "アルセウス", description: "発売日：2022年01月28日"},
    "scarlet": {title: "ポケットモンスター スカーレット", shortTitle: "スカーレット", description: "発売日：2022年11月18日"},
    "violet": {title: "ポケットモンスター バイオレット", shortTitle: "バイオレット", description: "発売日：2022年11月18日"},
  },
})
