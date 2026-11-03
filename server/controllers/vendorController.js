import Vendor from '../models/Vendor.js';
import User from '../models/User.js';

/**
 * @desc    Get the authenticated vendor's full profile
 * @route   GET /api/vendor/profile
 * @access  Private (Vendor)
 */
export const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id }).populate(
      'user',
      'name email createdAt'
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found. Please register as a vendor first.',
      });
    }

    res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    console.error('[GetVendorProfile Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve vendor profile.',
    });
  }
};

/**
 * @desc    Update the authenticated vendor's store profile
 * @route   PUT /api/vendor/profile
 * @access  Private (Vendor)
 */
export const updateVendorProfile = async (req, res) => {
  try {
    const { description, logo, banner } = req.body;

    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found.',
      });
    }

    // Only allow updating safe fields (storeName & commissionRate are admin-controlled)
    if (description !== undefined) vendor.description = description;
    if (logo !== undefined) vendor.logo = logo;
    if (banner !== undefined) vendor.banner = banner;

    await vendor.save();

    res.status(200).json({
      success: true,
      message: 'Store profile updated successfully!',
      vendor,
    });
  } catch (error) {
    console.error('[UpdateVendorProfile Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor profile.',
    });
  }
};

/**
 * @desc    Get all vendors (Admin only)
 * @route   GET /api/vendor/all
 * @access  Private (Admin)
 */
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({})
      .populate('user', 'name email isBlocked createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vendors.length,
      vendors,
    });
  } catch (error) {
    console.error('[GetAllVendors Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve vendor list.',
    });
  }
};

/**
 * @desc    Approve or reject a vendor application (Admin only)
 * @route   PUT /api/vendor/:id/status
 * @access  Private (Admin)
 */
export const updateVendorStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: approved, rejected, or pending.',
      });
    }

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    vendor.status = status;
    await vendor.save();

    res.status(200).json({
      success: true,
      message: `Vendor status updated to "${status}".`,
      vendor,
    });
  } catch (error) {
    console.error('[UpdateVendorStatus Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor status.',
    });
  }
};
