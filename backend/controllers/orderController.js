const Order = require('../models/OrderModel');

// Generate a random 6-digit invoice number
function generateInvoiceNumber() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Ensure the invoice number is unique
async function getUniqueInvoiceNumber() {
  let unique = false;
  let invoiceNumber;
  while (!unique) {
    invoiceNumber = generateInvoiceNumber();
    const existingOrder = await Order.findOne({ invoiceNumber });
    if (!existingOrder) {
      unique = true;
    }
  }
  return invoiceNumber;
}

// Create Order
exports.createOrder = async (req, res) => {
  try {
    console.log('Received Order:', req.body);

    // Optional: Validate items array
    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ message: 'Items are required and must be a non-empty array' });
    }

    // Generate unique invoice number
    const invoiceNumber = await getUniqueInvoiceNumber();

    // Calculate total
    const total = req.body.items.reduce((acc, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return acc + itemTotal;
    }, 0);

    // Prepare order data with calculated total and invoice number
    const orderData = {
      ...req.body,
      invoiceNumber,
      total
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json(order);

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error });
  }
};


// Get All Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};



// Update Order Fields (Status & Payment Status)
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = {};

    if (req.body.status) updateFields.status = req.body.status;
    if (req.body.paymentStatus) updateFields.paymentStatus = req.body.paymentStatus;

    const order = await Order.findByIdAndUpdate(id, updateFields, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error });
  }
};
