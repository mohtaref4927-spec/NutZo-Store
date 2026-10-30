import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext.js';
import { SplashLoader } from './components/SplashLoader.js';
import { OrangeBackgroundDecor } from './components/OrangeBackgroundDecor.js';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { ProductsSection } from './components/ProductsSection.js';
import { CategoriesSection } from './components/CategoriesSection.js';
import { ReviewsSection } from './components/ReviewsSection.js';
import { BankTransferView } from './components/BankTransferView.js';
import { FaqSection } from './components/FaqSection.js';
import { Footer } from './components/Footer.js';
import { CartDrawer } from './components/CartDrawer.js';
import { ProductDetailsModal } from './components/ProductDetailsModal.js';
import { DiscordCheckoutModal } from './components/DiscordCheckoutModal.js';
import { HowToOrderModal } from './components/HowToOrderModal.js';
import { SettingsRightDrawer } from './components/SettingsRightDrawer.js';
import { AdminLoginModal } from './components/AdminLoginModal.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { AddReviewModal } from './components/AddReviewModal.js';
import { VisualEditorToolbar } from './components/VisualEditorToolbar.js';

const MainLayout: React.FC = () => {
  const { activePage, settings } = useStore();
  const [splashFinished, setSplashFinished] = useState(() => {
    // Only show splash on fresh session load
    return sessionStorage.getItem('nutzo_splash_shown') === 'true';
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('nutzo_splash_shown', 'true');
    setSplashFinished(true);
  };

  return (
    <>
      {/* 1. Fast Smooth Startup Splash Loader */}
      {!splashFinished && (
        <SplashLoader
          onComplete={handleSplashComplete}
          logoUrl={settings?.logoUrl}
          storeName={settings?.storeName}
        />
      )}

      {/* 2. Floating Orange Geometric Backdrop Decor */}
      <OrangeBackgroundDecor />

      {/* 3. Live Visual Drag & In-Place Editor Bar (if active) */}
      <VisualEditorToolbar />

      {/* 4. Storefront App Interface */}
      <div className="relative z-10 min-h-screen flex flex-col font-['Cairo',sans-serif]" dir="rtl">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Multi-Page Router */}
        <main className="flex-1">
          {activePage === 'home' && (
            <>
              <Hero />
              <ProductsSection />
              <FaqSection />
            </>
          )}

          {activePage === 'products' && <ProductsSection />}

          {activePage === 'categories' && <CategoriesSection />}

          {activePage === 'reviews' && <ReviewsSection />}

          {activePage === 'bank_transfer' && <BankTransferView />}

          {activePage === 'faq' && <FaqSection />}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* 5. Modals and Slide-Over Drawers */}
      <CartDrawer />
      <ProductDetailsModal />
      <DiscordCheckoutModal />
      <HowToOrderModal />
      <SettingsRightDrawer />
      <AdminLoginModal />
      <AdminDashboard />
      <AddReviewModal />
    </>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
