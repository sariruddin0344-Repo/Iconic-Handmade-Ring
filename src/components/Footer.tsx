import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#050507] border-t border-white/10 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-1">
              <span className="font-display text-2xl font-bold tracking-[0.25em] text-white">
                ICONIC
              </span>
              <span className="block text-[10px] tracking-[0.35em] text-zinc-400 uppercase">
                Handmade Ring
              </span>
            </div>

            <p className="text-zinc-400 leading-relaxed font-light text-xs max-w-sm">
              Haute joaillerie and bespoke handmade rings. Individually sculpted in our Paris atelier with
              solid hallmarked precious alloys and conflict-free gemstones.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified French Assay Office Hallmarks</span>
            </div>
          </div>

          {/* Ateliers Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-white">
              Private Salons & Ateliers
            </h4>
            <ul className="space-y-2.5 text-zinc-400 text-xs">
              <li>
                <strong className="text-zinc-200 block">Paris Atelier (Principal)</strong>
                <span>14 Rue Lepic, Montmartre, 75018 Paris</span>
              </li>
              <li>
                <strong className="text-zinc-200 block">New York Salon</strong>
                <span>650 Madison Avenue, New York, NY 10022</span>
              </li>
              <li>
                <strong className="text-zinc-200 block">Tokyo Private Suite</strong>
                <span>Ginza 6-Chome, Chuo-ku, Tokyo 104-0061</span>
              </li>
            </ul>
          </div>

          {/* Client Services */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-white">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li>
                <a href="#atelier-configurator" className="hover:text-white transition-colors">
                  3D Customizer
                </a>
              </li>
              <li>
                <a href="#collections" className="hover:text-white transition-colors">
                  Ring Collections
                </a>
              </li>
              <li>
                <a href="#craftsmanship" className="hover:text-white transition-colors">
                  Craftsmanship Story
                </a>
              </li>
              <li>
                <span className="text-zinc-400">Complimentary Resizing</span>
              </li>
              <li>
                <span className="text-zinc-400">Lifetime Care & Cleaning</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-white">
              Private Gazette
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Receive private invitations to limited batch ring allocations and atelier open-door previews.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-[#d4af37]/30 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You are on the private invitation ledger.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter private email"
                  className="w-full px-3 py-2 text-xs bg-[#111116] border border-white/10 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-3 py-2 bg-[#d4af37] text-black rounded hover:brightness-110 cursor-pointer shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quiet Legal & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            © {new Date().getFullYear()} ICONIC Handmade Ring. All Rights Reserved. Haute Joaillerie
            Artisanat.
          </div>
          <div className="flex items-center gap-6">
            <span>Privileged Security</span>
            <span aria-hidden="true">·</span>
            <span>Ethical Diamonds & Traceable Precious Metals</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Commission</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
