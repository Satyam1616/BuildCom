const mongoose = require('mongoose');

const bankTransactionSchema = new mongoose.Schema({
  bankAccountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BankAccount', 
    required: true 
  },
  transactionDate: { type: Date, required: true },
  description: { type: String, required: true },
  reference: { type: String }, // Cheque number, UPI reference, etc.
  
  transactionType: {
    type: String,
    enum: ['Debit', 'Credit'],
    required: true
  },
  
  amount: { type: Number, required: true },
  balanceAfter: { type: Number }, // Running balance after this transaction
  
  category: {
    type: String,
    enum: [
      'Sales Receipt', 'Purchase Payment', 'Expense Payment', 
      'Bank Charges', 'Interest Received', 'Interest Paid',
      'Transfer In', 'Transfer Out', 'Opening Balance',
      'Tax Payment', 'TDS Refund', 'Other'
    ],
    default: 'Other'
  },
  
  paymentMode: {
    type: String,
    enum: ['Cash', 'Cheque', 'NEFT/RTGS', 'UPI', 'Card', 'Bank Transfer', 'Other'],
    default: 'Bank Transfer'
  },
  
  // Link to source documents
  linkedInvoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  linkedPurchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' },
  linkedExpense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
  
  // For bank reconciliation
  isReconciled: { type: Boolean, default: false },
  reconciledDate: { type: Date },
  bankStatementDate: { type: Date },
  bankStatementAmount: { type: Number },
  
  // For imported transactions
  isImported: { type: Boolean, default: false },
  importBatch: { type: String }, // To group imported transactions
  
  notes: { type: String },
  attachments: [String],
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Update bank account balance after transaction
bankTransactionSchema.post('save', async function(doc) {
  const BankAccount = mongoose.model('BankAccount');
  const account = await BankAccount.findById(doc.bankAccountId);
  
  if (account) {
    // Recalculate balance based on all transactions
    const transactions = await mongoose.model('BankTransaction')
      .find({ bankAccountId: doc.bankAccountId })
      .sort({ transactionDate: 1, createdAt: 1 });
    
    let balance = account.openingBalance;
    for (const transaction of transactions) {
      if (transaction.transactionType === 'Credit') {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
      
      // Update the balanceAfter for this transaction if not set
      if (!transaction.balanceAfter) {
        await mongoose.model('BankTransaction').updateOne(
          { _id: transaction._id },
          { balanceAfter: balance }
        );
      }
    }
    
    account.currentBalance = balance;
    await account.save();
  }
});

bankTransactionSchema.index({ 
  bankAccountId: 1, 
  transactionDate: -1, 
  isReconciled: 1 
});

module.exports = mongoose.model('BankTransaction', bankTransactionSchema);