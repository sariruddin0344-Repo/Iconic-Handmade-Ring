import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, Menu, X } from 'lucide-react';
import { CURRENCY_MAP } from '../data/products';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  currentCurrency: string;
  onSelectCurrency: (curr: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  currentCurrency,
  onSelectCurrency,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const navLinks = [
    { label: 'Collections', id: 'collections' },
    { label: '3D Atelier', id: 'atelier-configurator' },
    { label: 'Craftsmanship', id: 'craftsmanship' },
    { label: 'Testimonials', id: 'testimonials' },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08080a]/85 backdrop-blur-md border-b border-white/10 transition-colors duration-200">
      {/* Top Bar Announcement */}
      <div className="bg-[#121216] border-b border-white/5 py-1.5 px-4 text-center text-[11px] tracking-widest uppercase text-zinc-400">
        <span>Complimentary insured worldwide courier shipping & bespoke signature gift box</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex flex-col shrink-0"
        >
          <span className="font-display text-xl sm:text-2xl font-bold tracking-[0.25em] text-white group-hover:text-[#d4af37] transition-colors">
            ICONIC
          </span>
          <span className="text-[9px] tracking-[0.35em] text-zinc-400 uppercase -mt-0.5">
            Handmade Ring
          </span>
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-zinc-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="hover:text-white transition-colors relative py-1 text-xs uppercase tracking-widest after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d4af37] hover:after:w-full after:transition-all cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions (Currency, Search, Wishlist, Bag) */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white px-2 py-1 transition-colors flex items-center gap-1"
            >
              <span>{currentCurrency}</span>
            </button>
            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-[#121217] border border-white/10 rounded-md shadow-2xl py-1 z-50">
                {Object.keys(CURRENCY_MAP).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => {
                      onSelectCurrency(curr);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      currentCurrency === curr
                        ? 'text-[#d4af37] bg-white/5 font-semibold'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {CURRENCY_MAP[curr].label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search Collection"
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Trigger */}
          <button
            type="button"
            onClick={onOpenWishlist}
            aria-label="View Wishlist"
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-[#d4af37] text-black rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Open Shopping Bag"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white rounded-md border border-white/10 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden sm:inline">Bag</span>
            <span className="text-[11px] font-semibold text-[#d4af37] tabular-nums">
              ({cartCount})
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0c0c10] px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-left py-2 text-sm uppercase tracking-widest text-zinc-300 hover:text-[#d4af37] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>Currency:</span>
            <div className="flex gap-2">
              {Object.keys(CURRENCY_MAP).map((curr) => (
                <button
                  key={curr}
                  onClick={() => onSelectCurrency(curr)}
                  className={`px-2 py-1 rounded ${
                    currentCurrency === curr ? 'bg-[#d4af37] text-black font-bold' : 'text-zinc-300'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
