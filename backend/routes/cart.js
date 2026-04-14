const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const auth = require('../middleware/auth');

// All cart routes are protected
router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.put('/:itemId', auth, updateCartItem);
router.delete('/clear', auth, clearCart);
router.delete('/:itemId', auth, removeFromCart);

module.exports = router;
