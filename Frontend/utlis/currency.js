// Currency utility functions
export const formatCurrency = (amount) => {
  if (!amount || isNaN(amount)) return '₹0.00';
  
  const formattedAmount = parseFloat(amount).toFixed(2);
  return `₹${formattedAmount}`;
};

export const formatPrice = (price, oldPrice = null) => {
  if (!price) return '';
  
  const formattedPrice = formatCurrency(price);
  
  if (oldPrice && oldPrice > price) {
    return (
      <>
        <span className="old-price">{formatCurrency(oldPrice)}</span>
        {' '}
        {formattedPrice}
      </>
    );
  }
  
  return formattedPrice;
};

// Convert USD to INR (approximate rate)
export const usdToInr = (usdAmount) => {
  const exchangeRate = 83.5; // Approximate USD to INR rate
  return usdAmount * exchangeRate;
}; 