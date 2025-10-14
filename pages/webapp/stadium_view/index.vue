<template>
  <v-container fluid class="pa-0">
    <AppBreadcrumbs :items="breadcrumbs" />
    <!-- ページタイトル -->
    <v-row class="ma-0">
      <v-col cols="12" class="pa-2">
        <h1 class="text-h4 text-center mb-4">
          {{ tr.title }}
        </h1>
      </v-col>
    </v-row>

    <!-- 3D キャンバスエリア -->
    <v-row class="ma-0">
      <v-col cols="12" class="pa-2">
        <v-card elevation="2" class="stadium-container">
          <div ref="canvasContainer" class="canvas-wrapper">
            <canvas ref="threeCanvas" class="stadium-canvas"></canvas>
          </div>
          
          <!-- コントロールパネル -->
          <v-card-actions class="justify-center pa-4">
            <v-btn
              color="primary"
              prepend-icon="mdi-camera-control"
              @click="resetCamera"
              variant="outlined"
              class="mr-2"
            >
              {{ tr.resetView }}
            </v-btn>
            <v-btn
              color="success"
              prepend-icon="mdi-download"
              @click="downloadScreenshot"
              variant="elevated"
            >
              {{ tr.downloadImage }}
            </v-btn>
          </v-card-actions>

          <!-- 操作説明 -->
          <v-card-text class="text-center text-body-2 text-medium-emphasis">
            {{ tr.controls }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { computed, nextTick, onMounted, onUnmounted, ref } from '#imports'

const { settings } = useSettings()
const appConfig = useAppConfig()

// ページメタ設定
definePageMeta({
  pageTitle: 'シンプルフィールド 3Dビューアー' as const
})

// 翻訳設定
const currentLanguage = computed(() => settings.value?.language ?? 'jpn')
const tr = computed(() => ({
  title: currentLanguage.value === 'eng' ? '3D Field Viewer' : 'シンプルフィールド 3Dビューアー',
  resetView: currentLanguage.value === 'eng' ? 'Reset View' : 'ビューリセット',
  downloadImage: currentLanguage.value === 'eng' ? 'Download Image' : '画像ダウンロード',
  controls: currentLanguage.value === 'eng' 
    ? 'Left Click: Rotate | Mouse Wheel: Zoom | Right Click: Pan'
    : 'マウス左クリック: 回転 | マウスホイール: ズーム | マウス右クリック: パン',
  pageTitle: currentLanguage.value === 'eng' ? '3D Field Viewer' : 'シンプルフィールド 3Dビューアー'
}))

// DOM要素の参照
const canvasContainer = ref<HTMLElement>()
const threeCanvas = ref<HTMLCanvasElement>()

// Three.js関連の変数
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number

// 初期カメラ位置（アイスフィールド全体が見える角度）
const initialCameraPosition = { x: 40, y: 25, z: 40 }
const initialCameraTarget = { x: 0, y: 0, z: 0 }

// 3Dシーンを初期化する関数
const initThreeJS = () => {
  if (!threeCanvas.value || !canvasContainer.value) return

  // シーンを作成
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87CEEB) // スカイブルー
  
  // カメラを作成
  camera = new THREE.PerspectiveCamera(
    75, // 視野角
    canvasContainer.value.clientWidth / canvasContainer.value.clientHeight, // アスペクト比
    0.1, // 近面
    1000 // 遠面
  )
  
  // カメラの初期位置を設定
  camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z)
  
  // レンダラーを作成
  renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas.value,
    antialias: true,
    preserveDrawingBuffer: true // スクリーンショット用
  })
  renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  
  // OrbitControlsを設定
  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(initialCameraTarget.x, initialCameraTarget.y, initialCameraTarget.z)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 20
  controls.maxDistance = 200
  controls.maxPolarAngle = Math.PI * 0.7 // 下からの視点を制限
  
  // ライティングを設定
  setupLighting()
  
  // スタジアムを作成
  createStadium()
  
  // レンダリングループを開始
  animate()
}

// ライティングを設定する関数
const setupLighting = () => {
  // 環境光
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
  scene.add(ambientLight)
  
  // メインの方向光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(50, 100, 50)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 500
  directionalLight.shadow.camera.left = -100
  directionalLight.shadow.camera.right = 100
  directionalLight.shadow.camera.top = 100
  directionalLight.shadow.camera.bottom = -100
  scene.add(directionalLight)
  
  // サブの方向光（影を和らげる）
  const fillLight = new THREE.DirectionalLight(0x9090aa, 0.2)
  fillLight.position.set(-50, 50, -50)
  scene.add(fillLight)
}

// シンプルフィールドを作成する関数
const createStadium = () => {
  // 白い長方形フィールド
  createSimpleField()
  
  // 黒い外枠ライン
  createBorderLines()
  
  // 中央の水平線
  createCenterLine()
  
  // 中央の大きな円
  createLargeCircle()
  
  // 中央の小さな円
  createSmallCircle()
  
  // シンプルなライティング
  createSimpleLights()
}

// シンプルな白いフィールドを作成する関数
const createSimpleField = () => {
  // 白い長方形フィールド
  const fieldGeometry = new THREE.BoxGeometry(60, 0.1, 40)
  const fieldMaterial = new THREE.MeshLambertMaterial({ 
    color: 0xffffff // 白色
  })
  const field = new THREE.Mesh(fieldGeometry, fieldMaterial)
  field.position.y = 0
  field.receiveShadow = true
  scene.add(field)
}

