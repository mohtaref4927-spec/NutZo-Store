import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import type { ActivePage } from '../types/store.js';
import { ShoppingBag, Settings, MessageSquare, Menu, X, ExternalLink, CreditCard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cartCount,
    setIsCartOpen,
    setIsSettingsDrawerOpen,
    settings,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'products', label: 'المنتجات' },
    { id: 'categories', label: 'التصنيفات' },
    { id: 'reviews', label: 'التقييمات' },
    { id: 'bank_transfer', label: 'طرق الدفع' },
    { id: 'faq', label: 'الأسئلة الشائعة' },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const discordUrl = settings?.discordUrl || 'https://discord.gg/nutzo';
  const logoUrl = settings?.logoUrl || '/src/assets/images/nutzo_squirrel_logo_1793324006358.jpg';
  const storeName = settings?.storeName || 'NUTZO STORE';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-orange-500/20 bg-[#140600]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none"
        >
          <div className="relative w-9 h-9 rounded-xl overflow-hidden p-0.5 bg-gradient-to-tr from-orange-600 to-amber-400 shadow-md shadow-orange-950/60 border border-orange-400/40 group-hover:scale-105 transition-transform duration-200">
            <img
              src={logoUrl}
              alt={storeName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base md:text-lg tracking-wide bg-gradient-to-r from-amber-200 via-orange-300 to-amber-100 bg-clip-text text-transparent font-['Plus_Jakarta_Sans',sans-serif]">
              {storeName}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-orange-600/30 text-amber-200 border border-orange-500/40 shadow-sm shadow-orange-950/40'
                    : 'text-orange-200/75 hover:text-white hover:bg-orange-950/40'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls (Discord, Cart, Settings) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Discord Server Link Button */}
          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-indigo-200 border border-[#5865F2]/40 transition-all hover:scale-[1.02] shadow-sm cursor-pointer whitespace-nowrap"
            title="سيرفر الديسكورد"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>سيرفر الديسكورد</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2 rounded-lg text-xs font-medium text-amber-100 bg-orange-950/40 hover:bg-orange-900/50 border border-orange-500/30 transition-all hover:scale-105 cursor-pointer shadow-sm"
            aria-label="سلة المشتريات"
            title="سلة المشتريات"
          >
            <ShoppingBag className="w-4 h-4 text-orange-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 rounded-full px-1 shadow-md shadow-orange-950/80 animate-pulse-subtle">
                {cartCount}
              </span>
            )}
          </button>

          {/* Settings Drawer Button */}
          <button
            onClick={() => setIsSettingsDrawerOpen(true)}
            className="flex items-center justify-center p-2 rounded-lg text-xs font-medium text-orange-200/80 hover:text-white bg-orange-950/30 hover:bg-orange-900/40 border border-orange-500/20 transition-all hover:scale-105 cursor-pointer"
            aria-label="الإعدادات"
            title="الإعدادات"
          >
            <Settings className="w-4 h-4 text-orange-300" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-orange-200 hover:text-white bg-orange-950/40 border border-orange-500/30 cursor-pointer"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-orange-500/20 bg-[#160600]/98 px-4 py-4 space-y-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg text-center transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-orange-600/30 text-amber-200 border border-orange-500/40'
                      : 'text-orange-200/80 bg-orange-950/30 hover:bg-orange-900/40'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-orange-900/40 flex flex-col gap-2">
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-indigo-200 bg-[#5865F2]/20 border border-[#5865F2]/40 rounded-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>الانضمام إلى سيرفر الديسكورد</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
