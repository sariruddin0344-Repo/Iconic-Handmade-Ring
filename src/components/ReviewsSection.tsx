import React from 'react';
import { REVIEWS } from '../data/products';
import { Star, ShieldCheck, Sparkles } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-[#08080a] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs tracking-[0.25em] text-[#d4af37] uppercase font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collector Perspectives</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Loved Across Generations
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light">
            Read unprompted notes from private collectors who wear our handcrafted rings across the globe.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#101015] rounded-xl p-8 border border-white/5 flex flex-col justify-between hover:border-white/15 transition-all"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#d4af37]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#d4af37]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-serif-luxury text-base text-zinc-200 leading-relaxed italic">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              {/* Author & Ring Metadata (Zero-Pill clean layout) */}
              <div className="pt-6 border-t border-white/5 mt-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-display font-semibold text-white">
                    {rev.author}
                  </span>
                  {rev.verified && (
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
                      Verified Collector
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
                  <span>{rev.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{rev.date}</span>
                </div>

                <div className="text-[11px] text-[#d4af37]/80 mt-1.5 font-medium">
                  {rev.ringPurchased}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Press Accolades */}
        <div className="mt-16 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-zinc-400 text-xs uppercase tracking-widest">
          <div>
            <span className="block font-serif-luxury italic text-sm text-zinc-300 normal-case mb-1">
              &ldquo;A triumph of lost-wax sculptural ring craft.&rdquo;
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Vogue Haute Joaillerie</span>
          </div>
          <div>
            <span className="block font-serif-luxury italic text-sm text-zinc-300 normal-case mb-1">
              &ldquo;The tactile weight of true heirloom metalwork.&rdquo;
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Robb Report</span>
          </div>
          <div>
            <span className="block font-serif-luxury italic text-sm text-zinc-300 normal-case mb-1">
              &ldquo;Flawless balance between ancient bench methods & modern 3D preview.&rdquo;
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Architectural Digest</span>
          </div>
          <div>
            <span className="block font-serif-luxury italic text-sm text-zinc-300 normal-case mb-1">
              &ldquo;Jewelry intended to outlast lifetimes.&rdquo;
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">The Financial Times</span>
          </div>
        </div>
      </div>
    </section>
  );
};
