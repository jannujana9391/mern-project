import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingBag, 
  Store, 
  Heart,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const allProducts = [
  {
    id: 1,
    name: 'AeroPro Wireless Noise-Cancelling Headphones',
    price: 189.99,
    originalPrice: 249.99,
    category: 'Electronics',
    vendor: 'SoundWave Technologies',
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    stock: 24,
  },
  {
    id: 2,
    name: 'Minimalist Titanium Chrono Smartwatch',
    price: 129.50,
    originalPrice: 179.00,
    category: 'Electronics',
    vendor: 'Apex Horizon Time',
    rating: 4.6,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    stock: 18,
  },
  {
    id: 3,
    name: 'Handcrafted Heritage Leather Messenger Bag',
    price: 95.00,
    originalPrice: 130.00,
    category: 'Fashion',
    vendor: 'Artisan Crafts Co.',
    rating: 4.9,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    stock: 12,
  },
  {
    id: 4,
    name: 'Ultra-Comfort Ergonomic Mesh Desk Chair',
    price: 219.00,
    originalPrice: 289.00,
    category: 'Home & Office',
    vendor: 'ErgoComfort Living',
    rating: 4.7,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1580481077195-c22ae2426372?w=600&auto=format&fit=crop&q=80',
    stock: 8,
  },
  {
    id: 5,
    name: 'Mechanical Gaming Keyboard RGB Backlit',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Electronics',
    vendor: 'SoundWave Technologies',
    rating: 4.5,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    stock: 30,
  },
  {
    id: 6,
    name: 'Organic Botanical Skincare Rejuvenation Set',
    price: 58.00,
    originalPrice: 75.00,
    category: 'Beauty',
    vendor: 'PureFlora Organics',
    rating: 4.9,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    stock: 45,
  },
  {
    id: 7,
    name: 'Classic Vintage Denim Jacket Unisex',
    price: 68.00,
    originalPrice: 85.00,
    category: 'Fashion',
    vendor: 'Artisan Crafts Co.',
    rating: 4.4,
    reviews: 57,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    stock: 19,
  },
  {
    id: 8,
    name: 'Smart Ambient Desk Lamp with Wireless Charging',
    price: 49.99,
    originalPrice: 69.99,
    category: 'Home & Office',
    vendor: 'ErgoComfort Living',
    rating: 4.6,
    reviews: 73,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    stock: 22,
  },
];

const categories = ['All', 'Electronics', 'Fashion', 'Home & Office', 'Beauty'];

const Products = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedItem, setAddedItem] = useState(null);

  // Filter products
  const filtered = allProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.id - b.id; // featured default
  });

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
            Browse verified listings from certified vendors across multiple departments
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 self-start sm:self-center">
          Showing {sorted.length} Products
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product or vendor..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                selectedCategory === cat
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

      {/* Products Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative overflow-hidden bg-slate-100 h-52">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                  {product.category}
                </span>
                <button
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-500 hover:text-rose-500 rounded-full shadow-sm transition-colors"
                  title="Save to Wishlist"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs text-secondary font-semibold">
                    <Store className="w-3.5 h-3.5" />
                    <span className="truncate">{product.vendor}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center space-x-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-800">{product.rating}</span>
                      <span className="text-slate-400">({product.reviews})</span>
                    </div>
                    <span className="text-emerald-600 font-medium">{product.stock} in stock</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-extrabold text-primary">${product.price.toFixed(2)}</div>
                    <div className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2.5 bg-primary hover:bg-secondary text-white rounded-xl transition-all shadow-sm hover:shadow active:scale-95 flex items-center space-x-1 text-xs font-semibold px-3"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-lg font-bold text-slate-700">No products match your search criteria</p>
          <p className="text-sm text-slate-500">Try adjusting your filters or search keywords.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-semibold hover:bg-secondary-dark transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;

