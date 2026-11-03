import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Clock 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Platform Guarantees Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 bg-secondary/20 rounded-xl text-secondary-light">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Fast Global Delivery</h4>
              <p className="text-xs text-slate-400">Directly from independent vendors</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 bg-accent/20 rounded-xl text-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400">Encrypted payment & escrow</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Split Vendor Orders</h4>
              <p className="text-xs text-slate-400">One checkout, multiple vendors</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400">Customer & vendor assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-secondary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center text-2xl font-extrabold tracking-tight">
                <span className="text-white">Nex</span>
                <span className="text-secondary-light">Store</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              NexStore is a premier Multi-Vendor E-Commerce platform connecting shoppers with thousands of vetted local and global merchants. Built on the modern MERN Stack.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Global Marketplace Operations, Tech Hub</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-secondary-light" />
                <span>support@nexstore-marketplace.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+1 (800) 555-NEXSTORE</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-accent transition-colors">All Products</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Vendor Central */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Vendor Central</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/register" className="hover:text-secondary-light transition-colors">Become a Vendor</Link></li>
              <li><Link to="/login" className="hover:text-secondary-light transition-colors">Vendor Login</Link></li>
              <li><span className="text-slate-500">Commission Rates (Phase 10)</span></li>
              <li><span className="text-slate-500">Merchant Policy</span></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Stay Updated</h4>
            <p className="text-xs text-slate-400">
              Subscribe to get exclusive deals, new vendor alerts, and coupons.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-white font-semibold rounded-lg text-xs transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          &copy; {new Date().getFullYear()} NexStore Inc. Multi-Vendor E-Commerce Platform. All rights reserved.
        </div>
        <div className="flex items-center space-x-3 text-slate-400">
          <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-[10px]">VISA</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-[10px]">MASTERCARD</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-[10px]">PAYPAL</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-[10px]">RAZORPAY</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
