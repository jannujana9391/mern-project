import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

/**
 * @desc    Get aggregated platform statistics & metrics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
export const getPlatformStats = async (req, res) => {
  try {
    const [
      totalUsers,
      customersCount,
      vendorsCount,
      approvedVendorsCount,
      pendingVendorsCount,
      totalProducts,
      orders,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'vendor' }),
      Vendor.countDocuments({ status: 'approved' }),
      Vendor.countDocuments({ status: 'pending' }),
      Product.countDocuments(),
      Order.find().sort({ createdAt: -1 }),
    ]);

    const totalOrdersCount = orders.length;
    const grossMarketplaceVolume = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const platformRevenue = orders.reduce((sum, o) => sum + (o.platformCommission || 0), 0);
    const totalVendorEarnings = orders.reduce((sum, o) => sum + (o.vendorEarnings || 0), 0);

    const pendingOrdersCount = orders.filter((o) =>
      ['pending', 'processing'].includes(o.orderStatus)
    ).length;
    const deliveredOrdersCount = orders.filter((o) => o.orderStatus === 'delivered').length;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        customersCount,
        vendorsCount,
        approvedVendorsCount,
        pendingVendorsCount,
        totalProducts,
        totalOrdersCount,
        pendingOrdersCount,
        deliveredOrdersCount,
        grossMarketplaceVolume: Math.round(grossMarketplaceVolume * 100) / 100,
        platformRevenue: Math.round(platformRevenue * 100) / 100,
        totalVendorEarnings: Math.round(totalVendorEarnings * 100) / 100,
      },
      recentOrders: orders.slice(0, 8),
    });
  } catch (error) {
    console.error('[AdminStats Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve administrative statistics.',
    });
  }
};

/**
 * @desc    Get all registered users across the platform
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('[AdminGetUsers Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve platform users.',
    });
  }
};

/**
 * @desc    Toggle block status of a user
 * @route   PUT /api/admin/users/:id/block
 * @access  Private (Admin)
 */
export const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Administrator accounts cannot be blocked.',
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User "${user.name}" has been ${user.isBlocked ? 'blocked' : 'unblocked'}.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error('[AdminToggleBlock Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user block status.',
    });
  }
};

/**
 * @desc    Get all orders across the marketplace
 * @route   GET /api/admin/orders
 * @access  Private (Admin)
 */
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('[AdminGetOrders Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve all marketplace orders.',
    });
  }
};

/**
 * @desc    Update vendor platform commission rate
 * @route   PUT /api/admin/vendors/:id/commission
 * @access  Private (Admin)
 */
export const updateVendorCommission = async (req, res) => {
  try {
    const { commissionRate } = req.body;

    if (commissionRate === undefined || isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
      return res.status(400).json({
        success: false,
        message: 'Commission rate must be a number between 0 and 100.',
      });
    }

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    vendor.commissionRate = Number(commissionRate);
    await vendor.save();

    res.status(200).json({
      success: true,
      message: `Commission rate for "${vendor.storeName}" updated to ${vendor.commissionRate}%.`,
      vendor,
    });
  } catch (error) {
    console.error('[AdminUpdateCommission Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor commission rate.',
    });
  }
};

