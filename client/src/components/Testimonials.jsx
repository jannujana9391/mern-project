import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2 days ago',
    text: 'I ordered headphones from SoundWave and a leather bag from Artisan Crafts in one checkout. The split shipping notifications were clear, and both arrived earlier than promised!',
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Tech Enthusiast & Buyer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '1 week ago',
    text: 'As someone who purchases high-end electronics, knowing the platform holds payments in escrow until the vendor fulfills gives complete confidence. Incredible UI and fast support.',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Boutique Merchant & Buyer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '3 weeks ago',
    text: 'We opened our artisan ceramic storefront on NexStore last month. The vendor analytics and order management tools are by far the cleanest we have used compared to other platforms.',
  },
];

const Testimonials = () => {
  return (
    <section className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
          Trusted by 50,000+ Shoppers & Merchants
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          What Our Community Says
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Real experiences from verified buyers and independent sellers across the globe
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-slate-200" />
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "{rev.text}"
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                  {rev.name}
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </h4>
                <span className="text-[11px] text-slate-400 font-medium">{rev.role} • {rev.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

