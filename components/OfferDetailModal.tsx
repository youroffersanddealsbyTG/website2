"use client";

import React from "react";
import { useApp } from "../lib/AppContext";
import { X, Calendar, Info, ShieldAlert, ShoppingCart } from "lucide-react";

export default function OfferDetailModal() {
  const { selectedOffer, closeOfferDetails, addToCart } = useApp();

  if (!selectedOffer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={closeOfferDetails}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[85vh] no-scrollbar z-10 flex flex-col justify-between gap-6 animate-slide-up border border-zinc-100 dark:border-zinc-800">
        
        {/* Close Button */}
        <button
          onClick={closeOfferDetails}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Details */}
        <div className="space-y-6">
          {/* Header card */}
          <div className="flex gap-4 items-center">
            <img
              src={selectedOffer.businessLogo}
              alt={selectedOffer.businessName}
              className="w-16 h-16 rounded-2xl object-cover border border-zinc-100 dark:border-zinc-800 shadow-sm"
            />
            <div>
              <span className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                {selectedOffer.discount}
              </span>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white mt-1 leading-tight">
                {selectedOffer.title}
              </h2>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5 block">
                {selectedOffer.businessName}
              </span>
            </div>
          </div>

          {/* Details sections */}
          <div className="space-y-5 border-t border-zinc-100 dark:border-zinc-800 pt-5">
            {/* About offer */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-red-500" />
                <span>About Offer</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed pl-5.5">
                {selectedOffer.aboutOffer || selectedOffer.description}
              </p>
            </div>

            {/* Offer period */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-red-500" />
                <span>Offer Period</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed pl-5.5">
                {selectedOffer.offerPeriod || `Valid till ${selectedOffer.expiryDate || "30th September 2026"}`}
              </p>
            </div>

            {/* Applicable on */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-red-500" />
                <span>Applicable On</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed pl-5.5">
                {selectedOffer.applicableOn || "Dine-in and Takeaway only. Taxes extra as applicable."}
              </p>
            </div>

            {/* Terms & condition */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span>Terms & Conditions</span>
              </h3>
              <ul className="space-y-1.5 pl-5.5 list-disc text-zinc-600 dark:text-zinc-400">
                {selectedOffer.termsAndConditions && selectedOffer.termsAndConditions.length > 0 ? (
                  selectedOffer.termsAndConditions.map((term, i) => (
                    <li key={i} className="text-xs font-medium leading-relaxed">
                      {term}
                    </li>
                  ))
                ) : (
                  <>
                    <li className="text-xs font-medium leading-relaxed">Cannot be clubbed with other coupon promotions.</li>
                    <li className="text-xs font-medium leading-relaxed">Show coupon code to cashier prior to billing.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={() => {
            addToCart(selectedOffer);
            closeOfferDetails();
          }}
          className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:to-red-600 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <ShoppingCart className="w-4.5 h-4.5" />
          <span>Add to cart</span>
        </button>

      </div>
    </div>
  );
}
