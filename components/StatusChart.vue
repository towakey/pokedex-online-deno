<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { reactive, watch } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
ChartJS.register(ChartDataLabels)

interface StatusData {
  hp: number
  attack: number
  defense: number
  special_attack: number
  special_defense: number
  speed: number
}

const props = defineProps<{ statusData?: StatusData }>()

const chartOptions = reactive({
  responsive: true,
  indexAxis: 'y' as const,
  scales: {
    x: {
      max: 260,
    },
  },
  plugins: {
    legend: {
      display: false,
      labels: {
        color: '#000',
      },
    },
    datalabels: {
      color: '#fff',
      font: {
        weight: 'bold',
        size: 14,
      },
    },
    tooltip: {
      enabled: false,
    },
  },
})

const chartData = reactive({
  labels: ['HP', 'こうげき', 'ぼうぎょ', 'とくこう', 'とくぼう', 'すばやさ'],
  datasets: [
    {
      data: [
        props.statusData?.hp ?? 0,
        props.statusData?.attack ?? 0,
        props.statusData?.defense ?? 0,
        props.statusData?.special_attack ?? 0,
        props.statusData?.special_defense ?? 0,
        props.statusData?.speed ?? 0,
      ],
      backgroundColor: [
        '#3F88C5',
        '#3F88C5',
        '#3F88C5',
        '#3F88C5',
        '#3F88C5',
        '#3F88C5',
      ],
    },
  ],
})

// プロップスが変わったらデータセットを更新
watch(
  () => props.statusData,
  (val) => {
    if (!val) return
    chartData.datasets[0].data = [
      val.hp,
      val.attack,
      val.defense,
      val.special_attack,
      val.special_defense,
      val.speed,
    ]
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
        <Bar id="status-chart" :options="chartOptions" :data="chartData" />
      </ClientOnly>
    </v-card-text>
  </v-card>
</template>

<style scoped>
[id] {
  scroll-margin-top: 80px;
}
</style>
