import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Store, Eye, Check } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    setIsAdded(true);
    if (onAddToCart) onAddToCart(product);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (onToggleWishlist) onToggleWishlist(product);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between group relative"
    >
      {/* Top Media Container */}
      <div className="relative overflow-hidden bg-slate-100 h-56">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md tracking-wider">
            -{discountPercent}%
          </span>
        )}

        {/* Product Tag / Category */}
        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm border border-slate-100">
          {product.category}
        </span>

        {/* Quick Action Floating Buttons (Wishlist & Quick View) */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button
            onClick={handleWishlist}
            className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-200 ${
              isWishlisted
                ? 'bg-rose-50 text-rose-500'
                : 'bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <Link
            to="/products"
            className="p-2.5 bg-white/90 hover:bg-white text-slate-600 hover:text-primary rounded-full shadow-md backdrop-blur-md transition-colors"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Vendor Attribution Badge */}
          <div className="flex items-center space-x-1.5 text-xs text-secondary font-bold">
            <Store className="w-3.5 h-3.5" />
            <span className="truncate hover:underline cursor-pointer" title={`Vendor: ${product.vendor}`}>
              {product.vendor}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-secondary transition-colors">
            {product.name}
          </h3>

          {/* Ratings & Reviews */}
          <div className="flex items-center space-x-2 text-xs pt-0.5">
            <div className="flex items-center space-x-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-slate-900">{product.rating}</span>
            </div>
            <span className="text-slate-400">({product.reviews} reviews)</span>
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-extrabold text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">Free Delivery</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-primary hover:bg-secondary text-white hover:shadow-md'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

