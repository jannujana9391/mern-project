import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Laptop, 
  Shirt, 
  Home as HomeIcon, 
  HeartHandshake, 
  Gamepad2, 
  Watch, 
  Dumbbell, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

const categories = [
  { id: 'electronics', name: 'Electronics & Audio', count: '1,420 items', icon: <Laptop className="w-6 h-6" />, bg: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-400' },
  { id: 'fashion', name: 'Fashion & Wear', count: '2,850 items', icon: <Shirt className="w-6 h-6" />, bg: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-400' },
  { id: 'home', name: 'Home & Ergonomics', count: '980 items', icon: <HomeIcon className="w-6 h-6" />, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-400' },
  { id: 'beauty', name: 'Beauty & Skincare', count: '640 items', icon: <HeartHandshake className="w-6 h-6" />, bg: 'bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-400' },
  { id: 'gaming', name: 'Gaming Gear', count: '510 items', icon: <Gamepad2 className="w-6 h-6" />, bg: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-400' },
  { id: 'watches', name: 'Watches & Jewelry', count: '430 items', icon: <Watch className="w-6 h-6" />, bg: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-400' },
  { id: 'sports', name: 'Sports & Outdoors', count: '870 items', icon: <Dumbbell className="w-6 h-6" />, bg: 'bg-teal-50 text-teal-600 border-teal-100 hover:border-teal-400' },
  { id: 'books', name: 'Books & Stationery', count: '1,120 items', icon: <BookOpen className="w-6 h-6" />, bg: 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:border-cyan-400' },
];

const CategoryGrid = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Explore curated departments supplied by thousands of verified vendors</p>
        </div>
        <Link
          to="/products"
          className="text-xs font-bold text-secondary hover:text-purple-700 flex items-center space-x-1"
        >
          <span>All Categories</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to="/products"
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center space-y-2 group bg-white shadow-sm hover:shadow-md hover:-translate-y-1 ${cat.bg}`}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {cat.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs group-hover:text-secondary transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                {cat.count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
