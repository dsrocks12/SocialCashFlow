const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  paidBy: {
    type: String,
    required: true
  },
  receivedBy: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  transactionDate: {
    type: Date,
    required: true
  },
  repaymentDays: {
    type: Number,
    required: true,
    min: 0
  },
  repaymentDueDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'repaid'],
    default: 'pending'
  }
});

transactionSchema.pre('validate', function(next) {
  if (!this.repaymentDueDate && this.transactionDate && this.repaymentDays >= 0) {
    this.repaymentDueDate = new Date(this.transactionDate.getTime() + this.repaymentDays * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
