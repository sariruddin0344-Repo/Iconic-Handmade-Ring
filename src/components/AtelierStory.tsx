import React, { useState } from 'react';
import { ATELIER_IMAGE } from '../data/products';
import { Sparkles, Hammer, CheckCircle2, Calendar } from 'lucide-react';

export const AtelierStory: React.FC = () => {
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  const steps = [
    {
      num: '01',
      title: 'Freehand Wax Sculpting',
      desc: 'Every ring begins as an organic wax prototype hand-carved with steel files, ensuring no two bands ever share identical micro-facets.',
    },
    {
      num: '02',
      title: 'Lost-Wax High-Density Casting',
      desc: 'Melted at 1,770°C in vacuum induction chambers to eliminate porosity and yield heirloom density that endures centuries.',
    },
    {
      num: '03',
      title: 'Chiseling & Cold Forging',
      desc: 'Artisans hammer the metal cold to align the metallic crystalline grain, achieving remarkable structural rigidity and tactile texture.',
    },
    {
      num: '04',
      title: 'Microscope Claw Setting',
      desc: 'Under 40x optical magnification, each prong is burnished over the girdle of the stone, guaranteeing zero snag and optimum light entry.',
    },
  ];

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultSubmitted(true);
    setTimeout(() => {
      setConsultSubmitted(false);
      setShowConsultModal(false);
    }, 2800);
  };

  return (
    <section id="craftsmanship" className="py-24 bg-[#0a0a0d] border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs tracking-[0.25em] text-[#d4af37] uppercase font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ancestral Metiers d'Art</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight text-balance">
            The Atelier in Paris
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
            In an era of mass-manufactured cast jewelry, we remain devoted to the slow, deliberate handcraft of the goldsmith's bench.
          </p>
        </div>

        {/* Large Cinematic Image with Editorial Text Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Atelier Image */}
          <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={ATELIER_IMAGE}
              alt="Artisan jeweler hand-filing ring at bench"
              className="w-full aspect-[16/9] object-cover group-hover:scale-102 transition-transform duration-700"
            />
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
              <div className="space-y-1">
                <span className="text-[11px] tracking-widest text-[#d4af37] uppercase font-medium">
                  Bench Jeweler at Work
                </span>
                <p className="font-serif-luxury italic text-white text-lg sm:text-xl">
                  &ldquo;A ring is not made by machines. It is coaxed into existence by the heat of fire and the patience of the hand.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Story */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-display text-2xl font-bold text-white">
              No CAD Shortcuts. <br />
              <span className="gold-gradient-text font-serif-luxury italic font-normal text-2xl">
                Only Pure Human Mastery.
              </span>
            </h3>

            <p className="text-zinc-400 text-sm leading-relaxed font-light">
              Founded on the belief that a ring represents one’s most personal talisman, our master jewelers
              limit atelier output to just twelve creations per week. Each piece bears the French state eagle
              hallmark and our master maker's stamp.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowConsultModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-widest font-medium rounded-md border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                <span>Book Private Atelier Consultation</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Process Stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-[#121217] p-6 rounded-xl border border-white/5 hover:border-white/15 transition-colors relative"
            >
              <span className="font-display text-3xl font-bold text-white/20 block mb-3">
                {s.num}
              </span>
              <h4 className="font-display text-base font-semibold text-white mb-2">
                {s.title}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Atelier Consultation Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121216] border border-white/15 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Private Atelier Appointment
            </h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Connect directly with our master jeweler for bespoke commissions, custom sizing, or heirloom stone remounting.
            </p>

            {consultSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#d4af37] mx-auto animate-bounce" />
                <h4 className="text-sm font-semibold text-white">Consultation Requested</h4>
                <p className="text-xs text-zinc-400">
                  Our private concierge will contact you within 24 hours to confirm your appointment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] text-zinc-300 uppercase tracking-wider block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Eleanor Vance"
                    className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-300 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="eleanor@example.com"
                    className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-300 uppercase tracking-wider block mb-1">
                    Preferred Atelier Location
                  </label>
                  <select className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-[#d4af37]">
                    <option>Paris (Montmartre Atelier)</option>
                    <option>New York (Madison Avenue Studio)</option>
                    <option>Tokyo (Ginza Private Salon)</option>
                    <option>Virtual Video Consultation (Global)</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowConsultModal(false)}
                    className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider rounded hover:brightness-110 cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
