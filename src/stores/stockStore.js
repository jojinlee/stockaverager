import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  calculateAveragePrice,
  calculateTotalCost,
  calculateTotalUnits,
  calculateProfitLoss,
  calculateRunningAverages
} from '../utils/calculations';

const STORAGE_KEY = 'stock-averaging-transactions';

export const useStockStore = defineStore('stock', () => {
  // State
  const transactions = ref([]);

  // Load transactions from localStorage on init
  function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        transactions.value = JSON.parse(stored);
      } catch (e) {
        console.error('Error loading transactions:', e);
      }
    }
  }

  // Save transactions to localStorage
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions.value));
  }

  // Computed values
  const totalUnits = computed(() => calculateTotalUnits(transactions.value));
  const totalCost = computed(() => calculateTotalCost(transactions.value));
  const averagePrice = computed(() => calculateAveragePrice(transactions.value));
  const runningAverages = computed(() => calculateRunningAverages(transactions.value));

  // Actions
  function addTransaction(units, price) {
    if (units <= 0 || price <= 0) {
      throw new Error('Units and price must be greater than 0');
    }

    const newTransaction = {
      id: Date.now(),
      units: parseFloat(units),
      price: parseFloat(price),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    };

    transactions.value.push(newTransaction);
    saveToStorage();
    return newTransaction;
  }

  function removeTransaction(id) {
    const index = transactions.value.findIndex(tx => tx.id === id);
    if (index > -1) {
      transactions.value.splice(index, 1);
      saveToStorage();
    }
  }

  function clearAllTransactions() {
    transactions.value = [];
    saveToStorage();
  }

  function getProfitLoss(currentPrice) {
    return calculateProfitLoss(totalCost.value, currentPrice, totalUnits.value);
  }

  return {
    transactions,
    totalUnits,
    totalCost,
    averagePrice,
    runningAverages,
    addTransaction,
    removeTransaction,
    clearAllTransactions,
    getProfitLoss,
    loadFromStorage
  };
});
