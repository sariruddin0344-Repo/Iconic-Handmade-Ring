import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { RingProduct, CartItem } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InteractiveConfigurator } from './components/InteractiveConfigurator';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AtelierStory } from './components/AtelierStory';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Loading state for initial luxury prelude
  const [isLoading, setIsLoading] = useState(true);

  // E-Commerce state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentCurrency, setCurrentCurrency] = useState<string>('USD');

  // Modals and Drawers
  const [selectedProduct, setSelectedProduct] = useState<RingProduct | null>(null);
  const [modalInitial3D, setModalInitial3D] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Initial luxury load simulation (subtle 800ms fade)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[],
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOrderComplete = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  // Section navigation
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openQuickView = (product: RingProduct) => {
    setSelectedProduct(product);
    setModalInitial3D(false);
  };

  const openIn3D = (product: RingProduct) => {
    setSelectedProduct(product);
    setModalInitial3D(true);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#08080a] text-[#e4e4e7] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#fff8e7]">
      {/* Professional Initial Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#08080a] flex flex-col items-center justify-center transition-opacity duration-500">
          <div className="relative flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full border border-[#d4af37]/40 border-t-[#d4af37] animate-spin" />
            <div className="text-center">
              <span className="font-display text-xl font-bold tracking-[0.3em] text-white block">
                ICONIC
              </span>
              <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase">
                Handmade Ring · Paris
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentCurrency={currentCurrency}
        onSelectCurrency={setCurrentCurrency}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Cinematic 3D Hero Section */}
        <HeroSection
          onExploreConfigurator={() => handleNavigateSection('atelier-configurator')}
          onExploreCollection={() => handleNavigateSection('collections')}
          onSelectProductFor3D={(id) => {
            const p = PRODUCTS.find((item) => item.id === id);
            if (p) openIn3D(p);
          }}
        />

        {/* 2. Interactive 3D Ring Atelier Configurator */}
        <InteractiveConfigurator
          onAddToCart={handleAddToCart}
          currentCurrency={currentCurrency}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        />

        {/* 3. Featured Permanent Collection Catalog Grid */}
        <ProductGrid
          products={PRODUCTS}
          currentCurrency={currentCurrency}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={openQuickView}
          onOpenIn3D={openIn3D}
        />

        {/* 4. Atelier Craftsmanship Story */}
        <AtelierStory />

        {/* 5. Collector Perspectives & Press Accolades */}
        <ReviewsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        initialShow3D={modalInitial3D}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        currentCurrency={currentCurrency}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        currentCurrency={currentCurrency}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderComplete={handleOrderComplete}
        currentCurrency={currentCurrency}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={PRODUCTS}
        onRemoveFromWishlist={handleToggleWishlist}
        onViewProduct={openQuickView}
        currentCurrency={currentCurrency}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={openQuickView}
        currentCurrency={currentCurrency}
      />
    </div>
  );
}
