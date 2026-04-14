const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@shoestore.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'user@shoestore.com',
    password: 'user123',
    role: 'user'
  }
];

const products = [
  {
    name: 'Air Max Pulse',
    brand: 'Nike',
    description: 'The Air Max Pulse draws inspiration from the icons of London music culture. Its bold design features a visible Air unit and sleek, futuristic lines that make every step feel as fresh as a new beat.',
    price: 8999,
    originalPrice: 11999,
    category: 'Sneakers',
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ['Black', 'White', 'Red'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    stock: 25,
    rating: 4.5,
    numReviews: 120,
    featured: true,
    gender: 'Men'
  },
  {
    name: 'Ultraboost Light',
    brand: 'Adidas',
    description: 'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole, crafted with 30% more Boost vs the previous version.',
    price: 12999,
    originalPrice: 16999,
    category: 'Running',
    sizes: [6, 7, 8, 9, 10, 11, 12],
    colors: ['White', 'Black', 'Blue'],
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600',
    stock: 30,
    rating: 4.7,
    numReviews: 85,
    featured: true,
    gender: 'Unisex'
  },
  {
    name: 'RS-X Reinvention',
    brand: 'Puma',
    description: 'The RS-X Reinvention takes the original Running System technology and reinvents it for modern street style. Bold colors and chunky proportions define this statement sneaker.',
    price: 6499,
    originalPrice: 8999,
    category: 'Sneakers',
    sizes: [7, 8, 9, 10, 11],
    colors: ['White', 'Blue', 'Grey'],
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600',
    stock: 20,
    rating: 4.2,
    numReviews: 64,
    featured: true,
    gender: 'Men'
  },
  {
    name: 'Classic Leather',
    brand: 'Reebok',
    description: 'A timeless icon that has been a wardrobe staple since 1983. The Classic Leather features a soft leather upper and die-cut EVA midsole for lightweight cushioning.',
    price: 5499,
    originalPrice: 7499,
    category: 'Casual',
    sizes: [6, 7, 8, 9, 10],
    colors: ['White', 'Black', 'Brown'],
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600',
    stock: 35,
    rating: 4.3,
    numReviews: 92,
    featured: true,
    gender: 'Unisex'
  },
  {
    name: 'Old Skool',
    brand: 'Vans',
    description: 'The Old Skool, Vans classic skate shoe and the first to feature the iconic side stripe, is a low top lace-up with durable canvas and suede uppers.',
    price: 4999,
    originalPrice: 5999,
    category: 'Casual',
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ['Black', 'Navy', 'Red'],
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600',
    stock: 40,
    rating: 4.6,
    numReviews: 200,
    featured: true,
    gender: 'Unisex'
  },
  {
    name: 'Chuck Taylor All Star',
    brand: 'Converse',
    description: 'The icon that started it all. The Chuck Taylor All Star High Top features the classic canvas upper, rubber toe cap, and unmistakable silhouette.',
    price: 3999,
    originalPrice: 4999,
    category: 'Casual',
    sizes: [5, 6, 7, 8, 9, 10, 11, 12],
    colors: ['Black', 'White', 'Red', 'Navy'],
    image: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600',
    stock: 50,
    rating: 4.4,
    numReviews: 310,
    featured: true,
    gender: 'Unisex'
  },
  {
    name: 'Gel-Kayano 30',
    brand: 'Asics',
    description: 'The GEL-KAYANO 30 shoe creates a more comfortable stride with a smooth, stable ride. It features FF BLAST PLUS ECO cushioning for improved energy return.',
    price: 11999,
    originalPrice: 14999,
    category: 'Running',
    sizes: [7, 8, 9, 10, 11],
    colors: ['Black', 'Blue', 'Green'],
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600',
    stock: 15,
    rating: 4.8,
    numReviews: 56,
    featured: true,
    gender: 'Men'
  },
  {
    name: 'Suede Classic XXI',
    brand: 'Puma',
    description: 'The Suede hit the scene in 1968 and has been a sneaker legend ever since. The Suede Classic XXI updates the icon with a modern fit while keeping its legacy intact.',
    price: 5999,
    originalPrice: 7999,
    category: 'Casual',
    sizes: [6, 7, 8, 9, 10],
    colors: ['Black', 'Blue', 'Red', 'Green'],
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600',
    stock: 28,
    rating: 4.1,
    numReviews: 78,
    featured: false,
    gender: 'Unisex'
  },
  {
    name: 'Air Jordan 1 Mid',
    brand: 'Nike',
    description: 'Inspired by the original AJ1, the Air Jordan 1 Mid offers a fresh look and feels just as court-ready with an Air-Sole unit for cushioning and a padded collar for comfort.',
    price: 10999,
    originalPrice: 13999,
    category: 'Sneakers',
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ['Black', 'White', 'Red'],
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600',
    stock: 18,
    rating: 4.6,
    numReviews: 145,
    featured: false,
    gender: 'Men'
  },
  {
    name: 'Oxford Leather Formal',
    brand: 'Clarks',
    description: 'Classic Oxford formal shoe crafted from premium leather with a sleek silhouette. Perfect for office wear and formal occasions with cushioned insole for all-day comfort.',
    price: 7999,
    originalPrice: 9999,
    category: 'Formal',
    sizes: [7, 8, 9, 10, 11],
    colors: ['Black', 'Brown', 'Tan'],
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600',
    stock: 22,
    rating: 4.3,
    numReviews: 45,
    featured: false,
    gender: 'Men'
  },
  {
    name: 'Women\'s Air Max 270',
    brand: 'Nike',
    description: 'Nike\'s first lifestyle Air Max brings you style, comfort, and big attitude with the large window and lifestyle design. The sleek, running-inspired design features a stretchy inner sleeve.',
    price: 9999,
    originalPrice: 12999,
    category: 'Sneakers',
    sizes: [4, 5, 6, 7, 8],
    colors: ['Pink', 'White', 'Black'],
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600',
    stock: 20,
    rating: 4.5,
    numReviews: 88,
    featured: false,
    gender: 'Women'
  },
  {
    name: 'Chelsea Boots',
    brand: 'Timberland',
    description: 'Classic Chelsea boots with premium waterproof leather and pull-on design. Anti-fatigue technology provides all-day comfort and support for urban adventures.',
    price: 13999,
    originalPrice: 17999,
    category: 'Boots',
    sizes: [7, 8, 9, 10, 11],
    colors: ['Brown', 'Black'],
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600',
    stock: 12,
    rating: 4.4,
    numReviews: 36,
    featured: false,
    gender: 'Men'
  },
  {
    name: 'Speedcross 5',
    brand: 'Salomon',
    description: 'The Speedcross 5 combines aggressive grip with precise foothold for soft, technical trails. It delivers more comfort and less weight for faster trail running.',
    price: 10499,
    originalPrice: 12999,
    category: 'Sports',
    sizes: [7, 8, 9, 10, 11],
    colors: ['Black', 'Red', 'Blue'],
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600',
    stock: 14,
    rating: 4.7,
    numReviews: 67,
    featured: false,
    gender: 'Men'
  },
  {
    name: 'Women\'s Flex Runner',
    brand: 'Adidas',
    description: 'Lightweight and flexible running shoe designed for women. Features a breathable mesh upper with a cloudfoam midsole for superior cushioning during every run.',
    price: 6999,
    originalPrice: 8999,
    category: 'Running',
    sizes: [4, 5, 6, 7, 8],
    colors: ['Pink', 'White', 'Grey'],
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600',
    stock: 25,
    rating: 4.2,
    numReviews: 54,
    featured: false,
    gender: 'Women'
  },
  {
    name: 'Basketball Pro Elite',
    brand: 'Nike',
    description: 'High-performance basketball shoe with responsive Zoom Air cushioning and durable rubber outsole. Designed for explosive play on the court with excellent ankle support.',
    price: 14999,
    originalPrice: 18999,
    category: 'Sports',
    sizes: [8, 9, 10, 11, 12],
    colors: ['Black', 'Red', 'White'],
    image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600',
    stock: 10,
    rating: 4.6,
    numReviews: 42,
    featured: false,
    gender: 'Men'
  },
  {
    name: 'Women\'s Suede Platform',
    brand: 'Puma',
    description: 'A bold twist on the classic Suede. The platform sole adds height and attitude while the soft suede upper keeps things stylish and comfortable.',
    price: 5999,
    originalPrice: 7999,
    category: 'Sneakers',
    sizes: [4, 5, 6, 7, 8],
    colors: ['Black', 'Pink', 'White'],
    image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600',
    stock: 18,
    rating: 4.3,
    numReviews: 71,
    featured: false,
    gender: 'Women'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create users with hashed passwords
    for (const userData of users) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    await User.insertMany(users);
    console.log('Users seeded successfully');

    // Create products
    await Product.insertMany(products);
    console.log('Products seeded successfully');

    console.log('\n--- Seed Complete ---');
    console.log('Admin Login: admin@shoestore.com / admin123');
    console.log('User Login:  user@shoestore.com / user123');
    console.log('Total Products: ' + products.length);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
