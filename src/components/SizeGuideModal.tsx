import React, { useState } from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [circumference, setCircumference] = useState<number>(54.5); // mm

  const sizeTable = [
    { us: '5', uk: 'J 1/2', eu: '49', mm: 49.3, diameter: 15.7 },
    { us: '5.5', uk: 'L', eu: '50.5', mm: 50.6, diameter: 16.1 },
    { us: '6', uk: 'M', eu: '52', mm: 51.9, diameter: 16.5 },
    { us: '6.5', uk: 'N', eu: '53', mm: 53.1, diameter: 16.9 },
    { us: '7', uk: 'O', eu: '54.5', mm: 54.4, diameter: 17.3 },
    { us: '7.5', uk: 'P', eu: '56', mm: 55.7, diameter: 17.7 },
    { us: '8', uk: 'Q', eu: '57', mm: 57.0, diameter: 18.1 },
    { us: '8.5', uk: 'Q 1/2', eu: '58.5', mm: 58.3, diameter: 18.5 },
    { us: '9', uk: 'R 1/2', eu: '60', mm: 59.5, diameter: 19.0 },
    { us: '9.5', uk: 'S 1/2', eu: '61', mm: 60.8, diameter: 19.4 },
    { us: '10', uk: 'T 1/2', eu: '62', mm: 62.1, diameter: 19.8 },
    { us: '11', uk: 'V 1/2', eu: '65', mm: 64.6, diameter: 20.6 },
    { us: '12', uk: 'Y', eu: '67.5', mm: 67.2, diameter: 21.4 },
  ];

  // Find closest matching size based on interactive circumference slider
  const closestMatch = sizeTable.reduce((prev, curr) =>
    Math.abs(curr.mm - circumference) < Math.abs(prev.mm - circumference) ? curr : prev,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111116] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-display text-xl font-bold text-white">
              Bespoke Ring Size Guide
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

        {/* Interactive Finger Circumference Calculator */}
        <div className="bg-[#16161d] rounded-xl p-5 border border-white/5 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-wider text-zinc-300 font-semibold">
              Finger Circumference Finder:
            </label>
            <span className="font-mono text-sm text-[#d4af37] font-bold">
              {circumference.toFixed(1)} mm
            </span>
          </div>

          <input
            type="range"
            min={48}
            max={68}
            step={0.5}
            value={circumference}
            onChange={(e) => setCircumference(parseFloat(e.target.value))}
            className="w-full accent-[#d4af37] cursor-pointer"
          />

          <div className="pt-2 flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5 text-xs">
            <span className="text-zinc-400">Recommended Size:</span>
            <div className="flex items-center gap-4 text-white font-medium">
              <span>US: <strong className="text-[#d4af37]">{closestMatch.us}</strong></span>
              <span>UK: <strong>{closestMatch.uk}</strong></span>
              <span>EU: <strong>{closestMatch.eu}</strong></span>
              <span>Diameter: <strong>{closestMatch.diameter} mm</strong></span>
            </div>
          </div>
        </div>

        {/* Sizing Table */}
        <div className="max-h-60 overflow-y-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#181820] text-zinc-400 uppercase text-[10px] tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-4">US Size</th>
                <th className="py-2.5 px-4">UK / AU</th>
                <th className="py-2.5 px-4">Europe</th>
                <th className="py-2.5 px-4">Inside Circumference</th>
                <th className="py-2.5 px-4">Inside Diameter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {sizeTable.map((row) => (
                <tr
                  key={row.us}
                  className={`hover:bg-white/5 transition-colors ${
                    row.us === closestMatch.us ? 'bg-[#d4af37]/10 text-white font-semibold' : ''
                  }`}
                >
                  <td className="py-2 px-4 text-[#d4af37]">{row.us}</td>
                  <td className="py-2 px-4">{row.uk}</td>
                  <td className="py-2 px-4">{row.eu}</td>
                  <td className="py-2 px-4">{row.mm} mm</td>
                  <td className="py-2 px-4">{row.diameter} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Tip */}
        <div className="mt-6 flex items-start gap-3 text-xs text-zinc-400 bg-black/40 p-4 rounded-xl border border-white/5">
          <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Atelier Tip:</strong> Measure your finger at room temperature at the end of the day when fingers are slightly fuller. We offer complimentary resizing within 30 days of receipt.
          </p>
        </div>
      </div>
    </div>
  );
};
