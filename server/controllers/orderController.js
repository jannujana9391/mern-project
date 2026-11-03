import Order from '../models/Order.js';

/**
 * @desc    Create new orders with Multi-Vendor splitting
 * @route   POST /api/orders
 * @access  Private (Customer)
 */
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'card', paymentDetails = {} } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided in checkout payload.',
      });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid shipping address.',
      });
    }

    // 1. Multi-Vendor Splitting: Group items by vendorName
    const vendorGroups = {};
    items.forEach((item) => {
      const vendor = item.vendorName || item.vendor || 'Authorized Merchant';
      if (!vendorGroups[vendor]) {
        vendorGroups[vendor] = [];
      }
      vendorGroups[vendor].push({
        productId: String(item.id || item._id || item.productId),
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity || 1),
        image: item.image || '',
        vendorName: vendor,
      });
    });

    const createdOrders = [];
    const baseOrderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    let counter = 1;

    // 2. Create an isolated Order record for each vendor
    for (const [vendorName, vendorItems] of Object.entries(vendorGroups)) {
      const vendorSubtotal = vendorItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const platformFee = Math.round(vendorSubtotal * 0.1 * 100) / 100; // 10% commission
      const vendorEarnings = Math.round((vendorSubtotal - platformFee) * 100) / 100;

      const order = await Order.create({
        orderNumber: `${baseOrderNumber}-${counter++}`,
        customer: req.user._id,
        vendorName,
        items: vendorItems,
        shippingAddress: {
          fullName: shippingAddress.fullName || req.user.name,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state || '',
          zipCode: shippingAddress.zipCode || '',
          country: shippingAddress.country || 'USA',
          phone: shippingAddress.phone || '',
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        paymentDetails: {
          transactionId: paymentDetails.transactionId || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          paidAt: new Date(),
        },
        totalAmount: vendorSubtotal,
        platformCommission: platformFee,
        vendorEarnings,
        orderStatus: 'processing',
      });

      createdOrders.push(order);
    }

    res.status(201).json({
      success: true,
      message: `Successfully processed order! Created ${createdOrders.length} vendor order shipment(s).`,
      orders: createdOrders,
    });
  } catch (error) {
    console.error('[CreateOrder Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to place order.',
    });
  }
};

/**
 * @desc    Get all orders belonging to the logged-in customer
 * @route   GET /api/orders/my-orders
 * @access  Private (Customer)
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('[GetMyOrders Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order history.',
    });
  }
};

/**
 * @desc    Get single order details by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Ensure only the owner, or admin/vendor can see the order
    if (
      order.customer._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this order.',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('[GetOrderById Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order details.',
    });
  }
};
