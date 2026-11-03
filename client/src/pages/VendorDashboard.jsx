import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  BarChart2,
  Settings,
  Star,
  LogIn,
  ArrowUpRight,
  Layers,
  BadgePercent,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// ────────────────────────────────────────────────────────────────────────────────
// Helper: Status badge colour mapping
// ────────────────────────────────────────────────────────────────────────────────
const statusConfig = {
  pending:    { label: 'Pending',    color: 'bg-amber-100 text-amber-800',   icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800',     icon: RefreshCw },
  shipped:    { label: 'Shipped',    color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  delivered:  { label: 'Delivered',  color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: 'bg-rose-100 text-rose-800',    icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

const initialCategories = ['Electronics', 'Fashion', 'Home & Office', 'Beauty', 'Sports & Outdoors', 'Books & Stationery'];

// ────────────────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────────────────
const VendorDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [vendorProfile, setVendorProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalEarnings: 0,
    totalCommission: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [updateMsg, setUpdateMsg] = useState('');

  // ── Product Modal State ────────────────────────────────────────────────────
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: 10,
    image: '',
    description: '',
    isFeatured: false,
  });
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // ── Fetch vendor profile, orders, and products ─────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, ordersRes, productsRes] = await Promise.all([
        api.get('/vendor/profile'),
        api.get('/orders/vendor-orders'),
        api.get('/products/vendor/my-products'),
      ]);
      setVendorProfile(profileRes.data.vendor);
      setOrders(ordersRes.data.orders || []);
      setStats(ordersRes.data.stats || {});
      setProducts(productsRes.data.products || []);

      // Also try fetching category list
      try {
        const catRes = await api.get('/categories');
        if (catRes.data?.categories?.length > 0) {
          setCategories(catRes.data.categories.map((c) => c.name));
        }
      } catch (e) {
        // use initialCategories
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load vendor dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'vendor') {
      fetchData();
    }
  }, [isAuthenticated, user, fetchData]);

  // ── Update order status ────────────────────────────────────────────────────
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setUpdateMsg('');
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setUpdateMsg(`Order status updated to "${newStatus}" ✓`);
      const ordersRes = await api.get('/orders/vendor-orders');
      setOrders(ordersRes.data.orders || []);
      setStats(ordersRes.data.stats || {});
    } catch (err) {
      setUpdateMsg(err.message || 'Failed to update status.');
    } finally {
      setUpdatingOrderId(null);
      setTimeout(() => setUpdateMsg(''), 4000);
    }
  };

  // ── Open Add Product Modal ────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    setModalMode('create');
    setCurrentProductId(null);
    setProductForm({
      name: '',
      category: categories[0] || 'Electronics',
      price: '',
      originalPrice: '',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      description: '',
      isFeatured: false,
    });
    setIsProductModalOpen(true);
  };

  // ── Open Edit Product Modal ───────────────────────────────────────────────
  const handleOpenEditModal = (prod) => {
    setModalMode('edit');
    setCurrentProductId(prod._id);
    setProductForm({
      name: prod.name || '',
      category: prod.category || categories[0] || 'Electronics',
      price: prod.price !== undefined ? String(prod.price) : '',
      originalPrice: prod.originalPrice !== undefined ? String(prod.originalPrice) : '',
      stock: prod.stock !== undefined ? prod.stock : 10,
      image: prod.image || '',
      description: prod.description || '',
      isFeatured: Boolean(prod.isFeatured),
    });
    setIsProductModalOpen(true);
  };

  // ── Submit Add/Edit Product ───────────────────────────────────────────────
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category) {
      setUpdateMsg('Please fill in product name, price, and category.');
      return;
    }

    setSubmittingProduct(true);
    setUpdateMsg('');
    try {
      if (modalMode === 'create') {
        const res = await api.post('/products', productForm);
        setUpdateMsg(`Product "${res.data.product?.name}" created successfully! ✓`);
      } else {
        const res = await api.put(`/products/${currentProductId}`, productForm);
        setUpdateMsg(`Product "${res.data.product?.name}" updated successfully! ✓`);
      }
      setIsProductModalOpen(false);

      // Refresh product list
      const productsRes = await api.get('/products/vendor/my-products');
      setProducts(productsRes.data.products || []);
    } catch (err) {
      setUpdateMsg(err.message || 'Failed to save product.');
    } finally {
      setSubmittingProduct(false);
      setTimeout(() => setUpdateMsg(''), 4000);
    }
  };

  // ── Delete Product ────────────────────────────────────────────────────────
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingProductId(productId);
    try {
      await api.delete(`/products/${productId}`);
      setUpdateMsg(`Product "${productName}" removed from store. ✓`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      setUpdateMsg(err.message || 'Failed to delete product.');
    } finally {
      setDeletingProductId(null);
      setTimeout(() => setUpdateMsg(''), 4000);
    }
  };

  // ── Guard: must be logged in as vendor ────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="p-4 bg-purple-50 rounded-full">
          <LogIn className="w-10 h-10 text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Vendor Login Required</h2>
        <p className="text-sm text-slate-500 text-center max-w-sm">
          You must be signed in with a vendor account to access this dashboard.
        </p>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-secondary text-white text-sm font-semibold rounded-xl shadow hover:bg-purple-700 transition-colors"
        >
          Sign In as Vendor
        </Link>
      </div>
    );
  }

  if (user?.role !== 'vendor') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="p-4 bg-rose-50 rounded-full">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-sm text-slate-500 text-center">
          Only vendors can access this dashboard. Your role is: <strong>{user?.role}</strong>.
        </p>
        <Link to="/" className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors">
          Go to Homepage
        </Link>
      </div>
    );
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading Vendor Dashboard…</p>
      </div>
    );
  }

  const storeName = vendorProfile?.storeName || user.name + "'s Store";

  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: BarChart2 },
    { id: 'products',  label: 'Products',  icon: Package, count: products.length },
    { id: 'orders',    label: 'Orders',    icon: ShoppingBag, count: stats.pendingOrders },
    { id: 'store',     label: 'Store Info', icon: Store },
  ];

  // ── Overview statistics cards data ────────────────────────────────────────
  const statCards = [
    {
      label: 'Store Products',
      value: products.length,
      icon: Package,
      color: 'from-purple-500 to-indigo-600',
      bg: 'bg-purple-50',
      textColor: 'text-secondary',
      sub: 'Active catalog listings',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      textColor: 'text-blue-700',
      sub: 'All incoming customer orders',
    },
    {
      label: 'Pending / Processing',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
      textColor: 'text-amber-700',
      sub: 'Awaiting fulfillment',
    },
    {
      label: 'Net Earnings',
      value: `$${(stats.totalEarnings || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'from-emerald-400 to-green-600',
      bg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      sub: 'After 10% platform fee',
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header Banner ───────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-primary via-slate-800 to-secondary text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Store Logo */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl shrink-0">
            {vendorProfile?.logo ? (
              <img
                src={vendorProfile.logo}
                alt={storeName}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                <Store className="w-10 h-10 text-white/80" />
              </div>
            )}
          </div>

          {/* Store Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-3xl font-extrabold tracking-tight">{storeName}</h1>
              {/* Approval status badge */}
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                  vendorProfile?.status === 'approved'
                    ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
                    : vendorProfile?.status === 'rejected'
                    ? 'bg-rose-400/20 text-rose-300 border-rose-400/30'
                    : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                }`}
              >
                {vendorProfile?.status === 'approved' ? (
                  <><CheckCircle className="w-3 h-3" /> Approved</>
                ) : vendorProfile?.status === 'rejected' ? (
                  <><XCircle className="w-3 h-3" /> Rejected</>
                ) : (
                  <><Clock className="w-3 h-3" /> Pending Approval</>
                )}
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              {vendorProfile?.businessCategory || 'General Merchandise'} &nbsp;·&nbsp;
              {vendorProfile?.user?.email || user.email}
            </p>
            <div className="flex items-center gap-3 mt-2 justify-center sm:justify-start">
              <span className="flex items-center gap-1 text-amber-300 text-sm font-semibold">
                <Star className="w-4 h-4 fill-amber-300 stroke-amber-300" />
                {vendorProfile?.rating?.toFixed(1) || '5.0'}
                <span className="text-slate-400 font-normal">
                  ({vendorProfile?.reviewCount || 0} reviews)
                </span>
              </span>
              <span className="text-slate-500">·</span>
              <span className="flex items-center gap-1 text-slate-300 text-sm">
                <BadgePercent className="w-4 h-4 text-cyan-400" />
                {vendorProfile?.commissionRate || 10}% Platform Commission
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold rounded-xl transition-colors"
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    tab.id === 'orders' ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Update message toast */}
        {updateMsg && (
          <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl text-sm font-semibold ${
            updateMsg.includes('✓')
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}>
            {updateMsg.includes('✓') ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {updateMsg}
          </div>
        )}

        {/* ───── TAB: OVERVIEW ─────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {card.label}
                        </p>
                        <p className={`text-3xl font-extrabold mt-1 ${card.textColor}`}>
                          {card.value}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${card.bg}`}>
                        <Icon className={`w-5 h-5 ${card.textColor}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Catalog Banner */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-2xl text-secondary">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Product Catalog Management</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    You currently have <strong>{products.length} products</strong> listed in the marketplace.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2 border border-slate-200 hover:border-secondary text-slate-700 hover:text-secondary text-xs font-bold rounded-xl transition-colors"
                >
                  Manage Products
                </button>
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-secondary hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Product
                </button>
              </div>
            </div>

            {/* Commission Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-5">
                <BadgePercent className="w-5 h-5 text-secondary" />
                Revenue Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Gross Revenue</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    ${(stats.totalRevenue || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-400">Total customer payments</p>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl text-center">
                  <p className="text-xs text-rose-600 font-semibold uppercase tracking-wider">Platform Commission</p>
                  <p className="text-2xl font-extrabold text-rose-700 mt-1">
                    −${(stats.totalCommission || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-rose-400">{vendorProfile?.commissionRate || 10}% fee deducted</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl text-center">
                  <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Your Net Earnings</p>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                    ${(stats.totalEarnings || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-emerald-400">After platform fee</p>
                </div>
              </div>
            </div>

            {/* Recent Orders preview (last 5) */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-secondary" />
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-secondary font-semibold flex items-center gap-1 hover:underline"
                >
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">No orders yet</p>
                  <p className="text-xs mt-1">When customers buy your products, orders appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order #</th>
                        <th className="pb-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                        <th className="pb-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                        <th className="pb-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                        <th className="pb-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Earnings</th>
                        <th className="pb-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-mono text-xs font-bold text-slate-700">{order.orderNumber}</td>
                          <td className="py-3 text-slate-600">
                            {order.customer?.name || 'Guest'}
                            <span className="block text-[11px] text-slate-400">{order.customer?.email}</span>
                          </td>
                          <td className="py-3 text-slate-500">
                            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                          </td>
                          <td className="py-3 text-right font-bold text-slate-900">${order.totalAmount?.toFixed(2)}</td>
                          <td className="py-3 text-right font-bold text-emerald-700">${order.vendorEarnings?.toFixed(2)}</td>
                          <td className="py-3 text-center"><StatusBadge status={order.orderStatus} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ───── TAB: PRODUCTS (PHASE 7 CORE) ─────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Product Inventory</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {products.length} Items
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage your store catalog, pricing, inventory levels, and product visibility
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2.5 bg-secondary hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Product
                </button>
              </div>
            </div>

            {/* Products Table */}
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <Package className="w-16 h-16 text-slate-300 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-slate-800">No Products Listed Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Start selling to thousands of customers by adding your first product listing today!
                  </p>
                </div>
                <button
                  onClick={handleOpenAddModal}
                  className="px-5 py-2.5 bg-secondary hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Product</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4 text-right">Price</th>
                        <th className="py-3.5 px-4 text-center">Stock</th>
                        <th className="py-3.5 px-4 text-center">Rating</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => {
                        const price = typeof p.price === 'number' ? p.price : Number(p.price || 0);
                        const originalPrice = p.originalPrice ? Number(p.originalPrice) : null;
                        return (
                          <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Product Info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                                  }}
                                />
                                <div className="min-w-0 max-w-xs">
                                  <Link
                                    to={`/products/${p._id}`}
                                    className="font-bold text-slate-900 text-sm hover:text-secondary truncate block"
                                    title={p.name}
                                  >
                                    {p.name}
                                  </Link>
                                  <span className="text-[11px] text-slate-400 line-clamp-1">
                                    {p.description}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                                {p.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                              <div>${price.toFixed(2)}</div>
                              {originalPrice && originalPrice > price && (
                                <div className="text-[10px] text-slate-400 line-through">
                                  ${originalPrice.toFixed(2)}
                                </div>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="py-3.5 px-4 text-center">
                              {p.stock > 5 ? (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                  {p.stock} In Stock
                                </span>
                              ) : p.stock > 0 ? (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                  {p.stock} Low
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                                  Out of Stock
                                </span>
                              )}
                            </td>

                            {/* Rating */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1 text-xs">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="font-bold text-slate-800">{p.rating ? Number(p.rating).toFixed(1) : '5.0'}</span>
                                <span className="text-slate-400">({p.reviews || 0})</span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                <CheckCircle className="w-3.5 h-3.5" /> Active
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  to={`/products/${p._id}`}
                                  className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                                  title="View on Storefront"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="p-1.5 text-secondary hover:bg-purple-50 rounded-lg transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p._id, p.name)}
                                  disabled={deletingProductId === p._id}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ───── TAB: ORDERS ───────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Incoming Orders
                <span className="ml-2 text-sm font-normal text-slate-400">({orders.length} total)</span>
              </h2>
              <button
                onClick={fetchData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center text-slate-400">
                <Package className="w-14 h-14 mx-auto mb-4 opacity-30" />
                <p className="font-semibold">No orders received yet</p>
                <p className="text-sm mt-1">Orders will appear here once customers purchase your products.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-slate-50 border-b border-slate-100">
                      <div>
                        <span className="font-mono font-bold text-slate-800 text-sm">
                          {order.orderNumber}
                        </span>
                        <span className="mx-2 text-slate-300">·</span>
                        <span className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={order.orderStatus} />
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Payment Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="px-5 py-4">
                      {/* Customer Info */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Customer</p>
                          <p className="font-semibold text-slate-800 text-sm">{order.customer?.name || 'Guest'}</p>
                          <p className="text-xs text-slate-400">{order.customer?.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Shipping To</p>
                          <p className="text-sm text-slate-600">
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}
                          </p>
                          <p className="text-xs text-slate-400">{order.shippingAddress?.country}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 mb-4">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Order Items</p>
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg"
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                              <p className="text-xs text-slate-400">
                                ${item.price?.toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                            <p className="font-bold text-slate-700 text-sm">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Financial Summary */}
                      <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl mb-4">
                        <div className="text-center">
                          <p className="text-xs text-slate-400">Order Total</p>
                          <p className="font-extrabold text-slate-900">${order.totalAmount?.toFixed(2)}</p>
                        </div>
                        <div className="text-center border-x border-slate-200">
                          <p className="text-xs text-rose-400">Commission (10%)</p>
                          <p className="font-extrabold text-rose-600">−${order.platformCommission?.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-emerald-500">Your Earnings</p>
                          <p className="font-extrabold text-emerald-700">${order.vendorEarnings?.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Status Update Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <p className="text-xs text-slate-500 font-semibold">Update Status:</p>
                        <div className="flex flex-wrap gap-2">
                          {['processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                            <button
                              key={s}
                              disabled={order.orderStatus === s || updatingOrderId === order._id}
                              onClick={() => handleStatusUpdate(order._id, s)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                order.orderStatus === s
                                  ? 'bg-secondary text-white border-secondary cursor-default'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-secondary hover:text-secondary'
                              }`}
                            >
                              {updatingOrderId === order._id ? '…' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ───── TAB: STORE INFO ───────────────────────────────────────────── */}
        {activeTab === 'store' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900">Store Settings</h2>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
              {[
                { label: 'Store Name',          value: vendorProfile?.storeName,          icon: Store },
                { label: 'Business Category',   value: vendorProfile?.businessCategory,   icon: Layers },
                { label: 'Approval Status',     value: vendorProfile?.status?.toUpperCase(),   icon: CheckCircle },
                { label: 'Commission Rate',     value: `${vendorProfile?.commissionRate || 10}% Platform Fee`, icon: BadgePercent },
                { label: 'Store Rating',        value: `${vendorProfile?.rating?.toFixed(1) || '5.0'} / 5.0 (${vendorProfile?.reviewCount || 0} reviews)`, icon: Star },
                { label: 'Account Email',       value: vendorProfile?.user?.email || user.email, icon: Settings },
                { label: 'Member Since',        value: vendorProfile?.createdAt ? new Date(vendorProfile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—', icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-4">
                  <div className="p-2 bg-purple-50 rounded-lg shrink-0">
                    <Icon className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
                    <p className="font-semibold text-slate-800 text-sm">{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Store Description */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Store Description</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {vendorProfile?.description || 'No description added yet.'}
              </p>
            </div>

            {/* Banner Preview */}
            {vendorProfile?.banner && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Store Banner</p>
                <img
                  src={vendorProfile.banner}
                  alt="Store Banner"
                  className="w-full h-32 object-cover rounded-xl border border-slate-200"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Add / Edit Product Modal ────────────────────────────────────────── */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {modalMode === 'create' ? 'Add New Product' : 'Edit Product'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Listing will be visible to all customers immediately upon saving.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. AeroPro Wireless Noise-Cancelling Headphones"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
                />
              </div>

              {/* Category & Stock Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
                  />
                </div>
              </div>

              {/* Price and Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="189.99"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Original Price / MSRP ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="249.99"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
                  />
                </div>
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
                  />
                </div>
                {productForm.image && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="text-xs text-slate-500 font-medium truncate">Image Preview Loaded</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Highlight key product features, specifications, and materials..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
                ></textarea>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={productForm.isFeatured}
                  onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-secondary focus:ring-secondary/40"
                />
                <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700">
                  Feature this product on homepage promotional highlights
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="px-6 py-2.5 bg-secondary hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {submittingProduct && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === 'create' ? 'Create Product Listing' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VendorDashboard;
