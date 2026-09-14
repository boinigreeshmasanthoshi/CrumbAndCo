import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Award, Leaf, Users, Clock } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const bakers = [
    {
      name: 'Chef Aria Laurent',
      role: 'Head Pastry Chef & Co-Founder',
      bio: 'Trained at Le Cordon Bleu Paris, Aria spent 11 years mastering slow-emulsified ganaches, seasonal berry reduction compotes, and vintage French piping.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Chef Marcus Vance',
      role: 'Master Viennoisier',
      bio: 'Obsessed with the acoustics of flaky crusts and laminating cultured Normandy butter over 72-hour cold fermented doughs.',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Priya Nair',
      role: 'Cake Sculptor & Floral Stylist',
      bio: 'Botanical enthusiast and sugar artist creating delicate wafer paper blooms, palette knife textures, and edible gold leaf tiers.',
      image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const values = [
    {
      icon: Sparkles,
      title: 'Small Batch Integrity',
      desc: 'We never bake in industrial warehouses. Every cake sponge, brookie, and pastry is baked inside our sunlit Indiranagar open kitchen in measured batches.',
    },
    {
      icon: Award,
      title: 'Purest Origin Ingredients',
      desc: 'Single-origin 54% Callebaut Belgian chocolate, pure Madagascan Bourbon vanilla beans, unbleached flours, and zero artificial shortening.',
    },
    {
      icon: Leaf,
      title: 'Eco-Luxury Packaging',
      desc: 'Our signature pastel boxes are crafted from 100% biodegradable FSC-certified unbleached pulp board and compostable cotton ribbons.',
    },
    {
      icon: Heart,
      title: 'Happiness in Every Crumb',
      desc: 'Whether it is a quiet Sunday breakfast croissant or a grand 3-tier wedding centrepiece, we bake with reverence for human celebration.',
    },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FCEEEB] text-[#9E5D4E] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Sweet Story</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#3E2723] leading-tight">
              Crafting sweet memories, one crumb at a time.
            </h1>

            <p className="text-base text-[#6E4F44] leading-relaxed">
              Crumb & Co. started with a simple belief: that life's sweetest memories are created around a shared treat. What began as a tiny home oven in 2021 experimenting with sourdough brioche and vintage Lambeth buttercream has blossomed into an artisanal patisserie cherished by hundreds of celebrators.
            </p>

            <p className="text-sm text-[#735D54] leading-relaxed">
              We reject high-fructose syrups, premixed cake sponges, and frozen doughs. Instead, our team wakes up at 4:30 AM every morning to hand-whisk custard fillings, slice ripe local strawberries, and pull warm golden brioches straight from our deck ovens.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <div className="border-l-2 border-[#9E5D4E] pl-4">
                <p className="font-serif italic text-lg text-[#3E2723]">
                  “A little crumb of happiness in every bite.”
                </p>
                <p className="text-xs text-[#8C7A74] mt-1">— Aria & Marcus, Co-Founders</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden aspect-[3/4] bg-[#F5EBE1] shadow-md border border-[#EBDCCB]">
                <img
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
                  alt="Pastry lamination"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden aspect-square bg-[#F5EBE1] shadow-md border border-[#EBDCCB]">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
                  alt="Signature cake"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-3xl overflow-hidden aspect-square bg-[#F5EBE1] shadow-md border border-[#EBDCCB]">
                <img
                  src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&q=80"
                  alt="Vintage Lambeth cake"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden aspect-[3/4] bg-[#F5EBE1] shadow-md border border-[#EBDCCB]">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
                  alt="Freshly pulled bread"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EBDCCB] shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-[#9E5D4E] uppercase tracking-wider">
              Our Core Philosophy
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#3E2723]">
              What Makes Every Crumb Special
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(val => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EBDCCB] space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FCEEEB] text-[#9E5D4E] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#3E2723]">
                    {val.title}
                  </h3>
                  <p className="text-xs text-[#735D54] leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meet the Patissiers */}
        <div className="space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-[#9E5D4E] uppercase tracking-wider">
              The Artisan Hands
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#3E2723]">
              Meet Our Patissiers
            </h2>
            <p className="text-xs sm:text-sm text-[#735D54]">
              Dedicated food artists combining French pastry technique with warm contemporary flair.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bakers.map(baker => (
              <div
                key={baker.name}
                className="bg-white rounded-3xl overflow-hidden border border-[#EBDCCB] shadow-xs flex flex-col"
              >
                <div className="aspect-[4/5] bg-[#F5EBE1] overflow-hidden">
                  <img
                    src={baker.image}
                    alt={baker.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#3E2723]">
                      {baker.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#9E5D4E]">
                      {baker.role}
                    </p>
                    <p className="text-xs text-[#735D54] leading-relaxed mt-2">
                      {baker.bio}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#FAF7F2] text-[11px] text-[#8C7A74]">
                    Master Artisan • Crumb & Co.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
