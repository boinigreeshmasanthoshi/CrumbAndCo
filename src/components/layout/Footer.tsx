import React from 'react';
import { Cake, Instagram, Facebook, MessageCircle, Heart, ShieldCheck, Clock, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenOwnerLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenOwnerLogin }) => {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-[#F5EBE1] border-t border-[#E8DACB] text-[#4A352F] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E0CFBF]">
          {/* Brand Col (2 cols wide on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FCEEEB] flex items-center justify-center border border-[#F7D6D0]">
                <Cake className="w-5 h-5 text-[#9E5D4E]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#3E2723]">
                Crumb & Co.
              </span>
            </div>

            <p className="font-serif italic text-lg text-[#6E4F44]">
              “A little crumb of happiness in every bite.”
            </p>

            <p className="text-sm text-[#735D54] leading-relaxed max-w-sm">
              Freshly baked artisanal cakes, pastries, cupcakes, and handcrafted celebratory centrepieces made with pure French butter, Belgian couverture, and organic Madagascar vanilla.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/80 border border-[#E0CFBF] flex items-center justify-center text-[#6E4F44] hover:text-[#9E5D4E] hover:bg-[#FCEEEB] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/80 border border-[#E0CFBF] flex items-center justify-center text-[#6E4F44] hover:text-[#9E5D4E] hover:bg-[#FCEEEB] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-white/80 border border-[#E0CFBF] flex items-center justify-center text-[#6E4F44] hover:text-[#9E5D4E] hover:bg-[#FCEEEB] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#3E2723] tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#735D54]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#9E5D4E] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-[#9E5D4E] transition-colors">
                  Menu & Treats
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#9E5D4E] transition-colors">
                  About Our Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom-cakes')} className="hover:text-[#9E5D4E] transition-colors">
                  Custom Cakes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reviews')} className="hover:text-[#9E5D4E] transition-colors">
                  Customer Reviews
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#9E5D4E] transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#3E2723] tracking-wide">
              Bakehouse Menu
            </h4>
            <ul className="space-y-2 text-sm text-[#735D54]">
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-[#9E5D4E] transition-colors">
                  🎂 Birthday Cakes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-[#9E5D4E] transition-colors">
                  🍰 Baked Cheesecakes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-[#9E5D4E] transition-colors">
                  🧁 Floral Cupcakes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-[#9E5D4E] transition-colors">
                  🍪 Chunky Brookies & Cookies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-[#9E5D4E] transition-colors">
                  🥐 Flaky Butter Pastries
                </button>
              </li>
            </ul>
          </div>

          {/* Store Hours & Location */}
          <div className="space-y-3 text-sm text-[#735D54]">
            <h4 className="font-serif text-base font-semibold text-[#3E2723] tracking-wide">
              Bakehouse Atelier
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#9E5D4E] shrink-0 mt-0.5" />
              <span>42 Blossom Lane, Indiranagar, Bengaluru, 560038</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#9E5D4E] shrink-0" />
              <span>Tue – Sun: 8:00 AM – 10:00 PM</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#9E5D4E] shrink-0" />
              <span>+91 98201 44521</span>
            </div>
          </div>
        </div>

        {/* Bottom bar with discreet Owner Login */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7A74]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Crumb & Co. Patisserie. All rights reserved. Handcrafted with love.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:underline">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('about')} className="hover:underline">
              Terms & Conditions
            </button>

            {/* Discreet Owner Login */}
            <button
              id="footer-owner-login-btn"
              onClick={onOpenOwnerLogin}
              className="inline-flex items-center gap-1.5 text-[#8C7A74] hover:text-[#3E2723] transition-colors py-1 px-2.5 rounded-md hover:bg-white/60 border border-transparent hover:border-[#E0CFBF]"
              title="Bakery Administrator Access"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#9E5D4E]" />
              <span>{isAdmin ? 'Admin Dashboard' : 'Owner Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
