<template>
  <div class="card">
    <div class="flex items-start gap-3 mb-6">
      <span class="icon-chip bg-pale-green text-pale-green-ink">↓</span>
      <div>
        <h2 class="card-title">Averaging down</h2>
        <p class="card-subtitle">Simulate an additional purchase</p>
      </div>
    </div>

    <div class="space-y-7">
      <div>
        <div class="flex items-center justify-between gap-3 mb-2">
          <label for="addUnits" class="field-label !mb-0">Units to add</label>
          <input
            id="addUnits"
            v-model.number="addUnits"
            type="number"
            inputmode="decimal"
            min="0"
            step="1"
            aria-label="Units to add"
            class="field-input !h-9 !w-32 text-right font-mono !text-sm"
          />
        </div>
        <input
          v-model.number="addUnits"
          type="range"
          :min="0"
          :max="maxAddUnits"
          :step="1"
          aria-label="Units to add slider"
          class="range"
          @input="updateCalculations"
        />
        <div class="flex justify-between text-xs text-ink-faint font-mono mt-1">
          <span>0</span>
          <span>{{ formatNumber(maxAddUnits) }}</span>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between gap-3 mb-2">
          <label for="buyPrice" class="field-label !mb-0">Buy price</label>
          <input
            id="buyPrice"
            v-model.number="buyPrice"
            type="number"
            inputmode="decimal"
            min="0"
            step="0.0001"
            aria-label="Buy price"
            class="field-input !h-9 !w-32 text-right font-mono !text-sm"
          />
        </div>
        <input
          v-model.number="buyPrice"
          type="range"
          :min="minBuyPrice"
          :max="maxBuyPrice"
          :step="0.0001"
          aria-label="Buy price slider"
          class="range"
          @input="updateCalculations"
        />
        <div class="flex justify-between text-xs text-ink-faint font-mono mt-1">
          <span>{{ formatCurrency(minBuyPrice) }}</span>
          <span>{{ formatCurrency(maxBuyPrice) }}</span>
        </div>
      </div>

      <dl class="grid grid-cols-2 sm:grid-cols-4 rounded-lg border border-line overflow-hidden bg-line gap-px">
        <div class="bg-surface p-3 sm:p-4">
          <dt class="stat-label flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-pale-green-ink"></span>New average</dt>
          <dd class="stat-value mt-1">{{ formatCurrency(newAverageCost) }}</dd>
        </div>
        <div class="bg-surface p-3 sm:p-4">
          <dt class="stat-label">Total units</dt>
          <dd class="stat-value mt-1">{{ formatNumber(totalUnitsAfter) }}</dd>
        </div>
        <div class="bg-surface p-3 sm:p-4">
          <dt class="stat-label">Total cost</dt>
          <dd class="stat-value mt-1">{{ formatCurrency(totalCostAfter) }}</dd>
        </div>
        <div class="bg-surface p-3 sm:p-4">
          <dt class="stat-label">Breakeven</dt>
          <dd class="stat-value mt-1">{{ formatCurrency(newAverageCost) }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { formatCurrency, formatNumber } from '../utils/calculations';

const props = defineProps({
  currentUnits: {
    type: Number,
    default: 0
  },
  currentPrice: {
    type: Number,
    default: 0
  },
  currentCost: {
    type: Number,
    default: 0
  }
});

const addUnits = ref(0);
const buyPrice = ref(0.38);

const maxAddUnits = computed(() => Math.max(props.currentUnits * 2, 5000));
const minBuyPrice = computed(() => Math.min(props.currentPrice, 0.1) * 0.5 || 0.01);
const maxBuyPrice = computed(() => Math.max(props.currentPrice, 1) * 1.5 || 1);

const safeAddUnits = computed(() => Number(addUnits.value) || 0);
const safeBuyPrice = computed(() => Number(buyPrice.value) || 0);

const totalUnitsAfter = computed(() => props.currentUnits + safeAddUnits.value);

const totalCostAfter = computed(() => {
  return props.currentCost + (safeAddUnits.value * safeBuyPrice.value);
});

const newAverageCost = computed(() => {
  if (totalUnitsAfter.value === 0) return 0;
  return totalCostAfter.value / totalUnitsAfter.value;
});

function updateCalculations() {
  // Calculations are reactive via computed properties
}

defineExpose({
  addUnits,
  buyPrice,
  newAverageCost,
  totalUnitsAfter,
  totalCostAfter
});
</script>

