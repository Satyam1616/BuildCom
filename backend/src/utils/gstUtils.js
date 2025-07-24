// GST Utility Functions for Indian Tax Calculations

// State codes for GST calculations
const stateCodes = {
  'AN': { name: 'Andaman and Nicobar Islands', code: '35' },
  'AP': { name: 'Andhra Pradesh', code: '37' },
  'AR': { name: 'Arunachal Pradesh', code: '12' },
  'AS': { name: 'Assam', code: '18' },
  'BR': { name: 'Bihar', code: '10' },
  'CH': { name: 'Chandigarh', code: '04' },
  'CG': { name: 'Chhattisgarh', code: '22' },
  'DN': { name: 'Dadra and Nagar Haveli', code: '26' },
  'DD': { name: 'Daman and Diu', code: '25' },
  'DL': { name: 'Delhi', code: '07' },
  'GA': { name: 'Goa', code: '30' },
  'GJ': { name: 'Gujarat', code: '24' },
  'HR': { name: 'Haryana', code: '06' },
  'HP': { name: 'Himachal Pradesh', code: '02' },
  'JK': { name: 'Jammu and Kashmir', code: '01' },
  'JH': { name: 'Jharkhand', code: '20' },
  'KA': { name: 'Karnataka', code: '29' },
  'KL': { name: 'Kerala', code: '32' },
  'LA': { name: 'Ladakh', code: '38' },
  'LD': { name: 'Lakshadweep', code: '31' },
  'MP': { name: 'Madhya Pradesh', code: '23' },
  'MH': { name: 'Maharashtra', code: '27' },
  'MN': { name: 'Manipur', code: '14' },
  'ML': { name: 'Meghalaya', code: '17' },
  'MZ': { name: 'Mizoram', code: '15' },
  'NL': { name: 'Nagaland', code: '13' },
  'OR': { name: 'Odisha', code: '21' },
  'PY': { name: 'Puducherry', code: '34' },
  'PB': { name: 'Punjab', code: '03' },
  'RJ': { name: 'Rajasthan', code: '08' },
  'SK': { name: 'Sikkim', code: '11' },
  'TN': { name: 'Tamil Nadu', code: '33' },
  'TS': { name: 'Telangana', code: '36' },
  'TR': { name: 'Tripura', code: '16' },
  'UP': { name: 'Uttar Pradesh', code: '09' },
  'UK': { name: 'Uttarakhand', code: '05' },
  'WB': { name: 'West Bengal', code: '19' }
};

/**
 * Determine supply type based on supplier and customer state codes
 * @param {string} supplierStateCode - Supplier's state code
 * @param {string} customerStateCode - Customer's state code
 * @returns {string} - 'Intrastate', 'Interstate', or 'Export'
 */
function getSupplyType(supplierStateCode, customerStateCode) {
  if (!customerStateCode || customerStateCode === 'EXPORT') {
    return 'Export';
  }
  
  if (supplierStateCode === customerStateCode) {
    return 'Intrastate';
  } else {
    return 'Interstate';
  }
}

/**
 * Calculate GST breakdown based on supply type and GST rate
 * @param {number} taxableAmount - Amount on which GST is to be calculated
 * @param {number} gstRate - GST rate percentage (0, 5, 12, 18, 28)
 * @param {string} supplyType - 'Intrastate', 'Interstate', or 'Export'
 * @returns {object} - GST breakdown with CGST, SGST, IGST amounts
 */
function calculateGST(taxableAmount, gstRate, supplyType) {
  const result = {
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    totalGST: 0
  };
  
  if (gstRate === 0 || supplyType === 'Export') {
    return result;
  }
  
  const gstAmount = (taxableAmount * gstRate) / 100;
  result.totalGST = gstAmount;
  
  if (supplyType === 'Intrastate') {
    // For intrastate: CGST + SGST (each is half of total GST)
    result.cgstAmount = gstAmount / 2;
    result.sgstAmount = gstAmount / 2;
  } else if (supplyType === 'Interstate') {
    // For interstate: IGST (full GST amount)
    result.igstAmount = gstAmount;
  }
  
  return result;
}

/**
 * Calculate reverse charge mechanism
 * @param {string} supplierGST - Supplier's GST number
 * @param {string} customerGST - Customer's GST number
 * @param {string} serviceType - Type of service
 * @returns {boolean} - Whether reverse charge applies
 */
function isReverseChargeApplicable(supplierGST, customerGST, serviceType) {
  // Simplified logic - in real implementation, this would be more complex
  // based on specific services and business rules
  
  // Basic rule: If supplier is unregistered and customer is registered
  if (!supplierGST && customerGST) {
    return true;
  }
  
  // Specific services where reverse charge applies
  const reverseChargeServices = [
    'Legal Services', 'Manpower Services', 'Security Services',
    'Cleaning Services', 'Catering Services'
  ];
  
  return reverseChargeServices.includes(serviceType);
}

/**
 * Validate GST number format
 * @param {string} gstNumber - GST number to validate
 * @returns {boolean} - Whether GST number is valid
 */
function validateGSTNumber(gstNumber) {
  if (!gstNumber) return false;
  
  // GST number format: 2 digits state code + 10 characters PAN + 1 digit entity code + 1 digit Z + 1 digit check sum
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gstNumber);
}

/**
 * Extract state code from GST number
 * @param {string} gstNumber - GST number
 * @returns {string} - State code
 */
function getStateCodeFromGST(gstNumber) {
  if (validateGSTNumber(gstNumber)) {
    return gstNumber.substring(0, 2);
  }
  return null;
}

/**
 * Get state name from state code
 * @param {string} stateCode - Two-digit state code
 * @returns {string} - State name
 */
function getStateName(stateCode) {
  for (const [code, data] of Object.entries(stateCodes)) {
    if (data.code === stateCode) {
      return data.name;
    }
  }
  return null;
}

/**
 * Calculate line item GST
 * @param {object} item - Line item with quantity, rate, discount, gstRate
 * @param {string} supplyType - Supply type
 * @returns {object} - Complete line item with GST calculations
 */
function calculateLineItemGST(item, supplyType) {
  const amount = item.quantity * item.rate;
  const discountAmount = (amount * (item.discount || 0)) / 100;
  const taxableAmount = amount - discountAmount;
  
  const gstBreakdown = calculateGST(taxableAmount, item.gstRate, supplyType);
  
  return {
    ...item,
    amount,
    discountAmount,
    taxableAmount,
    cgstAmount: gstBreakdown.cgstAmount,
    sgstAmount: gstBreakdown.sgstAmount,
    igstAmount: gstBreakdown.igstAmount,
    totalAmount: taxableAmount + gstBreakdown.totalGST
  };
}

module.exports = {
  stateCodes,
  getSupplyType,
  calculateGST,
  isReverseChargeApplicable,
  validateGSTNumber,
  getStateCodeFromGST,
  getStateName,
  calculateLineItemGST
};