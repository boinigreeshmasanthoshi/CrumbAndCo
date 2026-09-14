import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, HeartHandshake, Wand2, PackageCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const cards = [
    {
      icon: Sparkles,
      title: 'Freshly Baked',
      description: 'Batches pulled warm from the ovens every morning, made strictly with pure cultured French butter and premium couverture.',
      color: 'from-[#FCEEEB] to-[#F7D6D0]',
      iconColor: 'text-[#9E5D4E]',
    },
    {
      icon: HeartHandshake,
      title: 'Handcrafted',
      description: 'Every delicate rosette, crumb, and sponge layer receives personal master-patissier attention and artisanal care.',
      color: 'from-[#FEF3E8] to-[#FED7AA]',
      iconColor: 'text-[#B45309]',
    },
    {
      icon: Wand2,
      title: 'Custom Creations',
      description: 'Personalized bespoke vintage Lambeth cakes, palette art, and custom message lettering tailored for your celebrations.',
      color: 'from-[#F5EEFA] to-[#E9D5FF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      icon: PackageCheck,
      title: 'Delivered With Care',
      description: 'Carefully packaged in climate-resistant luxury boutique boxes and hand-delivered directly to your doorstep.',
      color: 'from-[#EEF4ED] to-[#C8DEC3]',
      iconColor: 'text-[#3A5536]',
    },
  ];

  return (
    <section className="py-16 bg-[#FDFBF7] border-y border-[#F5EBE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold tracking-wider text-[#9E5D4E] uppercase">
            The Crumb & Co. Difference
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#3E2723]">
            Why Celebrations Love Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-white p-6 rounded-3xl border border-[#EBDCCB] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#3E2723]">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#735D54] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#FAF7F2] text-[11px] font-semibold text-[#8C7A74] group-hover:text-[#9E5D4E] transition-colors flex items-center gap-1">
                  <span>Guaranteed quality</span>
                  <span>✨</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
