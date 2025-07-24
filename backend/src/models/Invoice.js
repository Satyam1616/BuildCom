const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  rate: Number,
  gstRate: Number // e.g., 18 for 18%
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  items: [itemSchema],
  total: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  invoiceDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema); 