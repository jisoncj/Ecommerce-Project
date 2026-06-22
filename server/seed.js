require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

// Sample Products matching the earlier NEXUS design
const products = [
  {
    name: "AirPods Pro Max",
    category: "electronics",
    price: 249.99,
    originalPrice: 349.99,
    rating: 4.8,
    numReviews: 234,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Experience next-level audio with our premium wireless headphones.",
    badge: "Best Seller",
    stock: 45,
    brand: "SoundWave",
    featured: true
  },
  {
    name: "Quantum Smartwatch X1",
    category: "electronics",
    price: 399.99,
    rating: 4.7,
    numReviews: 187,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&auto=format",
    ],
    description: "The most advanced smartwatch with AMOLED display and health monitoring.",
    badge: "New",
    stock: 30,
    brand: "TechPulse",
    featured: true
  },
  {
    name: "Urban Leather Jacket",
    category: "fashion",
    price: 189.99,
    originalPrice: 259.99,
    rating: 4.7,
    numReviews: 154,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Premium genuine leather jacket with a modern cut.",
    badge: "Trending",
    stock: 35,
    brand: "UrbanEdge",
    featured: true
  },
  {
    name: "Cloud Runner Sneakers",
    category: "fashion",
    price: 129.99,
    rating: 4.8,
    numReviews: 452,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Walk on clouds with our revolutionary foam technology.",
    badge: "Best Seller",
    stock: 80,
    brand: "StrideFlex",
    featured: false
  },
  {
    name: "Artisan Leather Wallet",
    category: "accessories",
    price: 69.99,
    rating: 4.5,
    numReviews: 189,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Hand-crafted from full-grain Italian leather.",
    badge: null,
    stock: 75,
    brand: "LeatherCraft",
    featured: false
  },
  {
    name: "Zen Ceramic Lamp",
    category: "home",
    price: 89.99,
    rating: 4.4,
    numReviews: 98,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=600&h=600&fit=crop&auto=format",
    ],
    description: "Handmade ceramic table lamp with a warm ambient glow.",
    badge: null,
    stock: 30,
    brand: "ZenHome",
    featured: true
  }
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('your_username')) {
      console.log('⚠️ Please configure MONGO_URI in .env before seeding.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Existing data cleared');

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      name: 'Admin User',
      email: 'admin@nexus.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created (admin@nexus.com / admin123)');

    // Create Test User
    const userHashedPassword = await bcrypt.hash('user123', salt);
    await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: userHashedPassword,
      role: 'user'
    });
    console.log('Test user created (user@example.com / user123)');

    // Insert Products
    await Product.insertMany(products);
    console.log('Sample products seeded');

    console.log('✅ Seeding complete!');
    process.exit();
  } catch (error) {
    console.error('❌ Error with seeding data', error);
    process.exit(1);
  }
};

seedDatabase();
