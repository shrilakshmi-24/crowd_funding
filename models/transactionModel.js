const mongoose = require('mongoose');
const Beneficiary = require("./benificiaryModel")
const User=require('./userModel')
const Cause=require('./causesModel')

const transactionSchema = new mongoose.Schema({
    amount: {
      type: Number,
      required: true
    },
    paymentId: {
      type: String,
      required: true
    },
    orderId: {
      type: String,
      required: true
    },
    signature: {
      type: String,
      required: true
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cause_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cause',
      required: true
    },
    captured: {
      type: Boolean,
      required: true,
      default: false
    },
    capturedAt: {
      type: Date
    },
    
  });

const Transaction= mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;




  