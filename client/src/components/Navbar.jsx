import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  Store,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, subtotal } = useCart();
  const { wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'vendor':
        return { label: 'Vendor', color: 'bg-purple-50 text-secondary border-purple-200' };
      default:
        return { label: 'Customer', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' };
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Notification Bar */}
      <div className="bg-primary text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-secondary/40 text-purple-200 px-2 py-0.5 rounded font-semibold text-[10px] uppercase tracking-wider">
              Launch Event
            </span>
            <span>Discover thousands of verified products from independent vendors worldwide!</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-300 text-xs">
            {!isAuthenticated && (
              <Link to="/register" className="hover:text-accent flex items-center gap-1 transition-colors">
                <Store className="w-3.5 h-3.5 text-accent" /> Become a Vendor
              </Link>
            )}
            {isAuthenticated && (
              <Link to={user?.role === 'vendor' ? '/vendor-dashboard' : user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} className="text-accent flex items-center gap-1 hover:underline">
                <Sparkles className="w-3.5 h-3.5" /> Authenticated as {user?.name}
              </Link>
            )}
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">24/7 Support: support@nexstore.com</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-md shadow-secondary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-extrabold tracking-tight text-primary">Nex</span>
                <span className="text-2xl font-extrabold tracking-tight text-secondary">Store</span>
              </div>
              <span className="block text-[10px] font-bold text-accent tracking-widest uppercase -mt-1">
                Multi-Vendor Market
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full flex items-center">
              <div className="absolute left-3 text-slate-400 pointer-events-none">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search over 10,000+ products across all vendors..."
                className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
              />
              <button
                type="button"
                className="absolute right-1.5 px-4 py-1.5 bg-primary hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Search
              </button>
            </div>
          </div>

          {/* Actions & Role Indicator */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              title="My Wishlist"
              className="relative p-2.5 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className={`absolute top-1 right-1 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center transition-transform ${
                wishlistCount > 0 ? 'bg-rose-500 scale-110' : 'bg-slate-400'
              }`}>
                {wishlistCount}
              </span>
            </Link>

            {/* Shopping Cart Link */}
            <Link
              to="/cart"
              title="Shopping Cart"
              className="relative p-2.5 text-slate-600 hover:text-accent hover:bg-cyan-50 rounded-xl transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className={`absolute top-1 right-1 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm transition-transform ${
                totalItems > 0 ? 'bg-secondary scale-110' : 'bg-slate-400'
              }`}>
                {totalItems}
              </span>
            </Link>

            {/* User Profile / Auth Action */}
            {isAuthenticated && user ? (
              <div className="relative pl-2 border-l border-slate-200">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-secondary to-accent flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="block text-xs font-bold text-slate-900 truncate max-w-[100px]">
                      {user.name}
                    </span>
                    <span
                      className={`inline-block px-1.5 py-0.2 text-[10px] font-extrabold uppercase rounded border ${
                        getRoleBadge(user.role).color
                      }`}
                    >
                      {getRoleBadge(user.role).label}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      {user.role !== 'vendor' && (
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-secondary flex items-center space-x-2"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Customer Dashboard</span>
                        </Link>
                      )}

                      {user.role === 'vendor' && (
                        <Link
                          to="/vendor-dashboard"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-secondary flex items-center space-x-2"
                        >
                          <Store className="w-4 h-4" />
                          <span>Vendor Dashboard</span>
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin-dashboard"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center space-x-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/cart"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-secondary flex items-center space-x-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>My Cart ({totalItems})</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 flex items-center space-x-2"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>My Wishlist ({wishlistCount})</span>
                      </Link>

                      {user.role === 'vendor' && (
                        <div className="px-4 py-1.5 text-[11px] font-bold text-secondary bg-purple-50/60 mx-2 rounded-lg flex items-center gap-1.5 my-1">
                          <Store className="w-3.5 h-3.5" />
                          <span>Store: {user.vendor?.storeName || 'My Vendor Shop'}</span>
                        </div>
                      )}

                      {user.role === 'admin' && (
                        <div className="px-4 py-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 mx-2 rounded-lg flex items-center gap-1.5 my-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Admin Control Center</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-secondary to-purple-700 hover:from-purple-700 hover:to-secondary rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-primary rounded-lg"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Row (Links) */}
        <nav className="hidden md:flex items-center justify-between border-t border-slate-100 py-3 text-sm font-medium">
          <div className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-1 ${
                  isActive(link.path)
                    ? 'text-secondary font-bold border-b-2 border-secondary'
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-secondary" />
              <span>Cart: <strong>{totalItems} items</strong> (${subtotal.toFixed(2)})</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-fadeIn">
          {/* Search Bar in Mobile */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-purple-50 text-secondary font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Saved Wishlist</span>
              <span className={`px-2 py-0.5 rounded-full text-white text-xs font-bold ${
                wishlistCount > 0 ? 'bg-rose-500' : 'bg-slate-400'
              }`}>
                {wishlistCount}
              </span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-white text-xs font-bold">
                {totalItems}
              </span>
            </Link>
            {isAuthenticated && (
              <Link
                to={user?.role === 'vendor' ? '/vendor-dashboard' : user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4 text-secondary" />
                <span>{user?.role === 'vendor' ? 'Vendor Dashboard' : user?.role === 'admin' ? 'Admin Dashboard' : 'Customer Dashboard'}</span>
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-sm font-bold text-rose-600 bg-rose-50 rounded-xl flex items-center justify-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user?.name})</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-secondary hover:bg-secondary-dark rounded-xl"
                >
                  Create Account / Vendor Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
