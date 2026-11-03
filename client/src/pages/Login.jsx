import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  User, 
  Store, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleDemoFill = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'customer') {
      setEmail('customer@demo.com');
      setPassword('Customer@123');
    } else if (role === 'vendor') {
      setEmail('vendor@demo.com');
      setPassword('Vendor@123');
    } else {
      setEmail('admin@demo.com');
      setPassword('Admin@123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await login(email, password);
      setSuccessMsg(`Welcome back, ${result.user.name}! Redirecting...`);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Login Error:', err);
      setErrorMsg(
        err.response?.data?.message || err.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // If already logged in
  if (isAuthenticated && user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">You Are Signed In!</h2>
            <p className="text-sm text-slate-500">
              Logged in as <span className="font-bold text-slate-800">{user.name}</span> ({user.email})
            </p>
            <div className="inline-block mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-secondary/10 text-secondary border border-secondary/20">
                Active Role: {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <Link
              to="/"
              className="w-full py-3 bg-primary hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all block shadow-sm"
            >
              Continue to Marketplace
            </Link>

            <button
              onClick={logout}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-secondary to-accent shadow-md text-white mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500">
            Sign in to access your role-specific marketplace dashboard
          </p>
        </div>

        {/* 1-Click Demo Credential Pre-fill */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            ⚡ 1-Click Demo Account Login
          </span>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                selectedRole === 'customer'
                  ? 'bg-white text-secondary shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('vendor')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                selectedRole === 'vendor'
                  ? 'bg-white text-secondary shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Vendor</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                selectedRole === 'admin'
                  ? 'bg-white text-secondary shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] font-semibold text-secondary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-secondary to-purple-700 hover:from-purple-700 hover:to-secondary text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with MongoDB...</span>
              </>
            ) : (
              <>
                <span>Sign in as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-secondary hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
