"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../lib/AppContext";
import { Offer, getOffers } from "../lib/db";
import { 
  X, Share2, Heart, Star, Phone, ChevronRight, 
  MapPin, Check, MessageSquare, Send, Clock, Utensils, CreditCard, Car, ShoppingBag, Copy, ThumbsUp
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

  const [activeTab, setActiveTab] = useState<"offers" | "vouchers" | "about" | "reviews">("offers");
  const [shopOffers, setShopOffers] = useState<Offer[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const isLiked = selectedShop ? !!likedShops[selectedShop.id] : false;
  
  // Feedback form state
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [localComments, setLocalComments] = useState<{ username: string; rating: number; text: string; date: string; likes?: number }[]>([]);

  useEffect(() => {
    if (!selectedShop) return;
    
    // Load offers for this shop
    getOffers().then((allOffers) => {
      const filtered = allOffers.filter(o => o.shopId === selectedShop.id);
      
      // Pin the selectedOffer to the top if present
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

    // Mock initial customer reviews for Wireframe Image 4 alignment
    const initialReviews = [
      {
        username: "Rahul Sharma",
        rating: 5,
        text: "Amazing food and excellent service. The ambience is so warm and cozy. Highly recommended!",
        date: "2 days ago",
        likes: 12
      },
      {
        username: "Anitha Krishnan",
        rating: 5,
        text: "Food is really good. Loved the pizza and mocktails. Will visit again!",
        date: "1 week ago",
        likes: 8
      }
    ];

    setLocalComments(initialReviews);
    setCurrentImageIndex(0);
    setActiveTab("offers");
  }, [selectedShop, selectedOffer]);

  if (!selectedShop) return null;

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    const newComment = {
      username: reviewName,
      rating: reviewRating,
      text: reviewText,
      date: "Just now",
      likes: 0
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
        <div className="relative h-60 md:h-72 w-full bg-zinc-100 dark:bg-zinc-800 shrink-0">
          <img
            src={selectedShop.gallery[currentImageIndex] || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"}
            alt={selectedShop.name}
            className="w-full h-full object-cover transition-all duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

          {/* Action buttons (Share, Heart, Close) */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
            <div className="flex gap-2.5 ml-auto">
              <button className="bg-white/95 dark:bg-zinc-900/95 text-zinc-800 dark:text-white p-2.5 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer">
                <Share2 className="w-4.5 h-4.5" />
              </button>
              
              <button 
                onClick={() => selectedShop && toggleShopLike(selectedShop.id)}
                className="bg-white/95 dark:bg-zinc-900/95 p-2.5 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Heart className={`w-4.5 h-4.5 ${isLiked ? "fill-red-600 text-red-600" : "text-zinc-650 dark:text-zinc-300"}`} />
              </button>

              <button
                onClick={closeShopDetails}
                className="bg-white/95 dark:bg-zinc-900/95 text-zinc-800 dark:text-white p-2.5 rounded-full shadow-lg transition-transform active:scale-95 focus:outline-none cursor-pointer"
                title="Close Modal"
              >
                <X className="w-4.5 h-4.5" />
              </button>
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

        {/* 2. Shop Header Bar */}
        <div className="p-6 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                {selectedShop.name}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{selectedShop.address}</span>
              </p>
            </div>

            {/* Rating Box */}
            <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-md">
              <Star className="w-4 h-4 fill-current" />
              <span>{selectedShop.rating || 4.5}</span>
              <span className="text-[10px] font-normal opacity-90">({selectedShop.reviewsCount || 128})</span>
            </div>
          </div>
        </div>

        {/* 3. 4-Tab Navigation Header (Wireframes 3 & 4: Offers, Vouchers, About Store, Reviews) */}
        <div className="bg-red-600 px-2 py-1.5 sticky top-0 z-30 shrink-0 shadow-md">
          <div className="flex justify-around items-center">
            {[
              { id: "offers", label: "Offers" },
              { id: "vouchers", label: "Vouchers" },
              { id: "about", label: "About Store" },
              { id: "reviews", label: "Reviews" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 text-xs font-black uppercase tracking-wider transition-all duration-200 relative cursor-pointer ${
                  activeTab === tab.id 
                    ? "text-white scale-105" 
                    : "text-red-100 opacity-80 hover:opacity-100"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full animate-scale-up" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Tab Content Area */}
        <div className="p-6 flex-1 bg-zinc-50 dark:bg-zinc-950">
          
          {/* TAB 1: OFFERS */}
          {activeTab === "offers" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-extrabold uppercase text-zinc-500 tracking-wider">
                  All Offers in this Store
                </h3>
                <span className="text-xs font-bold text-red-600">{shopOffers.length} Offers</span>
              </div>
              
              {shopOffers.length > 0 ? (
                shopOffers.map((offer) => {
                  return (
                    <div 
                      key={offer.id} 
                      onClick={() => openOfferDetails(offer)}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-100 border border-zinc-100 relative">
                        <img src={offer.businessLogo} alt={offer.title} className="w-full h-full object-cover" />
                        <div className="absolute top-0 left-0 bg-red-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-br-lg">
                          {offer.discount}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black text-red-600 uppercase block mb-0.5">
                          {offer.discount} OFF
                        </span>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-red-600 transition-colors">
                          {offer.title}
                        </h4>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-sm font-black text-zinc-900 dark:text-white">
                            ₹{offer.ouiyaPrice}
                          </span>
                          {offer.originalPrice && (
                            <span className="text-xs text-zinc-400 line-through">
                              ₹{offer.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-red-600 shrink-0" />
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-zinc-400 text-xs">No active offers currently listed for this store.</div>
              )}
            </div>
          )}

          {/* TAB 2: VOUCHERS (Wireframe Image 3) */}
          {activeTab === "vouchers" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-extrabold uppercase text-zinc-500 tracking-wider">
                  All Vouchers
                </h3>
                <span className="text-xs font-bold text-red-600">3 Vouchers</span>
              </div>
              
              {[
                { code: "CAFE100", title: "Flat ₹100 OFF", desc: "On Minimum Bill of ₹500", expiry: "31 May 2025" },
                { code: "CAFE200", title: "Flat ₹200 OFF", desc: "On Minimum Bill of ₹1000", expiry: "31 May 2025" },
                { code: "DESSERT", title: "Free Dessert", desc: "On Orders Above ₹749", expiry: "31 May 2025" }
              ].map((vouch, idx) => (
                <div 
                  key={idx}
                  className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-950 rounded-2xl overflow-hidden shadow-sm flex items-stretch border-l-4 border-l-red-600"
                >
                  <div className="bg-red-600 text-white p-4 flex flex-col justify-center items-center w-28 shrink-0">
                    <span className="text-lg font-black">{vouch.title.split(" ")[1] || "DEAL"}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">{vouch.title.split(" ")[2] || "OFF"}</span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white">{vouch.title}</h4>
                      <p className="text-xs text-zinc-500 font-medium">{vouch.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
                        <span>Code: <strong>{vouch.code}</strong></span>
                        <button 
                          onClick={() => copyVoucherCode(vouch.code)}
                          className="hover:text-red-600 ml-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          const voucherOffer: Offer = {
                            id: `vouch-${vouch.code}`,
                            title: `${vouch.title} - ${selectedShop.name}`,
                            subTitle: vouch.desc,
                            description: `${vouch.desc}. Code: ${vouch.code}`,
                            businessName: selectedShop.name,
                            businessLogo: selectedShop.logoUrl,
                            discount: vouch.title,
                            rating: selectedShop.rating,
                            reviewsCount: selectedShop.reviewsCount,
                            code: vouch.code,
                            category: "Vouchers",
                            location: selectedShop.address,
                            ouiyaPrice: 50,
                            originalPrice: 100,
                            aboutOffer: "Redeem this voucher at store counter before billing.",
                            offerPeriod: `Valid Till: ${vouch.expiry}`,
                            termsAndConditions: ["Valid on dine-in & takeaway.", "Show code before bill generated."],
                            shopId: selectedShop.id
                          };
                          addToCart(voucherOffer);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
                      >
                        Use Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {copiedCode && (
                <div className="bg-emerald-600 text-white text-xs font-bold p-2.5 rounded-xl text-center shadow-md animate-fade-in">
                  Coupon Code {copiedCode} Copied to Clipboard!
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ABOUT STORE (Wireframe Image 4) */}
          {activeTab === "about" && (
            <div className="space-y-6">
              {/* Photo Gallery Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-zinc-500 tracking-wider">
                  About {selectedShop.name}
                </h3>
                <div className="relative h-44 rounded-2xl overflow-hidden shadow-md group cursor-pointer">
                  <img src={selectedShop.gallery[0] || selectedShop.logoUrl} alt="Store main" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-black text-sm bg-black/60 px-4 py-2 rounded-full border border-white/20">
                      18+ Photos
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Paragraph */}
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                {selectedShop.about || "A cozy café in the heart of White Town, Pondicherry serving delicious food, refreshing beverages and good vibes. Perfect place for family, friends and food lovers."}
              </p>

              {/* Store Metadata List */}
              <div className="space-y-3.5 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs">
                <div className="flex items-start gap-3">
                  <Utensils className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-zinc-900 dark:text-white block">Cuisine</span>
                    <span className="text-zinc-500 font-semibold">Continental, Italian, Beverages</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-zinc-900 dark:text-white block">Average Cost for Two</span>
                    <span className="text-zinc-500 font-semibold">₹800 for two people (approx.)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-zinc-900 dark:text-white block">Timings</span>
                    <span className="text-zinc-500 font-semibold">Mon - Sun : 10:00 AM - 11:00 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-zinc-900 dark:text-white block">Phone</span>
                    <a href={`tel:${selectedShop.phone}`} className="text-red-600 font-bold hover:underline">
                      {selectedShop.phone || "+91 98765 43210"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-zinc-900 dark:text-white block">Address</span>
                    <span className="text-zinc-500 font-semibold">
                      {selectedShop.address || "27, Dumas Street, White Town, Pondicherry - 605001"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amenities Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: "Dine-in", icon: Utensils },
                  { label: "Takeaway", icon: ShoppingBag },
                  { label: "Card Accepted", icon: CreditCard },
                  { label: "Parking", icon: Car }
                ].map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <span key={idx} className="inline-flex items-center gap-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-xl text-[11px] font-bold">
                      <IconComp className="w-3.5 h-3.5 text-red-600" />
                      <span>{item.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS (Wireframe Image 4) */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Overall Rating & Breakdown Header */}
              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-around border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-black text-zinc-900 dark:text-white">
                      <Star className="w-6 h-6 text-emerald-500 fill-current" />
                      <span>4.5</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Overall Rating</span>
                  </div>

                  <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />

                  <div className="text-center">
                    <span className="text-2xl font-black text-zinc-900 dark:text-white block">128</span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Reviews</span>
                  </div>
                </div>

                {/* Rating Breakdown Progress Bars */}
                <div className="space-y-1.5 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                  {[
                    { stars: "5★", percent: "70%" },
                    { stars: "4★", percent: "20%" },
                    { stars: "3★", percent: "7%" },
                    { stars: "2★", percent: "2%" },
                    { stars: "1★", percent: "1%" }
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 text-right shrink-0">{row.stars}</span>
                      <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: row.percent }} />
                      </div>
                      <span className="w-8 text-right text-[10px] text-zinc-400">{row.percent}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Highlight Tags */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-zinc-500 tracking-wider">What customers say</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                    Great Food (45)
                  </span>
                  <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                    Good Ambience (32)
                  </span>
                  <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                    Value for Money (28)
                  </span>
                </div>
              </div>

              {/* Feedback Input form */}
              <form onSubmit={handleAddReview} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Rate your experience:</span>
                  <div className="flex gap-1 select-none">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none cursor-pointer"
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
                    placeholder="Write your review for Cafe Des Arts..."
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

              {/* Reviews List */}
              <div className="space-y-4">
                {localComments.map((comment, idx) => (
                  <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-black text-zinc-900 dark:text-white">{comment.username}</span>
                      <span className="text-[10px] text-zinc-400 font-semibold">{comment.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < comment.rating ? "fill-current" : "text-zinc-200"}`} />
                      ))}
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                      {comment.text}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 hover:text-red-600 cursor-pointer">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{comment.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
