<template>
  <div class="card">
    <div class="flex items-start gap-3 mb-5">
      <span class="icon-chip bg-pale-blue text-pale-blue-ink">∿</span>
      <div>
        <h2 class="card-title">Cost basis trend</h2>
        <p class="card-subtitle">Average cost and total cost over time</p>
      </div>
    </div>

    <div v-if="stockStore.transactions.length === 0" class="h-40 flex items-center justify-center text-center rounded-lg border border-dashed border-line bg-surface-muted">
      <p class="text-sm text-ink-muted">Add transactions to see the chart</p>
    </div>

    <template v-else>
      <div class="flex flex-wrap gap-2 mb-3">
        <span class="tag tag-blue">Avg cost / share</span>
        <span class="tag tag-green">Total cost</span>
      </div>
      <div class="relative h-60 sm:h-72 -mx-1">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </template>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useStockStore } from '../stores/stockStore';
import { formatCurrency } from '../utils/calculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const stockStore = useStockStore();

const INK_MUTED = '#787774';
const GRID = 'rgba(0, 0, 0, 0.06)';

const chartData = computed(() => {
  const runningAvgs = stockStore.runningAverages;

  return {
    labels: runningAvgs.map((_, index) => `#${index + 1}`),
    datasets: [
      {
        label: 'Average cost per share',
        data: runningAvgs.map(item => item.averagePrice),
        borderColor: '#1F6C9F',
        backgroundColor: 'rgba(225, 243, 254, 0.6)',
        borderWidth: 1.5,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#1F6C9F',
        pointBorderWidth: 1.5,
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'Total cost',
        data: runningAvgs.map(item => item.totalCost),
        borderColor: '#346538',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderDash: [4, 4],
        fill: false,
        tension: 0.35,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#346538',
        pointBorderWidth: 1.5,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y1'
      }
    ]
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: '#2F2E2B',
      bodyColor: '#2F2E2B',
      borderColor: '#EAEAEA',
      borderWidth: 1,
      padding: 10,
      boxPadding: 4,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += formatCurrency(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      type: 'linear',
      position: 'left',
      border: { display: false },
      ticks: { color: '#1F6C9F', font: { size: 11 }, maxTicksLimit: 6 },
      grid: { color: GRID }
    },
    y1: {
      type: 'linear',
      position: 'right',
      border: { display: false },
      ticks: { color: '#346538', font: { size: 11 }, maxTicksLimit: 6 },
      grid: { drawOnChartArea: false }
    },
    x: {
      border: { color: '#EAEAEA' },
      ticks: { color: INK_MUTED, font: { size: 11 }, maxRotation: 0, autoSkip: true },
      grid: { display: false }
    }
  }
}));
</script>
