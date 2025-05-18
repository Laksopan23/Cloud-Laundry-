const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrder } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id',updateOrder); 


module.exports = router;
