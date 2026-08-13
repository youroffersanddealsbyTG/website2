"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../lib/AppContext";
import { Offer, getOffers } from "../lib/db";
import { 
  X, Share2, Heart, Star, Phone, ChevronRight, 
  MapPin, Check, MessageSquare, Send 
} from "lucide-react";

export default function ShopDetailModal() {
  const { 
    selectedShop, 
    closeShopDetails, 
    selectedOffer, 
    openOfferDetails,
    addToCart,
    likedShops,
    toggleShopLike 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"offers" | "vouchers" | "subscription" | "about">("offers");
  const [shopOffers, setShopOffers] = useState<Offer[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const isLiked = selectedShop ? !!likedShops[selectedShop.id] : false;
  
  // Feedback form state
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [localComments, setLocalComments] = useState<{ username: string; rating: number; text: string; date: string }[]>([]);

  useEffect(() => {
    if (!selectedShop) return;
    
    // Load offers for this shop
    getOffers().then((allOffers) => {
      const filtered = allOffers.filter(o => o.shopId === selectedShop.id);
      
      // Pin the selectedOffer to the very top if it exists
      if (selectedOffer) {
        const otherOffers = filtered.filter(o => o.id !== selectedOffer.id);
        const clicked = filtered.find(o => o.id === selectedOffer.id);
        if (clicked) {
          setShopOffers([clicked, ...otherOffers]);
        } else {
          setShopOffers(filtered);
        }
      } else {
        setShopOffers(filtered);
      }
    });

    // Fetch reviews from Firestore
    import("../lib/db").then(({ getReviewsForShop }) => {
      getReviewsForShop(selectedShop.id).then((fsReviews) => {
        if (fsReviews.length > 0) {
          const formatted = fsReviews.map(r => ({
            username: r.userName,
            rating: r.rating,
            text: r.comment,
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB") : "Recently"
          }));
          setLocalComments([...formatted, ...(selectedShop.comments || [])]);
        } else {
          setLocalComments(selectedShop.comments || []);
        }
      });
    });

    setCurrentImageIndex(0);
    setActiveTab("offers");
  }, [selectedShop, selectedOffer]);

  if (!selectedShop) return null;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    const newComment = {
      username: reviewName,
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    };

    setLocalComments([newComment, ...localComments]);
    setReviewName("");
    setReviewText("");
    setReviewRating(5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 select-none">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-md animate-fade-in"
        onClick={closeShopDetails}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-zinc-900 w-full h-full md:h-[90vh] md:max-w-2xl md:rounded-3xl shadow-2xl overflow-y-auto no-scrollbar z-10 flex flex-col animate-slide-up">
        
        {/* 1. Header/Carousel of Images */}
        <div className="relative h-64 md:h-72 w-full bg-zinc-100 dark:bg-zinc-800 shrink-0">
          <img
            src={selectedShop.gallery[currentImageIndex] || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"}
            alt={selectedShop.name}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

          {/* Action buttons (Share, Heart, Close) */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
            <div className="flex gap-2.5 ml-auto">
              <button className="bg-white/95 dark:bg-zinc-900/95 text-zinc-800 dark:text-white p-2.5 rounded-full shadow-lg transition-transform active:scale-95">
                <Share2 className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => selectedShop && toggleShopLike(selectedShop.id)}
                className="bg-white/95 dark:bg-zinc-900/95 p-2.5 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-zinc-650 dark:text-zinc-300"}`} />
              </button>

              {!selectedOffer && (
                <button
                  onClick={closeShopDetails}
                  className="bg-white/95 dark:bg-zinc-900/95 text-zinc-800 dark:text-white p-2.5 rounded-full shadow-lg transition-transform active:scale-95 focus:outline-none cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Carousel dots indicators */}
          {selectedShop.gallery.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {selectedShop.gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentImageIndex ? "w-5 bg-white" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. Shop Info Banner */}
        <div className="p-6 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                {selectedShop.name}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{selectedShop.address}</span>
              </p>
            </div>

            {/* Rating Box */}
            <div className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-md shadow-amber-500/20">
              <Star className="w-4 h-4 fill-current" />
              <span>{selectedShop.rating}</span>
            </div>
          </div>

          {/* Phone call pill */}
          <div className="mt-4 flex">
            <a
              href={`tel:${selectedShop.phone}`}
              className="inline-flex items-center gap-2 bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>{selectedShop.phone}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>

        {/* 3. Navigation Tabs in Red Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-2 py-1 sticky top-0 z-30 shrink-0 shadow-md">
          <div className="flex justify-around items-center">
            {(["offers", "vouchers", "subscription", "about"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 relative cursor-pointer ${
                  activeTab === tab 
                    ? "text-white scale-105" 
                    : "text-red-100 opacity-70 hover:opacity-100"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full animate-scale-up" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Tab Content */}
        <div className="p-6 flex-1 bg-zinc-50 dark:bg-zinc-950">
          
          {/* A. Offers Tab */}
          {activeTab === "offers" && (
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider mb-2">
                Available Offers
              </h3>
              
              {shopOffers.length > 0 ? (
                shopOffers.map((offer) => {
                  const isPinned = selectedOffer && offer.id === selectedOffer.id;
                  return (
                    <div 
                      key={offer.id} 
                      className={`bg-white dark:bg-zinc-900 border rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4 transition-all duration-300 ${
                        isPinned 
                          ? "border-red-500 shadow-red-500/5 ring-1 ring-red-500/20 scale-[1.01]" 
                          : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                            {offer.discount}
                          </span>
                          {isPinned && (
                            <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                              Selected Offer
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                          {offer.title}
                        </h4>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 line-clamp-1">
                          {offer.subTitle}
                        </p>
                        
                        <div className="mt-2.5 flex items-baseline gap-1.5 font-bold">
                          {offer.ouiyaPrice && (
                            <span className="text-zinc-900 dark:text-white text-lg">
                              ₹{offer.ouiyaPrice}
                            </span>
                          )}
                          {offer.originalPrice && (
                            <span className="text-zinc-400 dark:text-zinc-500 text-xs line-through">
                              ₹{offer.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => openOfferDetails(offer)}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-red-600/10 cursor-pointer transition-all active:scale-95"
                      >
                        Details
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-zinc-400">No active offers for this store.</div>
              )}
            </div>
          )}

          {/* B. Vouchers Tab */}
          {activeTab === "vouchers" && (
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider mb-2">
                Gift Vouchers
              </h3>
              
              {selectedShop.vouchers && selectedShop.vouchers.length > 0 ? (
                selectedShop.vouchers.map((vouch) => (
                  <div 
                    key={vouch.id} 
                    className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700 text-white rounded-2xl p-5 shadow-lg overflow-hidden border border-indigo-400/20"
                  >
                    {/* Decorative Background Circles */}
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute left-1/3 top-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />

                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
                          GIFT VOUCHER
                        </span>
                        <h4 className="text-lg font-black mt-2">
                          {selectedShop.name}
                        </h4>
                        <p className="text-xs text-indigo-100 mt-1">
                          Valid Till {vouch.expiry}
                        </p>
                      </div>

                      <span className="text-3xl font-black tracking-tight drop-shadow-md">
                        {vouch.discount}
                      </span>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
                      <div className="font-mono text-sm tracking-widest text-indigo-100 font-bold bg-black/10 px-3 py-1.5 rounded-xl border border-white/5">
                        Code: {vouch.code}
                      </div>

                      <button
                        onClick={() => {
                          // Standardize as an offer to add to cart
                          const voucherAsOffer: Offer = {
                            id: vouch.id,
                            title: vouch.title,
                            subTitle: "Special Gift Voucher",
                            description: `Enjoy a flat ${vouch.discount} voucher. Expiry: ${vouch.expiry}`,
                            businessName: selectedShop.name,
                            businessLogo: selectedShop.logoUrl,
                            discount: vouch.discount,
                            rating: selectedShop.rating,
                            reviewsCount: selectedShop.reviewsCount,
                            code: vouch.code,
                            category: "Vouchers",
                            location: "All Locations",
                            ouiyaPrice: 250, // mock price for vouchers
                            originalPrice: 500,
                            aboutOffer: "Claim a gift voucher that applies to your entire bill.",
                            offerPeriod: `Valid till ${vouch.expiry}`,
                            termsAndConditions: ["Subject to store conditions.", "Cannot be split."],
                            shopId: selectedShop.id
                          };
                          addToCart(voucherAsOffer);
                        }}
                        className="bg-white text-indigo-600 hover:bg-zinc-50 px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95"
                      >
                        Claim Voucher
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-400">No active gift vouchers.</div>
              )}
            </div>
          )}

          {/* C. Subscription Tab */}
          {activeTab === "subscription" && (
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider mb-2">
                Available Plans & Subscriptions
              </h3>
              
              {selectedShop.subscriptions && selectedShop.subscriptions.length > 0 ? (
                selectedShop.subscriptions.map((plan) => (
                  <div 
                    key={plan.id} 
                    className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                            {plan.name}
                          </h4>
                          <span className="text-[10px] uppercase tracking-wider text-red-500 font-extrabold mt-1 block">
                            EXCLUSIVE RESTAURANT PASS
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-zinc-900 dark:text-white">
                            ₹{plan.price}
                          </span>
                          <span className="text-xs text-zinc-400 block font-semibold mt-0.5">
                            / month
                          </span>
                        </div>
                      </div>

                      {/* Plan features */}
                      <ul className="mt-5 space-y-2.5">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                            <div className="bg-green-500 text-white rounded-full p-0.5 mt-0.5 shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span className="font-semibold leading-normal">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        const subscriptionAsOffer: Offer = {
                          id: plan.id,
                          title: plan.name,
                          subTitle: "Monthly Subscription Pass",
                          description: `Unlock special perks: ${plan.features.join(", ")}`,
                          businessName: selectedShop.name,
                          businessLogo: selectedShop.logoUrl,
                          discount: "Pass",
                          rating: selectedShop.rating,
                          reviewsCount: selectedShop.reviewsCount,
                          code: plan.id.toUpperCase(),
                          category: "Subscription",
                          location: "All Locations",
                          ouiyaPrice: plan.price,
                          originalPrice: plan.price * 1.5,
                          aboutOffer: `Subscription pass for ${selectedShop.name}. Get monthly coupons and exclusive benefits.`,
                          offerPeriod: "Auto-renews monthly",
                          termsAndConditions: ["Perks valid for subscriber only.", "Non-refundable."],
                          shopId: selectedShop.id
                        };
                        addToCart(subscriptionAsOffer);
                      }}
                      className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-3 rounded-2xl text-xs font-bold shadow-lg shadow-red-500/20 cursor-pointer text-center transition-all active:scale-95"
                    >
                      Get Started
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-400">No subscription packages offered at this store.</div>
              )}
            </div>
          )}

          {/* D. About Tab */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider mb-2">
                  About the Merchant
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-semibold">
                  {selectedShop.about}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider mb-3">
                  Photo Gallery
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {selectedShop.gallery.map((imgUrl, idx) => (
                    <div key={idx} className="h-20 bg-zinc-100 rounded-xl overflow-hidden shadow-sm">
                      <img src={imgUrl} alt="Store detail" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedbacks / Comments Section */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                <h3 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider mb-4 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-red-500" />
                  <span>Customer Feedback ({localComments.length})</span>
                </h3>

                {/* Feedback Input form */}
                <form onSubmit={handleAddReview} className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-4 mb-6 space-y-3.5">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Share your review:</span>
                    <div className="flex gap-1 select-none">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star className={`w-4 h-4 ${star <= reviewRating ? "fill-amber-500 text-amber-500" : "text-zinc-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                    placeholder="Your Name"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-white focus:outline-none"
                  />

                  <div className="flex items-end bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2">
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                      rows={2}
                      placeholder="Write your comment about this merchant..."
                      className="w-full bg-transparent border-none text-xs text-zinc-800 dark:text-white focus:outline-none resize-none placeholder-zinc-400"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shrink-0 cursor-pointer shadow-md transition-transform active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                  {localComments.length > 0 ? (
                    localComments.map((comment, idx) => (
                      <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm">
                        <div className="flex justify-between items-center gap-2 mb-1.5">
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{comment.username}</span>
                          <span className="text-[10px] text-zinc-400 font-medium">{comment.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-0.5 text-amber-500 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < comment.rating ? "fill-current" : "text-zinc-200"}`} />
                          ))}
                        </div>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-zinc-400">Be the first to review this business!</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
