import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  Laptop, 
  Shirt, 
  Home as HomeIcon, 
  HeartHandshake, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { checkHealth } from '../services/api';

const categories = [
  { id: 'electronics', name: 'Electronics & Gadgets', icon: <Laptop className="w-6 h-6" />, count: '1,420+ items', color: 'bg-blue-500/10 text-blue-600' },
  { id: 'fashion', name: 'Fashion & Apparel', icon: <Shirt className="w-6 h-6" />, count: '2,850+ items', color: 'bg-purple-500/10 text-purple-600' },
  { id: 'home', name: 'Home & Kitchen', icon: <HomeIcon className="w-6 h-6" />, count: '980+ items', color: 'bg-emerald-500/10 text-emerald-600' },
  { id: 'beauty', name: 'Beauty & Wellness', icon: <HeartHandshake className="w-6 h-6" />, count: '640+ items', color: 'bg-rose-500/10 text-rose-600' },
];

const initialProducts = [
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
    tag: 'Best Seller',
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
    tag: 'Popular',
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
    tag: 'Handmade',
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
    tag: 'Featured',
  },
];

const Home = () => {
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await checkHealth();
        setHealthData(data);
      } catch (err) {
        console.warn('Backend ping failed:', err.message);
      } finally {
        setHealthLoading(false);
      }
    };
    fetchHealth();
  }, []);

  const handleAddToCart = (product) => {
    setAddedItem(product.name);
    setTimeout(() => setAddedItem(null), 3000);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Toast Notification */}
      {addedItem && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <span className="text-sm font-semibold">Added "{addedItem}" to Cart!</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-slate-900 to-slate-950 text-white relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30 text-purple-200 border border-secondary/40 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-accent" /> Multi-Vendor Marketplace Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Shop Direct From <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-300 to-secondary-light">
                  Top Independent Vendors
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                Experience unified shopping with split multi-vendor checkouts, verified merchant authenticity, and express worldwide delivery.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3.5 bg-gradient-to-r from-secondary to-purple-600 hover:from-purple-600 hover:to-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/30 transition-all flex items-center space-x-2"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold rounded-xl border border-slate-700 transition-all flex items-center space-x-2"
                >
                  <Store className="w-4 h-4 text-accent" />
                  <span>Open Vendor Store</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-slate-300 text-xs">
                <div>
                  <span className="block text-xl font-bold text-white">500+</span>
                  <span className="text-slate-400">Verified Vendors</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-white">10,000+</span>
                  <span className="text-slate-400">Curated Products</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-white">99.8%</span>
                  <span className="text-slate-400">Positive Feedback</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/40 p-3">
                <img
                  src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=900&auto=format&fit=crop&q=80"
                  alt="Marketplace showcase"
                  className="rounded-2xl object-cover w-full h-[360px] sm:h-[420px]"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-primary/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Hot Pick</span>
                    <h3 className="text-white font-bold text-sm">Next-Gen Audio & Wearables</h3>
                    <p className="text-xs text-slate-400">Special seasonal discounts up to 40%</p>
                  </div>
                  <Link
                    to="/products"
                    className="p-2.5 bg-secondary hover:bg-secondary-light text-white rounded-xl transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live System Status Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">MERN Stack Environment Status</h4>
              <p className="text-xs text-slate-500">
                Phase 1 complete: Express server, React Router, Tailwind theme & database connection verified
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {healthLoading ? (
              <span className="text-slate-400">Pinging server...</span>
            ) : healthData ? (
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Backend Online (Port 5000)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 rounded-full font-semibold border border-sky-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> MongoDB Connected
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full font-semibold border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5" /> Backend Offline
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore Top Categories</h2>
            <p className="text-sm text-slate-500">Shop curated items organized by department</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-secondary hover:text-secondary-dark flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to="/products"
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-secondary/40 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} mb-4 group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-secondary transition-colors">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Multi-Vendor Products</h2>
            <p className="text-sm text-slate-500">Handpicked selections with certified merchant guarantees</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-secondary hover:text-secondary-dark flex items-center space-x-1">
            <span>Browse All (10,000+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialProducts.map((product) => (
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
                <span className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                  {product.tag}
                </span>
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                  {product.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  {/* Vendor attribution badge */}
                  <div className="flex items-center space-x-1.5 text-xs text-secondary font-semibold">
                    <Store className="w-3.5 h-3.5" />
                    <span className="truncate">{product.vendor}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 text-xs text-amber-500 pt-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-800">{product.rating}</span>
                    <span className="text-slate-400">({product.reviews})</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-extrabold text-primary">${product.price.toFixed(2)}</div>
                    <div className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2.5 bg-primary hover:bg-secondary text-white rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
                    title="Add to Shopping Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Vendor Platform Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-secondary to-purple-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Earn With Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Grow Your Business as an Authorized Merchant
            </h2>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              Reach millions of eager shoppers. Get a branded vendor storefront, live stock analytics, commission tracking, and seamless payout processing.
            </p>
          </div>
          <Link
            to="/register"
            className="px-8 py-4 bg-white text-secondary hover:bg-slate-100 font-extrabold rounded-2xl shadow-lg transition-all shrink-0"
          >
            Register as a Vendor
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
