const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  customerId: { type: String, },
  customerName: { type: String, required: true },
  Addressline1: { type: String, required: true },
  Addressline2: { type: String, required: true },
  customerPhone: { type: String, required: true },
  selectedService: { type: String, required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  expectedDeliveryDate: { type: Date, required: true },
  time: { type: String, required: true },
  pickupFee: { type: Number, required: true },
  pickupDiscount: { type: Number, required: true },
  note: { type: String },
  pickupPersonName: { type: String, required: true },
  pickupPersonPhone: { type: String, required: true },
  actualDeliveryDate: { type: Date }, // rename from actualdate
  status: { type: String, required: true, default: 'pending' },
  employee: { type: String },
  items: [itemSchema], 
  total: { type: Number },
  paymentStatus: {type: String, required: true, default: 'not paid'}
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
