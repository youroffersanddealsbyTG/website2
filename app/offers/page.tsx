"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../lib/AppContext";
import { getOffers, getBusinesses, getBusinessesFromFirebase, getCategories, Offer, Business } from "../../lib/db";
import { 
  ArrowLeft, Search, Star, Heart, MapPin, 
  Sparkles, Flame, Percent, ChevronRight 
} from "lucide-react";

export default function CategoryBrowseView() {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    setTab, 
    searchQuery, 
    setSearchQuery,
    openShopDetails,
    likedShops,
    toggleShopLike
  } = useApp();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const activeOffers = await getOffers({
        category: selectedCategory,
        query: searchQuery
      });
      setOffers(activeOffers);

      const allBiz = await getBusinessesFromFirebase();
      if (selectedCategory && selectedCategory !== "All") {
        const filteredBiz = allBiz.filter((b) => 
          activeOffers.some((o) => o.shopId === b.id || o.businessName.toLowerCase() === b.name.toLowerCase())
        );
        setBusinesses(filteredBiz.length > 0 ? filteredBiz : allBiz);
      } else {
        setBusinesses(allBiz);
      }
    };
    fetchData();
  }, [selectedCategory, searchQuery]);

  const handleBack = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setTab("home");
  };



  // Popular and Recommended subgroups in this category
  const categoryPopular = offers.filter(o => o.isTopOffer);
  const categoryRecommended = offers.slice().reverse(); // Mock recommended

  return (
    <div className="w-full pb-20 animate-fade-in select-none">
      
      {/* 1. Header (Dark) */}
      <div className="bg-zinc-950 border-b border-zinc-900 px-6 py-5 flex justify-between items-center text-white shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack} 
            className="hover:bg-zinc-900 border border-zinc-800 p-2 rounded-full transition-colors focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-black tracking-wider uppercase">
            {searchQuery ? "Search Results" : (selectedCategory === "All" ? "OUIYA" : selectedCategory)}
          </h2>
        </div>
        
        <button 
          onClick={handleBack}
          className="hover:bg-zinc-900 border border-zinc-800 p-2 rounded-full transition-colors focus:outline-none cursor-pointer"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Main Browse Feed Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        
        {/* Search details status */}
        {(searchQuery || selectedCategory !== "All") && (
          <div className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold px-1">
            Showing results for {searchQuery ? `"${searchQuery}"` : selectedCategory} • {offers.length} offers found
          </div>
        )}

        {/* 2. Popular Deals (Horizontal Scroll) */}
        {categoryPopular.length > 0 && (
          <section className="space-y-3.5">
            <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
              Popular Deals
            </h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-1.5 -mx-4 px-4 scroll-smooth">
              {categoryPopular.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => openShopDetails(offer.shopId, offer)}
                  className="w-44 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer shrink-0 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <img src={offer.businessLogo} alt={offer.businessName} className="h-28 w-full object-cover" />
                  <div className="p-3 space-y-1">
                    <span className="text-[9px] font-black text-red-500 uppercase">{offer.discount}</span>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">{offer.businessName}</h4>
                    <p className="text-[10px] text-zinc-400 truncate leading-none mt-0.5">{offer.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Recommended for you (Horizontal Scroll) */}
        {categoryRecommended.length > 0 && (
          <section className="space-y-3.5">
            <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
              Recommended for you
            </h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-1.5 -mx-4 px-4 scroll-smooth">
              {categoryRecommended.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => openShopDetails(offer.shopId, offer)}
                  className="w-48 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-3 shadow-sm hover:shadow-md cursor-pointer shrink-0 flex gap-3 items-center"
                >
                  <img src={offer.businessLogo} alt={offer.businessName} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">{offer.businessName}</h4>
                    <span className="text-[10px] font-black text-red-500 uppercase block mt-0.5">{offer.discount}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Brands Section (Horizontal Scroll of logos) */}
        <section className="space-y-3.5">
          <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
            Brands
          </h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
            {businesses.map((biz) => (
              <button
                key={biz.id}
                onClick={() => openShopDetails(biz.id)}
                className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 flex items-center justify-center p-2.5 shadow-sm hover:border-red-500 transition-all shrink-0 cursor-pointer"
              >
                <img src={biz.logoUrl} alt={biz.name} className="w-full h-full object-contain rounded-xl" />
              </button>
            ))}
          </div>
        </section>

        {/* 5. Shops List (Double Layout Card System!) */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
            Available Shops & Offers
          </h3>

          <div className="space-y-5">
            {businesses.map((biz) => {
              // Get the primary offer for this shop
              const shopOffer = offers.find(o => o.shopId === biz.id || o.businessName.toLowerCase() === biz.name.toLowerCase());

              if (!shopOffer) return null;

              const isLiked = likedShops[biz.id];
              const hasVoucher = biz.hasVoucher && biz.vouchers && biz.vouchers.length > 0;
              const voucher = biz.vouchers?.[0];

              return (
                <div 
                  key={biz.id}
                  onClick={() => openShopDetails(biz.id, shopOffer)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* MAIN CARD SECTION */}
                  <div className="p-5 flex gap-4 items-center justify-between">
                    {/* Left side Image */}
                    <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-100">
                      <img src={biz.logoUrl} alt={biz.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0 space-y-1.5 pl-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-black text-zinc-900 dark:text-white truncate">
                          {biz.name}
                        </h4>
                        <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-black">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{biz.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate font-semibold flex items-center gap-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{biz.address}</span>
                      </p>

                      <div className="flex items-center gap-2 flex-wrap pt-0.5">
                        <span className="text-[10px] font-black uppercase text-red-500">
                          {shopOffer.discount}
                        </span>
                        {shopOffer.ouiyaPrice && (
                          <>
                            <span className="text-zinc-300 dark:text-zinc-700 text-xs font-semibold">•</span>
                            <span className="text-xs font-black text-zinc-900 dark:text-white">
                              ₹{shopOffer.ouiyaPrice}
                            </span>
                            {shopOffer.originalPrice && (
                              <span className="text-[10px] text-zinc-400 line-through">
                                ₹{shopOffer.originalPrice}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right side: Like Heart button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleShopLike(biz.id); }}
                      className="bg-zinc-50 dark:bg-zinc-800 p-2.5 rounded-full text-zinc-400 hover:text-red-500 transition-colors shadow-sm self-start"
                    >
                      <Heart className={`w-4.5 h-4.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                  </div>

                  {/* INTEGRATED VOUCHER CARD (Double Card Layout) */}
                  {hasVoucher && voucher && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-4 flex justify-between items-center shadow-md relative overflow-hidden border border-indigo-400/20">
                        {/* Decorative circle */}
                        <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                        
                        <div className="space-y-0.5 relative z-10">
                          <span className="text-[8px] font-black tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-full uppercase">
                            GIFT VOUCHER
                          </span>
                          <h5 className="text-xs font-bold mt-1">
                            {biz.name} Value Voucher
                          </h5>
                          <p className="text-[9px] text-indigo-100">
                            Valid Till: {voucher.expiry}
                          </p>
                        </div>

                        <div className="text-right relative z-10">
                          <span className="text-lg font-black tracking-tight block">
                            {voucher.discount}
                          </span>
                          <span className="text-[9px] font-black uppercase text-indigo-200 tracking-wider">
                            CLAIM NOW
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
