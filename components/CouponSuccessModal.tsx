"use client";

import React, { useState } from "react";
import { useApp } from "../lib/AppContext";
import { ArrowLeft, CheckCircle2, Copy, Download, ShoppingBag, Info, Sparkles } from "lucide-react";

export default function CouponSuccessModal() {
  const { couponCode, couponExpiry, closeCouponSuccess, cart } = useApp();
  const [copied, setCopied] = useState(false);

  if (!couponCode) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const orderId = `#ORD${Math.floor(10000000 + Math.random() * 90000000)}`;
  const orderDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }) + ", 09:41 AM";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 select-none">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
        onClick={closeCouponSuccess}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-zinc-900 w-full h-full md:h-auto md:max-w-md md:rounded-3xl shadow-2xl overflow-y-auto no-scrollbar z-10 flex flex-col animate-slide-up border border-zinc-200 dark:border-zinc-800">
        
        {/* Header Banner (Wireframe Image 5: Payment Successful) */}
        <div className="bg-red-600 px-6 py-6 text-white text-center flex flex-col items-center relative shrink-0 shadow-md">
          <button 
            onClick={closeCouponSuccess}
            className="absolute top-4 left-4 hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="w-14 h-14 bg-white text-red-600 rounded-full flex items-center justify-center shadow-lg mb-2 mt-2">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <h2 className="text-xl font-black tracking-wide">🎉 Congratulations!</h2>
          <p className="text-xs text-red-100 font-semibold mt-1">Your purchase is successful.</p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 bg-zinc-50 dark:bg-zinc-950">

          {/* QR Code Container (Wireframe Image 5) */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-md text-center space-y-3">
            <div className="bg-white p-4 rounded-2xl shadow-inner border border-zinc-200 max-w-[180px] mx-auto aspect-square flex items-center justify-center">
              <svg 
                viewBox="0 0 29 29" 
                className="w-full h-full text-zinc-900 fill-current shape-rendering-crispEdges"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h7v7H0zm1 1h5v5H1zm1 1h3v3H2zm20-2h7v7h-7zm1 1h5v5h-5zm1 1h3v3h-3zM0 22h7v7H0zm1 1h5v5H1zm1 1h3v3H2z" />
                <path d="M9 0h2v1H9zm4 0h1v2h-1zm3 0h2v1h-2zm4 0h1v1h-1zm-10 2h3v1h-3zm4 0h1v1h-1zm3 0h1v2h-1zm-6 2h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm1 1h2v1h-2zm-9 1h1v3h-1zm2 0h1v1h-1zm2 0h2v2h-2zm-3 2h2v1h-2zm3 0h1v1h-1zm6 0h1v1h-1zm-9 2h2v1H9zm3 0h1v1h-1zm2 0h3v1h-3zm5 0h1v1h-1zm-8 2h1v1h-1zm2 0h2v1h-2zm6 0h2v2h-2zm-7 2h1v1h-1zm2 0h1v2h-1zm2 0h2v1h-2zm5 0h1v1h-1zm-8 2h2v1H9zm4 0h2v1h-2zm4 0h1v1h-1z" />
              </svg>
            </div>

            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
              Show this QR code at the store — OR USE COUPON CODE —
            </p>

            {/* Tap to copy Coupon Code */}
            <div 
              onClick={copyCode}
              className="bg-red-50 dark:bg-red-950/40 border-2 border-dashed border-red-500 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-red-100 transition-colors"
            >
              <span className="text-xl font-mono font-black text-red-600 dark:text-red-400 tracking-widest pl-2">
                {couponCode}
              </span>
              <button className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl shadow-sm">
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Order Info Card (Wireframe Image 5) */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
            <div className="flex justify-between items-center text-zinc-500">
              <span>Order ID</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-white">{orderId}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500">
              <span>Date</span>
              <span className="font-bold text-zinc-900 dark:text-white">{orderDate}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500">
              <span>Valid Till</span>
              <span className="font-bold text-red-600">{couponExpiry}</span>
            </div>
          </div>

          {/* How to Redeem Instructions (Wireframe Image 5) */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
            <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <h5 className="font-black">How to Redeem?</h5>
              <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                Visit the store counter before billing and show your QR code or coupon code to the staff to apply your discount.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => alert("QR Code image downloaded for offline use!")}
              className="w-full border border-red-600 text-red-600 dark:text-red-400 font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Save QR Code for Later</span>
            </button>

            <button
              onClick={closeCouponSuccess}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl text-xs shadow-lg shadow-red-600/20 transition-transform active:scale-95 cursor-pointer text-center uppercase tracking-wider"
            >
              Continue Shopping
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
