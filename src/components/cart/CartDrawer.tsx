import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Cake } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl border-l border-[#EBDCCB] flex flex-col z-10"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EBDCCB] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FCEEEB] text-[#9E5D4E] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#3E2723]">Your Bakery Bag</h2>
              <p className="text-xs text-[#8C7A74]">
                {items.length === 0 ? 'Empty bag' : `${items.length} unique treat${items.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#8C7A74] hover:text-[#3E2723] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        {items.length > 0 && (
          <div className="bg-[#FDFBF7] px-5 py-3 border-b border-[#EBDCCB] text-xs">
            {amountNeededForFreeDelivery > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#735D54]">
                  <span>Add <strong>₹{amountNeededForFreeDelivery}</strong> more for <strong>Free Delivery!</strong></span>
                  <span>{Math.round((subtotal / freeDeliveryThreshold) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EBDCCB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#9E5D4E] transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#4E6E49] font-medium">
                <Sparkles className="w-4 h-4 text-[#5B7B56]" />
                <span>Congratulations! You qualify for <strong>FREE Doorstep Delivery</strong> 🚚✨</span>
              </div>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-24 h-24 rounded-full bg-[#FCEEEB] flex items-center justify-center shadow-inner">
                <span className="text-5xl select-none">🧁</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#3E2723]">
                  Your cart is waiting for something sweet!
                </h3>
                <p className="text-xs text-[#735D54] max-w-xs">
                  Discover our handmade sponge cakes, flaky croissants, and decadent brownies baked fresh daily.
                </p>
              </div>

              <button
                onClick={() => {
                  closeCart();
                  onContinueShopping();
                }}
                className="px-6 py-3 rounded-full bg-[#9E5D4E] text-white font-semibold text-xs hover:bg-[#85473A] shadow-xs transition-colors"
              >
                Explore Delicious Treats
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-[#EBDCCB] shadow-xs flex gap-3.5"
              >
                {/* Thumbnail */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover bg-[#F5EBE1] shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif font-bold text-sm text-[#3E2723] truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                        className="text-[#A89891] hover:text-[#9E5D4E] transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Customization pills */}
                    <div className="flex flex-wrap gap-1 mt-1 text-[11px] text-[#735D54]">
                      <span className="px-1.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EBDCCB]">
                        {item.customization.size}
                      </span>
                      {item.customization.flavour && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EBDCCB]">
                          {item.customization.flavour}
                        </span>
                      )}
                    </div>

                    {/* Custom Message note if present */}
                    {item.customization.customMessage && (
                      <p className="text-[10px] text-[#9E5D4E] italic mt-1 truncate">
                        Message: “{item.customization.customMessage}”
                      </p>
                    )}
                  </div>

                  {/* Pricing and Quantity */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#FAF7F2]">
                    <span className="text-sm font-bold text-[#3E2723]">
                      ₹{item.unitPrice * item.quantity}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center bg-[#FAF7F2] border border-[#EBDCCB] rounded-xl p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-[#3E2723] hover:bg-[#FCEEEB] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-[#3E2723]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-[#3E2723] hover:bg-[#FCEEEB] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-[#EBDCCB] space-y-3">
            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs text-[#735D54]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#3E2723]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery Fee</span>
                <span className="font-semibold text-[#3E2723]">
                  {deliveryFee === 0 ? (
                    <span className="text-[#5B7B56]">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#5B7B56]">
                  <span>Celebration Promo (Orders above ₹1500)</span>
                  <span className="font-semibold">-₹{discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#FAF7F2] flex justify-between text-base font-bold text-[#3E2723]">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                id="cart-proceed-checkout-btn"
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  closeCart();
                  onContinueShopping();
                }}
                className="w-full py-2.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#4A352F] text-xs font-semibold border border-[#EBDCCB] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
