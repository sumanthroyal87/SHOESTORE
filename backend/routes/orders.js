const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const auth = require('../middleware/auth');

// All order routes are protected
router.post('/', auth, placeOrder);
router.get('/', auth, getMyOrders);
router.get('/:id', auth, getOrderById);

module.exports = router;
