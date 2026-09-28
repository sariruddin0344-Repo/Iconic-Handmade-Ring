import React, { useState } from 'react';
import { ThreeRingViewer } from './ThreeRingViewer';
import { MetalType, GemType, RingStyle } from '../types';
import { ArrowRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onExploreConfigurator: () => void;
  onExploreCollection: () => void;
  onSelectProductFor3D: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreConfigurator,
  onExploreCollection,
}) => {
  const [heroStyle, setHeroStyle] = useState<RingStyle>('enamel');
  const [heroMetal, setHeroMetal] = useState<MetalType>('black');
  const [heroGem, setHeroGem] = useState<GemType>('none');

  const metalsList: { id: MetalType; label: string; tone: string }[] = [
    { id: 'platinum', label: '950 Platinum', tone: 'bg-slate-200' },
    { id: 'gold', label: '18K Gold', tone: 'bg-[#D4AF37]' },
    { id: 'rosegold', label: 'Rose Gold', tone: 'bg-[#E0A899]' },
    { id: 'black', label: 'Obsidian', tone: 'bg-zinc-800 border border-zinc-600' },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-white/10 bg-[#08080a]">
      {/* Background radial luxury lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#d4af37]/8 via-transparent to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Text Column */}
          <div className="lg:col-span-6 space-y-8">
            {/* Quiet unboxed kicker */}
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] text-[#d4af37] uppercase font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haute Joaillerie & Artisanal Rings</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance">
              Forged by hand. <br />
              <span className="gold-gradient-text font-serif-luxury italic font-normal text-4xl sm:text-5xl lg:text-6xl block mt-2">
                Defined by eternity.
              </span>
            </h1>

            {/* Prose */}
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl font-light">
              Every ring from <strong className="text-zinc-200 font-medium">ICONIC</strong> is
              individually sculpted in our Parisian atelier using lost-wax casting and hand-burnished
              finishes. Experience the marriage of ancestral metalwork and interactive 3D precision.
            </p>

            {/* Quick Hero Material Finish Preview Switcher */}
            <div className="pt-2">
              <div className="text-[11px] tracking-widest uppercase text-zinc-400 mb-3 flex items-center gap-2">
                <span>Select interactive alloy finish:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {metalsList.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setHeroMetal(m.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      heroMetal === m.id
                        ? 'bg-white/10 text-white border border-[#d4af37]/60 shadow-lg shadow-[#d4af37]/10'
                        : 'bg-black/40 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${m.tone}`} />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                type="button"
                onClick={onExploreConfigurator}
                className="group flex items-center justify-center gap-3 px-7 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b38e28] text-black font-semibold text-xs uppercase tracking-widest rounded-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#d4af37]/20"
              >
                <span>Customize in 3D Atelier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onExploreCollection}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-widest font-medium rounded-md border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-zinc-400" />
                <span>Explore Catalog</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-zinc-400">
              <div>
                <span className="block font-semibold text-white tracking-wider">100% Bespoke</span>
                <span className="text-[11px] text-zinc-400">Hand-carved per client</span>
              </div>
              <div>
                <span className="block font-semibold text-white tracking-wider">Hallmarked</span>
                <span className="text-[11px] text-zinc-400">Certified 950 Pt & 18K</span>
              </div>
              <div>
                <span className="block font-semibold text-white tracking-wider">Lifetime Care</span>
                <span className="text-[11px] text-zinc-400">Complimentary polish</span>
              </div>
            </div>
          </div>

          {/* Right 3D Visual Presentation Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#141419] to-[#0c0c10] border border-white/10 shadow-2xl p-2 sm:p-4">
              {/* Corner Accent Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 blur-3xl pointer-events-none" />

              {/* Top Bar inside 3D Canvas */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 text-[11px] text-zinc-400 tracking-wider uppercase">
                <span className="flex items-center gap-1.5 text-[#d4af37]">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
                  Interactive 3D Preview
                </span>
                <span className="text-white font-medium">Artisan Cloisonné Enamel Band</span>
              </div>

              {/* 3D Interactive Ring Canvas */}
              <ThreeRingViewer
                ringStyle={heroStyle}
                metal={heroMetal}
                gem={heroGem}
                autoRotate={true}
                height="500px"
                className="w-full"
                showControls={true}
              />

              {/* Bottom Quick Gem Selectors */}
              <div className="px-4 py-3 border-t border-white/5 bg-black/40 flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-400 uppercase tracking-widest">Center Stone:</span>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'diamond' as GemType, label: 'Diamond', dot: 'bg-white shadow-[0_0_8px_#ffffff]' },
                    { id: 'sapphire' as GemType, label: 'Sapphire', dot: 'bg-blue-600 shadow-[0_0_8px_#2563eb]' },
                    { id: 'emerald' as GemType, label: 'Emerald', dot: 'bg-emerald-600 shadow-[0_0_8px_#059669]' },
                    { id: 'ruby' as GemType, label: 'Ruby', dot: 'bg-rose-700 shadow-[0_0_8px_#be123c]' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setHeroGem(g.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                        heroGem === g.id ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${g.dot}`} />
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
