import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Check, 
  ArrowLeft 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { 
    cartItems, 
    totalItems, 
    subtotal, 
    tax, 
    shipping, 
    grandTotal, 
    distinctVendors, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (couponCode.toUpperCase() === 'SAVE10') {
      setDiscount(Math.round(subtotal * 0.1 * 100) / 100);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code. Try "SAVE10" for 10% off.');
    }
  };

  const finalTotal = Math.max(0, Math.round((grandTotal - discount) * 100) / 100);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-5">
        <div className="w-24 h-24 bg-purple-50 text-secondary rounded-full flex items-center justify-center shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm">
            Looks like you haven't added anything to your cart yet. Explore thousands of items from certified independent merchants!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-primary hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            You have <span className="font-bold text-slate-800">{totalItems} item(s)</span> from{' '}
            <span className="font-bold text-secondary">{distinctVendors.length} independent vendor(s)</span>
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center space-x-1.5 self-start sm:self-center"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Multi-Vendor Order Split Alert */}
      {distinctVendors.length > 1 && (
        <div className="bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-slate-700">
          <Store className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-secondary uppercase tracking-wider block mb-0.5">
              Multi-Vendor Unified Order
            </span>
            <span>
              Your items will be fulfilled by <span className="font-bold">{distinctVendors.join(', ')}</span>.
              At checkout, your single payment automatically splits into separate merchant packages with individual tracking.
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Items + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-slate-300 transition-colors"
            >
              {/* Product Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-secondary font-bold">
                    <Store className="w-3.5 h-3.5" />
                    <span>{item.vendor}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h3>
                  <div className="text-sm font-extrabold text-primary">${item.price.toFixed(2)}</div>
                </div>
              </div>

              {/* Quantity Controls & Item Total */}
              <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Stepper */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 text-slate-500 hover:text-primary hover:bg-slate-200 transition-colors"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 py-1 text-xs font-bold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 text-slate-500 hover:text-primary hover:bg-slate-200 transition-colors"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[70px]">
                  <div className="text-sm font-black text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 text-xs font-bold text-secondary hover:text-purple-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Order Summary
          </h2>

          {/* Free Shipping Meter */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Truck className="w-4 h-4 text-emerald-600" />
                {shipping === 0 ? 'Free Shipping Qualified!' : 'Add $50 for Free Shipping'}
              </span>
              <span className="text-emerald-600 font-extrabold">{shipping === 0 ? 'FREE' : '$9.99'}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items Subtotal ({totalItems})</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Tax (5%)</span>
              <span className="font-bold text-slate-900">${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold text-slate-900">
                {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            {couponApplied && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon Discount (SAVE10)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Total Amount</span>
              <span className="text-2xl font-black text-primary">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Promo Coupon Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Have a Coupon Code? (Try "SAVE10")
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-secondary/40 font-bold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>}
            {couponApplied && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Coupon "SAVE10" applied!
              </p>
            )}
          </form>

          {/* Checkout CTA */}
          <button
            onClick={handleProceedToCheckout}
            className="w-full py-4 bg-gradient-to-r from-secondary to-purple-700 hover:from-purple-700 hover:to-secondary text-white font-extrabold rounded-2xl shadow-lg shadow-secondary/25 transition-all flex items-center justify-center space-x-2 text-sm active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Guaranteed 256-bit Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

