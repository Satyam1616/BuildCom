const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  stateCode: { type: String, required: true }, // For GST calculations
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' }
}, { _id: false });

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  gstNumber: { type: String }, // Optional for small customers
  panNumber: { type: String },
  address: addressSchema,
  customerType: { 
    type: String, 
    enum: ['B2B', 'B2C', 'Export'], 
    default: 'B2C' 
  },
  creditLimit: { type: Number, default: 0 },
  creditDays: { type: Number, default: 30 },
  openingBalance: { type: Number, default: 0 },
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

// Index for efficient searching
customerSchema.index({ name: 1, gstNumber: 1 });

module.exports = mongoose.model('Customer', customerSchema);