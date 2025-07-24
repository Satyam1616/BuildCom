// TDS Utility Functions for Indian Tax Calculations

// TDS rates and thresholds for FY 2024-25
const tdsRates = {
  'Professional Fees': {
    section: '194J',
    rate: 10,
    threshold: 30000,
    description: 'Payment to professionals like doctors, lawyers, engineers, etc.'
  },
  'Rent': {
    section: '194I',
    rate: 10,
    threshold: 240000,
    description: 'Rent payment for land, building, or furniture'
  },
  'Commission': {
    section: '194H',
    rate: 5,
    threshold: 15000,
    description: 'Commission or brokerage payment'
  },
  'Interest': {
    section: '194A',
    rate: 10,
    threshold: 5000,
    description: 'Interest payment other than on securities'
  },
  'Contractor Payment': {
    section: '194C',
    rate: 1, // For individual/HUF contractors
    rateCompany: 2, // For company contractors
    threshold: 30000,
    description: 'Payment to contractors and sub-contractors'
  },
  'Transport': {
    section: '194C',
    rate: 1,
    threshold: 30000,
    description: 'Payment for transport of goods'
  },
  'Salary': {
    section: '192',
    rate: 0, // Variable based on tax slab
    threshold: 0,
    description: 'Salary payment to employees'
  },
  'Dividend': {
    section: '194',
    rate: 10,
    threshold: 5000,
    description: 'Dividend payment'
  },
  'Insurance Commission': {
    section: '194D',
    rate: 5,
    threshold: 15000,
    description: 'Insurance commission payment'
  },
  'NSS/NSC/ELSS': {
    section: '194EE',
    rate: 30,
    threshold: 0,
    description: 'Payment on NSS, NSC, ELSS deposits'
  }
};

/**
 * Calculate TDS amount based on category and amount
 * @param {string} category - TDS category
 * @param {number} amount - Payment amount
 * @param {string} payeeType - 'Individual', 'Company', 'HUF', etc.
 * @param {boolean} hasPAN - Whether payee has PAN
 * @returns {object} - TDS calculation details
 */
function calculateTDS(category, amount, payeeType = 'Individual', hasPAN = true) {
  const result = {
    tdsRate: 0,
    tdsAmount: 0,
    netPayable: amount,
    section: '',
    isApplicable: false,
    threshold: 0,
    reason: ''
  };

  // Check if category exists
  const tdsRule = tdsRates[category];
  if (!tdsRule) {
    result.reason = 'TDS category not found';
    return result;
  }

  result.section = tdsRule.section;
  result.threshold = tdsRule.threshold;

  // Check threshold
  if (amount < tdsRule.threshold) {
    result.reason = `Amount below threshold of ₹${tdsRule.threshold}`;
    return result;
  }

  // Determine TDS rate
  let rate = tdsRule.rate;
  if (category === 'Contractor Payment' && payeeType === 'Company') {
    rate = tdsRule.rateCompany;
  }

  // Higher rate if no PAN (20% as per section 206AA)
  if (!hasPAN) {
    rate = 20;
    result.reason = 'Higher rate applied due to no PAN';
  }

  result.isApplicable = true;
  result.tdsRate = rate;
  result.tdsAmount = Math.round((amount * rate) / 100);
  result.netPayable = amount - result.tdsAmount;

  return result;
}

/**
 * Get cumulative payment check for threshold
 * @param {string} panNumber - PAN of payee
 * @param {string} category - TDS category
 * @param {number} currentAmount - Current payment amount
 * @param {number} cumulativeAmount - Cumulative amount paid in FY
 * @returns {object} - Whether TDS should be deducted
 */
function checkCumulativeThreshold(panNumber, category, currentAmount, cumulativeAmount) {
  const tdsRule = tdsRates[category];
  if (!tdsRule) {
    return { shouldDeduct: false, reason: 'Invalid category' };
  }

  const totalAmount = cumulativeAmount + currentAmount;
  
  if (totalAmount >= tdsRule.threshold && cumulativeAmount < tdsRule.threshold) {
    // TDS should be deducted on entire amount if threshold is crossed
    return { 
      shouldDeduct: true, 
      applicableAmount: currentAmount,
      reason: 'Threshold crossed with current payment' 
    };
  } else if (cumulativeAmount >= tdsRule.threshold) {
    // TDS should be deducted on current amount only
    return { 
      shouldDeduct: true, 
      applicableAmount: currentAmount,
      reason: 'Threshold already crossed' 
    };
  } else {
    return { 
      shouldDeduct: false, 
      reason: `Cumulative amount ₹${totalAmount} below threshold ₹${tdsRule.threshold}` 
    };
  }
}

