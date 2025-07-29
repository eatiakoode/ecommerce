// Currency conversion utility
// 1 USD = approximately 83 INR (you can update this rate as needed)
const USD_TO_INR_RATE = 83;

/**
 * Convert USD amount to INR
 * @param {number} usdAmount - Amount in USD
 * @returns {number} - Amount in INR
 */
export const convertUSDToINR = (usdAmount) => {
  if (typeof usdAmount !== 'number' || isNaN(usdAmount)) {
    return 0;
  }
  return Math.round(usdAmount * USD_TO_INR_RATE);
};

/**
 * Format INR amount with proper currency symbol and formatting
 * @param {number} inrAmount - Amount in INR
 * @returns {string} - Formatted INR amount
 */
export const formatINR = (inrAmount) => {
  if (typeof inrAmount !== 'number' || isNaN(inrAmount)) {
    return '₹0';
  }
  
  // Format with commas for thousands
  const formatted = inrAmount.toLocaleString('en-IN');
  return `₹${formatted}`;
};

/**
 * Convert and format USD to INR
 * @param {number} usdAmount - Amount in USD
 * @returns {string} - Formatted INR amount
 */
export const convertAndFormatUSDToINR = (usdAmount) => {
  const inrAmount = convertUSDToINR(usdAmount);
  return formatINR(inrAmount);
};

/**
 * Extract numeric value from USD string and convert to INR
 * @param {string} usdString - String like "$2399" or "$2,399"
 * @returns {string} - Formatted INR amount
 */
export const convertUSDStringToINR = (usdString) => {
  if (!usdString || typeof usdString !== 'string') {
    return '₹0';
  }
  
  // Remove $ and commas, then convert to number
  const numericValue = parseFloat(usdString.replace(/[$,]/g, ''));
  
  if (isNaN(numericValue)) {
    return '₹0';
  }
  
  return convertAndFormatUSDToINR(numericValue);
}; 