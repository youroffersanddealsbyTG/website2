"use client";

import React from "react";
import { Star, Ticket, ExternalLink, Heart } from "lucide-react";
import { Offer } from "../lib/db";
import { useApp } from "../lib/AppContext";

interface OfferCardProps {
  offer: Offer;
  onViewOffer: (offer: Offer) => void;
}

export default function OfferCard({ offer, onViewOffer }: OfferCardProps) {
  const { likedOffers, toggleOfferLike } = useApp();
  const isLiked = Boolean(likedOffers[offer.id]);
  const isSoldOut = (offer as any).isSoldOut || (offer as any).availableCount === 0;

  return (
    <div className="group bg-surface border border-border-main rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1 relative">
      {/* Visual Header / Image */}
      <div className="relative h-48 w-full bg-surface-hover overflow-hidden">
        <img
          src={offer.businessLogo || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=60"}
          alt={offer.businessName}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isSoldOut ? "grayscale opacity-60" : ""
          }`}
        />

        {/* Top Badges Row */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <span className="bg-zinc-950/75 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full shadow-md">
            {offer.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleOfferLike(offer.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 cursor-pointer shadow-md ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
            title={isLiked ? "Remove from favourites" : "Save to favourites"}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Sold out overlay tag */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-red-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg border border-red-400">
              CLAIMED OUT
            </span>
          </div>
        )}

        {/* Discount Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 flex flex-col justify-end">
          <div className="flex items-baseline gap-2">
            <span className="text-white text-xl font-black tracking-tight drop-shadow-md">
              {offer.discount}
            </span>
            {offer.originalPrice && offer.ouiyaPrice && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-400 line-through">₹{offer.originalPrice}</span>
                <span className="text-emerald-400 font-bold">₹{offer.ouiyaPrice}</span>
              </div>
            )}
          </div>
          <span className="text-zinc-200 text-xs font-medium line-clamp-1 drop-shadow-xs">
            {offer.subTitle}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {offer.businessName}
            </h3>
            {/* Rating */}
            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg text-amber-500 text-xs font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{offer.rating}</span>
            </div>
          </div>
          <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-4">
            {offer.description}
          </p>
        </div>

        {/* Action Bar */}
        <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted">
            <Ticket className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              {offer.isCoupon ? "Coupon" : "Deal"}
            </span>
          </div>
          <button
            onClick={() => onViewOffer(offer)}
            disabled={isSoldOut}
            className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary-hover hover:underline transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isSoldOut ? "Claimed" : "View Deal"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
