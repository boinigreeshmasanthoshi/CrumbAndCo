import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingBag, Plus, Minus, Check, AlertCircle, Sparkles, Heart, Clock, ShieldCheck } from 'lucide-react';
import { Product, CakeSizeOption } from '../../types.js';
import { useCart } from '../../context/CartContext.js';
import { useToast } from '../../context/ToastContext.js';

interface ProductDetailModalProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts,
  onClose,
  onSelectRelated,
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFlavour, setSelectedFlavour] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Synchronize when product changes
  useEffect(() => {
    if (product) {
      const defaultSize = product.sizes?.[0]?.size || 'Standard';
      setSelectedSize(defaultSize);
      setSelectedFlavour(product.flavours?.[0] || 'Original');
      setQuantity(1);
      setCustomMessage('');
      setSpecialInstructions('');
    }
  }, [product]);

  // Compute calculated unit price dynamically
  const calculatedUnitPrice = useMemo(() => {
    if (!product) return 0;
    const sizeOption = product.sizes?.find(s => s.size === selectedSize);
    if (sizeOption) return sizeOption.price;
    return product.price;
  }, [product, selectedSize]);

  // Related products (same category or featured, excluding current)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(p => p.id !== product.id && (p.category === product.category || p.isFeatured))
      .slice(0, 3);
  }, [product, allProducts]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!product.isAvailable) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }

    addToCart(
      product,
      {
        size: selectedSize,
        flavour: selectedFlavour,
        customMessage: customMessage.trim() || undefined,
        specialInstructions: specialInstructions.trim() || undefined,
      },
      quantity,
      calculatedUnitPrice
    );

    showToast(`Added ${quantity}x ${product.name} (${selectedSize}) to cart! 🍰`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="bg-[#FAF7F2] rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-[#EBDCCB] relative flex flex-col max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#EBDCCB] text-[#3E2723] hover:bg-[#FCEEEB] flex items-center justify-center shadow-xs transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Main Product Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: Product Image & Badges */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-[#EBDCCB] shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Status indicator */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.badge && (
                    <span className="px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[#9E5D4E] text-xs font-bold shadow-xs">
                      {product.badge}
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold shadow-xs ${
                      product.isAvailable
                        ? 'bg-[#E2ECE0] text-[#3A5536] border border-[#C8DEC3]'
                        : 'bg-[#FFF5F5] text-[#9B2C2C] border border-[#FED7D7]'
                    }`}
                  >
                    {product.isAvailable ? 'Available In Oven ✅' : 'Currently Unavailable ❌'}
                  </span>
                </div>
              </div>

              {/* Artisan Highlights */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-2xl border border-[#EBDCCB] flex items-center gap-2 text-[#4A352F]">
                  <Clock className="w-4 h-4 text-[#9E5D4E]" />
                  <span>Baking time: 4-6 hrs</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#EBDCCB] flex items-center gap-2 text-[#4A352F]">
                  <ShieldCheck className="w-4 h-4 text-[#5B7B56]" />
                  <span>100% Preservative-Free</span>
                </div>
              </div>
            </div>

            {/* Right: Details & Customization */}
            <div className="space-y-5">
              
              {/* Category & Title */}
              <div>
                <span className="text-xs font-semibold text-[#9E5D4E] tracking-wider uppercase">
                  {product.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2723] mt-0.5">
                  {product.name}
                </h2>

                {/* Rating & Review count */}
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1 bg-[#FEF3E8] px-2 py-0.5 rounded-lg text-[#8C5E28] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-[#8C7A74]">
                    ({product.reviewCount} customer reviews)
                  </span>
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="bg-white p-4 rounded-2xl border border-[#EBDCCB] flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#8C7A74] block">Price for {selectedSize}</span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#3E2723]">
                    ₹{calculatedUnitPrice}
                  </span>
                </div>

                <span className="text-xs text-[#5B7B56] font-semibold bg-[#EEF4ED] px-2.5 py-1 rounded-full">
                  Taxes Included
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#735D54] leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#3E2723] uppercase tracking-wider block">
                    Choose Size / Weight:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {product.sizes.map(opt => {
                      const isSelected = selectedSize === opt.size;
                      return (
                        <button
                          key={opt.size}
                          type="button"
                          onClick={() => setSelectedSize(opt.size)}
                          className={`p-2.5 rounded-2xl text-xs font-medium text-center transition-all border ${
                            isSelected
                              ? 'bg-[#FCEEEB] border-[#9E5D4E] text-[#3E2723] font-bold shadow-xs'
                              : 'bg-white border-[#EBDCCB] text-[#5C453E] hover:border-[#9E5D4E]'
                          }`}
                        >
                          <span className="block">{opt.size}</span>
                          <span className="text-[11px] text-[#8C7A74]">₹{opt.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Flavour Selector */}
              {product.flavours && product.flavours.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#3E2723] uppercase tracking-wider block">
                    Select Flavour Option:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.flavours.map(flav => {
                      const isSelected = selectedFlavour === flav;
                      return (
                        <button
                          key={flav}
                          type="button"
                          onClick={() => setSelectedFlavour(flav)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                            isSelected
                              ? 'bg-[#9E5D4E] border-[#9E5D4E] text-white font-semibold'
                              : 'bg-white border-[#EBDCCB] text-[#5C453E] hover:bg-[#FCEEEB]'
                          }`}
                        >
                          {flav}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Cake Message (e.g. Happy 25th Birthday Rhea) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3E2723] uppercase tracking-wider block flex items-center justify-between">
                  <span>Cake Writing Message (Optional):</span>
                  <span className="text-[10px] text-[#8C7A74] normal-case">Up to 35 chars</span>
                </label>
                <input
                  type="text"
                  maxLength={35}
                  placeholder="e.g. Happy 25th Birthday Rhea! ✨"
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723] placeholder-[#A89891] focus:outline-none focus:border-[#9E5D4E]"
                />
              </div>

              {/* Special instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3E2723] uppercase tracking-wider block">
                  Special Notes / Delivery instructions:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 100% Eggless required, less sugar, include 5 pastel candle sticks..."
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723] placeholder-[#A89891] focus:outline-none focus:border-[#9E5D4E] resize-none"
                />
              </div>

              {/* Quantity and Add to Cart Row */}
              <div className="pt-2 flex items-center gap-4">
                {/* Quantity Control */}
                <div className="flex items-center bg-white border border-[#EBDCCB] rounded-2xl p-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[#3E2723] hover:bg-[#FCEEEB] disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-[#3E2723]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    aria-label="Increase quantity"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[#3E2723] hover:bg-[#FCEEEB] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add To Cart CTA */}
                <button
                  disabled={!product.isAvailable}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                    product.isAvailable
                      ? 'bg-[#9E5D4E] hover:bg-[#85473A] text-white transform hover:-translate-y-0.5'
                      : 'bg-[#EBDCCB] text-[#8C7A74] cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {product.isAvailable
                      ? `Add to Cart • ₹${calculatedUnitPrice * quantity}`
                      : 'Currently Unavailable'}
                  </span>
                </button>
              </div>

            </div>
          </div>

          {/* Ingredients & Allergens Accordion / Pill Info */}
          <div className="bg-white p-5 rounded-3xl border border-[#EBDCCB] space-y-4">
            <div>
              <h4 className="font-semibold text-xs text-[#3E2723] uppercase tracking-wider mb-2">
                Ingredients & Master Provenance:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients?.map(ing => (
                  <span
                    key={ing}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#4A352F]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-xs text-[#3E2723] uppercase tracking-wider mb-2">
                Allergen Information:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {product.allergens?.map(all => (
                  <span
                    key={all}
                    className="px-2.5 py-1 rounded-lg bg-[#FEF3E8] border border-[#FED7AA] text-xs text-[#8C5E28]"
                  >
                    {all}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related Delicacies */}
          {relatedProducts.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-serif text-lg font-bold text-[#3E2723]">
                You might also enjoy
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="bg-white p-3 rounded-2xl border border-[#EBDCCB] flex items-center gap-3 cursor-pointer hover:border-[#9E5D4E] transition-colors"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#3E2723] truncate">
                        {rel.name}
                      </p>
                      <p className="text-[11px] text-[#8C7A74]">
                        Starting at ₹{rel.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
