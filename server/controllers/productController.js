const Product = require('../models/Product');

/**
 * GET /api/products
 * Get all products with optional search, category filter, and sorting
 */
exports.getProducts = async (req, res) => {
  try {
    const { search, category, sort, minPrice, maxPrice, limit, page } = req.query;

    // Build filter object
    const filter = {};

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting options
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    // Pagination
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalProducts: total,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/products/featured
 * Get featured products for the homepage
 */
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    // If not enough featured, fill with highest rated
    if (products.length < 8) {
      const additional = await Product.find({ featured: { $ne: true } })
        .sort({ rating: -1 })
        .limit(8 - products.length);
      products.push(...additional);
    }
    res.json(products);
  } catch (error) {
    console.error('Get featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/products (admin only)
 * Create a new product
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, images, stock, brand, badge, featured } = req.body;

    if (!name || !description || !price || !category || !images || images.length === 0) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      originalPrice: originalPrice || null,
      category,
      images,
      stock: stock || 0,
      brand: brand || '',
      badge: badge || null,
      featured: featured || false,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/products/:id (admin only)
 * Update an existing product
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/products/:id (admin only)
 * Delete a product
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/products/categories/list
 * Get all unique categories with counts
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
