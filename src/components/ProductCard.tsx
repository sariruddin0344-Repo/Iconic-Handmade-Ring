import React, { useState } from 'react';
import { RingProduct } from '../types';
import { CURRENCY_MAP } from '../data/products';
import { Eye, Heart, Sparkles, Box } from 'lucide-react';

interface ProductCardProps {
  product: RingProduct;
  currentCurrency: string;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onQuickView: (product: RingProduct) => void;
  onOpenIn3D: (product: RingProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentCurrency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onOpenIn3D,
}) => {
  const [imageError, setImageError] = useState(false);
  const currencyInfo = CURRENCY_MAP[currentCurrency] || CURRENCY_MAP.USD;
  const formattedPrice = `${currencyInfo.symbol}${Math.round(product.priceUSD * currencyInfo.rate).toLocaleString()}`;

  return (
    <article className="group relative flex flex-col bg-[#101014] rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1">
      {/* Image Showcase Container */}
      <div className="relative aspect-[4/3] w-full bg-[#141418] overflow-hidden flex items-center justify-center">
        {/* Product Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 text-[10px] tracking-widest uppercase font-medium text-zinc-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-black/50 text-zinc-300 hover:text-white hover:bg-black/80'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-black' : ''}`} />
        </button>

        {/* Fallback container if image fails to load */}
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181820] to-[#0c0c10]">
            <Sparkles className="w-8 h-8 text-[#d4af37] mb-2" />
            <span className="text-xs uppercase tracking-wider text-zinc-300 font-medium">
              {product.name}
            </span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        )}

        {/* Floating Quick Action Overlay on Desktop Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="px-4 py-2 bg-white/90 hover:bg-white text-black text-xs font-semibold uppercase tracking-wider rounded backdrop-blur-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenIn3D(product)}
            className="px-4 py-2 bg-black/80 hover:bg-black text-[#d4af37] border border-[#d4af37]/60 text-xs font-semibold uppercase tracking-wider rounded backdrop-blur-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Box className="w-3.5 h-3.5" />
            <span>View 3D</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed subtle category & origin */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 uppercase tracking-wider mb-1.5 font-light">
            <span>Handmade</span>
            <span aria-hidden="true">·</span>
            <span>Paris Atelier</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-display text-base font-semibold text-white group-hover:text-[#d4af37] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 font-light leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Price & Primary CTA */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="font-display text-base font-bold text-white tabular-nums">
            {formattedPrice}
          </span>

          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="text-xs text-[#d4af37] hover:text-white uppercase tracking-wider font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Configure</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </article>
  );
};
