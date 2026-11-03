import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new Customer or Vendor
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'customer', storeName, businessCategory } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email address, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // 3. Vendor-specific validation
    if (role === 'vendor') {
      if (!storeName) {
        return res.status(400).json({
          success: false,
          message: 'Store name is required for vendor registration.',
        });
      }

      const existingStore = await Vendor.findOne({ storeName: storeName.trim() });
      if (existingStore) {
        return res.status(400).json({
          success: false,
          message: 'This store name is already claimed. Please choose a different name.',
        });
      }
    }

    // 4. Create User
    const userRole = role === 'admin' ? 'customer' : role; // Prevent unauthorized public admin registration
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: userRole,
    });

    let vendorRecord = null;
    if (userRole === 'vendor') {
      vendorRecord = await Vendor.create({
        user: user._id,
        storeName: storeName.trim(),
        businessCategory: businessCategory || 'General Merchandise',
        status: 'approved',
      });
    }

    // 5. Generate Token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: `${userRole === 'vendor' ? 'Vendor store' : 'Customer account'} registered successfully!`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendor: vendorRecord,
      },
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during user registration.',
    });
  }
};

/**
 * @desc    Authenticate User (Customer, Vendor, Admin) & Get Token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user with password included
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Verify Password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check account status
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by the platform administrator.',
      });
    }

    // If vendor, get vendor profile
    let vendorRecord = null;
    if (user.role === 'vendor') {
      vendorRecord = await Vendor.findOne({ user: user._id });
    }

    // Generate Token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        vendor: vendorRecord,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during user authentication.',
    });
  }
};

/**
 * @desc    Get Current Logged-in User Profile
 * @route   GET /api/auth/me
 * @access  Private (JWT Required)
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let vendorRecord = null;

    if (user.role === 'vendor') {
      vendorRecord = await Vendor.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        vendor: vendorRecord,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[GetMe Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.',
    });
  }
};

/**
 * @desc    Seed Initial Demo Accounts for Customer, Vendor, and Admin
 * @route   POST /api/auth/seed-demo
 * @access  Public
 */
export const seedDemoUsers = async (req, res) => {
  try {
    // 1. Customer Demo
    let customer = await User.findOne({ email: 'customer@demo.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Sarah Customer',
        email: 'customer@demo.com',
        password: 'Customer@123',
        role: 'customer',
      });
    }

    // 2. Vendor Demo
    let vendorUser = await User.findOne({ email: 'vendor@demo.com' });
    if (!vendorUser) {
      vendorUser = await User.create({
        name: 'Alex Vendor',
        email: 'vendor@demo.com',
        password: 'Vendor@123',
        role: 'vendor',
      });

      await Vendor.create({
        user: vendorUser._id,
        storeName: 'SoundWave Technologies',
        businessCategory: 'Consumer Electronics & Audio',
        description: 'Authorized audio manufacturer & boutique gadget seller.',
        status: 'approved',
      });
    }

    // 3. Admin Demo
    let admin = await User.findOne({ email: 'admin@demo.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@demo.com',
        password: 'Admin@123',
        role: 'admin',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Demo accounts verified/created successfully in MongoDB!',
      demoAccounts: {
        customer: { email: 'customer@demo.com', password: 'Customer@123', role: 'customer' },
        vendor: { email: 'vendor@demo.com', password: 'Vendor@123', role: 'vendor' },
        admin: { email: 'admin@demo.com', password: 'Admin@123', role: 'admin' },
      },
    });
  } catch (error) {
    console.error('[Seed Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to seed demo accounts.',
    });
  }
};

