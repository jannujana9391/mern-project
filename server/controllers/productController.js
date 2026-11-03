import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import Category from '../models/Category.js';

// Default initial catalog data for auto-seeding
const initialProductsSeed = [
  {
    name: 'AeroPro Wireless Noise-Cancelling Headphones',
    description: 'Immersive sound experience with active noise cancellation, 40-hour battery life, and ultra-plush memory foam ear cushions.',
    price: 189.99,
    originalPrice: 249.99,
    category: 'Electronics',
    vendorName: 'SoundWave Technologies',
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 24,
    isFeatured: true,
  },
  {
    name: 'Minimalist Titanium Chrono Smartwatch',
    description: 'Aerospace-grade titanium chassis, AMOLED always-on crystal display, comprehensive health sensors, and 7-day battery.',
    price: 129.50,
    originalPrice: 179.00,
    category: 'Electronics',
    vendorName: 'Apex Horizon Time',
    rating: 4.6,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 18,
    isFeatured: true,
  },
  {
    name: 'Handcrafted Heritage Leather Messenger Bag',
    description: 'Full-grain vegetable-tanned artisanal cowhide leather, brass hardware accents, fits up to 16-inch laptops with dedicated padding.',
    price: 95.00,
    originalPrice: 130.00,
    category: 'Fashion',
    vendorName: 'Artisan Crafts Co.',
    rating: 4.9,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 12,
    isFeatured: true,
  },
  {
    name: 'Ultra-Comfort Ergonomic Mesh Desk Chair',
    description: 'Breathable elastic mesh backrest, adaptive lumbar support mechanism, multi-directional 4D armrests, and BIFMA-certified gas lift.',
    price: 219.00,
    originalPrice: 289.00,
    category: 'Home & Office',
    vendorName: 'ErgoComfort Living',
    rating: 4.7,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1580481077195-c22ae2426372?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1580481077195-c22ae2426372?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 8,
    isFeatured: false,
  },
  {
    name: 'Mechanical Gaming Keyboard RGB Backlit',
    description: 'Custom hot-swappable tactile switches, double-shot PBT keycaps, per-key RGB backlighting, and programmable macro rotary encoder.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Electronics',
    vendorName: 'SoundWave Technologies',
    rating: 4.5,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 30,
    isFeatured: true,
  },
  {
    name: 'Organic Botanical Skincare Rejuvenation Set',
    description: 'Cold-pressed botanical extracts, hyaluronic acid serum, vitamin C revitalizer, and gentle cleansing floral balm.',
    price: 58.00,
    originalPrice: 75.00,
    category: 'Beauty',
    vendorName: 'PureFlora Organics',
    rating: 4.9,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 45,
    isFeatured: false,
  },
  {
    name: 'Classic Vintage Denim Jacket Unisex',
    description: 'Heavyweight organic cotton denim, brass buttons, authentic stonewashed finish with relaxed comfortable everyday tailoring.',
    price: 68.00,
    originalPrice: 85.00,
    category: 'Fashion',
    vendorName: 'Artisan Crafts Co.',
    rating: 4.4,
    reviews: 57,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 19,
    isFeatured: false,
  },
  {
    name: 'Smart Ambient LED Sunset Horizon Lamp',
    description: '16 million colors with mobile app & voice control, ambient mood lighting, sunset and sunrise gradual alarm simulation modes.',
    price: 44.99,
    originalPrice: 59.99,
    category: 'Home & Office',
    vendorName: 'SoundWave Technologies',
    rating: 4.6,
    reviews: 73,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    ],
    stock: 35,
    isFeatured: true,
  },
];

/**
 * Helper to ensure demo products exist in MongoDB
 */
const autoSeedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) return;

    // Find or create default demo vendor
    let demoVendor = await Vendor.findOne({ storeName: 'SoundWave Technologies' });
    if (!demoVendor) {
      demoVendor = await Vendor.findOne();
    }

    if (!demoVendor) {
      console.log('[Product Seeder] Skipping auto-seed: No vendor registered yet.');
      return;
    }

    const productsToInsert = initialProductsSeed.map((p) => ({
      ...p,
      vendor: demoVendor._id,
      vendorName: p.vendorName || demoVendor.storeName,
    }));

    await Product.insertMany(productsToInsert);
    console.log(`[Product Seeder] Successfully seeded ${productsToInsert.length} initial products.`);
  } catch (error) {
    console.error('[Product Seeder Error]:', error.message);
  }
};

/**
 * @desc    Get all products with search, filter, and sorting
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    // Check auto-seed if database is currently empty
    await autoSeedProducts();

    const {
      search,
      category,
      vendorName,
      minPrice,
      maxPrice,
      featured,
      sort,
      page = 1,
      limit = 50,
    } = req.query;

    const query = { isActive: true };

    // Search filter (name or description)
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All' && category.trim() !== '') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // Vendor filter
    if (vendorName && vendorName.trim() !== '') {
      query.vendorName = { $regex: new RegExp(`^${vendorName.trim()}$`, 'i') };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting options
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-low' || sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high' || sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'popular') {
      sortOption = { reviews: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate('vendor', 'storeName logo rating')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)),
      products,
    });
  } catch (error) {
    console.error('[GetProducts Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'vendor',
      'storeName logo banner rating reviewCount description'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('[GetProductById Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product details.',
    });
  }
};

/**
 * @desc    Get all products belonging to the logged-in vendor
 * @route   GET /api/products/vendor/my-products
 * @access  Private (Vendor)
 */
export const getVendorProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found for this account.',
      });
    }

    const products = await Product.find({
      $or: [{ vendor: vendor._id }, { vendorName: vendor.storeName }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('[GetVendorProducts Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your vendor products.',
    });
  }
};

/**
 * @desc    Create a new product listing
 * @route   POST /api/products
 * @access  Private (Vendor / Admin)
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      image,
      images,
      stock,
      isFeatured,
    } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, and category.',
      });
    }

    let vendorId;
    let vendorName;

    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor profile not found.',
        });
      }
      vendorId = vendor._id;
      vendorName = vendor.storeName;
    } else if (req.user.role === 'admin') {
      const defaultVendor = await Vendor.findOne();
      vendorId = defaultVendor ? defaultVendor._id : req.user._id;
      vendorName = defaultVendor ? defaultVendor.storeName : 'Marketplace Direct';
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category: category.trim(),
      vendor: vendorId,
      vendorName,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      images: Array.isArray(images) && images.length > 0 ? images : [image].filter(Boolean),
      stock: stock !== undefined ? Number(stock) : 10,
      isFeatured: Boolean(isFeatured),
      rating: 5.0,
      reviews: 0,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product,
    });
  } catch (error) {
    console.error('[CreateProduct Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product.',
    });
  }
};

/**
 * @desc    Update an existing product listing
 * @route   PUT /api/products/:id
 * @access  Private (Vendor / Admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Permission check for vendors: must own this product
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (!vendor) {
        return res.status(403).json({ success: false, message: 'Vendor profile not found.' });
      }

      const isOwner =
        product.vendor.toString() === vendor._id.toString() ||
        product.vendorName === vendor.storeName;

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to edit this product.',
        });
      }
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      image,
      images,
      stock,
      isFeatured,
      isActive,
    } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (category !== undefined) product.category = category.trim();
    if (image !== undefined) product.image = image;
    if (images !== undefined) product.images = images;
    if (stock !== undefined) product.stock = Number(stock);
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      product,
    });
  } catch (error) {
    console.error('[UpdateProduct Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product.',
    });
  }
};

/**
 * @desc    Delete a product listing
 * @route   DELETE /api/products/:id
 * @access  Private (Vendor / Admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Permission check for vendors
    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (!vendor) {
        return res.status(403).json({ success: false, message: 'Vendor profile not found.' });
      }

      const isOwner =
        product.vendor.toString() === vendor._id.toString() ||
        product.vendorName === vendor.storeName;

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this product.',
        });
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
    });
  } catch (error) {
    console.error('[DeleteProduct Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product.',
    });
  }
};