/**
 * Get TDS certificate data
 * @param {object} paymentDetails - Payment details
 * @returns {object} - TDS certificate data
 */
function generateTDSCertificateData(paymentDetails) {
  return {
    deducteeDetails: {
      name: paymentDetails.payeeName,
      pan: paymentDetails.payeePAN,
      address: paymentDetails.payeeAddress
    },
    deductorDetails: {
      name: paymentDetails.deductorName,
      pan: paymentDetails.deductorPAN,
      tan: paymentDetails.deductorTAN,
      address: paymentDetails.deductorAddress
    },
    paymentDetails: {
      amount: paymentDetails.amount,
      tdsAmount: paymentDetails.tdsAmount,
      netAmount: paymentDetails.netAmount,
      section: paymentDetails.section,
      rate: paymentDetails.tdsRate,
      paymentDate: paymentDetails.paymentDate,
      challanNumber: paymentDetails.challanNumber,
      bsrCode: paymentDetails.bsrCode
    }
  };
}

/**
 * Validate PAN number format
 * @param {string} panNumber - PAN number to validate
 * @returns {boolean} - Whether PAN is valid
 */
function validatePAN(panNumber) {
  if (!panNumber) return false;
  
  // PAN format: 5 letters + 4 digits + 1 letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(panNumber);
}

/**
 * Get quarterly TDS return periods
 * @param {string} financialYear - Financial year (e.g., "2024-25")
 * @returns {array} - Array of quarter periods
 */
function getTDSQuarters(financialYear) {
  const [startYear, endYear] = financialYear.split('-').map(y => parseInt(y));
  const baseYear = startYear > 2000 ? startYear : 2000 + startYear;
  
  return [
    {
      quarter: 'Q1',
      period: `Apr ${baseYear} - Jun ${baseYear}`,
      dueDate: `31-Jul-${baseYear}`,
      startDate: new Date(baseYear, 3, 1), // April 1
      endDate: new Date(baseYear, 5, 30)   // June 30
    },
    {
      quarter: 'Q2',
      period: `Jul ${baseYear} - Sep ${baseYear}`,
      dueDate: `31-Oct-${baseYear}`,
      startDate: new Date(baseYear, 6, 1), // July 1
      endDate: new Date(baseYear, 8, 30)   // September 30
    },
    {
      quarter: 'Q3',
      period: `Oct ${baseYear} - Dec ${baseYear}`,
      dueDate: `31-Jan-${baseYear + 1}`,
      startDate: new Date(baseYear, 9, 1),  // October 1
      endDate: new Date(baseYear, 11, 31)  // December 31
    },
    {
      quarter: 'Q4',
      period: `Jan ${baseYear + 1} - Mar ${baseYear + 1}`,
      dueDate: `31-May-${baseYear + 1}`,
      startDate: new Date(baseYear + 1, 0, 1), // January 1
      endDate: new Date(baseYear + 1, 2, 31)  // March 31
    }
  ];
}

/**
 * Calculate advance tax dates
 * @param {string} financialYear - Financial year
 * @returns {array} - Advance tax due dates
 */
function getAdvanceTaxDates(financialYear) {
  const [startYear] = financialYear.split('-').map(y => parseInt(y));
  const baseYear = startYear > 2000 ? startYear : 2000 + startYear;
  
  return [
    {
      installment: 1,
      dueDate: `15-Jun-${baseYear}`,
      percentage: 15,
      description: 'First installment - 15% of advance tax'
    },
    {
      installment: 2,
      dueDate: `15-Sep-${baseYear}`,
      percentage: 45, // Cumulative 45%
      description: 'Second installment - 45% of advance tax'
    },
    {
      installment: 3,
      dueDate: `15-Dec-${baseYear}`,
      percentage: 75, // Cumulative 75%
      description: 'Third installment - 75% of advance tax'
    },
    {
      installment: 4,
      dueDate: `15-Mar-${baseYear + 1}`,
      percentage: 100, // Cumulative 100%
      description: 'Fourth installment - 100% of advance tax'
    }
  ];
}

module.exports = {
  tdsRates,
  calculateTDS,
  checkCumulativeThreshold,
  generateTDSCertificateData,
  validatePAN,
  getTDSQuarters,
  getAdvanceTaxDates
};