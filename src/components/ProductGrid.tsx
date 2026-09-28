import React, { useState, useMemo } from 'react';
import { RingProduct, MetalType } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

interface ProductGridProps {
  products: RingProduct[];
  currentCurrency: string;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onQuickView: (product: RingProduct) => void;
  onOpenIn3D: (product: RingProduct) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currentCurrency,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onOpenIn3D,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | MetalType>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filterTabs: { id: 'all' | MetalType; label: string }[] = [
    { id: 'all', label: 'All Creations' },
    { id: 'platinum', label: '950 Platinum' },
    { id: 'gold', label: '18K Yellow Gold' },
    { id: 'rosegold', label: 'Rose Gold' },
    { id: 'black', label: 'Oxidized Titanium' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedFilter !== 'all') {
      list = list.filter((p) => p.availableMetals.includes(selectedFilter));
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.priceUSD - b.priceUSD);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.priceUSD - a.priceUSD);
    }

    return list;
  }, [products, selectedFilter, sortBy]);

  return (
    <section id="collections" className="py-24 bg-[#08080a] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] text-[#d4af37] uppercase font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Permanent Collection</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Sculpted Masterpieces
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl font-light">
              Each ring is cast as a single seamless sculpture, calibrated for ergonomic comfort and
              hand-set with peerless precious stones.
            </p>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#d4af37]" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#121216] border border-white/10 text-white text-xs px-3 py-2 rounded-md focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="featured">Featured Heritage</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Interactive Segmented Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#121217] rounded-xl border border-white/10 w-fit mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md shadow-[#d4af37]/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid (3-column desktop layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currentCurrency={currentCurrency}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              onOpenIn3D={onOpenIn3D}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-[#101014] rounded-2xl border border-white/5 p-8">
            <p className="text-zinc-400 text-sm">No rings match your selected filter criteria.</p>
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className="mt-4 px-4 py-2 text-xs text-[#d4af37] border border-[#d4af37]/40 rounded hover:bg-[#d4af37]/10"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
