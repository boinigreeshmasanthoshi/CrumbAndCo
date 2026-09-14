import React from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingBag, Eye, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../../types.js';
import { useCart } from '../../context/CartContext.js';
import { useToast } from '../../context/ToastContext.js';

interface FeaturedSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products,
  onSelectProduct,
  onViewAll,
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const featured = products.filter(p => p.isFeatured).slice(0, 6);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!product.isAvailable) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }

    const defaultSize = product.sizes?.[0]?.size || 'Standard';
    const defaultPrice = product.sizes?.[0]?.price || product.price;
    const defaultFlavour = product.flavours?.[0] || 'Original';

    addToCart(
      product,
      {
        size: defaultSize,
        flavour: defaultFlavour,
      },
      1,
      defaultPrice
    );

    showToast(`Added ${product.name} (${defaultSize}) to cart! 🍰`, 'success');
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCEEEB] text-[#9E5D4E] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handpicked Patisserie</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#3E2723]">
            Fresh From Our Oven
          </h2>

          <p className="text-sm sm:text-base text-[#735D54]">
            Handmade in limited daily batches using slow-fermented batters, pure French butter, and premium Belgian chocolate.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => onSelectProduct(product)}
              className="group bg-white rounded-3xl overflow-hidden border border-[#EBDCCB] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Product Image Box */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5EBE1]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  {product.badge && (
                    <span className="px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[#9E5D4E] text-xs font-bold shadow-xs">
                      {product.badge}
                    </span>
                  )}
                  {!product.isAvailable && (
                    <span className="px-2.5 py-1 rounded-xl bg-[#FFF5F5] text-[#9B2C2C] text-xs font-bold border border-[#FED7D7] shadow-xs">
                      Currently Unavailable
                    </span>
                  )}
                </div>

                {/* Category tag */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-xl bg-black/40 backdrop-blur-md text-white text-[11px] font-medium">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#3E2723] group-hover:text-[#9E5D4E] transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 shrink-0 bg-[#FEF3E8] px-2 py-0.5 rounded-lg text-xs font-semibold text-[#8C5E28]">
                      <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#735D54] line-clamp-2 leading-relaxed">
                    {product.tagline || product.description}
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-[#F5EBE1] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-[#8C7A74] block leading-none">Starting from</span>
                    <span className="text-lg font-bold text-[#3E2723]">
                      ₹{product.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Details */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5EBE1] text-[#4A352F] border border-[#EBDCCB] transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Add to Cart */}
                    <button
                      disabled={!product.isAvailable}
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        product.isAvailable
                          ? 'bg-[#9E5D4E] hover:bg-[#85473A] text-white shadow-xs hover:shadow-sm'
                          : 'bg-[#EBDCCB] text-[#8C7A74] cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.isAvailable ? 'Add' : 'Sold Out'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            id="featured-view-all-btn"
            onClick={onViewAll}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#3E2723] font-semibold text-sm border border-[#EBDCCB] shadow-xs hover:shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>View All Fresh Bakes</span>
            <ArrowRight className="w-4 h-4 text-[#9E5D4E]" />
          </button>
        </div>

      </div>
    </section>
  );
};
