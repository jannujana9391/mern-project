import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Store, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  Headphones,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import FlashDeals from '../components/FlashDeals';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import VendorSpotlight from '../components/VendorSpotlight';
import Testimonials from '../components/Testimonials';
import { checkHealth } from '../services/api';

const featuredProducts = [
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

const Home = () => {
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

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
    setToastMessage({
      type: 'cart',
      text: `Added "${product.name}" to shopping cart!`,
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleWishlist = (product) => {
    if (wishlist.includes(product.id)) {
      setWishlist(wishlist.filter((id) => id !== product.id));
      setToastMessage({
        type: 'wishlist',
        text: `Removed "${product.name}" from wishlist.`,
      });
    } else {
      setWishlist([...wishlist, product.id]);
      setToastMessage({
        type: 'wishlist',
        text: `Saved "${product.name}" to your wishlist!`,
      });
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter products by selected tab
  const filteredProducts = activeTab === 'All' 
    ? featuredProducts 
    : featuredProducts.filter((p) => p.category.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 pt-6">
        {/* 1. Hero Promotional Banner Slider */}
        <HeroSlider />

        {/* 2. Live System Status Bar */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">MERN Stack Environment Status</h4>
              <p className="text-xs text-slate-500">
                Phase 2: Professional Homepage, Hero Banner, Flash Deals & Multi-Vendor Showcase
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
        </section>

        {/* 3. Shop by Category Grid */}
        <CategoryGrid />

        {/* 4. Flash Deals & Lightning Discounts */}
        <FlashDeals onAddToCart={handleAddToCart} />

        {/* 5. Trending Multi-Vendor Products Section with Tabs */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trending Marketplace Products</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                  Top Picks
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Authentic items shipped directly by independent certified merchants
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Electronics', 'Fashion', 'Home', 'Beauty'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    activeTab === tab
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlist.includes(product.id)}
              />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-white hover:bg-primary text-slate-800 hover:text-white border border-slate-200 font-bold text-sm rounded-2xl shadow-sm hover:shadow transition-all"
            >
              <span>Explore All 10,000+ Marketplace Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 6. Multi-Vendor Top Merchant Spotlight */}
        <VendorSpotlight />

        {/* 7. Marketplace Core Value Pillars */}
        <section className="bg-gradient-to-r from-slate-900 via-primary to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary-light flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-base">Free Global Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enjoy free standard delivery on qualified merchant orders over $50 with live carrier tracking.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-base">Escrow Buyer Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Funds are securely held until you receive and verify the authenticity of your order.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-base">Multi-Vendor Checkout</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add products from 10 different vendors and complete payment in a single unified transaction.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-base">24/7 Dedicated Support</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Round-the-clock dispute resolution and customer assistance for buyers and merchants.
              </p>
            </div>
          </div>
        </section>

        {/* 8. Verified Community Testimonials */}
        <Testimonials />

        {/* 9. High-Converting Merchant Recruitment Banner */}
        <section className="bg-gradient-to-r from-secondary via-purple-700 to-primary rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-purple-500/30">
          <div className="space-y-4 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Store className="w-3.5 h-3.5 text-accent" />
              Start Selling Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Turn Your Brand Into a Global E-Commerce Powerhouse
            </h2>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              Join thousands of thriving independent merchants on NexStore. Benefit from low commission rates, automated multi-vendor order routing, and instant payouts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-secondary hover:bg-slate-100 font-black rounded-2xl shadow-xl transition-all duration-200 active:scale-95 text-sm"
            >
              Open Your Vendor Store
            </Link>
            <Link
              to="/about"
              className="px-6 py-4 bg-purple-900/40 hover:bg-purple-900/60 text-white border border-purple-400/40 font-bold rounded-2xl transition-all duration-200 text-sm"
            >
              Learn More
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
