const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  vendorName: { type: String },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String },
  expenseDate: { type: Date, default: Date.now },
  description: { type: String },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema); 