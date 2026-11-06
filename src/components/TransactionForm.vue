<template>
  <div class="card">
    <div class="flex items-start gap-3 mb-5">
      <span class="icon-chip bg-pale-green text-pale-green-ink">+</span>
      <div>
        <h2 class="card-title">Add transaction</h2>
        <p class="card-subtitle">Record a purchase</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label for="units" class="field-label">Units</label>
          <input
            v-model.number="form.units"
            type="number"
            inputmode="decimal"
            id="units"
            placeholder="10"
            step="0.01"
            min="0"
            required
            class="field-input font-mono"
          />
        </div>

        <div>
          <label for="price" class="field-label">Price per unit</label>
          <input
            v-model.number="form.price"
            type="number"
            inputmode="decimal"
            id="price"
            placeholder="50.00"
            step="0.0001"
            min="0"
            required
            class="field-input font-mono"
          />
        </div>

        <div class="col-span-2 sm:col-span-1">
          <span class="field-label">Line cost</span>
          <div class="field-static">{{ lineCost }}</div>
        </div>
      </div>

      <p v-if="error" class="tag tag-red !text-sm !py-1.5 !px-3 w-full">{{ error }}</p>

      <button type="submit" class="btn btn-primary w-full">Add transaction</button>
    </form>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useStockStore } from '../stores/stockStore';
import { formatCurrency, formatNumber } from '../utils/calculations';

const stockStore = useStockStore();
const form = ref({ units: '', price: '' });
const error = ref('');

const lineCost = computed(() => {
  const units = parseFloat(form.value.units) || 0;
  const price = parseFloat(form.value.price) || 0;
  return formatCurrency(units * price);
});

function handleSubmit() {
  error.value = '';
  try {
    if (!form.value.units || !form.value.price) {
      error.value = 'Please fill in all fields';
      return;
    }

    if (form.value.units <= 0 || form.value.price <= 0) {
      error.value = 'Units and price must be greater than 0';
      return;
    }

    stockStore.addTransaction(form.value.units, form.value.price);
    form.value = { units: '', price: '' };
  } catch (e) {
    error.value = e.message;
  }
}
</script>

