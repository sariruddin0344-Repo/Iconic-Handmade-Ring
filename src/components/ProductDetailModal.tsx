import React, { useState } from 'react';
import { RingProduct, MetalType, GemType, CartItem } from '../types';
import { ThreeRingViewer } from './ThreeRingViewer';
import { CURRENCY_MAP } from '../data/products';
import { X, Box, Image as ImageIcon, Sparkles, Check, Info, Shield, ShoppingBag, Truck } from 'lucide-react';

interface ProductDetailModalProps {
  product: RingProduct | null;
  initialShow3D?: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  currentCurrency: string;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialShow3D = false,
  onClose,
  onAddToCart,
  currentCurrency,
  onOpenSizeGuide,
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'photo' | '3d'>(initialShow3D ? '3d' : 'photo');
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(product.defaultMetal);
  const [selectedGem, setSelectedGem] = useState<GemType>(product.defaultGem);
  const [selectedSize, setSelectedSize] = useState<number>(7);
  const [engravingText, setEngravingText] = useState<string>('');
  const [justAdded, setJustAdded] = useState(false);

  const currencyInfo = CURRENCY_MAP[currentCurrency] || CURRENCY_MAP.USD;
  const formattedPrice = `${currencyInfo.symbol}${Math.round(product.priceUSD * currencyInfo.rate).toLocaleString()}`;

  const sizes = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13];

  const handleAdd = () => {
    const item: CartItem = {
      id: `${product.id}-${selectedMetal}-${selectedGem}-${selectedSize}-${Date.now()}`,
      productId: product.id,
      name: `${product.name}`,
      style: product.style,
      metal: selectedMetal,
      gem: selectedGem,
      size: selectedSize,
      engraving: engravingText.trim() || undefined,
      priceUSD: product.priceUSD,
      quantity: 1,
      image: product.image,
    };
    onAddToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0e0e12] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#121217]">
          <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-zinc-400">
            <span>Bespoke Atelier</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#d4af37]">{product.craftDetails.origin}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Showcase (Photo vs 3D toggle) */}
          <div className="lg:col-span-6 space-y-4">
            {/* View Switcher Controls */}
            <div className="flex items-center justify-between bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('photo')}
                className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-2 font-medium transition-all ${
                  activeTab === 'photo'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-[#d4af37]" />
                <span>Macro Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('3d')}
                className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center gap-2 font-medium transition-all ${
                  activeTab === '3d'
                    ? 'bg-[#d4af37] text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Box className="w-4 h-4" />
                <span>360° 3D Model</span>
              </button>
            </div>

            {/* Display Stage */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#141419] border border-white/10 flex items-center justify-center">
              {activeTab === 'photo' ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ThreeRingViewer
                  ringStyle={product.style}
                  metal={selectedMetal}
                  gem={selectedGem}
                  autoRotate={true}
                  height="100%"
                  className="w-full h-full"
                  showControls={true}
                />
              )}
            </div>

            {/* Craftsmanship Specs Accordion / List */}
            <div className="bg-[#121216] rounded-xl p-4 border border-white/5 space-y-2 text-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300 block mb-2">
                Atelier Specifications
              </span>
              <div className="grid grid-cols-2 gap-3 text-zinc-400">
                <div>
                  <span className="block text-[10px] text-zinc-400 uppercase">Purity:</span>
                  <span className="text-zinc-200">{product.craftDetails.metalPurity}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-400 uppercase">Band Profile:</span>
                  <span className="text-zinc-200">{product.craftDetails.bandWidth}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-400 uppercase">Finish:</span>
                  <span className="text-zinc-200">{product.craftDetails.finish}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-400 uppercase">Center Stone:</span>
                  <span className="text-zinc-200">{product.craftDetails.caratWeight || 'Solid Carved Alloy'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contiguous Purchase Module */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#d4af37] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{product.subtitle}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {product.name}
              </h2>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-2xl font-bold text-white tabular-nums">
                  {formattedPrice}
                </span>
                <span className="text-xs text-zinc-400">Includes VAT & Insured Courier</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Alloy Selection */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-zinc-300 block font-medium">
                Select Precious Alloy:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableMetals.map((m) => {
                  const labels: Record<MetalType, string> = {
                    gold: '18K Gold',
                    platinum: '950 Platinum',
                    rosegold: 'Rose Gold',
                    black: 'Oxidized Titanium',
                  };
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMetal(m)}
                      className={`px-3 py-2 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                        selectedMetal === m
                          ? 'border-[#d4af37] bg-white/10 text-white shadow-sm'
                          : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {labels[m]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gemstone Selection if available */}
            {product.availableGems.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-zinc-300 block font-medium">
                  Center Gemstone:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.availableGems.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGem(g)}
                      className={`px-3 py-1.5 text-xs rounded-md border capitalize transition-all cursor-pointer ${
                        selectedGem === g
                          ? 'border-[#d4af37] bg-white/10 text-white font-medium'
                          : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ring Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wider text-zinc-300 font-medium">
                  Finger Size (US):
                </span>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" /> Sizing Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-black/30 rounded border border-white/5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`w-9 h-8 text-xs font-medium rounded transition-colors cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Engraving */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Custom Interior Laser Inscription:</span>
                <span>{engravingText.length}/24</span>
              </div>
              <input
                type="text"
                maxLength={24}
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                placeholder="ENGRAVE INITIALS OR DATE"
                className="w-full px-3.5 py-2 text-xs bg-black/50 border border-white/10 rounded-md text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37] uppercase tracking-wider"
              />
            </div>

            {/* Action Button */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#b38e28] hover:brightness-110 active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-widest rounded-md shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Your Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                    <span>Commission this Creation · {formattedPrice}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 text-[11px] text-zinc-400 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#d4af37]" /> Insured Courier
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#d4af37]" /> Lifetime Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
