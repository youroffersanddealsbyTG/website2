"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { createAdvertisement, Offer } from "../../../lib/db";
import { CreditCard, ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const [draftAd, setDraftAd] = useState<Omit<Offer, "id"> | null>(null);
  
  // Card States
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  // Status States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("ouiya_temp_ad");
      if (draft) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraftAd(JSON.parse(draft));
      } else {
        // No draft, redirect back to portal
        router.push("/portal");
      }
    }
  }, []);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    if (value.length <= 5) {
      setExpiry(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !expiry || !cvv) {
      setError("Please fill out all billing details.");
      return;
    }
    if (cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3) {
      setError("Please verify credit card details formatting.");
      return;
    }

    setError("");
    setIsProcessing(true);

    // Simulate Payment Charging (2.5 seconds)
    setTimeout(async () => {
      if (draftAd) {
        try {
          // Save Paid Advertisement to local storage/Firestore
          await createAdvertisement({
            ...draftAd,
            status: "Active",
            expiryDate: draftAd.plan?.includes("Premium") ? "2026-08-16" : "2026-07-23", // 30 days vs 7 days
            clicks: 0,
            impressions: 0
          });

          // Delete temporary draft
          localStorage.removeItem("ouiya_temp_ad");

          setIsProcessing(false);
          setIsSuccess(true);

          // Redirect after showing checkmark
          setTimeout(() => {
            router.push("/portal");
          }, 2000);
        } catch (e) {
          setIsProcessing(false);
          setError("Failed to process transaction. Please try again.");
        }
      }
    }, 2500);
  };

  if (!draftAd) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12">
        
        {/* Back Link */}
        <button
          onClick={() => router.push("/portal/new-ad")}
          disabled={isProcessing || isSuccess}
          className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8 disabled:opacity-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Ad Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Payment Card Form */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            
            {/* Visual Credit Card Preview Container */}
            <div className="flex justify-center mb-8 relative z-10 perspective-1000">
              <div 
                className={`relative w-80 sm:w-96 h-48 sm:h-56 transition-transform duration-700 transform-style-3d cursor-pointer ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                
                {/* CARD FRONT */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-dark via-primary-medium to-primary p-6 flex flex-col justify-between text-white backface-hidden shadow-2xl border border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] uppercase tracking-widest font-extrabold opacity-75">Ouiya Ad Billing</span>
                      <CreditCard className="w-8 h-8 opacity-90 mt-1" />
                    </div>
                    {/* Chip Icon */}
                    <div className="w-10 h-7 bg-amber-400/80 rounded-md border border-amber-300 flex items-center justify-center overflow-hidden">
                      <div className="grid grid-cols-3 gap-0.5 w-full h-full opacity-30 p-1">
                        <div className="border border-white" />
                        <div className="border border-white" />
                        <div className="border border-white" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="block font-mono text-xl sm:text-2xl font-bold tracking-widest text-center select-none">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[7px] uppercase tracking-wider opacity-60">Card Holder</span>
                      <span className="text-xs font-black uppercase tracking-wide truncate max-w-[180px]">
                        {cardName || "Your Brand / Name"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[7px] uppercase tracking-wider opacity-60">Expires</span>
                      <span className="text-xs font-bold font-mono">
                        {expiry || "MM/YY"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARD BACK */}
                <div className="absolute inset-0 rounded-2xl bg-zinc-800 p-6 flex flex-col justify-between text-white rotate-y-180 backface-hidden shadow-2xl border border-zinc-700">
                  <div className="w-full h-10 bg-black absolute left-0 top-6" />
                  <div className="mt-14 flex flex-col gap-2">
                    <div className="flex justify-end pr-2 text-[8px] opacity-60 uppercase">CVV Signature</div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-700 py-1.5 px-3 rounded flex justify-end">
                      <span className="font-mono text-sm font-black text-zinc-900 dark:text-white italic">
                        {cvv || "•••"}
                      </span>
                    </div>
                  </div>
                  <div className="text-[7px] opacity-40 text-center uppercase tracking-widest mt-4">
                    Authorized use only • Secure SSL Bill
                  </div>
                </div>

              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold mb-6">
                {error}
              </div>
            )}

            {/* Payment inputs Form */}
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  required
                  disabled={isProcessing || isSuccess}
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  onFocus={() => setIsFlipped(false)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  disabled={isProcessing || isSuccess}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  onFocus={() => setIsFlipped(false)}
                  placeholder="4111 2222 3333 4444"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary font-mono tracking-wider disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isProcessing || isSuccess}
                    value={expiry}
                    onChange={handleExpiryChange}
                    onFocus={() => setIsFlipped(false)}
                    placeholder="MM/YY"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary font-mono disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                    CVV/CVC
                  </label>
                  <input
                    type="password"
                    required
                    disabled={isProcessing || isSuccess}
                    value={cvv}
                    onChange={handleCvvChange}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    placeholder="•••"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary font-mono disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              {isSuccess ? (
                <div className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow shadow-emerald-500/25">
                  <CheckCircle2 className="w-5 h-5 animate-scale-up" />
                  <span>Payment Success! Syncing...</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-6"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Transaction...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{draftAd.pricePaid?.toLocaleString()} Now</span>
                    </>
                  )}
                </button>
              )}
            </form>

          </div>

          {/* Right Column: Order Summary Details */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-black text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              Campaign Summary
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-xs font-bold text-zinc-900 dark:text-white">
                    {draftAd.businessName}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block mt-0.5">
                    {draftAd.title} ({draftAd.category})
                  </span>
                </div>
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  {draftAd.plan}
                </span>
              </div>

              <div className="pt-4 border-t border-zinc-50 dark:border-zinc-850 space-y-2.5">
                <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>₹{draftAd.pricePaid}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <span>SGST / CGST (0%)</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between items-center text-sm font-black text-zinc-900 dark:text-white pt-2.5 border-t border-zinc-50 dark:border-zinc-850">
                  <span>Total Amount</span>
                  <span className="text-primary text-base">₹{draftAd.pricePaid}</span>
                </div>
              </div>
            </div>

            {/* Secured Badge */}
            <div className="mt-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 flex gap-3 items-center">
              <ShieldCheck className="w-7 h-7 text-emerald-500 shrink-0" />
              <div>
                <span className="block text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-wider">Secure Payment</span>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-normal mt-0.5">
                  Your billing info is encrypted using SSL keys. Ouiya does not store card numbers.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
