const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  accountName: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  ifscCode: { type: String, required: true },
  accountType: {
    type: String,
    enum: ['Current', 'Savings', 'Cash', 'CC/OD'],
    default: 'Current'
  },
  openingBalance: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isPrimary: { type: Boolean, default: false }, // Primary account for default transactions
  branchName: { type: String },
  branchAddress: { type: String },
  contactPerson: { type: String },
  contactNumber: { type: String },
  
  // For reconciliation
  lastReconciledDate: { type: Date },
  lastReconciledBalance: { type: Number, default: 0 },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Ensure only one primary account per company
bankAccountSchema.pre('save', async function(next) {
  if (this.isPrimary && this.isModified('isPrimary')) {
    await mongoose.model('BankAccount').updateMany(
      { _id: { $ne: this._id }, createdBy: this.createdBy },
      { isPrimary: false }
    );
  }
  next();
});

bankAccountSchema.index({ accountNumber: 1, isActive: 1 });

module.exports = mongoose.model('BankAccount', bankAccountSchema);