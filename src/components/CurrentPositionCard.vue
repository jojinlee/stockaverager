<template>
  <div class="card">
    <div class="flex items-start gap-3 mb-5">
      <span class="icon-chip bg-pale-blue text-pale-blue-ink">◎</span>
      <div>
        <h2 class="card-title">Current position</h2>
        <p class="card-subtitle">What you hold today</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:gap-4">
      <div>
        <label for="currentUnits" class="field-label">Units held</label>
        <input
          v-model.number="form.currentUnits"
          type="number"
          inputmode="decimal"
          id="currentUnits"
          placeholder="2000"
          step="0.01"
          min="0"
          @input="updatePosition"
          class="field-input font-mono"
        />
      </div>

      <div>
        <label for="currentPrice" class="field-label">Price per unit</label>
        <input
          v-model.number="form.currentPrice"
          type="number"
          inputmode="decimal"
          id="currentPrice"
          placeholder="0.69"
          step="0.0001"
          min="0"
          @input="updatePosition"
          class="field-input font-mono"
        />
      </div>
    </div>

    <div
      v-if="form.currentUnits > 0"
      class="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg bg-surface-muted border border-line px-4 py-3"
    >
      <p class="text-sm text-ink-muted">
        <span class="font-mono text-ink">{{ formatNumber(form.currentUnits) }}</span> units @
        <span class="font-mono text-ink">{{ formatCurrency(form.currentPrice || 0) }}</span>
      </p>
      <p class="flex items-center gap-2">
        <span class="tag tag-yellow">Invested</span>
        <span class="font-mono text-base font-medium text-ink tabular-nums">{{ formatCurrency(totalCostCurrent) }}</span>
      </p>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { formatCurrency, formatNumber } from '../utils/calculations';

const emit = defineEmits(['update-position']);

const form = ref({
  currentUnits: '',
  currentPrice: ''
});

const totalCostCurrent = computed(() => {
  const units = parseFloat(form.value.currentUnits) || 0;
  const price = parseFloat(form.value.currentPrice) || 0;
  return units * price;
});

const unrealizedLossPercent = computed(() => {
  if (!form.value.currentUnits || !form.value.currentPrice) return 0;
  // Assuming original cost was at current price (since we don't have original purchase info)
  // This is just showing how much underwater they are
  return 0; // Will be calculated based on averaging scenarios
});

function updatePosition() {
  emit('update-position', {
    units: parseFloat(form.value.currentUnits) || 0,
    price: parseFloat(form.value.currentPrice) || 0
  });
}
</script>

