import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Store, ShieldCheck, Zap } from 'lucide-react';

const slides = [
  {
    id: 1,
    tag: 'Limited Time Event',
    headline: 'Electronics & Audio Carnival',
    subline: 'Experience noise-cancelling headphones, AMOLED smartwatches, and next-gen gaming accessories direct from authorized manufacturers.',
    highlight: 'Up to 50% OFF',
    primaryCta: 'Explore Electronics',
    primaryLink: '/products',
    secondaryCta: 'Join as Tech Vendor',
    secondaryLink: '/register',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    accentColor: 'from-secondary to-accent',
    badge: '⚡ Flash Deals Active',
  },
  {
    id: 2,
    tag: 'Designer Boutique Showcase',
    headline: 'Handcrafted Fashion & Heritage Leather',
    subline: 'Support independent fashion houses and artisan leatherworkers. Each order is meticulously packaged and shipped directly with authenticity certificates.',
    highlight: 'Curated Artisan Goods',
    primaryCta: 'Browse Fashion',
    primaryLink: '/products',
    secondaryCta: 'Sell Your Creations',
    secondaryLink: '/register',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
    accentColor: 'from-purple-600 to-pink-500',
    badge: '✨ Verified Independent Designers',
  },
  {
    id: 3,
    tag: 'Home & Ergonomics',
    headline: 'Elevate Your Workspace & Living Space',
    subline: 'Discover breathable mesh chairs, motorized standing desks, and ambient smart lamps designed to boost focus, comfort, and wellbeing.',
    highlight: 'Free Express Shipping',
    primaryCta: 'Shop Ergonomics',
    primaryLink: '/products',
    secondaryCta: 'Register as Merchant',
    secondaryLink: '/register',
    image: 'https://images.unsplash.com/photo-1580481077195-c22ae2426372?w=1200&auto=format&fit=crop&q=80',
    accentColor: 'from-accent to-blue-600',
    badge: '📦 Direct Factory Warranty',
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const slide = slides[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-gradient-to-r from-primary via-slate-900 to-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
    >
      {/* Background Decorative Blur Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 left-10 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Slide Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30 text-purple-200 border border-secondary/40 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{slide.badge}</span>
          </div>

          <div className="space-y-3">
            <span className="text-accent font-extrabold text-sm uppercase tracking-widest block">
              {slide.tag} • <span className="text-white underline decoration-accent/60">{slide.highlight}</span>
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
              {slide.headline}
            </h1>
          </div>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
            {slide.subline}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to={slide.primaryLink}
              className="px-7 py-3.5 bg-gradient-to-r from-secondary to-purple-600 hover:from-purple-600 hover:to-secondary text-white font-extrabold rounded-2xl shadow-lg shadow-secondary/30 transition-all flex items-center space-x-2 text-sm active:scale-95"
            >
              <span>{slide.primaryCta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={slide.secondaryLink}
              className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold rounded-2xl border border-slate-700 transition-all flex items-center space-x-2 text-sm active:scale-95"
            >
              <Store className="w-4 h-4 text-accent" />
              <span>{slide.secondaryCta}</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-md h-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-800/50 group">
            <img
              src={slide.image}
              alt={slide.headline}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-5 left-5 right-5 p-4 bg-primary/80 backdrop-blur-md rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Deal of the Day</span>
                <p className="text-xs font-bold text-white truncate">Direct from Verified Merchant</p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 bg-secondary text-white rounded-xl shadow-sm">
                Save 40%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-slate-700 backdrop-blur-md transition-all z-20 hidden sm:flex items-center justify-center hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-slate-700 backdrop-blur-md transition-all z-20 hidden sm:flex items-center justify-center hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicator Pagination Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center space-x-2.5 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-accent' : 'w-2 bg-slate-600 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
