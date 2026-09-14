import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, MessageSquareHeart, Quote, Sparkles } from 'lucide-react';
import { Review } from '../../types.js';

interface CustomerReviewsSectionProps {
  reviews: Review[];
  onOpenLeaveReview: () => void;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  reviews,
  onOpenLeaveReview,
}) => {
  // Use approved reviews
  const approved = reviews.filter(r => r.isApproved);
  const displayReviews = approved.length > 0 ? approved : reviews;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance carousel smoothly
  useEffect(() => {
    if (displayReviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displayReviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayReviews.length]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? displayReviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % displayReviews.length);
  };

  const currentReview = displayReviews[currentIndex] || displayReviews[0];

  return (
    <section className="py-20 bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with overall 4.9/5 rating */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCEEEB] text-[#9E5D4E] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#E8976C]" />
            <span>Customer Love & Kind Words</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#3E2723]">
            Sweet Words From Our Customers
          </h2>

          {/* Rating badge */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-[#EBDCCB] shadow-xs">
              <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="font-bold text-[#3E2723] text-sm">4.9 / 5</span>
            </div>
            <span className="text-xs text-[#735D54] font-medium">
              Loved by <strong>500+ happy celebrators</strong>
            </span>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-3xl mx-auto">
          {/* Carousel Slide Card */}
          <div className="relative min-h-[280px] sm:min-h-[240px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentReview && (
                <motion.div
                  key={currentReview.id}
                  initial={{ opacity: 0, x: 25, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -25, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#EBDCCB] shadow-md relative flex flex-col justify-between"
                >
                  <Quote className="absolute top-6 right-6 w-10 h-10 text-[#FCEEEB] stroke-1" />

                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      {[...Array(currentReview.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    {/* Review Quote */}
                    <p className="font-serif italic text-lg sm:text-xl text-[#3E2723] leading-relaxed">
                      “{currentReview.comment}”
                    </p>
                  </div>

                  {/* Reviewer Meta */}
                  <div className="pt-6 mt-6 border-t border-[#F5EBE1] flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      {currentReview.avatar ? (
                        <img
                          src={currentReview.avatar}
                          alt={currentReview.customerName}
                          className="w-11 h-11 rounded-full object-cover border border-[#F7D6D0]"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#FCEEEB] text-[#9E5D4E] font-bold flex items-center justify-center text-sm">
                          {currentReview.customerName.charAt(0)}
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-sm text-[#3E2723]">
                          — {currentReview.customerName}
                        </h4>
                        <p className="text-xs text-[#8C7A74]">
                          Ordered: <span className="font-medium text-[#5C453E]">{currentReview.productName}</span>
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-[#A89891]">
                      {currentReview.date}
                    </span>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous review"
                className="w-10 h-10 rounded-full bg-white border border-[#EBDCCB] text-[#3E2723] hover:bg-[#FCEEEB] flex items-center justify-center shadow-xs transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next review"
                className="w-10 h-10 rounded-full bg-white border border-[#EBDCCB] text-[#3E2723] hover:bg-[#FCEEEB] flex items-center justify-center shadow-xs transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {displayReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? 'w-6 bg-[#9E5D4E]' : 'w-2 bg-[#E0CFBF]'
                  }`}
                />
              ))}
            </div>

            {/* Leave a review button */}
            <button
              onClick={onOpenLeaveReview}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FCEEEB] hover:bg-[#F9DED7] text-[#9E5D4E] text-xs font-semibold border border-[#F7D6D0] transition-colors shadow-xs"
            >
              <MessageSquareHeart className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
