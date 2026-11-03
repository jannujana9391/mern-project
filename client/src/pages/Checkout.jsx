import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  Store, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  AlertCircle, 
  Loader2, 
  MapPin, 
  PackageCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, subtotal, tax, shipping, grandTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '555-019-2834',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zipCode: '97477',
    country: 'USA',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardHolder: user?.name || 'Authorized Buyer',
    expiry: '12/28',
    cvv: '•••',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrders, setCompletedOrders] = useState(null);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const payload = {
        items: cartItems,
        shippingAddress,
        paymentMethod,
        paymentDetails: {
          transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        },
      };

      const res = await axios.post('/api/orders', payload);

      if (res.data?.success) {
        setCompletedOrders(res.data.orders);
        clearCart(); // Wipe cart upon successful payment
      }
    } catch (err) {
      console.error('Order placement error:', err);
      setErrorMsg(
        err.response?.data?.message || err.message || 'Payment processing failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // If order was placed successfully, show Order Confirmation Screen!
  if (completedOrders) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase rounded-full tracking-wider">
              Payment Confirmed
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Your simulated payment was successful. We created{' '}
              <span className="font-bold text-slate-800">{completedOrders.length} vendor shipment order(s)</span>{' '}
              in MongoDB with split fulfillment tracking.
            </p>
          </div>

          {/* Orders List */}
          <div className="space-y-3 pt-4 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Generated Vendor Orders:
            </h3>
            {completedOrders.map((ord) => (
              <div
                key={ord._id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{ord.orderNumber}</div>
                  <div className="text-secondary font-bold flex items-center gap-1 mt-0.5">
                    <Store className="w-3.5 h-3.5" />
                    <span>Fulfilled by: {ord.vendorName}</span>
                  </div>
                  <div className="text-slate-500 mt-1">
                    {ord.items.length} item(s) • Ship to: {ord.shippingAddress.city}, {ord.shippingAddress.state}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 bg-sky-50 text-sky-700 font-bold rounded-full mb-1 border border-sky-200">
                    Status: {ord.orderStatus}
                  </span>
                  <div className="font-black text-base text-primary">${ord.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-100">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <PackageCheck className="w-4 h-4" />
              <span>View Customer Dashboard</span>
            </Link>

            <Link
              to="/products"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout & Payment</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Review shipping address, select a simulated payment method, and complete your multi-vendor purchase
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-secondary" />
              <h2 className="text-base font-bold text-slate-900">1. Delivery Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Contact Phone</label>
                <input
                  type="text"
                  required
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Street Address</label>
                <input
                  type="text"
                  required
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">City</label>
                <input
                  type="text"
                  required
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">State</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Zip Code</label>
                  <input
                    type="text"
                    required
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Payment Gateway Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-accent" />
              <h2 className="text-base font-bold text-slate-900">2. Payment Method (Sandbox / Test Mode)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'card'
                    ? 'border-secondary bg-purple-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className={`w-5 h-5 mb-2 ${paymentMethod === 'card' ? 'text-secondary' : 'text-slate-400'}`} />
                <div className="font-bold text-xs text-slate-900">Credit / Debit Card</div>
                <div className="text-[10px] text-slate-500">Test Simulator</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-accent bg-cyan-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-extrabold text-sm mb-2 text-cyan-600">Razorpay</div>
                <div className="font-bold text-xs text-slate-900">Razorpay / UPI</div>
                <div className="text-[10px] text-slate-500">Test Mode</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Truck className={`w-5 h-5 mb-2 ${paymentMethod === 'cod' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div className="font-bold text-xs text-slate-900">Cash on Delivery</div>
                <div className="text-[10px] text-slate-500">Pay on Arrival</div>
              </button>
            </div>

            {/* Test Card Visual Mock */}
            {paymentMethod === 'card' && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Simulated Test Card (Sandbox)</span>
                  <span className="font-bold text-accent">VISA TEST</span>
                </div>
                <div className="font-mono text-base tracking-widest text-slate-100">
                  4242 •••• •••• 4242
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Cardholder</span>
                    <span>{cardDetails.cardHolder}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Expires</span>
                    <span>12 / 28</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Review Items ({cartItems.length})
          </h2>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-50 border" />
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                    <span className="text-slate-400 font-semibold">{item.vendor} × {item.quantity}</span>
                  </div>
                </div>
                <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (5%)</span>
              <span className="font-bold text-slate-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-slate-900">
                {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t text-sm font-bold text-slate-900">
              <span>Grand Total</span>
              <span className="text-2xl font-black text-primary">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-secondary to-accent hover:opacity-95 text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-60 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authorizing Payment & Splitting Orders...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ${grandTotal.toFixed(2)} Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
