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
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

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
            <Link to="/register" className="hover:text-accent flex items-center gap-1 transition-colors">
              <Store className="w-3.5 h-3.5 text-accent" /> Become a Vendor
            </Link>
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
              to="/products"
              title="Wishlist"
              className="relative p-2.5 text-slate-600 hover:text-secondary hover:bg-purple-50 rounded-xl transition-all"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Cart Link */}
            <Link
              to="/products"
              title="Shopping Cart"
              className="relative p-2.5 text-slate-600 hover:text-accent hover:bg-cyan-50 rounded-xl transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-slate-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Auth Buttons */}
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
            <span className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Platform Status: Ready (Phase 1)
            </span>
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
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
