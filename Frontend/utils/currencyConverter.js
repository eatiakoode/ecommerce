/**
 * Formats amount to INR currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted INR amount with ₹ symbol
 */
export const formatToINR = (amount) => {
  if (!amount || isNaN(amount)) return '₹0.00';
  
  const formatted = parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `₹${formatted}`;
};

/**
 * Formats string amount to INR
 * @param {string} amountString - String like "2399" or "2,399"
 * @returns {string} - Formatted INR amount with ₹ symbol
 */
export const formatStringToINR = (amountString) => {
  if (!amountString) return '₹0.00';
  
  // Remove commas and convert to number
  const numericValue = parseFloat(amountString.replace(/[,]/g, ''));
  
  if (isNaN(numericValue)) return '₹0.00';
  
  return formatToINR(numericValue);
}; 