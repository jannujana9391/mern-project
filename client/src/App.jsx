import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  Server, 
  Laptop, 
  Layers, 
  ShieldCheck, 
  Store, 
  User, 
  Database, 
  ArrowRight,
  ExternalLink,
  Activity,
  AlertCircle
} from 'lucide-react';

function App() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendData, setBackendData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const checkBackendHealth = async () => {
    setBackendStatus('checking');
    setErrorMsg('');
    try {
      const response = await axios.get('/api/health');
      setBackendData(response.data);
      setBackendStatus('connected');
    } catch (err) {
      console.error('Backend connection failed:', err);
      // Also try direct absolute URL if proxy wasn't picked up immediately
      try {
        const directResp = await axios.get('http://localhost:5000/api/health');
        setBackendData(directResp.data);
        setBackendStatus('connected');
      } catch (directErr) {
        setBackendStatus('disconnected');
        setErrorMsg(
          err.response?.data?.message ||
          'Could not connect to Express server at http://localhost:5000. Ensure "npm run dev" is running in the /server directory.'
        );
      }
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const roles = [
    {
      title: 'Customer Experience',
      role: 'Customer',
      icon: <User className="w-6 h-6 text-accent" />,
      desc: 'Browse multi-vendor catalogs, dynamic filters, cart, wishlist, split multi-vendor checkout, and live order tracking.',
      badge: 'Role 1',
    },
    {
      title: 'Vendor Storefront & Dashboard',
      role: 'Vendor',
      icon: <Store className="w-6 h-6 text-secondary" />,
      desc: 'Dedicated portal to manage custom inventory, upload products, process incoming orders, and track sales revenue.',
      badge: 'Role 2',
    },
    {
      title: 'Admin Control Center',
      role: 'Admin',
      icon: <ShieldCheck className="w-6 h-6 text-accent-light" />,
      desc: 'Platform governance: approve vendors, manage categories, oversee global orders, monitor commissions and sales analytics.',
      badge: 'Role 3',
    },
  ];

  const phases = [
    { num: '01', name: 'Project Setup & Installation', status: 'In Progress (Active)' },
    { num: '02', name: 'Frontend Design & Homepage', status: 'Next Phase' },
    { num: '03', name: 'MongoDB Database Connection', status: 'Upcoming' },
    { num: '04', name: 'User Registration & Login (JWT)', status: 'Upcoming' },
    { num: '05', name: 'Customer Dashboard', status: 'Upcoming' },
    { num: '06', name: 'Vendor Dashboard', status: 'Upcoming' },
    { num: '07', name: 'Product & Category Management', status: 'Upcoming' },
    { num: '08', name: 'Shopping Cart & Wishlist', status: 'Upcoming' },
    { num: '09', name: 'Order Management (Multi-Vendor Split)', status: 'Upcoming' },
    { num: '10', name: 'Admin Dashboard & Analytics', status: 'Upcoming' },
    { num: '11', name: 'Payment Gateway Integration', status: 'Upcoming' },
    { num: '12', name: 'End-to-End Testing & Bug Fixing', status: 'Upcoming' },
    { num: '13', name: 'Final Production Deployment', status: 'Upcoming' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-primary text-white border-b border-slate-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-secondary to-accent flex items-center justify-center shadow-lg font-extrabold text-xl tracking-wider text-white">
              N
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">NexStore</span>
              <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-accent/20 text-accent font-semibold border border-accent/30">
                Multi-Vendor
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Phase 1:</span>
              <span className="font-semibold text-accent">Setup & Architecture</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-primary via-slate-900 to-primary-light text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-40 top-0 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 text-purple-200 border border-secondary/40 text-xs font-semibold uppercase tracking-wider">
              🚀 Full Stack MERN Architecture Ready
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Enterprise Multi-Vendor <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary-light">
                E-Commerce Platform
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Step-by-step implementation powered by React, Tailwind CSS, Express.js, Node.js, and MongoDB.
              Engineered with clean role-based boundaries for Customers, Vendors, and Admins.
            </p>
          </div>
        </section>

        {/* Live System Connectivity Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/5 rounded-xl text-primary">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Environment & Connectivity Monitor</h2>
                <p className="text-sm text-slate-500">Real-time status check between React Frontend and Express Backend</p>
              </div>
            </div>

            <button
              onClick={checkBackendHealth}
              disabled={backendStatus === 'checking'}
              className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-slate-800 text-white transition-all duration-200 shadow hover:shadow-md disabled:opacity-50"
            >
              {backendStatus === 'checking' ? 'Testing Connection...' : 'Re-test Backend Health'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Frontend Status */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start space-x-3">
              <Laptop className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="text-xs uppercase font-bold text-slate-400">Frontend Client</p>
                <p className="text-sm font-semibold text-slate-800">React + Vite + Tailwind</p>
                <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Running on Port 5173
                </div>
              </div>
            </div>

            {/* Backend Status */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start space-x-3">
              <Server className="w-5 h-5 text-secondary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs uppercase font-bold text-slate-400">Backend Server</p>
                <p className="text-sm font-semibold text-slate-800">Node.js + Express API</p>
                {backendStatus === 'connected' && (
                  <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected (Port 5000)
                  </div>
                )}
                {backendStatus === 'checking' && (
                  <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Pinging Server...
                  </div>
                )}
                {backendStatus === 'disconnected' && (
                  <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5" /> Offline
                  </div>
                )}
              </div>
            </div>

            {/* Database Engine */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start space-x-3">
              <Database className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs uppercase font-bold text-slate-400">Database Engine</p>
                <p className="text-sm font-semibold text-slate-800">MongoDB 8.3 & Mongoose</p>
                <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  Ready for Phase 3 Connection
                </div>
              </div>
            </div>
          </div>

          {backendStatus === 'connected' && backendData && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs font-mono text-emerald-900 mt-2 space-y-1">
              <div className="font-bold text-emerald-800">API Response received from Express:</div>
              <div>Status: {backendData.status}</div>
              <div>Message: {backendData.message}</div>
              <div>Timestamp: {backendData.timestamp}</div>
            </div>
          )}

          {backendStatus === 'disconnected' && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 mt-2 space-y-1">
              <div className="font-bold text-rose-800">Express Server Offline:</div>
              <div>{errorMsg}</div>
            </div>
          )}
        </section>

        {/* 3 User Roles Architecture */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Three-Tier Role Architecture</h2>
              <p className="text-slate-500 text-sm">Strict role-based isolation tailored for multi-vendor commerce</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((r, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      {r.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-slate-100 px-2.5 py-1 rounded-md">
                      {r.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{r.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{r.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 font-medium flex items-center justify-between">
                  <span>Scope: {r.role} Permissions</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap of 13 Phases */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Project Development Plan (13 Phases)</h2>
            <p className="text-sm text-slate-500">Sequential, step-by-step execution roadmap</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {phases.map((p, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  idx === 0 
                    ? 'bg-primary/5 border-primary/20 text-primary' 
                    : 'bg-slate-50/50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                    idx === 0 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {p.num}
                  </span>
                  <span className="text-sm font-medium">{p.name}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  idx === 0 ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-slate-400 py-8 border-t border-slate-800 mt-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold">NexStore Multi-Vendor</span>
            <span>&copy; {new Date().getFullYear()} — Built with MERN Stack</span>
          </div>
          <div className="text-xs text-slate-500">
            Phase 1 Completed & Verified
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
