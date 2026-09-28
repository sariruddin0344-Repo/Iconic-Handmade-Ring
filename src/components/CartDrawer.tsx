import React, { useState } from 'react';
import { CartItem } from '../types';
import { CURRENCY_MAP } from '../data/products';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, Plus, Minus } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  currentCurrency: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  currentCurrency,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const currencyInfo = CURRENCY_MAP[currentCurrency] || CURRENCY_MAP.USD;

  const rawSubtotalUSD = cart.reduce((sum, item) => sum + item.priceUSD * item.quantity, 0);
  const discountUSD = rawSubtotalUSD * (discountPercent / 100);
  const finalSubtotalUSD = Math.max(0, rawSubtotalUSD - discountUSD);

  const formattedSubtotal = `${currencyInfo.symbol}${Math.round(finalSubtotalUSD * currencyInfo.rate).toLocaleString()}`;
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ICONIC10') {
      setDiscountPercent(10);
      setPromoMessage({ text: '10% Haute Joaillerie Privilege Applied' });
    } else if (promoCode.trim().toUpperCase() === 'VIP20') {
      setDiscountPercent(20);
      setPromoMessage({ text: '20% Atelier Collector Privilege Applied' });
    } else {
      setPromoMessage({ text: 'Invalid invitation code. Try "ICONIC10"', error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0e12] border-l border-white/10 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#121217]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                Your Shopping Bag ({totalItemCount})
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

          {/* Complimentary Shipping Banner */}
          <div className="bg-[#181820] py-2 px-6 border-b border-white/5 text-[11px] text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#d4af37]">
              <ShieldCheck className="w-3.5 h-3.5" /> Worldwide Insured Express
            </span>
            <span className="font-medium text-white">Complimentary</span>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto stroke-1" />
                <h4 className="font-display text-base font-medium text-white">
                  Your bag is currently empty
                </h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Explore our handcrafted collections or design your custom ring in the 3D Atelier.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs uppercase tracking-wider font-semibold rounded"
                >
                  Discover Creations
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPriceFormatted = `${currencyInfo.symbol}${Math.round(item.priceUSD * currencyInfo.rate).toLocaleString()}`;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl bg-[#14141a] border border-white/5 relative group"
                  >
                    {/* Ring Thumbnail */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display text-xs font-semibold text-white truncate">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-zinc-400 space-y-0.5 mt-0.5">
                          <p className="capitalize">
                            Alloy: <span className="text-zinc-200">{item.metal}</span> · Gem: <span className="text-zinc-200">{item.gem}</span>
                          </p>
                          <p>
                            Size: <span className="text-zinc-200">US {item.size}</span>
                          </p>
                          {item.engraving && (
                            <p className="font-serif-luxury italic text-[#d4af37]">
                              &ldquo;{item.engraving}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/5">
                        <div className="flex items-center gap-1 bg-black/40 rounded border border-white/5 p-0.5 text-xs">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-display text-xs font-semibold text-white tabular-nums">
                          {itemPriceFormatted}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Module */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#121217] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Invitation Code (e.g. ICONIC10)"
                    className="w-full pl-8 pr-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37] uppercase tracking-wider"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <div
                  className={`text-[11px] ${
                    promoMessage.error ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {promoMessage.text}
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Bag Subtotal:</span>
                  <span className="text-white tabular-nums">
                    {currencyInfo.symbol}
                    {Math.round(rawSubtotalUSD * currencyInfo.rate).toLocaleString()}
                  </span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Privilege Discount ({discountPercent}%):</span>
                    <span className="tabular-nums">
                      -{currencyInfo.symbol}
                      {Math.round(discountUSD * currencyInfo.rate).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Courier Shipping:</span>
                  <span className="text-[#d4af37]">Complimentary</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-semibold text-white">
                  <span>Estimated Total:</span>
                  <span className="font-display text-base text-[#d4af37] tabular-nums">
                    {formattedSubtotal}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#b38e28] hover:brightness-110 active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-widest rounded-md shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
