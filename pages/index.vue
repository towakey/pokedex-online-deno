<template>
  <div>
    <h1>ポケデックス</h1>
    <p>Nuxt.js アプリケーションが正常に動作しています！</p>
    <div class="test-content">
      <h2>テストページ</h2>
      <p>この pages/index.vue ページが表示されています。</p>
    </div>
  </div>
</template>

<script setup>
// ページのメタデータを設定
useHead({
  title: 'ポケデックス - Nuxt.js',
  meta: [
    { name: 'description', content: 'Nuxt.js で作成されたポケデックスアプリケーション' }
  ]
})
</script>

<style scoped>
h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

.test-content {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
}

h2 {
  color: #34495e;
  margin-bottom: 1rem;
}

p {
  color: #666;
  line-height: 1.6;
}
</style>