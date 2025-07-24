const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  stateCode: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' }
}, { _id: false });

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  gstNumber: { type: String },
  panNumber: { type: String },
  address: addressSchema,
  vendorType: {
    type: String,
    enum: ['Supplier', 'Service Provider', 'Contractor', 'Professional'],
    default: 'Supplier'
  },
  tdsCategory: {
    type: String,
    enum: ['Professional Fees', 'Rent', 'Commission', 'Interest', 'Other'],
    default: 'Other'
  },
  tdsRate: { type: Number, default: 0 }, // Percentage
  paymentTerms: { type: String, default: 'Net 30' },
  creditLimit: { type: Number, default: 0 },
  openingBalance: { type: Number, default: 0 },
  bankDetails: {
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String },
    accountHolderName: { type: String }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

vendorSchema.index({ name: 1, gstNumber: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);