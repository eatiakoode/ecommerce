const fs = require('fs');
const path = require('path');

// Currency conversion rate
const USD_TO_INR_RATE = 83;

// Function to convert USD to INR
const convertUSDToINR = (usdAmount) => {
  return Math.round(usdAmount * USD_TO_INR_RATE);
};

// Function to format INR
const formatINR = (inrAmount) => {
  return `₹${inrAmount.toLocaleString('en-IN')}`;
};

// Function to convert USD string to INR
const convertUSDStringToINR = (usdString) => {
  const numericValue = parseFloat(usdString.replace(/[$,]/g, ''));
  if (isNaN(numericValue)) return '₹0';
  return formatINR(convertUSDToINR(numericValue));
};

// Files to update
const filesToUpdate = [
  'frontend/data/testimonials.js',
  'frontend/data/collections.js',
  'frontend/components/productDetails/SpecialDeal.jsx',
  'frontend/components/productDetails/SubscribeAndSave.jsx',
  'frontend/components/otherPages/ShopCart.jsx',
  'frontend/components/productDetails/details/DetailsExternal.jsx',
  'frontend/components/productDetails/ComboDeal2.jsx',
  'frontend/components/productDetails/ComboDeal.jsx',
  'frontend/components/otherPages/Checkout.jsx',
  'frontend/components/headers/Topbar2.jsx',
  'frontend/components/headers/Topbar8.jsx',
  'frontend/components/headers/Topbar7.jsx',
  'frontend/components/my-account/OrderDetails.jsx',
  'frontend/components/my-account/Orers.jsx',
  'frontend/components/headers/Topbar9.jsx',
  'frontend/components/headers/Topbar3.jsx',
  'frontend/components/headers/Topbar4.jsx',
  'frontend/components/headers/Topbar5.jsx',
  'frontend/components/headers/Topbar10.jsx',
  'frontend/components/common/MarqueeSection2.jsx',
  'Admin/src/app/(dashboard)/products/_components/EditProduct.tsx',
  'Admin/src/app/(dashboard)/orders/[id]/page.tsx'
];

// Update each file
filesToUpdate.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace USD patterns with INR
      content = content.replace(/\$(\d+(?:\.\d{2})?)/g, (match, amount) => {
        const inrAmount = convertUSDToINR(parseFloat(amount));
        return formatINR(inrAmount);
      });
      
      // Replace specific patterns
      content = content.replace(/\$(\d+,\d+)/g, (match, amount) => {
        const numericValue = parseFloat(amount.replace(/,/g, ''));
        const inrAmount = convertUSDToINR(numericValue);
        return formatINR(inrAmount);
      });
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    } else {
      console.log(`File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
});

console.log('Price conversion completed!'); 