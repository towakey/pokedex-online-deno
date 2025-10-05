<script setup lang="ts">
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { reactive, watch, computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler)
ChartJS.register(ChartDataLabels)

interface StatusData {
  hp: number
  attack: number
  defense: number
  special_attack: number
  special_defense: number
  speed: number
}

interface StatusDataset {
  label: string
  color: string
  data: StatusData
}

const props = defineProps<{ 
  statusData?: StatusData
  statusList?: StatusDataset[]
}>()

const { settings } = useSettings()
const appConfig = useAppConfig()

// 統一された言語設定
const currentLanguage = computed(() => {
  return (settings.value.language === 'eng' ? 'eng' : 'jpn') as 'jpn' | 'eng'
})

// 多言語対応ラベル
const statusLabels = computed(() => {
  const lang = currentLanguage.value
  return [
    appConfig.translation.hp[lang],
    appConfig.translation.attack[lang],
    appConfig.translation.defense[lang],
    appConfig.translation.spAttack[lang],
    appConfig.translation.spDefense[lang],
    appConfig.translation.speed[lang],
  ]
})

// 複数データセット表示かどうか
const isMultiDataset = computed(() => !!props.statusList && props.statusList.length > 0)

const chartOptions = reactive({
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      beginAtZero: true,
      max: 260,
      ticks: {
        stepSize: 50,
        color: '#666',
        font: {
          size: 12,
        },
      } as any,
      grid: {
        color: '#ddd',
      },
      pointLabels: {
        color: '#333',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
      } as any,
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        color: '#333',
        font: {
          size: 12,
        },
        usePointStyle: true,
      },
    },
    datalabels: {
      display: false, // 複数データセット時は煩雑になるため無効化
      color: '#333',
      font: {
        weight: 'bold' as const,
        size: 12,
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 4,
      padding: 4,
    } as any,
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
    },
  },
} as any)

// データセット生成関数
const generateDatasets = () => {
  // 複数データセットモード
  if (props.statusList && props.statusList.length > 0) {
    return props.statusList.map((dataset) => {
      const rgbaColor = dataset.color.startsWith('#') 
        ? hexToRgba(dataset.color, 0.2) 
        : `${dataset.color.replace(')', ', 0.2)')}`
      
      return {
        label: dataset.label,
        data: [
          dataset.data.hp,
          dataset.data.attack,
          dataset.data.defense,
          dataset.data.special_attack,
          dataset.data.special_defense,
          dataset.data.speed,
        ],
        backgroundColor: rgbaColor,
        borderColor: dataset.color,
        borderWidth: 2,
        pointBackgroundColor: dataset.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    })
  }
  
  // 単体データモード（後方互換）
  return [
    {
      label: 'ステータス',
      data: [
        props.statusData?.hp ?? 0,
        props.statusData?.attack ?? 0,
        props.statusData?.defense ?? 0,
        props.statusData?.special_attack ?? 0,
        props.statusData?.special_defense ?? 0,
        props.statusData?.speed ?? 0,
      ],
      backgroundColor: 'rgba(63, 136, 197, 0.2)',
      borderColor: '#3F88C5',
      borderWidth: 2,
      pointBackgroundColor: '#3F88C5',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    },
  ]
}

// Hex to RGBA変換
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const chartData = reactive({
  labels: statusLabels.value,
  datasets: generateDatasets(),
})

// 言語が変わったらラベルを更新
watch(
  statusLabels,
  (newLabels) => {
    chartData.labels = newLabels
  }
)

// プロップスが変わったらデータセットを更新
watch(
  () => [props.statusData, props.statusList],
  () => {
    chartData.datasets = generateDatasets()
  },
  { deep: true }
)
</script>

<template>
  <v-card
    variant="outlined"
    style="margin-top: 20px; background-color: white;"
    :id="`status`"
  >
    <v-card-text>
      <ClientOnly>
        <Radar id="status-chart" :options="chartOptions" :data="chartData" />
      </ClientOnly>
    </v-card-text>
  </v-card>
</template>

<style scoped>
[id] {
  scroll-margin-top: 80px;
}
</style>
