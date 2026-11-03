import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, ShieldCheck, ArrowRight, Package, Award } from 'lucide-react';

const featuredVendors = [
  {
    id: 1,
    name: 'SoundWave Technologies',
    category: 'Electronics & Audio',
    rating: 4.9,
    reviews: 580,
    sales: '3,400+ Sales',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    description: 'Premier brand for studio-grade acoustic headphones, Bluetooth audio transmitters, and gaming DACs.',
    sampleImages: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 2,
    name: 'Artisan Crafts Co.',
    category: 'Handmade Leather & Apparel',
    rating: 4.8,
    reviews: 420,
    sales: '1,890+ Sales',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1473187983305-f615310e7daa?w=600&auto=format&fit=crop&q=80',
    description: 'Bespoke full-grain leather bags, minimalist bi-fold wallets, and handcrafted heritage apparel.',
    sampleImages: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 3,
    name: 'ErgoComfort Living',
    category: 'Office & Ergonomics',
    rating: 4.9,
    reviews: 310,
    sales: '1,120+ Sales',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80',
    description: 'Scientifically calibrated lumbar chairs, sit-stand desks, and smart ambient desk lighting.',
    sampleImages: [
      'https://images.unsplash.com/photo-1580481077195-c22ae2426372?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&auto=format&fit=crop&q=80',
    ],
  },
];

const VendorSpotlight = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Top Rated Marketplace Vendors</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
              Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover dedicated merchant storefronts with independent warranties and 99%+ fulfillment ratings
          </p>
        </div>

        <Link
          to="/register"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-secondary hover:text-purple-700 transition-colors"
        >
          <span>Become an Authorized Merchant</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Header Banner */}
              <div className="relative h-28 overflow-hidden bg-slate-900">
                <img
                  src={vendor.banner}
                  alt={vendor.name}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </span>
              </div>

              {/* Profile Card Info */}
              <div className="px-6 pt-0 pb-4 relative">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-md overflow-hidden -mt-7 relative z-10 bg-white">
                  <img src={vendor.avatar} alt={vendor.name} className="w-full h-full object-cover" />
                </div>

                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-secondary transition-colors">
                      {vendor.name}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 block">{vendor.category}</span>
                  <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                    {vendor.description}
                  </p>
                </div>

                {/* Rating & Sales Stats */}
                <div className="flex items-center space-x-4 pt-3 text-xs border-t border-slate-100 mt-3">
                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{vendor.rating}</span>
                    <span className="text-slate-400 font-normal">({vendor.reviews})</span>
                  </div>
                  <div className="text-slate-500 font-semibold flex items-center space-x-1">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span>{vendor.sales}</span>
                  </div>
                </div>

                {/* Sample Product Previews */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Popular from this store:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {vendor.sampleImages.map((img, i) => (
                      <div key={i} className="h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={img} alt="Product preview" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Store CTA */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <Link
                to="/products"
                className="w-full py-2.5 px-4 bg-white hover:bg-primary text-slate-700 hover:text-white border border-slate-200 font-bold text-xs rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center space-x-2"
              >
                <Store className="w-3.5 h-3.5 text-secondary" />
                <span>Visit Storefront</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VendorSpotlight;
