import React from 'react';
import { RingProduct } from '../types';
import { CURRENCY_MAP } from '../data/products';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: RingProduct[];
  onRemoveFromWishlist: (id: string) => void;
  onViewProduct: (product: RingProduct) => void;
  currentCurrency: string;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onRemoveFromWishlist,
  onViewProduct,
  currentCurrency,
}) => {
  if (!isOpen) return null;

  const currencyInfo = CURRENCY_MAP[currentCurrency] || CURRENCY_MAP.USD;
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0e12] border-l border-white/10 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#121217]">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
              <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                Saved Creations ({wishlistedProducts.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Heart className="w-10 h-10 text-zinc-600 mx-auto stroke-1" />
                <h4 className="font-display text-base font-medium text-white">
                  No saved creations yet
                </h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Click the heart icon on any ring in the collection to curate your personal wishlist.
                </p>
              </div>
            ) : (
              wishlistedProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-4 p-4 rounded-xl bg-[#14141a] border border-white/5 relative group"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-display text-xs font-semibold text-white truncate">
                          {p.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveFromWishlist(p.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{p.subtitle}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="font-display text-xs font-semibold text-white tabular-nums">
                        {currencyInfo.symbol}
                        {Math.round(p.priceUSD * currencyInfo.rate).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onViewProduct(p);
                          onClose();
                        }}
                        className="text-xs text-[#d4af37] hover:text-white uppercase tracking-wider font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
