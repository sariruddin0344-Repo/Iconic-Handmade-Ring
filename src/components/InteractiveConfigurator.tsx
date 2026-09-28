import React, { useState } from 'react';
import { ThreeRingViewer } from './ThreeRingViewer';
import { MetalType, GemType, RingStyle, CartItem } from '../types';
import { CURRENCY_MAP } from '../data/products';
import { Sparkles, Check, ShoppingBag, Sliders, Type, Info, Layers } from 'lucide-react';

interface InteractiveConfiguratorProps {
  onAddToCart: (item: CartItem) => void;
  currentCurrency: string;
  onOpenSizeGuide: () => void;
}

export const InteractiveConfigurator: React.FC<InteractiveConfiguratorProps> = ({
  onAddToCart,
  currentCurrency,
  onOpenSizeGuide,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<RingStyle>('solitaire');
  const [selectedMetal, setSelectedMetal] = useState<MetalType>('platinum');
  const [selectedGem, setSelectedGem] = useState<GemType>('diamond');
  const [selectedSize, setSelectedSize] = useState<number>(7);
  const [engravingText, setEngravingText] = useState<string>('');
  const [addedAlert, setAddedAlert] = useState(false);

  // Ring models list
  const styles: { id: RingStyle; title: string; subtitle: string; basePrice: number }[] = [
    {
      id: 'enamel',
      title: 'Artisan Cloisonné Enamel (Photo Match)',
      subtitle: 'Hand-painted Union Jack medallions, red crosses & neon lime accents',
      basePrice: 1850,
    },
    {
      id: 'solitaire',
      title: 'The Ethereal Solitaire',
      subtitle: 'Cathedral prong cradle holding a high-carat brilliant gemstone',
      basePrice: 3450,
    },
    {
      id: 'signet',
      title: 'The Sovereign Signet',
      subtitle: 'Hand-chiseled seal ring with tactile organic texture & seal face',
      basePrice: 2890,
    },
    {
      id: 'eternity',
      title: 'The Celestial Eternity',
      subtitle: 'Continuous micro-pave channel band with 360° light refraction',
      basePrice: 3150,
    },
    {
      id: 'wave',
      title: 'The Molten Nautilus',
      subtitle: 'Asymmetric fluid liquid gold sculpting that follows hand contours',
      basePrice: 2420,
    },
  ];

  // Metals list
  const metals: { id: MetalType; name: string; desc: string; priceDelta: number; colorHex: string }[] = [
    { id: 'platinum', name: '950 Solid Platinum', desc: 'Dense, naturally brilliant, hypoallergenic', priceDelta: 400, colorHex: '#F0F3F6' },
    { id: 'gold', name: '18K Yellow Gold', desc: 'Warm classic radiance hallmarked in Paris', priceDelta: 300, colorHex: '#DEB841' },
    { id: 'rosegold', name: '18K Rose Blush Gold', desc: 'Romantic copper-infused luxury alloy', priceDelta: 320, colorHex: '#DF9F8B' },
    { id: 'black', name: 'Oxidized Gunmetal Titanium', desc: 'Deep satin charcoal with gold rim accents', priceDelta: 0, colorHex: '#232428' },
  ];

  // Gemstones list
  const gemstones: { id: GemType; name: string; desc: string; priceDelta: number; colorHex: string }[] = [
    { id: 'diamond', name: 'Flawless D Diamond', desc: 'VVS1 clarity certified brilliant cut', priceDelta: 600, colorHex: '#FFFFFF' },
    { id: 'sapphire', name: 'Royal Ceylon Sapphire', desc: 'Velvety midnight blue crystal', priceDelta: 450, colorHex: '#143D8A' },
    { id: 'emerald', name: 'Colombian Emerald', desc: 'Lush verdant green with natural jardin', priceDelta: 500, colorHex: '#0E7345' },
    { id: 'ruby', name: 'Pigeon Blood Ruby', desc: 'Intense crimson fire with high refraction', priceDelta: 520, colorHex: '#9E0A28' },
    { id: 'onyx', name: 'Midnight Jet Onyx', desc: 'Polished black stone with satin depth', priceDelta: 100, colorHex: '#08080A' },
  ];

  // Ring sizes
  const sizes = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13];

  // Calculate total price
  const currentModel = styles.find((s) => s.id === selectedStyle) || styles[0];
  const metalItem = metals.find((m) => m.id === selectedMetal) || metals[0];
  const gemItem = gemstones.find((g) => g.id === selectedGem) || gemstones[0];
  const engravingPrice = engravingText.trim().length > 0 ? 0 : 0; // Complimentary!

  const totalUSD = currentModel.basePrice + metalItem.priceDelta + gemItem.priceDelta + engravingPrice;
  const currencyInfo = CURRENCY_MAP[currentCurrency] || CURRENCY_MAP.USD;
  const formattedPrice = `${currencyInfo.symbol}${Math.round(totalUSD * currencyInfo.rate).toLocaleString()}`;

  const handleAddToCart = () => {
    const item: CartItem = {
      id: `${selectedStyle}-${selectedMetal}-${selectedGem}-${selectedSize}-${Date.now()}`,
      productId: `custom-${selectedStyle}`,
      name: `${currentModel.title} (Bespoke)`,
      style: selectedStyle,
      metal: selectedMetal,
      gem: selectedGem,
      size: selectedSize,
      engraving: engravingText.trim() || undefined,
      priceUSD: totalUSD,
      quantity: 1,
      image:
        selectedStyle === 'signet'
          ? '/src/assets/images/ring_signet_heritage_1790577601071.jpg'
          : selectedStyle === 'eternity'
          ? '/src/assets/images/ring_eternity_band_1790577612907.jpg'
          : selectedStyle === 'wave'
          ? '/src/assets/images/hero_cinematic_ring_1790577578539.jpg'
          : '/src/assets/images/ring_solitaire_diamond_1790577589817.jpg',
    };

    onAddToCart(item);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  return (
    <section id="atelier-configurator" className="py-20 bg-[#0a0a0d] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs tracking-[0.25em] text-[#d4af37] uppercase font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisanal 3D Atelier</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight text-balance">
            Interactive Ring Configurator
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
            Design your one-of-a-kind heirloom. Rotate the 3D model in real time, customize the precious
            metal alloy, choose certified gemstones, and engrave a personal inscription.
          </p>
        </div>

        {/* Studio Grid: 3D Viewport on Left, Customizer Panel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 3D Viewport Column */}
          <div className="lg:col-span-7 bg-[#121216] rounded-2xl border border-white/10 overflow-hidden shadow-2xl sticky top-28">
            {/* Top Viewport Header */}
            <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                <span className="font-medium text-white tracking-wider uppercase">
                  360° Real-Time Studio
                </span>
              </div>
              <span className="text-zinc-400 text-[11px] font-mono">
                {currentModel.title} · {metalItem.name}
              </span>
            </div>

            {/* 3D Three.js Canvas */}
            <ThreeRingViewer
              ringStyle={selectedStyle}
              metal={selectedMetal}
              gem={selectedGem}
              autoRotate={true}
              height="520px"
              className="w-full"
              showControls={true}
            />

            {/* Viewport Inscription Indicator */}
            {engravingText && (
              <div className="px-5 py-2.5 bg-black/60 border-t border-white/5 flex items-center justify-between text-xs text-zinc-300">
                <span className="text-zinc-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#d4af37]" /> Inscription:
                </span>
                <span className="font-serif-luxury italic tracking-widest text-white text-sm">
                  &ldquo;{engravingText}&rdquo;
                </span>
              </div>
            )}
          </div>

          {/* Configuration Controls Column */}
          <div className="lg:col-span-5 space-y-7">
            {/* 1. Ring Silhouette Selection */}
            <div className="bg-[#121216] rounded-xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-semibold text-white flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>01. Silhouette Architecture</span>
                </label>
                <span className="text-[11px] text-[#d4af37]">{currentModel.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedStyle(s.id)}
                    className={`p-3 rounded-lg text-left transition-all cursor-pointer ${
                      selectedStyle === s.id
                        ? 'bg-white/10 border border-[#d4af37] shadow-md shadow-[#d4af37]/10'
                        : 'bg-black/30 border border-white/5 hover:border-white/15 text-zinc-400'
                    }`}
                  >
                    <div className="text-xs font-semibold text-white">{s.title}</div>
                    <div className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{s.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Precious Alloy Selection */}
            <div className="bg-[#121216] rounded-xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-semibold text-white flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>02. Precious Alloy</span>
                </label>
                <span className="text-[11px] text-zinc-300 font-medium">{metalItem.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {metals.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMetal(m.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all cursor-pointer ${
                      selectedMetal === m.id
                        ? 'bg-white/10 border border-[#d4af37]'
                        : 'bg-black/30 border border-white/5 hover:border-white/15'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-inner"
                      style={{ backgroundColor: m.colorHex }}
                    />
                    <div>
                      <div className="text-xs font-medium text-white">{m.name}</div>
                      <div className="text-[10px] text-zinc-400">
                        {m.priceDelta > 0 ? `+${currencyInfo.symbol}${Math.round(m.priceDelta * currencyInfo.rate)}` : 'Base Alloy'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Gemstone Selection */}
            <div className="bg-[#121216] rounded-xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>03. Center Stone</span>
                </label>
                <span className="text-[11px] text-zinc-300 font-medium">{gemItem.name}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {gemstones.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGem(g.id)}
                    className={`p-2.5 rounded-lg flex flex-col items-center text-center transition-all cursor-pointer ${
                      selectedGem === g.id
                        ? 'bg-white/10 border border-[#d4af37]'
                        : 'bg-black/30 border border-white/5 hover:border-white/15'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full mb-1.5 shadow"
                      style={{ backgroundColor: g.colorHex }}
                    />
                    <span className="text-[11px] font-medium text-white leading-tight">{g.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-zinc-400 mt-0.5">
                      +{currencyInfo.symbol}{Math.round(g.priceDelta * currencyInfo.rate)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Sizing & Custom Engraving */}
            <div className="bg-[#121216] rounded-xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-semibold text-white">
                  04. Sizing & Laser Engraving
                </label>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="text-[11px] text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3 h-3" /> Size Guide
                </button>
              </div>

              {/* Size Selector */}
              <div>
                <span className="text-[11px] text-zinc-400 block mb-2">Select Finger Size (US):</span>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`w-9 h-8 text-xs font-medium rounded transition-colors cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#d4af37] text-black font-bold'
                          : 'bg-black/40 text-zinc-300 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inscription text */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
                  <span>Interior Laser Engraving (Complimentary):</span>
                  <span>{engravingText.length}/24</span>
                </div>
                <input
                  type="text"
                  maxLength={24}
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                  placeholder="e.g. FOREVER & ALWAYS"
                  className="w-full px-3.5 py-2.5 text-xs bg-black/50 border border-white/10 rounded-md text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4af37] uppercase tracking-wider"
                />
              </div>
            </div>

            {/* Contiguous Purchase Module */}
            <div className="bg-[#181820] rounded-xl p-6 border border-[#d4af37]/30 shadow-2xl space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-zinc-400 uppercase tracking-widest block">Total Bespoke Value</span>
                  <span className="font-display text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {formattedPrice}
                  </span>
                </div>
                <span className="text-[11px] text-[#d4af37] font-medium tracking-wide">
                  Insured Delivery Included
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#d4af37] to-[#b38e28] hover:brightness-110 active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-widest rounded-md shadow-xl shadow-[#d4af37]/20 transition-all cursor-pointer"
              >
                {addedAlert ? (
                  <>
                    <Check className="w-4 h-4 text-black stroke-[3]" />
                    <span>Added to Shopping Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>Add Bespoke Creation to Bag</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-zinc-400 text-center space-y-1">
                <p>Hand-forged by master jeweler in Paris · 7-10 business days lead time</p>
                <p className="text-zinc-400">Includes Certificate of Authenticity & 30-Day Resizing Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
