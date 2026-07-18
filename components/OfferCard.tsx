"use client";

import React from "react";
import { Star, Ticket, ExternalLink } from "lucide-react";
import { Offer } from "../lib/db";

interface OfferCardProps {
  offer: Offer;
  onViewOffer: (offer: Offer) => void;
}

export default function OfferCard({ offer, onViewOffer }: OfferCardProps) {
  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Visual Header/Image */}
      <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <img
          src={offer.businessLogo || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=60"}
          alt={offer.businessName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-zinc-950/70 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full">
          {offer.category}
        </span>
        {/* Discount Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end">
          <span className="text-white text-xl font-black tracking-tight drop-shadow-md">
            {offer.discount}
          </span>
          <span className="text-zinc-200 text-xs font-semibold drop-shadow-sm">
            {offer.subTitle}
          </span>
        </div>
      </div>

      {/* Info & Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white line-clamp-1">
              {offer.businessName}
            </h3>
            {/* Rating */}
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-lg text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{offer.rating}</span>
              <span className="text-[10px] text-zinc-400 font-medium">({offer.reviewsCount})</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {offer.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Ticket className="w-4 h-4 rotate-90 text-primary" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              {offer.isCoupon ? "Coupon" : "Deal"}
            </span>
          </div>
          <button
            onClick={() => onViewOffer(offer)}
            className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary-hover hover:underline transition-colors focus:outline-none cursor-pointer"
          >
            <span>View Offer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
