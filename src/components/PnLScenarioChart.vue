<template>
  <div class="card">
    <div class="flex items-start gap-3 mb-5">
      <span class="icon-chip bg-pale-yellow text-pale-yellow-ink">≈</span>
      <div class="flex-1 min-w-0">
        <h2 class="card-title">P&amp;L scenarios</h2>
        <p class="card-subtitle">Projected profit / loss at different exit prices</p>
      </div>
    </div>

    <template v-if="chartReady">
      <div class="flex flex-wrap gap-2 mb-3">
        <span class="tag tag-green">Profit</span>
        <span class="tag tag-red">Loss</span>
      </div>
      <div class="relative h-64 sm:h-80 -mx-1">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </template>

    <div v-else class="h-48 sm:h-64 flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-line bg-surface-muted">
      <p class="text-sm text-ink-muted">Enter your current position to see scenarios</p>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  newAverageCost: {
    type: Number,
    default: 0
  },
  totalUnitsAfter: {
    type: Number,
    default: 0
  },
  totalCostAfter: {
    type: Number,
    default: 0
  },
  currentPrice: {
    type: Number,
    default: 0
  }
});

// Generate exit price scenarios
const exitPrices = computed(() => {
  if (props.currentPrice === 0) return [];
  const minPrice = Math.max(0.01, props.currentPrice * 0.5);
  const maxPrice = props.currentPrice * 1.5;
  const step = (maxPrice - minPrice) / 9; // 10 data points
  const prices = [];
  for (let i = 0; i < 10; i++) {
    prices.push(minPrice + step * i);
  }
  return prices;
});

const pnlData = computed(() => {
  return exitPrices.value.map(price => {
    const currentValue = price * props.totalUnitsAfter;
    return currentValue - props.totalCostAfter;
  });
});

const chartReady = computed(() => props.totalUnitsAfter > 0 && props.currentPrice > 0);

const INK_MUTED = '#787774';
const GRID = 'rgba(0, 0, 0, 0.06)';

const chartData = computed(() => {
  return {
    labels: exitPrices.value.map(price => price.toFixed(4)),
    datasets: [
      {
        label: 'P&L (RM)',
        data: pnlData.value,
        backgroundColor: pnlData.value.map(pnl => (pnl >= 0 ? '#EDF3EC' : '#FDEBEC')),
        borderColor: pnlData.value.map(pnl => (pnl >= 0 ? '#346538' : '#9F2F2D')),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: '#2F2E2B',
      bodyColor: '#2F2E2B',
      borderColor: '#EAEAEA',
      borderWidth: 1,
      padding: 10,
      displayColors: false,
      callbacks: {
        title: function(items) {
          return `Exit price: RM ${exitPrices.value[items[0].dataIndex].toFixed(4)}`;
        },
        label: function(context) {
          return `P&L: RM ${context.parsed.y.toFixed(2)}`;
        }
      }
    }
  },
  scales: {
    y: {
      border: { display: false },
      ticks: { color: INK_MUTED, font: { size: 11 }, maxTicksLimit: 6 },
      grid: { color: GRID }
    },
    x: {
      title: { display: true, text: 'Exit price (RM)', color: INK_MUTED, font: { size: 11 } },
      border: { color: '#EAEAEA' },
      ticks: { color: INK_MUTED, font: { size: 10 }, maxRotation: 0, autoSkip: true, autoSkipPadding: 8 },
      grid: { display: false }
    }
  }
}));
</script>
