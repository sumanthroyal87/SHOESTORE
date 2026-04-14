const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getFeaturedProducts, getBrands } = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/brands', getBrands);
router.get('/:id', getProductById);

module.exports = router;
