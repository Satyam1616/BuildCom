// Number to Words Conversion for Indian Currency (Rupees)

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

/**
 * Convert number less than 100 to words
 * @param {number} num - Number less than 100
 * @returns {string} - Number in words
 */
function convertTens(num) {
  if (num < 20) {
    return ones[num];
  } else {
    const tensPlace = Math.floor(num / 10);
    const onesPlace = num % 10;
    return tens[tensPlace] + (onesPlace !== 0 ? ' ' + ones[onesPlace] : '');
  }
}

/**
 * Convert number less than 1000 to words
 * @param {number} num - Number less than 1000
 * @returns {string} - Number in words
 */
function convertHundreds(num) {
  let result = '';
  
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' Hundred';
    num %= 100;
    if (num > 0) {
      result += ' ';
    }
  }
  
  if (num > 0) {
    result += convertTens(num);
  }
  
  return result;
}

/**
 * Convert number to Indian rupees format in words
 * @param {number} amount - Amount to convert
 * @returns {string} - Amount in words
 */
function convertToWords(amount) {
  if (amount === 0) {
    return 'Zero Rupees Only';
  }
  
  if (amount < 0) {
    return 'Minus ' + convertToWords(Math.abs(amount));
  }
  
  // Split into rupees and paise
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  
  let result = '';
  
  // Convert rupees part
  if (rupees > 0) {
    result += convertRupeesToWords(rupees) + ' Rupees';
  }
  
  // Convert paise part
  if (paise > 0) {
    if (result !== '') {
      result += ' and ';
    }
    result += convertPaiseToWords(paise) + ' Paise';
  }
  
  return result + ' Only';
}

/**
 * Convert rupees amount to words (Indian numbering system)
 * @param {number} num - Rupees amount
 * @returns {string} - Rupees in words
 */
function convertRupeesToWords(num) {
  if (num === 0) return '';
  
  let result = '';
  
  // Crores (10,000,000)
  if (num >= 10000000) {
    const crores = Math.floor(num / 10000000);
    result += convertHundreds(crores) + ' Crore';
    num %= 10000000;
    if (num > 0) result += ' ';
  }
  
  // Lakhs (100,000)
  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    result += convertTens(lakhs) + ' Lakh';
    num %= 100000;
    if (num > 0) result += ' ';
  }
  
  // Thousands (1,000)
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    result += convertTens(thousands) + ' Thousand';
    num %= 1000;
    if (num > 0) result += ' ';
  }
  
  // Remaining hundreds, tens, and ones
  if (num > 0) {
    result += convertHundreds(num);
  }
  
  return result.trim();
}

/**
 * Convert paise to words
 * @param {number} paise - Paise amount (0-99)
 * @returns {string} - Paise in words
 */
function convertPaiseToWords(paise) {
  return convertTens(paise);
}

/**
 * Format number with Indian currency formatting (commas)
 * @param {number} amount - Amount to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted amount
 */
function formatIndianCurrency(amount, decimals = 2) {
  const fixed = amount.toFixed(decimals);
  const [rupees, paise] = fixed.split('.');
  
  // Indian numbering system: XX,XX,XXX
  let formatted = '';
  const rupeesStr = rupees;
  const len = rupeesStr.length;
  
  if (len <= 3) {
    formatted = rupeesStr;
  } else if (len <= 5) {
    formatted = rupeesStr.slice(0, len - 3) + ',' + rupeesStr.slice(-3);
  } else if (len <= 7) {
    formatted = rupeesStr.slice(0, len - 5) + ',' + 
                rupeesStr.slice(len - 5, len - 3) + ',' + 
                rupeesStr.slice(-3);
  } else {
    // For larger numbers, continue the pattern
    let parts = [];
    let remaining = rupeesStr;
    
    // Take last 3 digits
    parts.unshift(remaining.slice(-3));
    remaining = remaining.slice(0, -3);
    
    // Take groups of 2 digits from right to left
    while (remaining.length > 0) {
      if (remaining.length <= 2) {
        parts.unshift(remaining);
        break;
      } else {
        parts.unshift(remaining.slice(-2));
        remaining = remaining.slice(0, -2);
      }
    }
    
    formatted = parts.join(',');
  }
  
  return '₹' + formatted + (decimals > 0 ? '.' + paise : '');
}

/**
 * Convert amount to invoice format (amount in words)
 * @param {number} amount - Amount to convert
 * @param {string} currency - Currency symbol (default: 'INR')
 * @returns {object} - Formatted amount and words
 */
function formatForInvoice(amount, currency = 'INR') {
  return {
    amount: formatIndianCurrency(amount),
    amountInWords: convertToWords(amount),
    currency: currency
  };
}

/**
 * Convert decimal number to fraction words (for precise calculations)
 * @param {number} amount - Amount with decimals
 * @returns {string} - Amount in words with precise paise
 */
function convertWithPrecision(amount) {
  const rupees = Math.floor(amount);
  const decimal = amount - rupees;
  const paise = Math.round(decimal * 100);
  
  let result = '';
  
  if (rupees > 0) {
    result += convertRupeesToWords(rupees) + ' Rupees';
  }
  
  if (paise > 0) {
    if (result !== '') {
      result += ' and ';
    }
    result += convertPaiseToWords(paise) + ' Paise';
  }
  
  if (result === '') {
    result = 'Zero Rupees';
  }
  
  return result + ' Only';
}

module.exports = {
  convertToWords,
  formatIndianCurrency,
  formatForInvoice,
  convertWithPrecision
};