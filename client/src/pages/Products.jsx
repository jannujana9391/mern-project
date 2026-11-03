import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal,
  CheckCircle2,
  RefreshCw,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const fallbackProducts = [
  {
    id: 1,
    _id: '1',
    name: 'AeroPro Wireless Noise-Cancelling Headphones',
    price: 189.99,
    originalPrice: 249.99,
    category: 'Electronics',
    vendor: 'SoundWave Technologies',
    vendorName: 'SoundWave Technologies',
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    stock: 24,
  },
  {
    id: 2,
    _id: '2',
    name: 'Minimalist Titanium Chrono Smartwatch',
    price: 129.50,
    originalPrice: 179.00,
    category: 'Electronics',
    vendor: 'Apex Horizon Time',
    vendorName: 'Apex Horizon Time',
    rating: 4.6,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    stock: 18,
  },
  {
    id: 3,
    _id: '3',
    name: 'Handcrafted Heritage Leather Messenger Bag',
    price: 95.00,
    originalPrice: 130.00,
    category: 'Fashion',
    vendor: 'Artisan Crafts Co.',
    vendorName: 'Artisan Crafts Co.',
    rating: 4.9,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    stock: 12,
  },
  {
    id: 4,
    _id: '4',
    name: 'Ultra-Comfort Ergonomic Mesh Desk Chair',
    price: 219.00,
    originalPrice: 289.00,
    category: 'Home & Office',
    vendor: 'ErgoComfort Living',
    vendorName: 'ErgoComfort Living',
    rating: 4.7,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1580481077195-c22ae2426372?w=600&auto=format&fit=crop&q=80',
    stock: 8,
  },
  {
    id: 5,
    _id: '5',
    name: 'Mechanical Gaming Keyboard RGB Backlit',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Electronics',
    vendor: 'SoundWave Technologies',
    vendorName: 'SoundWave Technologies',
    rating: 4.5,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    stock: 30,
  },
  {
    id: 6,
    _id: '6',
    name: 'Organic Botanical Skincare Rejuvenation Set',
    price: 58.00,
    originalPrice: 75.00,
    category: 'Beauty',
    vendor: 'PureFlora Organics',
    vendorName: 'PureFlora Organics',
    rating: 4.9,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    stock: 45,
  },
  {
    id: 7,
    _id: '7',
    name: 'Classic Vintage Denim Jacket Unisex',
    price: 68.00,
    originalPrice: 85.00,
    category: 'Fashion',
    vendor: 'Artisan Crafts Co.',
    vendorName: 'Artisan Crafts Co.',
    rating: 4.4,
    reviews: 57,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    stock: 19,
  },
  {
    id: 8,
    _id: '8',
    name: 'Smart Ambient LED Sunset Horizon Lamp',
    price: 44.99,
    originalPrice: 59.99,
    category: 'Home & Office',
    vendor: 'SoundWave Technologies',
    vendorName: 'SoundWave Technologies',
    rating: 4.6,
    reviews: 73,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    stock: 35,
  },
];

const defaultCategories = ['All', 'Electronics', 'Fashion', 'Home & Office', 'Beauty', 'Sports & Outdoors'];

const Products = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const [addedItem, setAddedItem] = useState(null);

  // Sync with searchParams if changed from outside
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchTerm(q);
  }, [searchParams]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.categories?.length > 0) {
          const names = ['All', ...res.data.categories.map((c) => c.name)];
          setCategories(names);
        }
      } catch (e) {
        // use defaultCategories
      }
    };
    fetchCats();
  }, []);

  // Fetch products from backend with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchTerm.trim() !== '') {
          params.search = searchTerm.trim();
        }
        if (sortBy === 'price-low') params.sort = 'price-asc';
        if (sortBy === 'price-high') params.sort = 'price-desc';
        if (sortBy === 'rating') params.sort = 'rating';

        const res = await api.get('/products', { params });
        if (res.data?.products && res.data.products.length > 0) {
          setProducts(res.data.products);
        } else if (res.data?.products && res.data.products.length === 0 && (searchTerm || selectedCategory !== 'All')) {
          setProducts([]);
        } else {
          // Fallback if empty database
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.log('Using local products fallback:', err.message);
        // Fallback filtering on client
        let filtered = fallbackProducts;
        if (selectedCategory !== 'All') {
          filtered = filtered.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter((p) => p.name.toLowerCase().includes(term) || (p.vendorName || p.vendor || '').toLowerCase().includes(term));
        }
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, searchTerm, sortBy]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItem(product.name);
    setTimeout(() => setAddedItem(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {addedItem && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <span className="text-sm font-semibold">Added "{addedItem}" to Cart!</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Marketplace Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified listings from certified independent vendors across all departments
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 self-start sm:self-center flex items-center gap-2">
          {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-secondary" />}
          <span>Showing {products.length} Products</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products or vendors..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/40"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Loading State or Products Grid */}
      {loading && products.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Searching marketplace catalog...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-lg font-bold text-slate-700">No products match your search criteria</p>
          <p className="text-sm text-slate-500">Try adjusting your category filter or search keywords.</p>
          <button
            onClick={() => {
              handleCategorySelect('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-semibold hover:bg-secondary-dark transition-colors shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
