import React, { useState, useMemo } from 'react';
import { RingProduct } from '../types';
import { CURRENCY_MAP } from '../data/products';
import { X, Search, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: RingProduct[];
  onSelectProduct: (product: RingProduct) => void;
  currentCurrency: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  currentCurrency,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const currencyInfo = CURRENCY_MAP[currentCurrency] || CURRENCY_MAP.USD;

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q) ||
        p.availableMetals.some((m) => m.toLowerCase().includes(q)),
    );
  }, [query, products]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#111116] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#141419]">
          <Search className="w-5 h-5 text-[#d4af37] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rings by name, metal (platinum, gold), or silhouette..."
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-zinc-500"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-xs text-zinc-500">
              No handcrafted creations match &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-16 h-16 rounded-lg object-cover bg-black/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#d4af37] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{prod.style}</span>
                  </div>
                  <h4 className="font-display text-sm font-semibold text-white truncate">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate">{prod.subtitle}</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-sm font-bold text-white tabular-nums">
                    {currencyInfo.symbol}
                    {Math.round(prod.priceUSD * currencyInfo.rate).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
