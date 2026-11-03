import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  Trash2,
  Lock,
  Unlock,
  BadgePercent,
  Sliders,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Admin Data States
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Filters & Actions
  const [vendorFilter, setVendorFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [orderFilter, setOrderFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, vendorsRes, ordersRes, usersRes, productsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/vendor/all'),
        api.get('/admin/orders'),
        api.get('/admin/users'),
        api.get('/products?limit=100'),
      ]);

      setStats(statsRes.data.stats || {});
      setRecentOrders(statsRes.data.recentOrders || []);
      setVendors(vendorsRes.data.vendors || []);
      setOrders(ordersRes.data.orders || []);
      setUsers(usersRes.data.users || []);
      setProducts(productsRes.data.products || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load administrative control center.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchAdminData();
    }
  }, [isAuthenticated, user, fetchAdminData]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleVendorStatus = async (vendorId, status) => {
    setUpdatingId(vendorId);
    try {
      await api.put(`/vendor/${vendorId}/status`, { status });
      showToast(`Vendor status updated to "${status}" ✓`);
      const res = await api.get('/vendor/all');
      setVendors(res.data.vendors || []);
    } catch (err) {
      showToast(err.message || 'Failed to update vendor status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateCommission = async (vendorId, currentRate) => {
    const input = window.prompt(`Enter new commission rate (%) for this merchant:`, String(currentRate));
    if (input === null) return;
    const rate = Number(input);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      alert('Please enter a valid percentage between 0 and 100.');
      return;
    }

    try {
      await api.put(`/admin/vendors/${vendorId}/commission`, { commissionRate: rate });
      showToast(`Commission rate updated to ${rate}% ✓`);
      const res = await api.get('/vendor/all');
      setVendors(res.data.vendors || []);
    } catch (err) {
      showToast(err.message || 'Failed to update commission.');
    }
  };

  const handleToggleBlockUser = async (userId, currentName) => {
    try {
      const res = await api.put(`/admin/users/${userId}/block`);
      showToast(res.data.message || 'User status updated. ✓');
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data.users || []);
    } catch (err) {
      showToast(err.message || 'Failed to toggle block status.');
    }
  };

  const handleDeleteProductAdmin = async (productId, productName) => {
    if (!window.confirm(`Admin Action: Permanently remove "${productName}" from the marketplace?`)) {
      return;
    }
    try {
      await api.delete(`/products/${productId}`);
      showToast(`Product "${productName}" deleted from marketplace. ✓`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      showToast(err.message || 'Failed to delete product.');
    }
  };

  // ── Guard: Admin Only ──────────────────────────────────────────────────────
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="p-4 bg-rose-50 text-rose-600 rounded-full">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Authorization Required</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          This portal is restricted to platform administrators. Please sign in with an admin account (`admin@demo.com`).
        </p>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition-colors shadow-sm"
        >
          Sign In as Administrator
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading Administrative Control Center...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview',  label: 'Overview & Metrics', icon: TrendingUp },
    { id: 'vendors',   label: 'Vendors',            icon: Store,      count: vendors.length },
    { id: 'products',  label: 'Products Catalog',   icon: Package,    count: products.length },
    { id: 'orders',    label: 'Marketplace Orders', icon: ShoppingBag, count: orders.length },
    { id: 'users',     label: 'Users & Customers',  icon: Users,      count: users.length },
  ];

  // Filtered lists
  const filteredVendors = vendors.filter((v) => vendorFilter === 'all' || v.status === vendorFilter);
  const filteredOrders = orders.filter((o) => orderFilter === 'all' || o.orderStatus === orderFilter);
  const filteredUsers = users.filter((u) => {
    const term = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.role.toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top Header Bar ──────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Marketplace Administration</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                  Super Admin
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Signed in as <strong className="text-slate-200">{user.name}</strong> ({user.email}) • Global Operations Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Content Container ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-4 bg-slate-900 text-white text-xs font-bold rounded-xl animate-fadeIn flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ───── TAB 1: OVERVIEW & METRICS ──────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 6 Primary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Platform GMV</span>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  ${(stats.grossMarketplaceVolume || 0).toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 mt-1">Total customer checkout value</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Revenue (Commissions)</span>
                  <div className="p-3 bg-purple-50 text-secondary rounded-2xl">
                    <BadgePercent className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-secondary mt-2">
                  ${(stats.platformRevenue || 0).toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 mt-1">Net 10% platform marketplace fees retained</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor Payouts</span>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-blue-700 mt-2">
                  ${(stats.totalVendorEarnings || 0).toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 mt-1">Disbursable merchant earnings</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                  <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {stats.totalOrdersCount || 0}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {stats.pendingOrdersCount || 0} active / {stats.deliveredOrdersCount || 0} delivered
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Vendors</span>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <Store className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {vendors.length}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {stats.approvedVendorsCount || 0} approved • {stats.pendingVendorsCount || 0} pending
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog Products</span>
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">
                  {products.length}
                </div>
                <p className="text-xs text-slate-400 mt-1">Across all verified merchants</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Platform Transactions</h3>
                  <p className="text-xs text-slate-500">Live order activity across independent merchants</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No orders recorded in the platform yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase border-b border-slate-100">
                      <tr>
                        <th className="pb-3">Order Number</th>
                        <th className="pb-3">Vendor</th>
                        <th className="pb-3 text-right">Order Total</th>
                        <th className="pb-3 text-right">Platform Fee</th>
                        <th className="pb-3 text-center">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentOrders.map((ord) => (
                        <tr key={ord._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-mono font-bold text-slate-800 text-xs">{ord.orderNumber}</td>
                          <td className="py-3 text-slate-600 text-xs font-semibold">{ord.vendorName}</td>
                          <td className="py-3 text-right font-extrabold text-slate-900">${ord.totalAmount?.toFixed(2)}</td>
                          <td className="py-3 text-right font-bold text-rose-600">+${ord.platformCommission?.toFixed(2)}</td>
                          <td className="py-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <Link
                              to={`/orders/${ord._id}`}
                              className="text-xs text-secondary hover:underline font-bold"
                            >
                              Details →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───── TAB 2: VENDORS MANAGEMENT ─────────────────────────────────── */}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Vendors & Merchants</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Approve new vendor applications, monitor ratings, and configure commission rates
                </p>
              </div>

              <div className="flex items-center gap-2">
                {['all', 'approved', 'pending', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setVendorFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                      vendorFilter === st
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Store Name</th>
                      <th className="py-3.5 px-4">Owner Email</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4 text-center">Commission</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVendors.map((v) => (
                      <tr key={v._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={v.logo}
                              alt={v.storeName}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{v.storeName}</div>
                              <span className="text-[11px] text-slate-400">Rating: {v.rating?.toFixed(1) || '5.0'} ★</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-xs text-slate-600">
                          {v.user?.email || 'Registered User'}
                        </td>

                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                          {v.businessCategory}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleUpdateCommission(v._id, v.commissionRate || 10)}
                            className="px-2.5 py-1 bg-purple-50 text-secondary border border-purple-200 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                            title="Click to edit commission percentage"
                          >
                            {v.commissionRate || 10}%
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              v.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : v.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {v.status?.toUpperCase()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {v.status !== 'approved' && (
                              <button
                                onClick={() => handleVendorStatus(v._id, 'approved')}
                                disabled={updatingId === v._id}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            {v.status !== 'rejected' && (
                              <button
                                onClick={() => handleVendorStatus(v._id, 'rejected')}
                                disabled={updatingId === v._id}
                                className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ───── TAB 3: PRODUCTS CATALOG ───────────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Marketplace Products Catalog</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Overview of all {products.length} live product listings across all vendor stores
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Merchant</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4 text-right">Price</th>
                      <th className="py-3.5 px-4 text-center">Stock</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div className="max-w-xs truncate font-bold text-slate-900 text-sm">
                              {p.name}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-xs font-semibold text-secondary">
                          {p.vendorName}
                        </td>

                        <td className="py-3.5 px-4 text-xs text-slate-600">
                          {p.category}
                        </td>

                        <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                          ${p.price?.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4 text-center text-xs font-bold">
                          {p.stock}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/products/${p._id}`}
                              className="p-1.5 text-slate-500 hover:text-primary rounded-lg transition-colors"
                              title="View Product Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProductAdmin(p._id, p.name)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Remove Product (Admin Moderation)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ───── TAB 4: ORDERS ─────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">All Marketplace Orders</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete ledger of {orders.length} orders across all merchants
                </p>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                      orderFilter === st
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Order #</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Merchant</th>
                      <th className="py-3.5 px-4 text-right">Total</th>
                      <th className="py-3.5 px-4 text-right">Fee (10%)</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-xs text-slate-900">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-700">
                          {ord.customer?.name || 'Customer'}
                          <span className="block text-[11px] text-slate-400">{ord.customer?.email}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-secondary">
                          {ord.vendorName}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-900">
                          ${ord.totalAmount?.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-rose-600">
                          +${ord.platformCommission?.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/orders/${ord._id}`}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ───── TAB 5: USERS & CUSTOMERS ──────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Registered Marketplace Accounts</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage permissions, customer profiles, and block malicious accounts
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user by name or email..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">User</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Registered Date</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              u.role === 'admin'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : u.role === 'vendor'
                                ? 'bg-purple-50 text-secondary border-purple-200'
                                : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-xs text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {u.isBlocked ? (
                            <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-[10px] font-bold">
                              Blocked
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                              Active
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleBlockUser(u._id, u.name)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                                u.isBlocked
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              {u.isBlocked ? (
                                <>
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>Unblock</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Block User</span>
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
