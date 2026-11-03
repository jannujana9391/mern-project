import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  User, 
  Store, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({
      type: 'info',
      text: `Phase 1 Demo: Login UI ready. In Phase 4, your credentials will authenticate via JWT as a ${selectedRole.toUpperCase()}.`,
    });
  };

  const handleDemoFill = (role) => {
    setSelectedRole(role);
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-secondary to-accent shadow-md text-white mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500">
            Sign in to access your customized role dashboard
          </p>
        </div>

        {/* Role Selector Tabs */}
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

        {/* Info Notification */}
        {message && (
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
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
            className="w-full py-3 bg-gradient-to-r from-secondary to-purple-700 hover:from-purple-700 hover:to-secondary text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <span>Sign in as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
            <ArrowRight className="w-4 h-4" />
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

