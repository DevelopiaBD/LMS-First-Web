const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  amount: Number,
  paymentMethod: String,
  transactionId: String,
  paidAt: { type: Date, default: Date.now }
});


const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment
