<template>
  <div class="h-80 w-full">
    <Line v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
    <div v-else class="flex h-full items-center justify-center text-sm text-slate-500">
      Đang tải dữ liệu biểu đồ...
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  data: Array<{ date: string; amount: number; count: number }>
}>()

const chartData = computed(() => {
  const labels = props.data.map((item) => {
    // Format date from YYYY-MM-DD to DD/MM
    const [year, month, day] = item.date.split('-')
    return `${day}/${month}`
  })
  const amounts = props.data.map((item) => item.amount)

  return {
    labels,
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        backgroundColor: 'rgba(6, 182, 212, 0.2)', // cyan-500 with opacity
        borderColor: '#06b6d4', // cyan-500
        pointBackgroundColor: '#0891b2', // cyan-600
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
        tension: 0.4,
        data: amounts,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            }).format(context.parsed.y)
          }
          return label
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(200, 200, 200, 0.1)',
      },
      ticks: {
        callback: function(value: any) {
          return new Intl.NumberFormat('vi-VN', {
            notation: "compact",
            compactDisplay: "short"
          }).format(value)
        }
      }
    },
  },
}
</script>
