const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  itemName: { type: String, required: true },
  description: { type: String },
  hsnSacCode: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Piece' },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  taxableAmount: { type: Number, required: true },
  gstRate: { type: Number, required: true },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  cessAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true }
}, { _id: false });

const purchaseSchema = new mongoose.Schema({
  billNumber: { type: String, required: true },
  vendorBillNumber: { type: String }, // Vendor's bill number
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: { type: String, required: true },
  vendorGSTNumber: { type: String },
  vendorAddress: {
    addressLine1: String,
    city: String,
    state: String,
    stateCode: String,
    pincode: String
  },
  billDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  items: [purchaseItemSchema],
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
  
  // TDS Information
  tdsApplicable: { type: Boolean, default: false },
  tdsRate: { type: Number, default: 0 },
  tdsAmount: { type: Number, default: 0 },
  netPayable: { type: Number, required: true },
  
  status: {
    type: String,
    enum: ['Draft', 'Received', 'Paid', 'Partially Paid', 'Overdue'],
    default: 'Received'
  },
  paidAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  
  payments: [{
    paymentDate: Date,
    amount: Number,
    paymentMethod: String,
    tdsDeducted: Number,
    reference: String
  }],
  
  attachments: [String],
  notes: { type: String },
  
  // For ITC tracking
  itcClaimed: { type: Boolean, default: false },
  itcAmount: { type: Number, default: 0 },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Calculate TDS and net payable
purchaseSchema.pre('save', function(next) {
  if (this.tdsApplicable && this.tdsRate > 0) {
    this.tdsAmount = (this.grandTotal * this.tdsRate) / 100;
    this.netPayable = this.grandTotal - this.tdsAmount;
  } else {
    this.tdsAmount = 0;
    this.netPayable = this.grandTotal;
  }
  
  this.balanceAmount = this.netPayable - this.paidAmount;
  
  // Calculate ITC amount (total GST amount)
  this.itcAmount = this.totalCGST + this.totalSGST + this.totalIGST;
  
  next();
});

purchaseSchema.index({ billNumber: 1, vendorId: 1, billDate: -1 });

module.exports = mongoose.model('Purchase', purchaseSchema);