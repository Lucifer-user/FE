<template>
  <div class="w-full h-64 md:h-80 relative">
    <template v-if="displayServices.length > 0">
      <Bar :data="chartData" :options="chartOptions" />
    </template>
    <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-white/30">
      <span class="material-symbols-outlined text-4xl mb-3 opacity-50">analytics</span>
      <p class="text-sm font-bold uppercase tracking-widest">{{ $t('admin.home.no_performance_data') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import { useTheme } from '~/composables/useTheme'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const { isDark } = useTheme()

const props = defineProps({
  services: {
    type: Array,
    default: () => []
  }
})

const colors = [
  '#00f0ff', // cyan
  '#7701d0', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#10b981'  // emerald
]

const displayServices = computed(() => {
  return props.services || []
})

const chartData = computed(() => ({
  labels: displayServices.value.map(s => s.name),
  datasets: [
    {
      label: 'Tokens Used',
      data: displayServices.value.map(s => s.tokenUsed),
      backgroundColor: displayServices.value.map((_, i) => colors[i % colors.length] + '44'), // Semi-transparent
      borderColor: displayServices.value.map((_, i) => colors[i % colors.length]),
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: displayServices.value.map((_, i) => colors[i % colors.length]),
      maxBarThickness: 40
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.5)',
        font: { size: 10, weight: 'bold', family: 'Inter' }
      }
    },
    y: {
      grid: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.5)',
        font: { size: 10, family: 'Inter' },
        callback: (value) => {
          if (value >= 1000000) return (value / 1000000) + 'M'
          if (value >= 1000) return (value / 1000) + 'K'
          return value
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: isDark.value ? '#1a1a1a' : '#ffffff',
      titleColor: isDark.value ? '#ffffff' : '#0f172a',
      bodyColor: isDark.value ? '#ffffff' : '#0f172a',
      titleFont: { size: 12, weight: 'bold', family: 'Inter' },
      bodyFont: { size: 12, family: 'Inter' },
      padding: 12,
      cornerRadius: 12,
      borderColor: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1
    }
  }
}))
</script>
