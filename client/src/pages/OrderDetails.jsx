import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Store,
  MapPin,
  CreditCard,
  Printer,
  ArrowLeft,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const steps = [
  { key: 'placed', label: 'Order Placed', desc: 'Payment confirmed & logged', icon: Clock },
  { key: 'processing', label: 'Processing', desc: 'Vendor is preparing items', icon: Package },
  { key: 'shipped', label: 'Shipped', desc: 'In transit with courier', icon: Truck },
  { key: 'delivered', label: 'Delivered', desc: 'Package delivered safely', icon: CheckCircle },
];

const getStepIndex = (status) => {
  switch (status) {
    case 'pending':
      return 0;
    case 'processing':
      return 1;
    case 'shipped':
      return 2;
    case 'delivered':
      return 3;
    default:
      return 0;
  }
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelMsg, setCancelMsg] = useState('');

  const fetchOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      const res = await api.put(`/orders/${id}/cancel`);
      setCancelMsg('Order cancelled successfully.');
      setOrder(res.data.order);
    } catch (err) {
      setCancelMsg(err.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
      setTimeout(() => setCancelMsg(''), 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] max-w-md mx-auto px-4 flex flex-col items-center justify-center text-center gap-4">
        <div className="p-4 bg-rose-50 text-rose-600 rounded-full">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'This order does not exist or you lack permission to view it.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'cancelled';
  const currentStep = getStepIndex(order.orderStatus);
  const canCancel = (order.orderStatus === 'pending' || order.orderStatus === 'processing') && user?.role !== 'vendor';

  return (
    <div className="min-h-screen bg-slate-50 py-10 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 print:border-none">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider">
              <Link to="/dashboard" className="hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
              </Link>
              <span>•</span>
              <span>Multi-Vendor Order Receipt</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {order.orderNumber}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isCancelled
                    ? 'bg-rose-100 text-rose-800'
                    : order.orderStatus === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {order.orderStatus.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {cancelling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>Cancel Order</span>
              </button>
            )}
          </div>
        </div>

        {/* Cancelled Notice */}
        {isCancelled && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800">
            <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">This shipment has been cancelled.</p>
              <p className="text-xs text-rose-600">
                Any associated payments will be refunded to your original payment method within 3–5 business days.
              </p>
            </div>
          </div>
        )}

        {/* Cancel Message Toast */}
        {cancelMsg && (
          <div className="p-4 bg-slate-900 text-white text-xs font-bold rounded-xl animate-fadeIn">
            {cancelMsg}
          </div>
        )}

        {/* ── Order Progress Stepper ────────────────────────────────────────── */}
        {!isCancelled && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-6">Delivery Progress</h2>
            
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep >= idx;
                  const isCurrent = currentStep === idx;

                  return (
                    <div key={step.key} className="flex flex-col items-start md:items-center text-left md:text-center space-y-2 relative">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-secondary text-white shadow-md shadow-secondary/30 ring-4 ring-purple-50'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-slate-400 max-w-xs">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Order Items & Vendor Attribution ──────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-secondary font-bold text-sm">
              <Store className="w-4 h-4" />
              <span>Fulfilled by Merchant: {order.vendorName}</span>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Merchant: <strong className="text-slate-600">{order.vendorName}</strong>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      ${item.price?.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-extrabold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown Table */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-semibold">${order.totalAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Standard Shipping</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Estimated Sales Tax</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Order Amount</span>
              <span className="text-2xl font-extrabold text-primary">
                ${order.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Shipping & Payment Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>Shipping Address</span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900 text-sm">
                {order.shippingAddress?.fullName || order.customer?.name}
              </p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && (
                <p className="text-slate-400 mt-2">Contact: {order.shippingAddress.phone}</p>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CreditCard className="w-4 h-4 text-secondary" />
              <span>Payment Details</span>
            </div>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex items-center justify-between">
                <span>Method</span>
                <span className="font-bold text-slate-900 uppercase">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Status</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  order.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.paymentStatus === 'paid' ? '✓ PAID' : '⏳ PENDING'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Transaction ID</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {order.paymentDetails?.transactionId || 'TXN-DIRECT'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SSL Encrypted & Certified Multi-Vendor Checkout</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
