"use client";

import React, { useState } from "react";
import { useApp } from "../lib/AppContext";
import { ArrowLeft, Star } from "lucide-react";

export default function CouponSuccessModal() {
  const { couponCode, couponExpiry, closeCouponSuccess } = useApp();
  const [rating, setRating] = useState(5);

  if (!couponCode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 select-none">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
        onClick={closeCouponSuccess}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-zinc-900 w-full h-full md:h-auto md:max-w-md md:rounded-3xl shadow-2xl overflow-y-auto no-scrollbar z-10 flex flex-col animate-slide-up border border-zinc-100 dark:border-zinc-800">
        
        {/* Red Header Section */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-red-600 px-6 py-8 text-white rounded-t-none md:rounded-t-3xl text-center flex flex-col items-center relative shrink-0 shadow-md">
          {/* Back button */}
          <button 
            onClick={closeCouponSuccess}
            className="absolute top-6 left-6 hover:bg-white/10 p-2 rounded-full transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <h2 className="text-2xl font-black tracking-wide uppercase mt-4">Coupon code</h2>
          <p className="text-xs text-red-100 font-semibold tracking-wider uppercase mt-2.5">
            Scan the QR at Shop & Get Deal
          </p>
        </div>

        {/* Coupon/QR Code Area */}
        <div className="p-6 md:p-8 flex flex-col items-center text-center bg-zinc-50 dark:bg-zinc-950 flex-1">
          {/* QR Code Container */}
          <div className="bg-white p-4.5 rounded-2xl shadow-xl border border-zinc-100 mb-6 max-w-[200px] w-full aspect-square flex items-center justify-center">
            {/* SVG Vector QR Code for instant crisp rendering */}
            <svg 
              viewBox="0 0 29 29" 
              className="w-full h-full text-zinc-900 fill-current shape-rendering-crispEdges"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Markers top left, top right, bottom left */}
              <path d="M0 0h7v7H0zm1 1h5v5H1zm1 1h3v3H2zm20-2h7v7h-7zm1 1h5v5h-5zm1 1h3v3h-3zM0 22h7v7H0zm1 1h5v5H1zm1 1h3v3H2z" />
              {/* Random QR code pixels grid */}
              <path d="M9 0h2v1H9zm4 0h1v2h-1zm3 0h2v1h-2zm4 0h1v1h-1zm-10 2h3v1h-3zm4 0h1v1h-1zm3 0h1v2h-1zm-6 2h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm1 1h2v1h-2zm-9 1h1v3h-1zm2 0h1v1h-1zm2 0h2v2h-2zm-3 2h2v1h-2zm3 0h1v1h-1zm6 0h1v1h-1zm-9 2h2v1H9zm3 0h1v1h-1zm2 0h3v1h-3zm5 0h1v1h-1zm-8 2h1v1h-1zm2 0h2v1h-2zm6 0h2v2h-2zm-7 2h1v1h-1zm2 0h1v2h-1zm2 0h2v1h-2zm5 0h1v1h-1zm-8 2h2v1H9zm4 0h2v1h-2zm4 0h1v1h-1z" />
            </svg>
          </div>

          {/* CODE TEXT */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Coupon Code
            </span>
            <div className="text-2xl font-mono font-black text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl px-6 py-3.5 tracking-widest shadow-sm select-all">
              {couponCode}
            </div>
          </div>

          {/* Valid Till Date */}
          <div className="mt-5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Valid Till <span className="text-red-500 font-bold">{couponExpiry}</span>
          </div>

          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium leading-normal max-w-xs mt-3.5">
            Valid for a single purchase. <br />
            Generate a new code in the app for each purchase.
          </p>

          {/* Stars */}
          <div className="flex gap-1.5 my-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  className={`w-7 h-7 stroke-[1.5] ${
                    star <= rating 
                      ? "fill-amber-400 text-amber-400" 
                      : "text-zinc-300 dark:text-zinc-700"
                  }`} 
                />
              </button>
            ))}
          </div>

          {/* Rate us on Google Play button */}
          <button
            onClick={() => {
              alert("Thank you for your rating! Redirecting to Google Play...");
              closeCouponSuccess();
            }}
            className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:to-red-600 text-white py-4 rounded-2xl text-xs font-bold shadow-lg shadow-red-500/20 transition-all cursor-pointer active:scale-95"
          >
            Rate us on Google
          </button>
        </div>

      </div>
    </div>
  );
}
