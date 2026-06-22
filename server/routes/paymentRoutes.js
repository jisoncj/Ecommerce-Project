const express = require('express');
const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * POST /api/payment/create-intent
 * Create a Stripe Payment Intent
 */
router.post('/create-intent', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items to process' });
    }

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key')) {
      return res.status(500).json({ 
        message: 'Stripe is not configured. Please add your STRIPE_SECRET_KEY to .env' 
      });
    }

    // ALWAYS calculate price on the backend to prevent frontend tampering
    let totalAmount = 0;
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      // Add to total (item price * quantity)
      totalAmount += product.price * item.quantity;
    }

    // Create a PaymentIntent with the order amount and currency
    // Stripe expects amount in cents (or smallest currency unit)
return res.status(200).json({
  message: 'Payment disabled for deployment',
  clientSecret: 'dummy_secret'
});
  } catch (error) {
    console.error('Stripe Intent Error:', error);
    res.status(500).json({ message: error.message || 'Server Error building payment intent' });
  }
});

module.exports = router;
