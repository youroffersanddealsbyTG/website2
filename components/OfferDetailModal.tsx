"use client";

import React from "react";
import { useApp } from "../lib/AppContext";
import { X, Calendar, Info, ShieldAlert, ShoppingCart, MapPin, Navigation, Tag, Gift, Star } from "lucide-react";

export default function OfferDetailModal() {
  const { selectedOffer, closeOfferDetails, addToCart } = useApp();

  if (!selectedOffer) return null;

  const originalPrice = selectedOffer.originalPrice || Math.round(selectedOffer.ouiyaPrice * 1.4);
  const youSaveAmount = originalPrice - selectedOffer.ouiyaPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-md animate-fade-in"
        onClick={closeOfferDetails}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl p-6 overflow-y-auto no-scrollbar z-10 flex flex-col justify-between gap-6 animate-slide-up border border-zinc-100 dark:border-zinc-800">
        
        {/* Close Button */}
        <button
          onClick={closeOfferDetails}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Details */}
        <div className="space-y-5">
          {/* Offer Image Header with Discount Tag */}
          <div className="relative h-48 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
            <img
              src={selectedOffer.businessLogo || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"}
              alt={selectedOffer.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-md">
              {selectedOffer.discount}
            </div>
          </div>

          {/* Store Info */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white leading-tight">
                  {selectedOffer.businessName}
                </h2>
                <p className="text-xs text-zinc-500 font-semibold mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>{selectedOffer.location || "White Town, Pondicherry"}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-xl text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{selectedOffer.rating || 4.5}</span>
              </div>
            </div>
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mt-2">{selectedOffer.title}</p>
          </div>

          {/* Pricing Summary Box (Wireframe Image 3) */}
          <div className="bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-4 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase block">Original Price</span>
              <span className="text-sm font-black text-zinc-500 line-through">₹{originalPrice}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-red-600 uppercase block">Offer Price</span>
              <span className="text-lg font-black text-red-600">₹{selectedOffer.ouiyaPrice}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase block">You Save</span>
              <span className="text-sm font-black text-emerald-600">₹{youSaveAmount}</span>
            </div>
          </div>

          {/* Terms Grid Badges (Wireframe Image 3) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-xl text-center">
              <span className="text-[9px] text-zinc-400 block font-bold">Valid Till</span>
              <span className="font-black text-zinc-800 dark:text-zinc-200">{selectedOffer.expiryDate || "31 May 2025"}</span>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-xl text-center">
              <span className="text-[9px] text-zinc-400 block font-bold">Min Bill</span>
              <span className="font-black text-zinc-800 dark:text-zinc-200">₹{selectedOffer.ouiyaPrice}</span>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-xl text-center">
              <span className="text-[9px] text-zinc-400 block font-bold">Max Discount</span>
              <span className="font-black text-zinc-800 dark:text-zinc-200">₹1000</span>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-xl text-center">
              <span className="text-[9px] text-zinc-400 block font-bold">Use While</span>
              <span className="font-black text-zinc-800 dark:text-zinc-200">Dine-in</span>
            </div>
          </div>

          {/* Extra Savings Invite Card (Wireframe Image 3) */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Extra Savings!</span>
              <h4 className="text-xs font-bold pt-1">Invite your friends & you both get</h4>
              <p className="text-sm font-black text-yellow-300">₹50 Cashback</p>
            </div>
            <button className="bg-white text-red-600 text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-md cursor-pointer hover:bg-red-50">
              Invite Now
            </button>
          </div>

          {/* About this offer */}
          <div className="space-y-1.5 pt-1">
            <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">About This Offer</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
              {selectedOffer.aboutOffer || selectedOffer.description || "Enjoy flat discount on your total bill. Great food, cozy ambiance, and now amazing savings!"}
            </p>
          </div>
        </div>

        {/* Action Buttons: Directions & Claim Offer */}
        <div className="grid grid-cols-12 gap-3 pt-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOffer.businessName + " Pondicherry")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-4 border border-zinc-300 dark:border-zinc-700 hover:border-red-600 text-zinc-800 dark:text-zinc-200 font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Navigation className="w-4 h-4 text-red-600" />
            <span>Directions</span>
          </a>

          <button
            onClick={() => {
              addToCart(selectedOffer);
              closeOfferDetails();
            }}
            className="col-span-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl text-xs shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Claim Offer (Get Coupon & Save)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
