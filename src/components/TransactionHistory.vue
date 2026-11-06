<template>
  <div class="card !p-0 overflow-hidden">
    <div class="flex items-start gap-3 p-5 sm:p-6 pb-4 sm:pb-4">
      <span class="icon-chip bg-pale-yellow text-pale-yellow-ink">≡</span>
      <div class="flex-1">
        <h2 class="card-title">Transaction history</h2>
        <p class="card-subtitle">{{ stockStore.transactions.length }} {{ stockStore.transactions.length === 1 ? 'entry' : 'entries' }}</p>
      </div>
      <button
        v-if="stockStore.transactions.length > 0"
        type="button"
        @click="handleClearAll"
        class="btn btn-danger !h-9 !px-3 -mr-2"
      >
        Clear all
      </button>
    </div>

    <div v-if="stockStore.transactions.length === 0" class="mx-5 sm:mx-6 mb-5 sm:mb-6 h-32 flex items-center justify-center text-center rounded-lg border border-dashed border-line bg-surface-muted">
      <p class="text-sm text-ink-muted">No transactions yet. Add one to get started.</p>
    </div>

    <template v-else>
      <!-- Mobile: stacked list -->
      <ul class="sm:hidden border-t border-line divide-y divide-line">
        <li v-for="(transaction, index) in stockStore.transactions" :key="transaction.id" class="px-5 py-4">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="font-mono text-sm text-ink tabular-nums">
                {{ formatNumber(transaction.units) }} × {{ formatCurrency(transaction.price) }}
              </p>
              <p class="text-xs text-ink-muted mt-0.5">{{ transaction.date }}</p>
            </div>
            <p class="font-mono text-sm font-medium text-ink tabular-nums shrink-0">
              {{ formatCurrency(transaction.units * transaction.price) }}
            </p>
          </div>
          <div class="mt-2 flex items-center justify-between gap-2">
            <div class="flex flex-wrap gap-1.5">
              <span class="tag tag-blue font-mono">avg {{ formatCurrency(getRunningAverage(index)) }}</span>
              <span class="tag bg-surface-muted text-ink-muted border border-line font-mono">Σ {{ formatCurrency(getRunningTotal(index)) }}</span>
            </div>
            <button
              type="button"
              @click="stockStore.removeTransaction(transaction.id)"
              class="btn btn-danger !h-9 !px-3 -mr-3"
              aria-label="Delete transaction"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>

      <!-- Tablet/desktop: table -->
      <div class="hidden sm:block overflow-x-auto border-t border-line">
        <table class="w-full text-sm">
          <thead class="bg-surface-muted">
            <tr class="text-xs text-ink-muted">
              <th class="px-6 py-2.5 text-left font-medium">Date</th>
              <th class="px-3 py-2.5 text-right font-medium">Units</th>
              <th class="px-3 py-2.5 text-right font-medium">Price</th>
              <th class="px-3 py-2.5 text-right font-medium">Line cost</th>
              <th class="px-3 py-2.5 text-right font-medium">Avg price</th>
              <th class="px-3 py-2.5 text-right font-medium">Total cost</th>
              <th class="px-6 py-2.5"><span class="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line font-mono tabular-nums">
            <tr
              v-for="(transaction, index) in stockStore.transactions"
              :key="transaction.id"
              class="hover:bg-canvas-soft"
            >
              <td class="px-6 py-3 text-ink-muted font-sans">{{ transaction.date }}</td>
              <td class="px-3 py-3 text-right text-ink">{{ formatNumber(transaction.units) }}</td>
              <td class="px-3 py-3 text-right text-ink">{{ formatCurrency(transaction.price) }}</td>
              <td class="px-3 py-3 text-right text-ink">{{ formatCurrency(transaction.units * transaction.price) }}</td>
              <td class="px-3 py-3 text-right"><span class="tag tag-blue">{{ formatCurrency(getRunningAverage(index)) }}</span></td>
              <td class="px-3 py-3 text-right text-ink">{{ formatCurrency(getRunningTotal(index)) }}</td>
              <td class="px-6 py-3 text-right font-sans">
                <button
                  type="button"
                  @click="stockStore.removeTransaction(transaction.id)"
                  class="text-xs font-medium text-ink-faint hover:text-pale-red-ink transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <dl class="grid grid-cols-3 gap-px bg-line border-t border-line">
        <div class="bg-surface-muted px-5 sm:px-6 py-4">
          <dt class="stat-label">Total units</dt>
          <dd class="font-mono text-sm sm:text-base font-medium text-ink mt-1 tabular-nums">{{ formatNumber(stockStore.totalUnits) }}</dd>
        </div>
        <div class="bg-surface-muted px-4 sm:px-6 py-4">
          <dt class="stat-label">Total cost</dt>
          <dd class="font-mono text-sm sm:text-base font-medium text-ink mt-1 tabular-nums break-all">{{ formatCurrency(stockStore.totalCost) }}</dd>
        </div>
        <div class="bg-surface-muted px-4 sm:px-6 py-4">
          <dt class="stat-label">Avg price</dt>
          <dd class="font-mono text-sm sm:text-base font-medium text-ink mt-1 tabular-nums">{{ formatCurrency(stockStore.averagePrice) }}</dd>
        </div>
      </dl>
    </template>
  </div>
</template>
<script setup>
import { useStockStore } from '../stores/stockStore';
import { formatCurrency, formatNumber, calculateAveragePrice, calculateTotalCost } from '../utils/calculations';

const stockStore = useStockStore();

function getRunningAverage(index) {
  const upToIndex = stockStore.transactions.slice(0, index + 1);
  return calculateAveragePrice(upToIndex);
}

function getRunningTotal(index) {
  const upToIndex = stockStore.transactions.slice(0, index + 1);
  return calculateTotalCost(upToIndex);
}

function handleClearAll() {
  if (confirm('Are you sure you want to delete all transactions? This cannot be undone.')) {
    stockStore.clearAllTransactions();
  }
}
</script>

