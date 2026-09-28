import React, { useState } from 'react';
import { CartItem } from '../types';
import { CURRENCY_MAP } from '../data/products';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, Landmark, Copy, Check } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderComplete: () => void;
  currentCurrency: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderComplete,
  currentCurrency,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wire' | 'cod'>('card');
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Form details
  const [formData, setFormData] = useState({
    fullName: 'Eleanor Vance',
    email: 'eleanor.vance@geneva-luxury.ch',
    phone: '+41 22 819 2000',
    address: 'Rue du Rhône 42',
    city: 'Geneva',
    postalCode: '1204',
    country: 'Switzerland',
    giftNote: 'With all my devotion and endless love.',
  });

  const [orderNumber] = useState(() => `IR-${Math.floor(100000 + Math.random() * 900000)}`);

  const currencyInfo = CURRENCY_MAP[currentCurrency] || CURRENCY_MAP.USD;
  const rawSubtotalUSD = cart.reduce((sum, item) => sum + item.priceUSD * item.quantity, 0);
  const formattedTotal = `${currencyInfo.symbol}${Math.round(rawSubtotalUSD * currencyInfo.rate).toLocaleString()}`;

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleProcessPayment = () => {
    setStep('confirmed');
    onOrderComplete();
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111116] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#141419]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
              {step === 'confirmed' ? 'Commission Confirmed' : 'Haute Joaillerie Checkout'}
            </h3>
          </div>
          {step !== 'confirmed' && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'details' && (
            <form onSubmit={handleSubmitDetails} className="space-y-4">
              <div className="text-xs text-zinc-400 mb-2">
                Step 1 of 2: Insured Delivery Destination
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-zinc-300 block mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-zinc-300 block mb-1">
                    Email for Shipment Tracking
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-zinc-300 block mb-1">
                    Phone (Courier Contact)
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-zinc-300 block mb-1">
                    Country / Territory
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-zinc-300 block mb-1">
                  Street Address & Suite / Floor
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-zinc-300 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-zinc-300 block mb-1">
                    Postal / ZIP Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-zinc-300 block mb-1">
                  Bespoke Hand-Written Calligraphy Gift Note (Optional)
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={formData.giftNote}
                  onChange={(e) => setFormData({ ...formData, giftNote: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <span className="text-xs text-zinc-400">
                  Total: <strong className="text-white font-mono">{formattedTotal}</strong>
                </span>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider rounded hover:brightness-110 cursor-pointer"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="text-xs text-zinc-400">Step 2 of 2: Payment Settlement</div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#d4af37] bg-white/5'
                      : 'border-white/10 bg-black/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#d4af37]" />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Credit / Debit Card (Encrypted Stripe Vault)
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Visa, Mastercard, American Express, UnionPay
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wire')}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                    paymentMethod === 'wire'
                      ? 'border-[#d4af37] bg-white/5'
                      : 'border-white/10 bg-black/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Landmark className="w-5 h-5 text-[#d4af37]" />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Private Bank Wire Transfer
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Concierge IBAN verification (Direct Paris Atelier Account)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#d4af37] bg-white/5'
                      : 'border-white/10 bg-black/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#d4af37]" />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Armored Courier Handover (COD)
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Pay upon personal delivery with ID verification
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">Verified</span>
                </button>
              </div>

              {/* Summary box */}
              <div className="p-4 bg-black/50 rounded-xl border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Recipient:</span>
                  <span className="text-zinc-200">{formData.fullName} ({formData.city}, {formData.country})</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Courier:</span>
                  <span className="text-[#d4af37]">Brinks Global Insured Express</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/5 font-semibold text-white">
                  <span>Grand Total:</span>
                  <span className="font-display text-base text-[#d4af37] tabular-nums">{formattedTotal}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  ← Back to Details
                </button>

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="px-7 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b38e28] text-black font-semibold text-xs uppercase tracking-widest rounded shadow-xl hover:brightness-110 cursor-pointer"
                >
                  Authorize Commission · {formattedTotal}
                </button>
              </div>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#d4af37]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                  Atelier Order #{orderNumber} Confirmed
                </span>
                <h3 className="font-display text-2xl font-bold text-white">
                  Your Bespoke Ring Is In Production
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Our master goldsmiths have received your commission specifications. A confirmation email
                  with your hallmarked serial certificate has been sent to{' '}
                  <strong className="text-zinc-200">{formData.email}</strong>.
                </p>
              </div>

              {/* Order summary card */}
              <div className="bg-[#16161d] rounded-xl p-5 border border-white/10 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-zinc-400">Order Reference:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white font-bold">{orderNumber}</span>
                    <button
                      type="button"
                      onClick={handleCopyOrder}
                      className="p-1 text-zinc-400 hover:text-white"
                      title="Copy Reference"
                    >
                      {copiedOrder ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-zinc-300">
                  <span>Production Timeline:</span>
                  <span className="text-[#d4af37] font-medium">5-8 Business Days (Hand-Forged)</span>
                </div>

                <div className="flex items-center justify-between text-zinc-300">
                  <span>Courier:</span>
                  <span>Direct Insured Armored Dispatch</span>
                </div>

                <div className="flex items-center justify-between text-zinc-300 border-t border-white/5 pt-2">
                  <span>Settlement Method:</span>
                  <span className="capitalize">{paymentMethod.toUpperCase()} Settlement</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-widest rounded cursor-pointer"
                >
                  Return to Boutique
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
