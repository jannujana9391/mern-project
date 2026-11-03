import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Store,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

// Fallback catalog for demo IDs or offline mode
const fallbackCatalog = [
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
    stock: 24,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Experience pure sonic precision with the AeroPro Wireless Headphones. Featuring class-leading hybrid active noise cancellation, custom 40mm neodymium drivers, and up to 40 hours of continuous wireless playback on a single charge.',
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
    stock: 18,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Forged from aerospace-grade titanium, this minimalist smartwatch blends timeless horology with next-generation bio-tracking sensors, heart rate & SpO2 monitoring, and 5 ATM water resistance.',
  },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Try fetching from MongoDB API
      const res = await api.get(`/products/${id}`);
      if (res.data?.product) {
        const prod = res.data.product;
        setProduct(prod);
        setSelectedImage(prod.image || (prod.images && prod.images[0]) || '');
        fetchRelated(prod.category, prod._id);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log('MongoDB product lookup failed or numeric ID; attempting fallback check...', err.message);
    }

    // 2. Check fallback catalog if numeric ID
    const foundFallback = fallbackCatalog.find((p) => String(p.id) === String(id) || String(p._id) === String(id));
    if (foundFallback) {
      setProduct(foundFallback);
      setSelectedImage(foundFallback.image);
      setLoading(false);
      return;
    }

    // 3. Try fetching all products to find match by name or fallback
    try {
      const allRes = await api.get('/products');
      const matched = allRes.data?.products?.find((p) => String(p._id) === String(id) || String(p.id) === String(id));
      if (matched) {
        setProduct(matched);
        setSelectedImage(matched.image || (matched.images && matched.images[0]) || '');
        fetchRelated(matched.category, matched._id);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    setError('Product not found or has been removed by the merchant.');
    setLoading(false);
  };

  const fetchRelated = async (category, currentId) => {
    try {
      const res = await api.get('/products', { params: { category, limit: 4 } });
      const filtered = (res.data?.products || []).filter((p) => String(p._id) !== String(currentId));
      setRelatedProducts(filtered);
    } catch (e) {
      console.error('Failed to load related products:', e);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdded(true);
    const vendorName = product.vendorName || (typeof product.vendor === 'object' ? product.vendor?.storeName : product.vendor) || 'Authorized Merchant';
    
    addToCart({
      id: product._id || product.id,
      _id: product._id || product.id,
      name: product.name,
      price: typeof product.price === 'number' ? product.price : Number(product.price || 0),
      image: selectedImage || product.image,
      vendor: vendorName,
      vendorName: vendorName,
      category: product.category,
      stock: product.stock,
      quantity,
    });

    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] max-w-2xl mx-auto px-4 flex flex-col items-center justify-center text-center gap-4">
        <div className="p-4 bg-rose-50 text-rose-600 rounded-full">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md">{error || 'This item is no longer available in the marketplace.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Products</span>
        </Link>
      </div>
    );
  }

  const price = typeof product.price === 'number' ? product.price : Number(product.price || 0);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const vendorName = product.vendorName || (typeof product.vendor === 'object' ? product.vendor?.storeName : product.vendor) || 'Authorized Merchant';
  const vendorRating = typeof product.vendor === 'object' && product.vendor?.rating ? product.vendor.rating.toFixed(1) : '4.9';
  const reviewsCount = product.reviews !== undefined ? product.reviews : (product.reviewCount || 0);
  const galleryImages = [
    product.image,
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean);
  const uniqueImages = [...new Set(galleryImages)];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to={`/products?category=${product.category}`} className="text-slate-600 hover:text-secondary transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left Column: Image Gallery (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Primary Large Image View */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-square border border-slate-200 shadow-inner group">
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md tracking-wider">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnail Selector */}
              {uniqueImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {uniqueImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === imgUrl
                          ? 'border-secondary shadow-md scale-102 ring-2 ring-secondary/20'
                          : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Buyer Guarantees Box */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50">
                  <Truck className="w-5 h-5 text-secondary mb-1" />
                  <span className="text-[11px] font-bold text-slate-800">Free Delivery</span>
                  <span className="text-[10px] text-slate-400">Orders over $50</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50">
                  <RotateCcw className="w-5 h-5 text-secondary mb-1" />
                  <span className="text-[11px] font-bold text-slate-800">30-Day Return</span>
                  <span className="text-[10px] text-slate-400">Hassle-free policy</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50">
                  <ShieldCheck className="w-5 h-5 text-secondary mb-1" />
                  <span className="text-[11px] font-bold text-slate-800">100% Genuine</span>
                  <span className="text-[10px] text-slate-400">Verified Merchant</span>
                </div>
              </div>
            </div>

            {/* Right Column: Information, Pricing, & Actions (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Category & Wishlist */}
                <div className="flex items-center justify-between">
                  <Link
                    to={`/products?category=${product.category}`}
                    className="inline-block px-3 py-1 bg-purple-50 text-secondary text-xs font-bold rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                  >
                    {product.category}
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        isWishlisted
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'border-slate-200 text-slate-600 hover:text-rose-500 hover:border-rose-200'
                      }`}
                      title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Ratings & Stock Status */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-extrabold text-slate-900">
                      {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
                    </span>
                    <span className="text-slate-400">({reviewsCount} customer reviews)</span>
                  </div>

                  <span className="text-slate-300">|</span>

                  {product.stock > 5 ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units available)
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5" /> Low Stock: Only {product.stock} left!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-rose-700 font-bold text-xs bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Vendor Attribution Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-secondary">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sold & Fulfilled by</p>
                      <p className="text-sm font-bold text-slate-900">{vendorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{vendorRating} Vendor Rating</span>
                  </div>
                </div>

                {/* Pricing Block */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-primary text-white space-y-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Special Marketplace Price</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      ${price.toFixed(2)}
                    </span>
                    {originalPrice && originalPrice > price && (
                      <span className="text-lg text-slate-400 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800">
                        Save ${(originalPrice - price).toFixed(2)} ({discountPercent}% OFF)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">All applicable taxes calculated at checkout.</p>
                </div>

                {/* Product Description */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">Product Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-sm font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2.5 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={product.stock > 0 && quantity >= product.stock}
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2.5 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Subtotal: <strong>${(price * quantity).toFixed(2)}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : product.stock <= 0
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-primary hover:bg-slate-800 text-white shadow-primary/20 hover:shadow-lg'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Added to Cart ({quantity})</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className="py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-secondary to-purple-700 hover:from-purple-700 hover:to-secondary text-white shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Related Products
                </h2>
                <p className="text-xs text-slate-500">More items from the {product.category} category</p>
              </div>
              <Link
                to={`/products?category=${product.category}`}
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
              >
                View More <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p._id || p.id}
                  product={p}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
