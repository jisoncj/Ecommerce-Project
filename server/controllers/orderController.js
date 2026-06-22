const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * POST /api/orders
 * Create a new order (called after successful checkout/payment)
 */
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentStatus, stripePaymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify prices and calculate total on backend to prevent tampering
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();

      // Ensure price is matching DB
      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    // Create the order
    const order = await Order.create({
      user: req.user.id,
      items: validatedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentStatus || 'pending',
      stripePaymentId,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/orders/my-orders
 * Get logged-in user's orders
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/orders/:id
 * Get single order by ID (must belong to user or be an admin)
 */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Make sure the order belongs to the user, unless they are an admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/orders (Admin only)
 * Get all orders in the system
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PATCH /api/orders/:id/status (Admin only)
 * Update order status (processing, shipped, etc.)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    // Validate status
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
