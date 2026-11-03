import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Store, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('customer'); // 'customer' or 'vendor'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    businessType: 'Electronics',
  });
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage({
      type: 'success',
      text: `Phase 1 Registration UI Verified! In Phase 4, your ${role.toUpperCase()} account will be registered into MongoDB with bcrypt-hashed passwords.`,
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-secondary to-accent shadow-md text-white mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create an Account</h2>
          <p className="text-xs text-slate-500">
            Join NexStore as a buyer or start selling as an independent vendor
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
              role === 'customer'
                ? 'bg-white text-secondary shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer Account</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('vendor')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
              role === 'vendor'
                ? 'bg-white text-secondary shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Merchant / Vendor</span>
          </button>
        </div>

        {statusMessage && (
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>
          </div>

          {/* Conditional Vendor Store Fields */}
          {role === 'vendor' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Store / Business Name</label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="e.g. Apex Tech Hub"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Primary Product Category</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  >
                    <option value="Electronics">Consumer Electronics</option>
                    <option value="Fashion">Fashion & Apparel</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Beauty">Beauty & Personal Care</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm mt-2"
          >
            <span>Create {role === 'vendor' ? 'Vendor Store' : 'Customer Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-secondary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

