import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Store,
  Star,
  Check,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [toastMsg, setToastMsg] = useState('');
  const [movedId, setMovedId] = useState(null);

  const handleMoveToCart = (item) => {
    addToCart({
      id: item.id || item._id,
      _id: item._id || item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      vendor: item.vendor || item.vendorName,
      vendorName: item.vendorName || item.vendor,
      category: item.category,
      stock: item.stock,
      quantity: 1,
    });
    setMovedId(item.id || item._id);
    setToastMsg(`Moved "${item.name}" to your shopping cart! ✓`);
    setTimeout(() => {
      removeFromWishlist(item.id || item._id);
      setMovedId(null);
    }, 800);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
            <span className="text-sm font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-500 rounded-2xl">
                <Heart className="w-6 h-6 fill-rose-500" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                My Wishlist
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Save your favorite items from independent merchants and purchase anytime
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                {wishlistItems.length} Saved {wishlistItems.length === 1 ? 'Item' : 'Items'}
              </span>
              <button
                onClick={clearWishlist}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-400">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Your Wishlist is Empty</h3>
            <p className="text-sm text-slate-500">
              You haven't saved any items yet. Explore our curated catalog and tap the heart icon on any product to save it here!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md shadow-primary/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const id = item.id || item._id;
              const price = typeof item.price === 'number' ? item.price : Number(item.price || 0);
              const originalPrice = item.originalPrice ? Number(item.originalPrice) : null;
              const isMoving = movedId === id;

              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Image container */}
                  <div className="relative overflow-hidden bg-slate-100 h-52">
                    <Link to={`/products/${id}`} className="block w-full h-full">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                    </Link>

                    <button
                      onClick={() => removeFromWishlist(id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 rounded-full shadow-sm transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <span className="absolute bottom-3 left-3 bg-white/90 text-slate-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 text-xs text-secondary font-bold">
                        <Store className="w-3.5 h-3.5" />
                        <span className="truncate">{item.vendor || item.vendorName}</span>
                      </div>

                      <Link to={`/products/${id}`}>
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-secondary transition-colors">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-center space-x-1 text-xs text-amber-500 pt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-800">{item.rating || '5.0'}</span>
                        <span className="text-slate-400">({item.reviews || 0} reviews)</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-extrabold text-primary">${price.toFixed(2)}</span>
                        {originalPrice && originalPrice > price && (
                          <span className="text-xs text-slate-400 line-through ml-1.5">
                            ${originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={isMoving}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                          isMoving
                            ? 'bg-emerald-600 text-white'
                            : 'bg-primary hover:bg-secondary text-white'
                        }`}
                      >
                        {isMoving ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Moved</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Move to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
