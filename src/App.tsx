import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { HomePage } from './components/pages/HomePage.js';
import { MenuPage } from './components/shop/MenuPage.js';
import { CustomCakePage } from './components/custom/CustomCakePage.js';
import { AboutPage } from './components/pages/AboutPage.js';
import { ContactPage } from './components/pages/ContactPage.js';
import { CheckoutPage } from './components/checkout/CheckoutPage.js';
import { OrderConfirmation } from './components/checkout/OrderConfirmation.js';
import { AccountPage } from './components/account/AccountPage.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { ProductDetailModal } from './components/shop/ProductDetailModal.js';
import { CartDrawer } from './components/cart/CartDrawer.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { LeaveReviewModal } from './components/reviews/LeaveReviewModal.js';
import { Product, ProductCategory, Review, Order } from './types.js';
import { useAuth } from './context/AuthContext.js';
import { useCart } from './context/CartContext.js';

export default function App() {
  const { user } = useAuth();
  const { openCart } = useCart();

  // Navigation page state
  const [currentPage, setCurrentPage] = useState<
    'home' | 'menu' | 'custom-cakes' | 'about' | 'contact' | 'checkout' | 'confirmation' | 'account' | 'admin'
  >('home');

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Modals
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchReviews();
  }, []);

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch {
      // ignore
    }
  };

  const handleNavigate = (page: string, category?: ProductCategory) => {
    if (page === 'menu') {
      setSelectedCategory(category || 'All');
    }
    setCurrentPage(page as any);
  };

  const handleOrderPlaced = (order: Order) => {
    setRecentOrder(order);
    setCurrentPage('confirmation');
  };

  const handleSelectOrderForTracking = (order: Order) => {
    setRecentOrder(order);
    setCurrentPage('confirmation');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#3E2723] font-sans antialiased selection:bg-[#FCEEEB] selection:text-[#9E5D4E]">
      
      {/* Top Navigation */}
      <Navbar
        activePage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            products={products}
            reviews={reviews}
            onSelectProduct={setActiveProduct}
            onNavigateMenu={(cat) => handleNavigate('menu', cat)}
            onOpenLeaveReview={() => setIsReviewModalOpen(true)}
            onCustomCakes={() => handleNavigate('custom-cakes')}
          />
        )}

        {currentPage === 'menu' && (
          <MenuPage
            products={products}
            onSelectProduct={setActiveProduct}
            initialCategory={selectedCategory}
          />
        )}

        {currentPage === 'custom-cakes' && (
          <CustomCakePage />
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onOrderPlaced={handleOrderPlaced}
            onBackToMenu={() => handleNavigate('menu')}
          />
        )}

        {currentPage === 'confirmation' && recentOrder && (
          <OrderConfirmation
            order={recentOrder}
            onReturnHome={() => handleNavigate('home')}
            onViewMenu={() => handleNavigate('menu')}
          />
        )}

        {currentPage === 'account' && (
          <AccountPage
            onSelectOrderForTracking={handleSelectOrderForTracking}
            onOpenAdminDashboard={() => handleNavigate('admin')}
            onBrowseMenu={() => handleNavigate('menu')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard
            onClose={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Footer */}
      {currentPage !== 'admin' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Product Customization & Detail Modal */}
      <ProductDetailModal
        product={activeProduct}
        allProducts={products}
        onClose={() => setActiveProduct(null)}
        onSelectRelated={(p) => setActiveProduct(p)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => handleNavigate('checkout')}
        onContinueShopping={() => handleNavigate('menu')}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          // If admin, can navigate or stay
        }}
      />

      {/* Leave Review Modal */}
      <LeaveReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        products={products}
        onReviewSubmitted={fetchReviews}
      />

    </div>
  );
}
