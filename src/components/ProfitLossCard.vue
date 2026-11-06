<template>
  <div class="card">
    <button
      type="button"
      class="w-full flex items-start gap-3 text-left"
      :aria-expanded="isExpanded"
      @click="isExpanded = !isExpanded"
    >
      <span class="icon-chip bg-pale-red text-pale-red-ink">±</span>
      <span class="flex-1">
        <span class="card-title block">Profit / loss</span>
        <span class="card-subtitle block">Value your holdings at a market price</span>
      </span>
      <span class="text-ink-faint text-lg leading-8 transition-transform duration-200" :class="{ 'rotate-180': isExpanded }">⌄</span>
    </button>

    <div v-if="isExpanded" class="mt-5 space-y-4">
      <div>
        <label for="marketPrice" class="field-label">Current market price per unit</label>
        <input
          v-model.number="currentPrice"
          type="number"
          inputmode="decimal"
          id="marketPrice"
          placeholder="55.00"
          step="0.0001"
          min="0"
          class="field-input font-mono"
        />
      </div>

      <dl v-if="stockStore.totalUnits > 0" class="grid grid-cols-2 gap-px bg-line rounded-lg border border-line overflow-hidden">
        <div class="bg-surface p-3 sm:p-4">
          <dt class="stat-label">Market value</dt>
          <dd class="stat-value mt-1">{{ formatCurrency(currentValue) }}</dd>
        </div>
        <div class="bg-surface p-3 sm:p-4">
          <dt class="stat-label">Total cost</dt>
          <dd class="stat-value mt-1">{{ formatCurrency(stockStore.totalCost) }}</dd>
        </div>
        <div class="p-3 sm:p-4" :class="profitLoss.absolute >= 0 ? 'bg-pale-green' : 'bg-pale-red'">
          <dt class="stat-label">P&amp;L</dt>
          <dd
            class="stat-value mt-1"
            :class="profitLoss.absolute >= 0 ? '!text-pale-green-ink' : '!text-pale-red-ink'"
          >
            {{ formatCurrency(profitLoss.absolute) }}
          </dd>
        </div>
        <div class="p-3 sm:p-4" :class="profitLoss.percentage >= 0 ? 'bg-pale-green' : 'bg-pale-red'">
          <dt class="stat-label">Return</dt>
          <dd
            class="stat-value mt-1"
            :class="profitLoss.percentage >= 0 ? '!text-pale-green-ink' : '!text-pale-red-ink'"
          >
            {{ profitLoss.percentage }}%
          </dd>
        </div>
      </dl>

      <div v-else class="h-24 flex items-center justify-center text-center rounded-lg border border-dashed border-line bg-surface-muted">
        <p class="text-sm text-ink-muted">Add transactions to calculate profit / loss</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useStockStore } from '../stores/stockStore';
import { formatCurrency } from '../utils/calculations';

const stockStore = useStockStore();
const currentPrice = ref('');
const isExpanded = ref(false);

const currentValue = computed(() => {
  return parseFloat(currentPrice.value) * stockStore.totalUnits || 0;
});

const profitLoss = computed(() => {
  if (!currentPrice.value || stockStore.totalUnits === 0) {
    return { absolute: 0, percentage: 0 };
  }
  return stockStore.getProfitLoss(parseFloat(currentPrice.value));
});
</script>

