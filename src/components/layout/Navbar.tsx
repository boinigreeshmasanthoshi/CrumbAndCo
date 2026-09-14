import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, User as UserIcon, Menu as MenuIcon, X, Cake, Sparkles, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAccount }) => {
  const { totalItemsCount, openCart } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'Menu', view: 'menu' },
    { label: 'About Us', view: 'about' },
    { label: 'Custom Cakes', view: 'custom-cakes' },
    { label: 'Reviews', view: 'reviews' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBDCCB]/70 transition-all">
      {/* Top micro-announcement bar */}
      <div className="bg-[#FCEEEB] text-[#4A352F] py-1.5 px-4 text-xs tracking-wide text-center font-medium border-b border-[#F7D6D0]/50 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#E8976C]" />
        <span>Freshly baked every morning! Free doorstep delivery on orders above ₹999</span>
        <span className="hidden sm:inline text-[#E8976C]">•</span>
        <span className="hidden sm:inline font-semibold">Use code SWEET100 for ₹100 off above ₹1500</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FCEEEB] to-[#FED7AA] flex items-center justify-center shadow-sm border border-[#F7D6D0] group-hover:scale-105 transition-transform duration-200">
            <Cake className="w-6 h-6 text-[#9E5D4E]" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#3E2723] block leading-none">
              Crumb & Co.
            </span>
            <span className="text-[11px] font-medium text-[#8C7A74] tracking-wider uppercase block mt-1">
              Artisan Patisserie
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map(item => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#FCEEEB] text-[#3E2723] shadow-xs'
                    : 'text-[#5C453E] hover:text-[#2B1810] hover:bg-[#F5EBE1]/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart Trigger */}
          <button
            id="nav-cart-button"
            onClick={openCart}
            aria-label="Shopping Cart"
            className="relative p-2.5 rounded-full bg-white text-[#3E2723] hover:bg-[#FCEEEB] border border-[#EBDCCB] shadow-xs hover:shadow-sm transition-all focus:outline-none"
          >
            <ShoppingBag className="w-5 h-5 text-[#4A352F]" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#E8976C] text-white text-[11px] font-bold flex items-center justify-center shadow-xs animate-scale">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Account Trigger */}
          <button
            id="nav-account-button"
            onClick={onOpenAccount}
            aria-label="User Account"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#EBDCCB] text-[#3E2723] text-sm font-medium shadow-xs transition-all"
          >
            <UserIcon className="w-4 h-4 text-[#4A352F]" />
            <span className="hidden sm:inline">
              {isAuthenticated ? (user?.name?.split(' ')[0] || 'Account') : 'Sign In'}
            </span>
            {isAdmin && (
              <span className="hidden lg:inline text-[10px] bg-[#E2ECE0] text-[#4E6E49] px-2 py-0.5 rounded-full font-semibold">
                Owner
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2.5 rounded-full bg-white border border-[#EBDCCB] text-[#3E2723] hover:bg-[#F5EBE1] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#FAF7F2] border-b border-[#EBDCCB] px-4 pt-2 pb-6 space-y-2 shadow-lg"
          >
            {navItems.map(item => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentView === item.view
                    ? 'bg-[#FCEEEB] text-[#3E2723] font-semibold'
                    : 'text-[#5C453E] hover:bg-[#F5EBE1]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-[#EBDCCB]/60 flex justify-between items-center px-2 text-xs text-[#8C7A74]">
              <span className="italic">“A little crumb of happiness”</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAccount();
                }}
                className="text-[#9E5D4E] font-semibold underline"
              >
                {isAuthenticated ? 'Manage Account' : 'Customer Login'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
