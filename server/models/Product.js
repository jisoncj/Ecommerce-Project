const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: null, // for showing discounts
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['electronics', 'fashion', 'accessories', 'home'],
    },
    images: {
      type: [String], // array of image URLs
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one image is required',
      },
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    brand: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      default: null, // e.g., "Best Seller", "New", "Sale"
    },
  },
  {
    timestamps: true,
  }
);

// Enable text search on name and description
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
