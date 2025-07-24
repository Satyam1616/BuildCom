const mongoose = require('mongoose');

const chartOfAccountsSchema = new mongoose.Schema({
  accountCode: { type: String, required: true, unique: true },
  accountName: { type: String, required: true },
  accountType: {
    type: String,
    enum: [
      'Assets', 'Liabilities', 'Equity', 'Income', 'Expenses'
    ],
    required: true
  },
  subType: {
    type: String,
    enum: [
      // Asset Subtypes
      'Current Assets', 'Fixed Assets', 'Investments', 'Other Assets',
      // Liability Subtypes
      'Current Liabilities', 'Long Term Liabilities',
      // Equity Subtypes
      'Capital', 'Retained Earnings', 'Drawings',
      // Income Subtypes
      'Operating Revenue', 'Other Income',
      // Expense Subtypes
      'Cost of Goods Sold', 'Operating Expenses', 'Financial Expenses', 'Other Expenses'
    ],
    required: true
  },
  parentAccount: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChartOfAccounts' 
  },
  level: { type: Number, default: 1 }, // Hierarchy level
  isSystemAccount: { type: Boolean, default: false }, // Cannot be deleted
  isActive: { type: Boolean, default: true },
  openingBalance: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  
  // For tax accounts
  isTaxAccount: { type: Boolean, default: false },
  taxType: {
    type: String,
    enum: ['GST Payable', 'GST Receivable', 'TDS Payable', 'TDS Receivable', 'Income Tax', 'Other']
  },
  
  description: { type: String },
  
  // For bank accounts
  linkedBankAccount: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BankAccount' 
  },
  
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

// Index for efficient searching
chartOfAccountsSchema.index({ accountCode: 1, accountType: 1, isActive: 1 });

// Static method to create default chart of accounts
chartOfAccountsSchema.statics.createDefaultAccounts = async function(userId) {
  const defaultAccounts = [
    // Assets
    { accountCode: '1000', accountName: 'Assets', accountType: 'Assets', subType: 'Current Assets', level: 1 },
    { accountCode: '1100', accountName: 'Current Assets', accountType: 'Assets', subType: 'Current Assets', level: 2 },
    { accountCode: '1101', accountName: 'Cash', accountType: 'Assets', subType: 'Current Assets', level: 3 },
    { accountCode: '1102', accountName: 'Bank Accounts', accountType: 'Assets', subType: 'Current Assets', level: 3 },
    { accountCode: '1103', accountName: 'Accounts Receivable', accountType: 'Assets', subType: 'Current Assets', level: 3 },
    { accountCode: '1104', accountName: 'Inventory', accountType: 'Assets', subType: 'Current Assets', level: 3 },
    { accountCode: '1105', accountName: 'GST Input Tax Credit', accountType: 'Assets', subType: 'Current Assets', level: 3, isTaxAccount: true, taxType: 'GST Receivable' },
    { accountCode: '1106', accountName: 'TDS Receivable', accountType: 'Assets', subType: 'Current Assets', level: 3, isTaxAccount: true, taxType: 'TDS Receivable' },
    
    { accountCode: '1200', accountName: 'Fixed Assets', accountType: 'Assets', subType: 'Fixed Assets', level: 2 },
    { accountCode: '1201', accountName: 'Plant & Machinery', accountType: 'Assets', subType: 'Fixed Assets', level: 3 },
    { accountCode: '1202', accountName: 'Office Equipment', accountType: 'Assets', subType: 'Fixed Assets', level: 3 },
    { accountCode: '1203', accountName: 'Furniture & Fixtures', accountType: 'Assets', subType: 'Fixed Assets', level: 3 },
    
    // Liabilities
    { accountCode: '2000', accountName: 'Liabilities', accountType: 'Liabilities', subType: 'Current Liabilities', level: 1 },
    { accountCode: '2100', accountName: 'Current Liabilities', accountType: 'Liabilities', subType: 'Current Liabilities', level: 2 },
    { accountCode: '2101', accountName: 'Accounts Payable', accountType: 'Liabilities', subType: 'Current Liabilities', level: 3 },
    { accountCode: '2102', accountName: 'GST Output Tax', accountType: 'Liabilities', subType: 'Current Liabilities', level: 3, isTaxAccount: true, taxType: 'GST Payable' },
    { accountCode: '2103', accountName: 'TDS Payable', accountType: 'Liabilities', subType: 'Current Liabilities', level: 3, isTaxAccount: true, taxType: 'TDS Payable' },
    { accountCode: '2104', accountName: 'Income Tax Payable', accountType: 'Liabilities', subType: 'Current Liabilities', level: 3, isTaxAccount: true, taxType: 'Income Tax' },
    
    // Equity
    { accountCode: '3000', accountName: 'Equity', accountType: 'Equity', subType: 'Capital', level: 1 },
    { accountCode: '3100', accountName: 'Owner\'s Capital', accountType: 'Equity', subType: 'Capital', level: 2 },
    { accountCode: '3200', accountName: 'Retained Earnings', accountType: 'Equity', subType: 'Retained Earnings', level: 2 },
    
    // Income
    { accountCode: '4000', accountName: 'Income', accountType: 'Income', subType: 'Operating Revenue', level: 1 },
    { accountCode: '4100', accountName: 'Sales Revenue', accountType: 'Income', subType: 'Operating Revenue', level: 2 },
    { accountCode: '4200', accountName: 'Other Income', accountType: 'Income', subType: 'Other Income', level: 2 },
    { accountCode: '4201', accountName: 'Interest Income', accountType: 'Income', subType: 'Other Income', level: 3 },
    
    // Expenses
    { accountCode: '5000', accountName: 'Expenses', accountType: 'Expenses', subType: 'Operating Expenses', level: 1 },
    { accountCode: '5100', accountName: 'Cost of Goods Sold', accountType: 'Expenses', subType: 'Cost of Goods Sold', level: 2 },
    { accountCode: '5200', accountName: 'Operating Expenses', accountType: 'Expenses', subType: 'Operating Expenses', level: 2 },
    { accountCode: '5201', accountName: 'Office Rent', accountType: 'Expenses', subType: 'Operating Expenses', level: 3 },
    { accountCode: '5202', accountName: 'Salaries & Wages', accountType: 'Expenses', subType: 'Operating Expenses', level: 3 },
    { accountCode: '5203', accountName: 'Travel & Conveyance', accountType: 'Expenses', subType: 'Operating Expenses', level: 3 },
    { accountCode: '5204', accountName: 'Professional Fees', accountType: 'Expenses', subType: 'Operating Expenses', level: 3 },
    { accountCode: '5205', accountName: 'Bank Charges', accountType: 'Expenses', subType: 'Operating Expenses', level: 3 },
  ];
  
  for (const account of defaultAccounts) {
    account.createdBy = userId;
    account.isSystemAccount = true;
  }
  
  return await this.insertMany(defaultAccounts);
};

module.exports = mongoose.model('ChartOfAccounts', chartOfAccountsSchema);