import React from 'react';
import { Hero } from '../home/Hero.js';
import { FeaturedSection } from '../home/FeaturedSection.js';
import { WhyChooseUs } from '../home/WhyChooseUs.js';
import { CustomerReviewsSection } from '../home/CustomerReviewsSection.js';
import { InstagramGallery } from '../home/InstagramGallery.js';
import { Product, ProductCategory, Review } from '../../types.js';

interface HomePageProps {
  products: Product[];
  reviews: Review[];
  onSelectProduct: (product: Product) => void;
  onNavigateMenu: (category?: ProductCategory) => void;
  onOpenLeaveReview: () => void;
  onCustomCakes: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  reviews,
  onSelectProduct,
  onNavigateMenu,
  onOpenLeaveReview,
  onCustomCakes,
}) => {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <Hero
        onShopCakes={() => onNavigateMenu('Birthday Cakes')}
        onExploreMenu={() => onNavigateMenu()}
      />

      {/* Featured Treats: Fresh From Our Oven */}
      <FeaturedSection
        products={products}
        onSelectProduct={onSelectProduct}
        onViewAll={() => onNavigateMenu()}
      />

      {/* Why Choose Crumb & Co */}
      <WhyChooseUs />

      {/* Bespoke Custom Cake Teaser Banner */}
      <section className="bg-gradient-to-r from-[#FCEEEB] via-[#FEF3E8] to-[#FCEEEB] py-16 border-y border-[#F5EBE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-[#EBDCCB] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9E5D4E] bg-[#FCEEEB] px-3 py-1 rounded-full">
                Custom Celebration Atelier
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#3E2723]">
                Dreaming of a Personalized Celebration Cake?
              </h3>
              <p className="text-sm text-[#735D54]">
                From vintage Lambeth multi-tiers to botanical hand-piped blooms and photo references. Let our pastry artists bake your vision.
              </p>
            </div>

            <button
              onClick={onCustomCakes}
              className="px-8 py-4 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 shrink-0 cursor-pointer"
            >
              Request Custom Cake ✨
            </button>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <CustomerReviewsSection
        reviews={reviews}
        onOpenLeaveReview={onOpenLeaveReview}
      />

      {/* Instagram Gallery */}
      <InstagramGallery />
    </div>
  );
};
