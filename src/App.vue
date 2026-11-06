<script setup>
import { ref, onMounted } from 'vue';
import { useStockStore } from './stores/stockStore';
import CurrentPositionCard from './components/CurrentPositionCard.vue';
import AveragingDownCalculator from './components/AveragingDownCalculator.vue';
import PnLScenarioChart from './components/PnLScenarioChart.vue';
import TransactionForm from './components/TransactionForm.vue';
import TransactionHistory from './components/TransactionHistory.vue';
import ProfitLossCard from './components/ProfitLossCard.vue';
import CostBasisChart from './components/CostBasisChart.vue';

const stockStore = useStockStore();
const currentPosition = ref({ units: 0, price: 0 });
const showAdvanced = ref(false);
const calculatorRef = ref(null);

onMounted(() => {
  stockStore.loadFromStorage();
});

function updatePosition(pos) {
  currentPosition.value = pos;
}
</script>

<template>
  <div class="min-h-dvh bg-canvas">
    <header class="sticky top-0 z-20 bg-canvas/85 backdrop-blur border-b border-hairline pt-[env(safe-area-inset-top)]">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <span class="icon-chip bg-pale-blue text-pale-blue-ink">↘</span>
        <h1 class="text-sm font-semibold tracking-tight text-ink">Stock Averaging</h1>
        <span class="tag tag-yellow ml-auto">Calculator</span>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <section class="mb-6 sm:mb-8">
        <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">Average down, clearly.</h2>
        <p class="mt-2 text-sm sm:text-base text-ink-muted max-w-xl">
          Work out your new average cost and preview profit &amp; loss at different exit prices.
        </p>
      </section>

      <div class="space-y-4 sm:space-y-5">
        <CurrentPositionCard @update-position="updatePosition" />
        <AveragingDownCalculator
          ref="calculatorRef"
          :current-units="currentPosition.units"
          :current-price="currentPosition.price"
          :current-cost="currentPosition.units * currentPosition.price"
        />
        <PnLScenarioChart
          :new-average-cost="calculatorRef?.newAverageCost || 0"
          :total-units-after="calculatorRef?.totalUnitsAfter || 0"
          :total-cost-after="calculatorRef?.totalCostAfter || 0"
          :current-price="currentPosition.price"
        />
      </div>

      <section class="mt-10 pt-6 border-t border-line">
        <button
          type="button"
          @click="showAdvanced = !showAdvanced"
          :aria-expanded="showAdvanced"
          class="w-full flex items-center gap-3 py-2 text-left group"
        >
          <span class="icon-chip bg-surface-muted border border-line text-ink-muted transition-transform duration-200" :class="{ 'rotate-90': showAdvanced }">›</span>
          <span class="flex-1">
            <span class="block text-sm font-semibold text-ink">Transaction history &amp; analysis</span>
            <span class="block text-xs text-ink-muted">Log purchases, track cost basis and P&amp;L</span>
          </span>
          <span class="tag tag-blue">Advanced</span>
        </button>

        <div v-if="showAdvanced" class="mt-4 space-y-4 sm:space-y-5">
          <TransactionForm />
          <TransactionHistory />
          <CostBasisChart />
          <ProfitLossCard />
        </div>
      </section>
    </main>
  </div>
</template>
