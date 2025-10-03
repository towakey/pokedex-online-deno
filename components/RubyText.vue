<template>
  <span v-html="formattedText"></span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text: string
  highlightWord?: string // 強調表示するワード（オプション）
}

const props = defineProps<Props>()

// ルビ付きテキストをフォーマットするcomputedプロパティ
const formattedText = computed(() => {
  if (!props.text) return ''

  let result = props.text
  
  // 日本語のルビ記法を検出してHTMLに変換
  // 例: 「漢字(かんじ)」 → <ruby><rb>漢字</rb><rt>かんじ</rt></ruby>
  result = result
    .replace(/([一-龯々ヶ]+)\(([^)]+)\)/g, '<ruby><rb>$1</rb><rt>$2</rt></ruby>')
    .replace(/＜([^＞]+)＞/g, '<ruby><rb>$1</rb><rt>?</rt></ruby>')
  
  // 検索ワードのハイライト処理
  if (props.highlightWord && props.highlightWord.trim()) {
    const word = props.highlightWord.trim()
    // HTMLタグ内のテキストを避けるため、正規表現で慎重に置換
    // タグの外側のテキストのみをハイライト
    const regex = new RegExp(`(${escapeRegExp(word)})(?![^<]*>)`, 'gi')
    result = result.replace(regex, '<span class="highlight-word">$1</span>')
  }
  
  return result
})

// 正規表現の特殊文字をエスケープ
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
</script>

<style scoped>
ruby {
  ruby-position: over;
}

rt {
  font-size: 0.6em;
  color: #666;
  font-weight: normal;
}

.description-text ruby {
  margin: 0 0.1em;
}

.description-text rt {
  font-size: 0.5em;
}

/* 検索ワードのハイライト */
:deep(.highlight-word) {
  color: #d32f2f;
  font-weight: bold;
  background-color: #ffebee;
  padding: 0 2px;
  border-radius: 2px;
}
</style>
