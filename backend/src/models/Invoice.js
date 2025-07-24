const mongoose = require('mongoose');

const itemLineSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  itemName: { type: String, required: true },
  description: { type: String },
  hsnSacCode: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Piece' },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true }, // quantity * rate
  discount: { type: Number, default: 0 }, // Percentage
  discountAmount: { type: Number, default: 0 },
  taxableAmount: { type: Number, required: true },
  gstRate: { type: Number, required: true },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  cessAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  invoiceSeries: { type: String, default: 'INV' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: { type: String, required: true },
  customerGSTNumber: { type: String },
  customerAddress: {
    addressLine1: String,
    city: String,
    state: String,
    stateCode: String,
    pincode: String
  },
  placeOfSupply: { type: String, required: true }, // State name
  supplyType: { 
    type: String, 
    enum: ['Intrastate', 'Interstate', 'Export'], 
    required: true 
  },
  invoiceType: {
    type: String,
    enum: ['Tax Invoice', 'Bill of Supply', 'Export Invoice'],
    default: 'Tax Invoice'
  },
  invoiceDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  items: [itemLineSchema],
  subTotal: { type: Number, required: true },
  totalDiscount: { type: Number, default: 0 },
  taxableAmount: { type: Number, required: true },
  totalCGST: { type: Number, default: 0 },
  totalSGST: { type: Number, default: 0 },
  totalIGST: { type: Number, default: 0 },
  totalCess: { type: Number, default: 0 },
  totalTax: { type: Number, default: 0 },
  roundOff: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  amountInWords: { type: String },
  terms: { type: String },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['Draft', 'Sent', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled'], 
    default: 'Draft' 
  },
  paidAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  payments: [{
    paymentDate: Date,
    amount: Number,
    paymentMethod: String,
    reference: String
  }],
  attachments: [String], // File paths
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Auto-generate invoice number
invoiceSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `${this.invoiceSeries}-${String(count + 1).padStart(4, '0')}`;
  }
  
  // Calculate balance amount
  this.balanceAmount = this.grandTotal - this.paidAmount;
  
  // Update status based on payment
  if (this.paidAmount === 0) {
    this.status = this.status === 'Draft' ? 'Draft' : 'Sent';
  } else if (this.paidAmount >= this.grandTotal) {
    this.status = 'Paid';
  } else {
    this.status = 'Partially Paid';
  }
  
  next();
});

invoiceSchema.index({ invoiceNumber: 1, customerId: 1, invoiceDate: -1 });

module.exports = mongoose.model('Invoice', invoiceSchema); 