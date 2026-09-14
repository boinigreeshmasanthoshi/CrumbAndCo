import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Star, Sparkles, MessageSquareHeart, Upload } from 'lucide-react';
import { Product } from '../../types.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onReviewSubmitted?: () => void;
}

export const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  isOpen,
  onClose,
  products,
  onReviewSubmitted,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [comment, setComment] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) {
      showToast('Please provide your name and review thoughts.', 'error');
      return;
    }

    const selectedProduct = products.find(p => p.id === productId);
    const productName = selectedProduct ? selectedProduct.name : 'Artisanal Cake';

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          rating,
          comment,
          productId,
          productName,
          avatar: avatar || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      showToast('Thank you for your sweet words! Review posted 💕', 'success');
      onReviewSubmitted?.();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Could not submit review.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#FAF7F2] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#EBDCCB] relative p-6 sm:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-[#8C7A74] hover:text-[#3E2723] p-1.5 rounded-full hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#FCEEEB] text-[#9E5D4E] flex items-center justify-center mx-auto text-xl shadow-xs">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#3E2723]">
            Share Your Sweet Experience
          </h2>
          <p className="text-xs text-[#735D54]">
            How did your treat taste? Your kind words brighten our bakers' mornings!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star rating selector */}
          <div className="flex flex-col items-center gap-1.5 py-2">
            <span className="text-xs font-semibold text-[#4A352F]">Tap to Rate:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        isFilled
                          ? 'fill-[#F59E0B] text-[#F59E0B]'
                          : 'text-[#D4BDB0]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-[11px] font-bold text-[#9E5D4E]">
              {rating === 5 ? 'Heavenly! (5 Stars)' : `${rating} Stars`}
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#4A352F]">Which Treat Did You Enjoy?</label>
            <select
              value={productId}
              onChange={e => setProductId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#4A352F]">Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Sneha Patel"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#4A352F]">Your Review & Tasting Notes</label>
            <textarea
              required
              rows={3}
              placeholder="“The cake was moist, perfectly balanced in sweetness, and the Belgian chocolate ganache was silky smooth...”"
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Posting...' : 'Post Sweet Review'}</span>
          </button>

        </form>
      </motion.div>
    </div>
  );
};
