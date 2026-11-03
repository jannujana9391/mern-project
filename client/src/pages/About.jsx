import React from 'react';
import { Sparkles, ShieldCheck, Store, Users, Zap, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 text-purple-200 border border-secondary/40 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> About NexStore
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Empowering Independent Merchants & Modern Shoppers
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            We built NexStore to eliminate the friction between innovative direct-to-consumer merchants and worldwide shoppers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Multi-Vendor Hub</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every merchant has full ownership of their storefront, customized product catalogs, inventory pricing, and order fulfillment.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Buyer Protection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              All merchants are vetted and verified before listing. Split payments and escrow security guarantee complete peace of mind.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Modern Architecture</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Engineered with MongoDB, Express, React, and Node.js for lightning-fast catalog browsing, responsive mobile views, and robust security.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Our Vision</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              A Transparent Marketplace Designed for Everyone
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unlike traditional platforms that prioritize centralized corporate sellers, NexStore democratizes digital commerce. We provide boutique brands, independent designers, and specialty electronics vendors with enterprise-level selling tools.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Shoppers enjoy a curated catalog with verified customer reviews, clear vendor ratings, and a seamless one-click checkout across multiple sellers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="block text-3xl font-extrabold text-primary">500+</span>
              <span className="text-xs text-slate-500 font-medium">Active Merchants</span>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="block text-3xl font-extrabold text-secondary">10k+</span>
              <span className="text-xs text-slate-500 font-medium">Curated Products</span>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="block text-3xl font-extrabold text-accent">50k+</span>
              <span className="text-xs text-slate-500 font-medium">Happy Customers</span>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="block text-3xl font-extrabold text-emerald-600">99.9%</span>
              <span className="text-xs text-slate-500 font-medium">Uptime Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
