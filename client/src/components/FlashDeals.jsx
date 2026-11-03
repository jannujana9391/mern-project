import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShoppingBag, Star, Store, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const flashDealItems = [
  {
    id: 101,
    name: 'Smart True-Wireless Earbuds with Active ANC',
    price: 49.99,
    originalPrice: 99.99,
    vendor: 'SoundWave Technologies',
    rating: 4.8,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    claimedPercent: 82,
    claimedText: '82% Claimed',
    stockLeft: 4,
    discount: '50% OFF',
  },
  {
    id: 102,
    name: 'Fitness GPS Smartwatch with SpO2 Sensor',
    price: 89.00,
    originalPrice: 149.00,
    vendor: 'Apex Horizon Time',
    rating: 4.7,
    reviews: 184,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    claimedPercent: 65,
    claimedText: '65% Claimed',
    stockLeft: 9,
    discount: '40% OFF',
  },
  {
    id: 103,
    name: 'Handmade Italian Full-Grain Leather Wallet',
    price: 34.50,
    originalPrice: 65.00,
    vendor: 'Artisan Crafts Co.',
    rating: 4.9,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
    claimedPercent: 91,
    claimedText: '91% Claimed',
    stockLeft: 3,
    discount: '47% OFF',
  },
  {
    id: 104,
    name: 'Aluminum Multi-Angle Ergonomic Laptop Riser',
    price: 29.99,
    originalPrice: 49.99,
    vendor: 'ErgoComfort Living',
    rating: 4.6,
    reviews: 97,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    claimedPercent: 54,
    claimedText: '54% Claimed',
    stockLeft: 14,
    discount: '40% OFF',
  },
];

const FlashDeals = ({ onAddToCart }) => {
  // Live Countdown Timer (14 hours, 23 minutes, 45 seconds countdown)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 28,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num) => String(num).padStart(2, '0');

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Header with Countdown Clock */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center animate-pulse">
            <Flame className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Flash Deals & Lightning Discounts
              </h2>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wide">
                Live Now
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Limited inventory allocated by independent merchants at exclusive wholesale pricing
            </p>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center space-x-3 bg-slate-900 text-white px-4 py-2 rounded-2xl self-start md:self-auto shadow-inner">
          <Clock className="w-4 h-4 text-accent animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-xs font-bold text-slate-300">Ends In:</span>
          <div className="flex items-center space-x-1.5 font-mono font-bold text-sm">
            <span className="px-2 py-1 bg-slate-800 rounded-lg text-accent">
              {formatDigit(timeLeft.hours)}
            </span>
            <span className="text-slate-500">:</span>
            <span className="px-2 py-1 bg-slate-800 rounded-lg text-accent">
              {formatDigit(timeLeft.minutes)}
            </span>
            <span className="text-slate-500">:</span>
            <span className="px-2 py-1 bg-slate-800 rounded-lg text-accent">
              {formatDigit(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Flash Deals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {flashDealItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-white hover:shadow-xl hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Image & Discount */}
            <div className="relative rounded-xl overflow-hidden bg-white h-48 mb-3 border border-slate-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
                {item.discount}
              </span>
              <span className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                ⚡ Only {item.stockLeft} Left
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-1 text-xs text-secondary font-bold">
                <Store className="w-3.5 h-3.5" />
                <span className="truncate">{item.vendor}</span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {item.name}
              </h4>

              {/* Pricing */}
              <div className="flex items-baseline space-x-2 pt-1">
                <span className="text-xl font-black text-rose-600">${item.price.toFixed(2)}</span>
                <span className="text-xs text-slate-400 line-through">${item.originalPrice.toFixed(2)}</span>
              </div>

              {/* Progress Bar (Stock Claimed) */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                  <span>{item.claimedText}</span>
                  <span className="text-rose-600 font-bold">{item.stockLeft} units left</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-secondary to-rose-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.claimedPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 mt-2 border-t border-slate-200/60">
              <button
                onClick={() => onAddToCart && onAddToCart(item)}
                className="w-full py-2.5 bg-primary hover:bg-secondary text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Claim Flash Deal</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashDeals;

