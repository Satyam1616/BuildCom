const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseNumber: { type: String, unique: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'Office Rent', 'Utilities', 'Internet & Phone', 'Travel',
      'Fuel', 'Office Supplies', 'Marketing', 'Professional Fees',
      'Bank Charges', 'Insurance', 'Maintenance', 'Salaries',
      'Entertainment', 'Depreciation', 'Other'
    ],
    required: true
  },
  subCategory: { type: String },
  amount: { type: Number, required: true },
  gstAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  // TDS Information
  tdsApplicable: { type: Boolean, default: false },
  tdsRate: { type: Number, default: 0 },
  tdsAmount: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Cheque', 'UPI', 'Card', 'Credit'],
    default: 'Cash'
  },
  
  bankAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount' },
  referenceNumber: { type: String }, // Cheque number, transaction ID, etc.
  
  expenseDate: { type: Date, default: Date.now },
  description: { type: String, required: true },
  
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Paid', 'Cancelled'],
    default: 'Pending'
  },
  
  // Recurring expense setup
  isRecurring: { type: Boolean, default: false },
  recurringFrequency: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Yearly'],
  },
  recurringEndDate: { type: Date },
  parentExpenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
  
  attachments: [String], // Receipt images/PDFs
  notes: { type: String },
  
  // For reimbursement tracking
  isReimbursable: { type: Boolean, default: false },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reimbursementStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Paid'],
    default: 'Pending'
  },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Auto-generate expense number
expenseSchema.pre('save', async function(next) {
  if (this.isNew && !this.expenseNumber) {
    const count = await mongoose.model('Expense').countDocuments();
    this.expenseNumber = `EXP-${String(count + 1).padStart(4, '0')}`;
  }
  
  // Calculate net amount after TDS
  if (this.tdsApplicable && this.tdsRate > 0) {
    this.tdsAmount = (this.totalAmount * this.tdsRate) / 100;
    this.netAmount = this.totalAmount - this.tdsAmount;
  } else {
    this.tdsAmount = 0;
    this.netAmount = this.totalAmount;
  }
  
  next();
});

expenseSchema.index({ expenseDate: -1, category: 1, status: 1 });

module.exports = mongoose.model('Expense', expenseSchema); 