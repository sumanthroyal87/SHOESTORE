const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please enter brand name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please enter product category'],
    enum: ['Running', 'Casual', 'Sports', 'Formal', 'Sneakers', 'Boots']
  },
  sizes: [{
    type: Number
  }],
  colors: [{
    type: String
  }],
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x400?text=Shoe'
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    default: 'Unisex'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
