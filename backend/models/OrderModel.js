const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  customerAddress1: String,
  customerAddress2: String,
  customerPhone: String,
  selectedService: String,
  invoiceNumber: { type: String, default: () => `INV-${Date.now()}` },
  date: Date,
  expectedDeliveryDate: Date,
  time: String,
  pickupFee: String,
  pickupDiscount: String,
  note: String,
  pickupPersonName: String,
  pickupPersonPhone: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
