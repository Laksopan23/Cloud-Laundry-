const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerAddress1: { type: String, required: true },
  customerAddress2: { type: String},
  customerPhone: { type: String, required: true },
  selectedService: { type: String, required: true },
  invoiceNumber: { type: String, default: () => `INV-${Date.now()}`, required: true },
  date: { type: Date, required: true },
  expectedDeliveryDate: { type: Date, required: true },
  time: { type: String, required: true },
  pickupFee: { type: String, required: true },
  pickupDiscount: { type: String, required: true },
  note: { type: String },
  pickupPersonName: { type: String, required: true },
  pickupPersonPhone: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
