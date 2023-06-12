const mongoose = require('mongoose');
const Beneficiary=require('./benificiaryModel')
const User=require('./userModel')
const Organization=require('./organization')

const causeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  total_amount: {
    type: Number,
    required: true
  },
  collected_amount:{
    type: Number,
    required: true,
    default:0
  },
  pending_amount:{
    type: Number,
    default:function () {
      return this.total_amount;
    }
  },
  start_date: {
    type: Date,
    required: true,default:Date.now()
  },
  end_date: {
    type: Date,
    required: true
  },
  image: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'pending'],
    default:'pending',
    required: true
  },
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true
  } ,
  organization:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true

  }
},
{
    timestamps:true
});

const Cause= mongoose.model('Cause', causeSchema);

module.exports = Cause;