// 黒い外枠ラインを作成する関数
const createBorderLines = () => {
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
  
  // 外枠の4辺
  const borderLines = [
    // 上辺
    { size: [60.2, 0.05, 0.3], pos: [0, 0.06, 20.15] },
    // 下辺
    { size: [60.2, 0.05, 0.3], pos: [0, 0.06, -20.15] },
    // 左辺
    { size: [0.3, 0.05, 40.2], pos: [-30.15, 0.06, 0] },
    // 右辺
    { size: [0.3, 0.05, 40.2], pos: [30.15, 0.06, 0] }
  ]
  
  borderLines.forEach(line => {
    const geometry = new THREE.BoxGeometry(line.size[0], line.size[1], line.size[2])
    const mesh = new THREE.Mesh(geometry, lineMaterial)
    mesh.position.set(line.pos[0], line.pos[1], line.pos[2])
    scene.add(mesh)
  })
}

// 中央の水平線を作成する関数
const createCenterLine = () => {
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
  
  // 大きな円の外側で分割された中央線
  // 上半分の線
  const upperLineGeometry = new THREE.BoxGeometry(0.3, 0.05, 12)
  const upperLine = new THREE.Mesh(upperLineGeometry, lineMaterial)
  upperLine.position.set(0, 0.06, 14) // z座標: 8 + 12/2 = 14
  scene.add(upperLine)
  
  // 下半分の線
  const lowerLineGeometry = new THREE.BoxGeometry(0.3, 0.05, 12)
  const lowerLine = new THREE.Mesh(lowerLineGeometry, lineMaterial)
  lowerLine.position.set(0, 0.06, -14) // z座標: -8 - 12/2 = -14
  scene.add(lowerLine)
}

// 中央の大きな円を作成する関数
const createLargeCircle = () => {
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
  
  // 大きな円（リング状）
  const largeCircleGeometry = new THREE.RingGeometry(8, 8.3, 64)
  const largeCircle = new THREE.Mesh(largeCircleGeometry, lineMaterial)
  largeCircle.rotation.x = -Math.PI / 2
  largeCircle.position.y = 0.06
  scene.add(largeCircle)
}

// 中央の小さな円を作成する関数
const createSmallCircle = () => {
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
  
  // 小さな円（リング状）
  const smallCircleGeometry = new THREE.RingGeometry(2, 2.3, 64)
  const smallCircle = new THREE.Mesh(smallCircleGeometry, lineMaterial)
  smallCircle.rotation.x = -Math.PI / 2
  smallCircle.position.y = 0.06
  scene.add(smallCircle)
}


// シンプルなライトを作成する関数
const createSimpleLights = () => {
  // 環境光（全体を明るくする）
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
  scene.add(ambientLight)
  
  // メインの方向光（太陽光のような）
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(50, 100, 50)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 500
  directionalLight.shadow.camera.left = -100
  directionalLight.shadow.camera.right = 100
  directionalLight.shadow.camera.top = 100
  directionalLight.shadow.camera.bottom = -100
  scene.add(directionalLight)
}



// アニメーションループ
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  // コントロールを更新
  controls.update()
  
  // レンダリング
  renderer.render(scene, camera)
}

// カメラ初期位置を設定
const setCameraPosition = () => {
  // シンプルフィールドに適した角度とズーム
  camera.position.set(50, 40, 50)
  camera.lookAt(0, 0, 0)
  
  if (controls) {
    controls.target.set(0, 0, 0)
    controls.update()
  }
}

// カメラをリセットする関数
const resetCamera = () => {
  if (camera && controls) {
    camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z)
    controls.target.set(initialCameraTarget.x, initialCameraTarget.y, initialCameraTarget.z)
    controls.update()
  }
}

// スクリーンショットをダウンロードする関数
const downloadScreenshot = () => {
  if (renderer && threeCanvas.value) {
    // レンダリング
    renderer.render(scene, camera)
    
    // キャンバスから画像データを取得
    const dataURL = threeCanvas.value.toDataURL('image/png')
    
    // ダウンロードリンクを作成
    const link = document.createElement('a')
    link.download = `pokemon-stadium-${new Date().getTime()}.png`
    link.href = dataURL
    
    // ダウンロードを実行
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// ウィンドウリサイズに対応
const handleResize = () => {
  if (camera && renderer && canvasContainer.value) {
    camera.aspect = canvasContainer.value.clientWidth / canvasContainer.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvasContainer.value.clientWidth, canvasContainer.value.clientHeight)
  }
}

// コンポーネントマウント時
onMounted(() => {
  nextTick(() => {
    initThreeJS()
    window.addEventListener('resize', handleResize)
  })
})

// コンポーネントアンマウント時
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (controls) {
    controls.dispose()
  }
  if (renderer) {
    renderer.dispose()
  }
  window.removeEventListener('resize', handleResize)
})

// パンくず（多言語対応）
const breadcrumbs = computed(() => [
  { 
    title: appConfig.translation.top[currentLanguage.value as keyof typeof appConfig.translation.top], 
    disabled: false, 
    to: '/' 
  },
  { 
    title: tr.value.pageTitle, 
    disabled: true, 
    href: '/webapp/stadium_view' 
  },
])

</script>

<style scoped>
.stadium-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 500px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.stadium-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .canvas-wrapper {
    height: 50vh;
    min-height: 400px;
  }
  
  .v-btn {
    font-size: 0.8rem;
  }
}
</style>