const Order = require('../models/OrderModel');


function generateInvoiceNumber() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit number as string
  }
  
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


exports.createOrder = async (req, res) => {
  try {
    console.log('Received Order:', req.body);
    const invoiceNumber = await getUniqueInvoiceNumber();
    const order = new Order({ ...req.body, invoiceNumber });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};
