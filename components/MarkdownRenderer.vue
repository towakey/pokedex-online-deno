<template>
  <div class="markdown-content" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
interface Props {
  content: string
}

const props = defineProps<Props>()

// 簡単なマークダウン変換（基本的なもののみ対応）
const renderedContent = computed(() => {
  let html = props.content
  
  // ヘッダー変換
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-h5 mb-4 font-weight-bold">$1</h3>')
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-h6 mb-3 font-weight-medium">$1</h4>')
  
  // 太字変換
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // リスト変換
  html = html.replace(/^\*   (.*$)/gim, '<li class="mb-2">$1</li>')
  
  // 段落変換（連続した改行を段落区切りとする）
  html = html.replace(/\n\n+/g, '</p><p class="text-body-1 mb-4">')
  html = '<p class="text-body-1 mb-4">' + html + '</p>'
  
  // リストの開始と終了タグを追加
  html = html.replace(/(<li.*?<\/li>)/gs, '<ul class="mb-4">$1</ul>')
  
  // 空の段落を削除
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '')
  
  return html
})
</script>

<style scoped>
.markdown-content {
  line-height: 1.8;
}

.markdown-content :deep(h3) {
  color: rgb(var(--v-theme-primary));
  border-bottom: 2px solid rgb(var(--v-theme-primary));
  padding-bottom: 8px;
  margin-bottom: 16px !important;
}

.markdown-content :deep(h4) {
  color: rgb(var(--v-theme-secondary));
  margin-top: 24px;
}

.markdown-content :deep(ul) {
  margin-left: 16px;
}

.markdown-content :deep(li) {
  position: relative;
}

.markdown-content :deep(li:before) {
  content: '•';
  color: rgb(var(--v-theme-primary));
  font-weight: bold;
  position: absolute;
  left: -16px;
}

.markdown-content :deep(strong) {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
</style>
