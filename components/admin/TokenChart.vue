<template>
  <div class="relative w-full h-full flex flex-col md:flex-row items-center gap-8">
    <template v-if="displayServices.length > 0">
      <!-- Chart Container -->
      <div class="relative w-48 h-48 md:w-64 md:h-64">
        <Doughnut :data="chartData" :options="chartOptions" />
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-[10px] text-slate-400/50 dark:text-white/20 uppercase font-black tracking-widest transition-colors">{{ $t('admin.home.total_usage') }}</span>
          <span class="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] transition-colors">{{ formatNumber(totalTokens) }}</span>
        </div>
      </div>

      <!-- Custom Legend -->
      <div class="flex-1 grid grid-cols-1 gap-3 w-full">
        <div v-for="(s, i) in displayServices" :key="s.name" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all group">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" :style="{ color: colors[i % colors.length] }"></div>
            <span class="text-xs font-bold text-slate-600 dark:text-white/70 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{{ s.name }}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-xs font-bold text-slate-900 dark:text-white transition-colors">{{ formatNumber(s.tokenUsed) }}</span>
            <span class="text-[8px] text-slate-400 dark:text-white/20 uppercase font-black transition-colors">{{ ((s.tokenUsed / totalTokens) * 100).toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Empty State -->
    <div v-else class="w-full h-full flex flex-col items-center justify-center py-12 text-slate-400 dark:text-white/30">
      <span class="material-symbols-outlined text-4xl mb-3 opacity-50">data_alert</span>
      <p class="text-sm font-bold uppercase tracking-widest">{{ $t('admin.home.no_usage_data') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useTheme } from '~/composables/useTheme'

ChartJS.register(ArcElement, Tooltip, Legend)

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

const totalTokens = computed(() => displayServices.value.reduce((acc, s) => acc + (s.tokenUsed || 0), 0))

const chartData = computed(() => ({
  labels: displayServices.value.map(s => s.name),
  datasets: [
    {
      data: displayServices.value.map(s => s.tokenUsed),
      backgroundColor: colors,
      borderColor: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      borderWidth: 2,
      hoverOffset: 15,
      spacing: 5,
      cutout: '75%'
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false // We use our own custom legend
    },
    tooltip: {
      backgroundColor: isDark.value ? '#1a1a1a' : '#ffffff',
      titleColor: isDark.value ? '#ffffff' : '#0f172a',
      bodyColor: isDark.value ? '#ffffff' : '#0f172a',
      titleFont: { size: 12, weight: 'bold', family: 'Inter' },
      bodyFont: { size: 12, family: 'Inter' },
      padding: 12,
      cornerRadius: 12,
      displayColors: true,
      borderColor: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1
    }
  }
}))

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return new Intl.NumberFormat().format(num || 0)
}
</script>
