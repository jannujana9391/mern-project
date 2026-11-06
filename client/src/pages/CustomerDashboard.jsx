import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  User, 
  CreditCard, 
  ShoppingBag, 
  Store, 
  ArrowRight,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data?.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setErrorMsg('Could not load order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalSpent = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
  const activeOrders = orders.filter(
    (o) => o.orderStatus === 'processing' || o.orderStatus === 'shipped'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-primary via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-secondary to-accent flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-secondary/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black">{user?.name || 'Customer Profile'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-accent/20 text-accent font-extrabold text-[10px] uppercase border border-accent/30">
                {user?.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <Link
          to="/products"
          className="px-6 py-3 bg-secondary hover:bg-secondary-light text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center space-x-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Marketplace</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-secondary rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Orders</span>
            <div className="text-xl font-black text-slate-900">{orders.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-cyan-50 text-accent rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Active Shipments</span>
            <div className="text-xl font-black text-slate-900">{activeOrders.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Spent</span>
            <div className="text-xl font-black text-slate-900">${totalSpent.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Shipping Status</span>
            <div className="text-xs font-bold text-slate-800">Verified Address</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-secondary text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Orders & Multi-Vendor Tracking ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('address')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'address'
              ? 'bg-secondary text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Default Shipping Address
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto" />
              <p className="text-xs text-slate-400 font-bold">Loading your orders from MongoDB...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once you place an order, your vendor-specific tracking records will appear here in real time.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-slate-800 transition-colors"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-secondary/40 transition-all space-y-4"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                    <div>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">
                        {ord.orderNumber}
                      </span>
                      <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ord.paymentStatus}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-secondary border border-purple-200">
                        {ord.orderStatus}
                      </span>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Total</span>
                        <span className="font-black text-slate-900 text-sm">
                          ${ord.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Attribution */}
                  <div className="flex items-center space-x-2 text-xs font-bold text-secondary bg-slate-50 p-2 rounded-xl">
                    <Store className="w-4 h-4" />
                    <span>Vendor Package: {ord.vendorName}</span>
                  </div>

                  {/* Ordered Items */}
                  <div className="space-y-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border"
                          />
                          <div>
                            <span className="font-bold text-slate-900 line-clamp-1">{item.name}</span>
                            <span className="text-slate-400">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-extrabold text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Destination Info & Track Button */}
                  <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="truncate">
                      Shipping to: {ord.shippingAddress?.fullName}, {ord.shippingAddress?.city},{' '}
                      {ord.shippingAddress?.state}
                    </span>
                    <Link
                      to={`/orders/${ord._id}`}
                      className="px-3.5 py-1.5 bg-primary hover:bg-secondary text-white text-xs font-bold rounded-xl transition-colors shadow-sm inline-flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Address */}
      {activeTab === 'address' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-xl space-y-4">
          <h2 className="text-base font-bold text-slate-900">Registered Delivery Location</h2>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <div className="font-bold text-slate-900">{user?.name}</div>
            <div>742 Evergreen Terrace</div>
            <div>Springfield, OR 97477</div>
            <div>United States</div>
            <div className="text-slate-400 pt-1">Phone: +1 (555) 019-2834</div>
          </div>
          <p className="text-[11px] text-slate-400">
            This address will be automatically selected during multi-vendor checkout.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;

