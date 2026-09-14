import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Heart } from 'lucide-react';

export const InstagramGallery: React.FC = () => {
  const posts = [
    {
      image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&q=80',
      caption: 'Vintage piped Lambeth tiers for an enchanted twilight birthday ✨🎂',
      likes: '1.2k',
      tag: 'Custom Cakes',
    },
    {
      image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=600&q=80',
      caption: 'Fresh French lavender & raw organic honey cupcakes in bloom 🌸',
      likes: '840',
      tag: 'Cupcakes',
    },
    {
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      caption: 'Morning viennoiserie pulling warm with 36 flaky golden layers 🥐',
      likes: '960',
      tag: 'Baking Process',
    },
    {
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
      caption: 'Freshly baked Maldon salted choc brookies packed for delivery 🍪',
      likes: '1.5k',
      tag: 'Cookies',
    },
    {
      image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80',
      caption: 'Unboxing our signature pastel velvet bloom celebration box 💕',
      likes: '2.1k',
      tag: 'Packaging',
    },
    {
      image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
      caption: 'Celebrating Rhea’s 25th with our Parisian strawberry pistache tartlet 🍓',
      likes: '1.8k',
      tag: 'Celebrations',
    },
  ];

  return (
    <section className="py-20 bg-[#FDFBF7] border-t border-[#F5EBE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FCEEEB] text-[#9E5D4E] text-xs font-semibold">
            <Instagram className="w-3.5 h-3.5" />
            <span>Join Our Sweet Community</span>
          </div>

          <h2 className="font-serif text-3xl font-bold text-[#3E2723]">
            Follow @CrumbAndCo
          </h2>

          <p className="text-sm text-[#735D54]">
            Behind-the-scenes lamination, bespoke piping reels, and sweet celebration moments shared daily.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post, idx) => (
            <motion.a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#FCEEEB] shadow-xs hover:shadow-md transition-all cursor-pointer block"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Hover overlay with instagram badge */}
              <div className="absolute inset-0 bg-[#3E2723]/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-between text-white text-xs">
                <div className="flex justify-end">
                  <Instagram className="w-4 h-4 text-white/90" />
                </div>

                <div className="space-y-1">
                  <p className="line-clamp-2 text-[11px] leading-tight text-white/90">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#F7D6D0]">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>

              {/* Subtle category tag always visible on mobile */}
              <div className="absolute bottom-2 left-2 pointer-events-none md:hidden">
                <span className="px-1.5 py-0.5 rounded-md bg-black/50 text-[10px] text-white">
                  {post.tag}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Follow CTA button */}
        <div className="text-center mt-10">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#FAF7F2] text-[#3E2723] font-semibold text-xs sm:text-sm border border-[#EBDCCB] shadow-xs hover:shadow-sm transition-all"
          >
            <Instagram className="w-4 h-4 text-[#9E5D4E]" />
            <span>Follow on Instagram @CrumbAndCo</span>
          </a>
        </div>

      </div>
    </section>
  );
};
