const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true }, // Stock Keeping Unit
  description: { type: String },
  itemType: {
    type: String,
    enum: ['Goods', 'Service'],
    required: true
  },
  hsnSacCode: { type: String, required: true }, // HSN for goods, SAC for services
  unit: {
    type: String,
    enum: ['Piece', 'Kg', 'Liter', 'Meter', 'Hour', 'Day', 'Service'],
    default: 'Piece'
  },
  salePrice: { type: Number, required: true },
  purchasePrice: { type: Number, default: 0 },
  gstRate: { type: Number, required: true }, // Percentage (0, 5, 12, 18, 28)
  cessRate: { type: Number, default: 0 }, // Additional cess if applicable
  openingStock: { type: Number, default: 0 },
  currentStock: { type: Number, default: 0 },
  minimumStock: { type: Number, default: 0 },
  maximumStock: { type: Number, default: 0 },
  stockValue: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ['Raw Material', 'Finished Goods', 'Trading Goods', 'Service'],
    default: 'Trading Goods'
  },
  isActive: { type: Boolean, default: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Calculate stock value before saving
itemSchema.pre('save', function(next) {
  this.stockValue = this.currentStock * this.purchasePrice;
  next();
});

// Index for efficient searching
itemSchema.index({ name: 1, sku: 1, hsnSacCode: 1 });

module.exports = mongoose.model('Item', itemSchema);