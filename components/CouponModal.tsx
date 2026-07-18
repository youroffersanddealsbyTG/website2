"use client";

import React, { useState } from "react";
import { X, Copy, Check, Calendar, Star, Ticket } from "lucide-react";
import { Offer } from "../lib/db";

interface CouponModalProps {
  offer: Offer | null;
  onClose: () => void;
}

export default function CouponModal({ offer, onClose }: CouponModalProps) {
  const [copied, setCopied] = useState(false);

  if (!offer) return null;

  const handleCopy = () => {
    if (offer.code) {
      navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 animate-in scale-in duration-200 z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Header */}
        <div className="flex gap-4 items-center mb-6">
          <img
            src={offer.businessLogo}
            alt={offer.businessName}
            className="w-16 h-16 rounded-2xl object-cover border border-zinc-100 dark:border-zinc-800"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
                {offer.category}
              </span>
              <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{offer.rating}</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {offer.businessName}
            </h2>
          </div>
        </div>

        {/* Discount Info */}
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 mb-6 text-center">
          <span className="block text-3xl font-black tracking-tight text-primary uppercase mb-1">
            {offer.discount}
          </span>
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {offer.subTitle}
          </span>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto mt-2">
            {offer.description}
          </p>
        </div>

        {/* Expiry Details */}
        <div className="flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs mb-6">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Expires on {offer.expiryDate || "Aug 31, 2026"}</span>
        </div>

        {/* Coupon Code Section */}
        {offer.code ? (
          <div className="space-y-3">
            <span className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">
              Promo Coupon Code
            </span>
            <div className="relative flex flex-col sm:flex-row gap-3 items-center">
              <div className="w-full bg-zinc-50 dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 text-center select-all">
                <span className="font-mono text-2xl font-extrabold tracking-widest text-zinc-900 dark:text-white">
                  {offer.code}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className={`w-full sm:w-auto h-14 px-6 flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-300 cursor-pointer shadow-md ${
                  copied
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
                    : "bg-primary hover:bg-primary-hover text-white shadow-primary/25 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 animate-scale-up" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-2xl font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200"
            >
              <span>Activate Deal</span>
            </a>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal">
            Terms & Conditions: Copy the coupon code and apply it during checkout on the merchant app. Offer cannot be combined with other deals.
          </p>
        </div>

      </div>
    </div>
  );
}
