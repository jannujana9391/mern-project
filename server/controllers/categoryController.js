r3import Category from '../models/Category.js';

const initialCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'High-tech gadgets, headphones, smartwatches, and computing devices.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trending artisanal clothing, jackets, bags, and luxury accessories.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Home & Office',
    slug: 'home-office',
    description: 'Ergonomic workspace furniture, ambient lighting, and modern home decor.',
    image: 'https://images.unsplash.com/photo-1580481077195-c22ae2426372?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Natural skincare routines, organic cosmetics, and self-care essentials.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Active gear, fitness wearables, athletic wear, and outdoor essentials.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Books & Stationery',
    slug: 'books-stationery',
    description: 'Handbound notebooks, fine writing instruments, and curated reads.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80',
  },
];

/**
 * @desc    Get all categories (with auto-seed fallback)
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ name: 1 });

    if (categories.length === 0) {
      await Category.insertMany(initialCategories);
      categories = await Category.find().sort({ name: 1 });
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error('[GetCategories Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories.',
    });
  }
};

/**
 * @desc    Create a new product category
 * @route   POST /api/categories
 * @access  Private (Admin / Vendor)
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a category name.',
      });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists.',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&auto=format&fit=crop&q=80',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      category,
    });
  } catch (error) {
    console.error('[CreateCategory Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create category.',
    });
  }
};

