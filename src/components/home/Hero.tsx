import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Heart, Star, Award, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onShopCakes: () => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopCakes, onExploreMenu }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#FDFBF7] to-[#FAF7F2] py-16 lg:py-24">
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft pastel ambient blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FCEEEB]/70 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-[#FEF3E8]/60 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-[#E2ECE0]/50 rounded-full blur-3xl" />

        {/* Floating pastry crumb & flower charms */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-10 text-xl opacity-60 select-none hidden sm:block"
        >
          🌸
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-36 right-16 text-2xl opacity-60 select-none"
        >
          ✨
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-20 left-16 text-lg opacity-50 select-none hidden md:block"
        >
          🧁
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-28 right-1/4 text-sm opacity-60 select-none"
        >
          ⭐
        </motion.div>

        {/* Subtle decorative golden crumbs */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#E8976C]/40 animate-pulse" />
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-[#F7D6D0] animate-pulse" />
        <div className="absolute bottom-16 right-12 w-2.5 h-2.5 rounded-full bg-[#9FB89A]/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCEEEB] border border-[#F7D6D0] text-[#783F34] text-xs font-semibold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E8976C]" />
              <span>Small-Batch Handcrafted Patisserie</span>
            </motion.div>

            {/* Brand & Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#3E2723] leading-[1.15]">
                A little crumb of{' '}
                <span className="relative inline-block text-[#9E5D4E]">
                  happiness
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-3 text-[#F7D6D0] -z-10"
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                in every single bite.
              </h1>

              <p className="text-base sm:text-lg text-[#6E4F44] max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal pt-2">
                Freshly baked treats, handcrafted with love and made to make your moments a little sweeter. From signature Belgian chocolate truffle cakes to flaky viennoiserie and custom celebratory centrepieces.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                id="hero-shop-cakes-btn"
                onClick={onShopCakes}
                className="px-7 py-3.5 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white font-medium text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop Our Cakes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-explore-menu-btn"
                onClick={onExploreMenu}
                className="px-7 py-3.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#3E2723] font-medium text-sm sm:text-base border border-[#EBDCCB] shadow-xs hover:shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Menu</span>
              </button>
            </motion.div>

            {/* Trust highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-6 border-t border-[#EBDCCB]/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#735D54]"
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="font-semibold text-[#3E2723]">4.9 / 5.0</span>
                <span>(500+ Happy Reviews)</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#D4BDB0] hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#5B7B56]" />
                <span>100% Pure Butter & Couverture</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#D4BDB0] hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#9E5D4E]" />
                <span>Eggless Options Available</span>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Visuals */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Outer decorative card frame with soft pastel shadow */}
              <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-xl border border-[#F5EBE1]">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#FCEEEB]">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85"
                    alt="Belgian Chocolate Truffle Cake by Crumb & Co."
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient overlay at bottom of card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* On-image caption badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 shadow-md flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#3E2723]">Chef's Belgian Truffle</p>
                      <p className="text-[11px] text-[#735D54]">Made with 54% Callebaut Dark Chocolate</p>
                    </div>
                    <span className="text-sm font-bold text-[#9E5D4E] bg-[#FCEEEB] px-2.5 py-1 rounded-xl">
                      ₹800 / kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating review card sticker */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#EBDCCB] shadow-lg max-w-[210px] hidden sm:block"
              >
                <div className="flex items-center gap-1 text-[#F59E0B] mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#3E2723] font-medium leading-tight">
                  “The best cake we have ever tasted in town!”
                </p>
                <p className="text-[10px] text-[#8C7A74] mt-1">— Ananya S., Verified Customer</p>
              </motion.div>

              {/* Floating freshness tag sticker */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-[#E2ECE0] text-[#3A5536] px-3.5 py-2 rounded-2xl border border-[#C8DEC3] shadow-md text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5B7B56]" />
                <span>Baked Fresh Today</span>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
