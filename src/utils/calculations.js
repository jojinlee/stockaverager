/**
 * Calculate weighted average price per share
 * @param {Array} transactions - Array of {units, price} objects
 * @returns {number} Average price per share
 */
export function calculateAveragePrice(transactions) {
  if (!transactions || transactions.length === 0) return 0;
  
  const totalCost = transactions.reduce((sum, tx) => sum + (tx.units * tx.price), 0);
  const totalUnits = transactions.reduce((sum, tx) => sum + tx.units, 0);
  
  return totalUnits === 0 ? 0 : totalCost / totalUnits;
}

/**
 * Calculate total cost of all transactions
 * @param {Array} transactions - Array of {units, price} objects
 * @returns {number} Total cost
 */
export function calculateTotalCost(transactions) {
  if (!transactions || transactions.length === 0) return 0;
  return transactions.reduce((sum, tx) => sum + (tx.units * tx.price), 0);
}

/**
 * Calculate total units held
 * @param {Array} transactions - Array of {units, price} objects
 * @returns {number} Total units
 */
export function calculateTotalUnits(transactions) {
  if (!transactions || transactions.length === 0) return 0;
  return transactions.reduce((sum, tx) => sum + tx.units, 0);
}

/**
 * Calculate profit or loss
 * @param {number} totalCost - Total cost of all purchases
 * @param {number} currentPrice - Current market price per share
 * @param {number} totalUnits - Total units held
 * @returns {Object} {absolute: number, percentage: number}
 */
export function calculateProfitLoss(totalCost, currentPrice, totalUnits) {
  if (totalUnits === 0) return { absolute: 0, percentage: 0 };
  
  const currentValue = currentPrice * totalUnits;
  const absolute = currentValue - totalCost;
  const percentage = (absolute / totalCost) * 100;
  
  return {
    absolute: Math.round(absolute * 100) / 100,
    percentage: Math.round(percentage * 100) / 100
  };
}

/**
 * Calculate running averages for chart display
 * @param {Array} transactions - Array of {units, price, date} objects
 * @returns {Array} Array of {date, averagePrice, totalCost, totalUnits}
 */
export function calculateRunningAverages(transactions) {
  if (!transactions || transactions.length === 0) return [];
  
  return transactions.map((_, index) => {
    const upToCurrentTx = transactions.slice(0, index + 1);
    return {
      date: transactions[index].date,
      averagePrice: calculateAveragePrice(upToCurrentTx),
      totalCost: calculateTotalCost(upToCurrentTx),
      totalUnits: calculateTotalUnits(upToCurrentTx)
    };
  });
}

/**
 * Format currency value
 * @param {number} value - Value to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

/**
 * Format number to 2 decimal places
 * @param {number} value - Value to format
 * @returns {number} Formatted number
 */
export function formatNumber(value) {
  return Math.round(value * 100) / 100;
}
