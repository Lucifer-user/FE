<template>
  <div class="h-80 w-full flex items-center justify-center">
    <Doughnut v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
    <div v-else class="flex h-full items-center justify-center text-sm text-slate-500">
      Đang tải dữ liệu biểu đồ...
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  data: Array<{ name: string; total: number }>
}>()

// Premium color palette for charts
const colorPalette = [
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#64748b', // slate-500
]

const chartData = computed(() => {
  return {
    labels: props.data.map(d => d.name),
    datasets: [
      {
        backgroundColor: colorPalette,
        data: props.data.map(d => d.total),
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
      }
    }
  },
  cutout: '70%',
}
</script>
