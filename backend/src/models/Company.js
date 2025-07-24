const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  legalName: { type: String },
  logo: { type: String }, // File path to logo
  
  // Address Information
  address: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    stateCode: { type: String, required: true }, // For GST
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  
  // Contact Information
  phone: { type: String },
  email: { type: String, required: true },
  website: { type: String },
  
  // Business Registration
  businessType: {
    type: String,
    enum: [
      'Sole Proprietorship', 'Partnership', 'Private Limited Company',
      'Public Limited Company', 'LLP', 'HUF', 'Trust', 'Other'
    ],
    required: true
  },
  
  // Tax Information
  gstNumber: { type: String, required: true },
  panNumber: { type: String, required: true },
  tanNumber: { type: String }, // For TDS
  cinNumber: { type: String }, // Corporate Identification Number
  udyamNumber: { type: String }, // MSME Registration
  
  // Financial Year Settings
  financialYearStart: { 
    type: String, 
    enum: ['April', 'January'], 
    default: 'April' 
  },
  currentFinancialYear: { type: String }, // e.g., "2024-25"
  
  // Invoice Settings
  invoicePrefix: { type: String, default: 'INV' },
  invoiceNumbering: {
    type: String,
    enum: ['Sequential', 'Reset Yearly', 'Reset Monthly'],
    default: 'Sequential'
  },
  lastInvoiceNumber: { type: Number, default: 0 },
  
  // GST Settings
  gstFilingFrequency: {
    type: String,
    enum: ['Monthly', 'Quarterly'],
    default: 'Monthly'
  },
  compositeScheme: { type: Boolean, default: false },
  
  // Banking Information
  primaryBankAccount: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BankAccount' 
  },
  
  // Invoice Terms & Conditions
  invoiceTerms: { type: String },
  invoiceNotes: { type: String },
  paymentTerms: { type: String, default: 'Payment due within 30 days' },
  
  // Report Settings
  baseCurrency: { type: String, default: 'INR' },
  decimalPlaces: { type: Number, default: 2 },
  
  // System Settings
  isActive: { type: Boolean, default: true },
  subscriptionStatus: {
    type: String,
    enum: ['Trial', 'Active', 'Expired', 'Cancelled'],
    default: 'Trial'
  },
  subscriptionEndDate: { type: Date },
  
  // User who set up the company
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

// Ensure unique GST number
companySchema.index({ gstNumber: 1 }, { unique: true });

module.exports = mongoose.model('Company', companySchema);