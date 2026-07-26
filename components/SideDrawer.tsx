"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../lib/AppContext";
import { getBusinesses, getOffers, Business, Offer } from "../lib/db";
import { 
  X, ArrowLeft, Home, User, Heart, ShoppingCart, Ticket, 
  Tv, Users, Settings, Sun, ChevronRight, HelpCircle, 
  LogOut, Shield, Gift, Copy, Check, Award, Store, Tag, Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SideDrawer() {
  const { 
    isDrawerOpen, 
    toggleDrawer, 
    setTab, 
    themeMode,
    setThemeMode,
    openOfferDetails,
    addToCart,
    likedShops,
    toggleShopLike,
    likedOffers,
    toggleOfferLike,
    openShopDetails
  } = useApp();

  const router = useRouter();
  const [currentView, setCurrentView] = useState<"main" | "profile" | "purchases" | "subscriptions" | "refer" | "favourites">("main");
  const [copied, setCopied] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Swipe gesture tracking
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Customer auth state
  const [customerName, setCustomerName] = useState("Karthik");
  const [customerAvatar, setCustomerAvatar] = useState("https://img.freepik.com/premium-vector/vector-3d-character-avatar-design_1170063-2287.jpg?w=200");
  const [offersList, setOffersList] = useState<Offer[]>([]);
  const [purchases, setPurchases] = useState<{
    id: string;
    businessName: string;
    title: string;
    discount: string;
    code: string;
    validTill: string;
    qrText: string;
  }[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("ouiya_customer_name") || "Karthik";
      const storedAvatar = localStorage.getItem("ouiya_customer_avatar") || "https://img.freepik.com/premium-vector/vector-3d-character-avatar-design_1170063-2287.jpg?w=200";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCustomerName(storedName);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCustomerAvatar(storedAvatar);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatarError(false);

      getOffers().then(setOffersList).catch(() => {});

      const loadPurchases = () => {
        const stored = localStorage.getItem("ouiya_purchased_coupons");
        if (stored) {
          try {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPurchases(JSON.parse(stored));
          } catch {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPurchases([]);
          }
        } else {
          const defaults = [
            {
              id: "purch-1",
              businessName: "Pizza Hut",
              title: "Double Cheese Pizza Deal",
              discount: "34% OFF",
              code: "PIZZAHUT34",
              validTill: "10 July 2026",
              qrText: "OUIYAPZHUT34"
            },
            {
              id: "purch-2",
              businessName: "Burger Hut",
              title: "Maharaja Veggie Combo Pass",
              discount: "50% OFF",
              code: "BURGER50",
              validTill: "24 July 2026",
              qrText: "OUIYABRGR50"
            }
          ];
          localStorage.setItem("ouiya_purchased_coupons", JSON.stringify(defaults));
          setPurchases(defaults);
        }
      };
      loadPurchases();
    }
  }, [isDrawerOpen]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ouiya_customer_name", "Guest User");
      localStorage.setItem("ouiya_customer_avatar", "");
      setCustomerName("Guest User");
      setCustomerAvatar("");
    }
  };

  const handleLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ouiya_customer_name", "Karthik");
      localStorage.setItem("ouiya_customer_avatar", "https://img.freepik.com/premium-vector/vector-3d-character-avatar-design_1170063-2287.jpg?w=200");
      setCustomerName("Karthik");
      setCustomerAvatar("https://img.freepik.com/premium-vector/vector-3d-character-avatar-design_1170063-2287.jpg?w=200");
    }
  };

  const buySubscription = (planName: string, price: number, logoUrl: string) => {
    const subscriptionOffer = {
      id: `sub-${planName.toLowerCase().replace(/\s+/g, "-")}`,
      title: `${planName} Subscription`,
      subTitle: "Restaurant Annual Pass",
      description: "Unlimited BOGO vouchers, priority home delivery, and extra 15% discount across all participating outlets.",
      businessName: planName,
      businessLogo: logoUrl,
      discount: "SUBSCRIPTION",
      rating: 4.9,
      reviewsCount: "1.2K",
      code: `${planName.toUpperCase().replace(/\s+/g, "").substring(0, 6)}999`,
      category: "Subscription",
      location: "Puducherry",
      originalPrice: price * 1.5,
      ouiyaPrice: price,
      shopId: "ouiya-platform"
    };

    addToCart(subscriptionOffer);
    toggleDrawer();
    setTab("cart");
  };

  // Reset view when drawer closes/opens
  useEffect(() => {
    if (!isDrawerOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentView("main");
    }
  }, [isDrawerOpen]);



  // Touch handlers for swipe-to-dismiss (right swipe closes drawer)
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diffX = e.touches[0].clientX - startX;
    // Only track dragging to the right (closing)
    if (diffX > 0) {
      setCurrentX(diffX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // If swiped more than 100px to the right, close the drawer
    if (currentX > 100) {
      toggleDrawer();
    }
    setCurrentX(0);
  };



  const handleCopyCode = () => {
    navigator.clipboard.writeText("OUIYA50REF");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  const handleOpenRedeemedQR = (purchase: {
    id: string;
    businessName: string;
    title: string;
    discount: string;
    code: string;
    validTill: string;
    qrText: string;
  }) => {
    // Open the Offer Detail screen (which displays the coupon QR page on claim/success)
    const simulatedOffer = {
      id: purchase.id,
      title: purchase.title,
      subTitle: "Redeemed Coupon Voucher",
      description: "This coupon has been successfully purchased and claimed. Present this QR code to the cashier to redeem your discount.",
      businessName: purchase.businessName,
      businessLogo: purchase.businessName === "Pizza Hut" 
        ? "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=150"
        : "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150",
      discount: purchase.discount,
      rating: 4.5,
      reviewsCount: "120",
      code: purchase.code,
      category: "Food",
      location: "Puducherry",
      originalPrice: 1500,
      ouiyaPrice: 999,
      shopId: purchase.businessName === "Pizza Hut" ? "biz-pizzahut" : "biz-burgerhut"
    };

    toggleDrawer();
    openOfferDetails(simulatedOffer);
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-end select-none transition-all duration-300 ${isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Drawer Backdrop Overlay */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
        onClick={toggleDrawer}
      />

      {/* Sliding Drawer Container Container */}
      <div
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isDrawerOpen ? `translateX(${currentX}px)` : "translateX(100%)",
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        className="relative w-full sm:w-[400px] h-full bg-white dark:bg-zinc-950 shadow-2xl flex flex-col z-10 overflow-hidden border-l border-zinc-150 dark:border-zinc-900 transition-transform duration-300"
      >
        
        {/* VIEW 1: Main Navigation Drawer Drawer */}
        {currentView === "main" && (
          <>
            {/* Header: Red Gradient Banner */}
            <div className="bg-gradient-to-b from-primary-dark via-primary to-primary-hover p-6 pb-8 text-white relative shrink-0">
              <button 
                onClick={toggleDrawer}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mt-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary font-black shadow-md border border-white/20 overflow-hidden shrink-0">
                  {!customerAvatar || avatarError ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#fa0303] to-[#970202] flex items-center justify-center text-white font-black text-2xl uppercase">
                      {customerName ? customerName.charAt(0) : "U"}
                    </div>
                  ) : (
                    <img 
                      src={customerAvatar} 
                      alt="User Avatar"
                      onError={() => setAvatarError(true)}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight leading-none">
                    {customerName === "Guest User" ? "Welcome Guest!" : customerName}
                  </h3>
                  {customerName === "Guest User" ? (
                    <button 
                      onClick={handleLogin}
                      className="text-[9px] font-extrabold uppercase tracking-widest bg-white text-primary px-3 py-1 rounded-full mt-1.5 hover:bg-zinc-100 transition-all cursor-pointer shadow-sm"
                    >
                      Login Profile
                    </button>
                  ) : (
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-red-100 mt-1 italic">
                      The offer Explorer
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="flex-grow py-6 overflow-y-auto no-scrollbar px-4 space-y-2">
              <button
                onClick={() => { setTab("home"); toggleDrawer(); router.push("/"); }}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-bold text-sm cursor-pointer"
              >
                <Home className="w-5 h-5 text-primary" />
                <span>Home</span>
              </button>

              <button
                onClick={() => setCurrentView("profile")}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-bold text-sm cursor-pointer"
              >
                <User className="w-5 h-5 text-primary" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => setCurrentView("favourites")}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-bold text-sm cursor-pointer"
              >
                <Heart className="w-5 h-5 text-primary" />
                <span>Favourite</span>
              </button>

              <button
                onClick={() => { setTab("cart"); toggleDrawer(); router.push("/"); }}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-bold text-sm cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 text-primary" />
                <span>My Cart</span>
              </button>

              <button
                onClick={() => setCurrentView("purchases")}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-bold text-sm cursor-pointer"
              >
                <Ticket className="w-5 h-5 text-primary" />
                <span>My Purchase</span>
              </button>

              <button
                onClick={() => setCurrentView("subscriptions")}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-bold text-sm cursor-pointer"
              >
                <Tv className="w-5 h-5 text-primary" />
                <span>Subscription Plans</span>
              </button>

              <button
                onClick={() => setCurrentView("refer")}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-bold text-sm cursor-pointer"
              >
                <Users className="w-5 h-5 text-primary" />
                <span>Refer a friend</span>
              </button>

              <button
                onClick={() => setCurrentView("profile")}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-bold text-sm cursor-pointer"
              >
                <Settings className="w-5 h-5 text-primary" />
                <span>Settings</span>
              </button>
            </div>
            
            {/* Footer inside drawer */}
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 text-center shrink-0">
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider block">OUIYA APP VERSION 1.2.0</span>
            </div>
          </>
        )}

        {/* VIEW 2: Profile Sub-View (Matches App Mockup 1) */}
        {currentView === "profile" && (
          <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
            {/* Header: Red Gradient with Avatar */}
            <div className="bg-gradient-to-b from-primary-dark via-primary to-primary-hover p-6 pb-12 text-white relative shrink-0 flex flex-col items-center">
              <button 
                onClick={() => setCurrentView("main")}
                className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <span className="text-base font-black uppercase tracking-wider mt-2 mb-6">
                {customerName === "Guest User" ? "Welcome Guest!" : `Hi ${customerName}!`}
              </span>

              {/* Avatar boy image */}
              <div className="w-24 h-24 rounded-full border-4 border-white bg-zinc-100 overflow-hidden shadow-xl flex items-center justify-center shrink-0">
                {!customerAvatar || avatarError ? (
                  <div className="w-full h-full bg-gradient-to-br from-[#fa0303] to-[#970202] flex items-center justify-center text-white font-black text-4xl uppercase">
                    {customerName ? customerName.charAt(0) : "U"}
                  </div>
                ) : (
                  <img 
                    src={customerAvatar} 
                    alt="Cartoon Avatar Profile" 
                    onError={() => setAvatarError(true)}
                    className="w-full h-full object-cover scale-105"
                  />
                )}
              </div>
            </div>

            {/* List options */}
            <div className="-mt-6 bg-white dark:bg-zinc-900 rounded-t-3xl p-6 flex-grow shadow-2xl space-y-1.5 overflow-y-auto no-scrollbar">
              
              <button className="flex justify-between items-center w-full py-4 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 rounded-xl text-zinc-800 dark:text-zinc-200 transition-colors font-black text-sm cursor-pointer">
                <div className="flex items-center gap-3">
                  <User className="w-4.5 h-4.5 text-zinc-500" />
                  <span>Account details</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              <button 
                onClick={() => { setTab("categories"); toggleDrawer(); router.push("/"); }}
                className="flex justify-between items-center w-full py-4 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 rounded-xl text-zinc-800 dark:text-zinc-200 transition-colors font-black text-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4.5 h-4.5 text-zinc-500" />
                  <span>Favourite</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              {/* Appearance Segment Control */}
              <div className="py-3 px-3 space-y-2">
                <div className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200 font-black text-sm">
                  <Sun className="w-4.5 h-4.5 text-zinc-500 shrink-0" />
                  <span>Theme Preference</span>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
                  <button
                    onClick={() => setThemeMode("light")}
                    className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer ${
                      themeMode === "light" 
                        ? "bg-white text-zinc-950 shadow-sm" 
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setThemeMode("dark")}
                    className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer ${
                      themeMode === "dark" 
                        ? "bg-[#fa0303] text-white shadow-sm" 
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setThemeMode("system")}
                    className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer ${
                      themeMode === "system" 
                        ? "bg-zinc-800 text-white dark:bg-zinc-900 shadow-sm" 
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}
                  >
                    System
                  </button>
                </div>
              </div>

              {/* Switch to Business Advertiser portal */}
              <button 
                onClick={() => { toggleDrawer(); router.push("/portal"); }}
                className="flex justify-between items-center w-full py-4 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 rounded-xl text-zinc-800 dark:text-zinc-200 transition-colors font-black text-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4.5 h-4.5 text-zinc-500" />
                  <span>Switch to Business</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              <hr className="border-zinc-100 dark:border-zinc-800 my-4" />

              <button className="flex justify-between items-center w-full py-4 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 rounded-xl text-zinc-800 dark:text-zinc-200 transition-colors font-black text-sm cursor-pointer">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4.5 h-4.5 text-zinc-500" />
                  <span>Help & support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              {customerName === "Guest User" ? (
                <button 
                  onClick={handleLogin}
                  className="flex justify-between items-center w-full py-4 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 rounded-xl text-emerald-600 transition-colors font-black text-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4.5 h-4.5" />
                    <span>Login Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400/50" />
                </button>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="flex justify-between items-center w-full py-4 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 rounded-xl text-red-500 transition-colors font-black text-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4.5 h-4.5" />
                    <span>Logout</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400/50" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: Favourites Sub-View */}
        {currentView === "favourites" && (() => {
          const allBusinesses = getBusinesses();
          const likedShopIds = Object.keys(likedShops).filter(id => likedShops[id]);
          const likedOfferIds = Object.keys(likedOffers).filter(id => likedOffers[id]);
          const likedShopItems = allBusinesses.filter(b => likedShopIds.includes(b.id));
          const likedOfferItems = offersList.filter(o => likedOfferIds.includes(o.id));
          const hasAny = likedShopItems.length > 0 || likedOfferItems.length > 0;

          return (
            <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-dark via-primary to-primary p-5 text-white flex items-center gap-3 shrink-0 relative shadow-md">
                <button 
                  onClick={() => setCurrentView("main")}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-base font-black uppercase tracking-wider">My Favourites</h3>
              </div>

              {/* Favourites Content */}
              <div className="flex-grow p-5 overflow-y-auto no-scrollbar space-y-6">
                {!hasAny ? (
                  <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="bg-primary/10 p-5 rounded-full">
                      <Heart className="w-12 h-12 text-primary/50" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white">No favourites yet</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold max-w-[200px]">Tap the ♥ icon on any shop or offer to save it here.</p>
                    </div>
                    <button
                      onClick={() => { toggleDrawer(); setTab("home"); }}
                      className="bg-primary hover:bg-primary-hover text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-md mt-2"
                    >
                      Explore Offers
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Liked Shops */}
                    {likedShopItems.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-500 font-extrabold uppercase tracking-wider">Liked Shops ({likedShopItems.length})</p>
                        {likedShopItems.map((shop) => (
                          <div 
                            key={shop.id}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => { toggleDrawer(); openShopDetails(shop.id); }}
                          >
                            <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                              {shop.logoUrl ? (
                                <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
                              ) : (
                                <Store className="w-5 h-5 text-zinc-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-black text-zinc-900 dark:text-white truncate group-hover:text-primary transition-colors">{shop.name}</h4>
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold truncate">{shop.address}</p>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleShopLike(shop.id); }}
                              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
                            >
                              <Heart className="w-4 h-4 fill-primary text-primary" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Liked Offers */}
                    {likedOfferItems.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-500 font-extrabold uppercase tracking-wider">Liked Offers ({likedOfferItems.length})</p>
                        {likedOfferItems.map((offer) => (
                          <div 
                            key={offer.id}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => { toggleDrawer(); openShopDetails(offer.shopId, offer); }}
                          >
                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <Tag className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-black text-zinc-900 dark:text-white truncate group-hover:text-primary transition-colors">{offer.businessName}</h4>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-black text-primary">{offer.discount}</span>
                                <span className="text-zinc-300 dark:text-zinc-700 text-[9px]">•</span>
                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold truncate">{offer.title}</span>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleOfferLike(offer.id); }}
                              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
                            >
                              <Heart className="w-4 h-4 fill-primary text-primary" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {/* VIEW 4: Purchases Sub-View (Matches App Mockup 3) */}
        {currentView === "purchases" && (
          <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-dark via-primary to-primary p-5 text-white flex items-center gap-3 shrink-0 relative shadow-md">
              <button 
                onClick={() => setCurrentView("main")}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-base font-black uppercase tracking-wider">My Purchase</h3>
            </div>

            {/* Purchases Lists scroll container */}
            <div className="flex-grow p-6 overflow-y-auto no-scrollbar space-y-6">
              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-extrabold uppercase tracking-wider mb-2">
                Redeemed Coupons & Vouchers:
              </p>
              
              {purchases.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Ticket className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto animate-pulse" />
                  <p className="text-xs text-zinc-400 font-bold">No coupons purchased yet.</p>
                </div>
              ) : purchases.map((purch) => (
                  <div 
                    key={purch.id}
                    onClick={() => handleOpenRedeemedQR(purch)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 cursor-pointer flex flex-col"
                  >
                    {/* Top Red Bar Header */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 py-3.5 px-6 flex justify-between items-center text-white shrink-0">
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">CODE</span>
                      <span className="text-xs font-mono font-black tracking-widest leading-none">{purch.code}</span>
                    </div>

                  {/* QR details section */}
                  <div className="p-5 flex flex-col items-center gap-3">
                    {/* Dummy QR representation */}
                    <div className="w-28 h-28 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2.5 flex flex-col items-center justify-center relative group">
                      <div className="grid grid-cols-5 gap-1.5 w-full h-full opacity-80">
                        {Array.from({ length: 25 }).map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`rounded-sm ${(idx * 7) % 3 === 0 || (idx + 2) % 4 === 0 ? "bg-zinc-900 dark:bg-white" : "bg-transparent"}`} 
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                        <span className="text-[8px] font-black uppercase tracking-wider bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white px-2 py-1 rounded border shadow-sm">View QR</span>
                      </div>
                    </div>

                    <div className="text-center space-y-0.5 mt-1">
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white">{purch.businessName}</h4>
                      <p className="text-[10px] text-zinc-500 font-semibold">{purch.title}</p>
                    </div>

                    <div className="flex items-center gap-1.5 py-1 text-[9px] font-bold text-red-500 uppercase tracking-wider">
                      <span>Valid Till {purch.validTill}</span>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenRedeemedQR(purch); }}
                      className="w-full mt-2 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
                    >
                      Show Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: Subscription Plans Sub-View (Matches App Mockup 2) */}
        {currentView === "subscriptions" && (
          <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-dark via-primary to-primary p-5 text-white flex items-center gap-3 shrink-0 relative shadow-md">
              <button 
                onClick={() => setCurrentView("main")}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-base font-black uppercase tracking-wider">Subscription Plan</h3>
            </div>

            {/* Scrollable plan layout details */}
            <div className="flex-grow p-6 overflow-y-auto no-scrollbar space-y-6">
              
              {/* Category picker banner */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-4 rounded-2xl flex justify-between items-center text-xs font-black shadow-sm text-zinc-800 dark:text-zinc-200">
                <span className="flex items-center gap-2">
                  <Tv className="w-4.5 h-4.5 text-primary" />
                  <span>Select Category</span>
                </span>
                <ChevronRight className="w-4.5 h-4.5 text-zinc-400 rotate-90" />
              </div>

              <h4 className="text-[10px] text-zinc-450 dark:text-zinc-500 font-extrabold uppercase tracking-widest flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Popular plans</span>
              </h4>

              {/* Side-by-side popular plan cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Plan 1 */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-4 flex flex-col justify-between shadow-md relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="block text-lg font-black text-zinc-900 dark:text-white leading-tight">₹ 999</span>
                      <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">/ Year</span>
                      <span className="text-[10px] font-black text-primary block mt-1">OUIYA Gold</span>
                    </div>

                    <ul className="text-[8px] text-zinc-500 dark:text-zinc-400 font-bold space-y-1.5 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                      <li className="flex items-center gap-1 text-emerald-500">
                        <Check className="w-3 h-3 shrink-0" />
                        <span className="text-zinc-500 dark:text-zinc-400 truncate">Free delivery passes</span>
                      </li>
                      <li className="flex items-center gap-1 text-emerald-500">
                        <Check className="w-3 h-3 shrink-0" />
                        <span className="text-zinc-500 dark:text-zinc-400 truncate">Extra 15% discount</span>
                      </li>
                      <li className="flex items-center gap-1 text-emerald-500">
                        <Check className="w-3 h-3 shrink-0" />
                        <span className="text-zinc-500 dark:text-zinc-400 truncate">Exclusive deals access</span>
                      </li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => buySubscription("OUIYA Gold", 999, "https://images.unsplash.com/photo-1478860126073-2e3589a6121f?w=150")}
                    className="w-full mt-5 bg-gradient-to-r from-red-650 to-red-550 hover:from-red-600 hover:to-red-500 text-white text-[10px] py-2.5 rounded-xl font-black shadow-md cursor-pointer text-center"
                  >
                    Buy now
                  </button>
                </div>

                {/* Plan 2 */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-4 flex flex-col justify-between shadow-md relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="block text-lg font-black text-zinc-900 dark:text-white leading-tight">₹ 1499</span>
                      <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">/ Year</span>
                      <span className="text-[10px] font-black text-primary block mt-1">OUIYA Elite</span>
                    </div>

                    <ul className="text-[8px] text-zinc-500 dark:text-zinc-400 font-bold space-y-1.5 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                      <li className="flex items-center gap-1 text-emerald-500">
                        <Check className="w-3 h-3 shrink-0" />
                        <span className="text-zinc-500 dark:text-zinc-400 truncate">BOGO coupon offers</span>
                      </li>
                      <li className="flex items-center gap-1 text-emerald-500">
                        <Check className="w-3 h-3 shrink-0" />
                        <span className="text-zinc-500 dark:text-zinc-400 truncate">Priority helpline desk</span>
                      </li>
                      <li className="flex items-center gap-1 text-emerald-500">
                        <Check className="w-3 h-3 shrink-0" />
                        <span className="text-zinc-500 dark:text-zinc-400 truncate">All-inclusive pass</span>
                      </li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => buySubscription("OUIYA Elite", 1499, "https://images.unsplash.com/photo-1478860126073-2e3589a6121f?w=150")}
                    className="w-full mt-5 bg-gradient-to-r from-red-650 to-red-550 hover:from-red-600 hover:to-red-500 text-white text-[10px] py-2.5 rounded-xl font-black shadow-md cursor-pointer text-center"
                  >
                    Buy now
                  </button>
                </div>
              </div>

              {/* Available plans layout list */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] text-zinc-450 dark:text-zinc-500 font-extrabold uppercase tracking-widest">
                  Available plans
                </h4>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center p-2.5 border border-zinc-100">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg" alt="McDonalds logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-900 dark:text-white">McDonald&apos;s Annual Pass</h4>
                      <span className="text-[10px] font-black text-emerald-500">₹ 999 <span className="text-[8px] text-zinc-400">/ Year</span></span>
                    </div>
                  </div>

                  <ul className="text-xs font-semibold text-zinc-550 dark:text-zinc-400 space-y-2.5">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Free burger pass every week</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Unlimited free priority delivery</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>2 Free hot beverages per billing</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => buySubscription("McDonald's Pass", 999, "https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg")}
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer mt-4"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: Refer a Friend Sub-View */}
        {currentView === "refer" && (
          <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-dark via-primary to-primary p-5 text-white flex items-center gap-3 shrink-0 relative shadow-md">
              <button 
                onClick={() => setCurrentView("main")}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-base font-black uppercase tracking-wider">Refer a friend</h3>
            </div>

            {/* Referral Sharing Content */}
            <div className="flex-grow p-6 flex flex-col items-center justify-center text-center space-y-6">
              <div className="bg-primary/10 p-6 rounded-full text-primary shadow-inner">
                <Gift className="w-16 h-16 animate-bounce" />
              </div>

              <div className="space-y-2 max-w-xs">
                <h4 className="text-lg font-black text-zinc-900 dark:text-white">Give ₹250, Get ₹250</h4>
                <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                  Share your referral link with a friend. Once they make their first coupon purchase, you both get ₹250 wallet balance free!
                </p>
              </div>

              {/* Share Code Card */}
              <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-5 rounded-3xl shadow-md space-y-4 max-w-sm">
                <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-extrabold uppercase tracking-widest block">
                  Your Referral Code
                </span>
                
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex justify-between items-center">
                  <span className="text-base font-mono font-black tracking-widest text-zinc-850 dark:text-zinc-100">
                    OUIYA50REF
                  </span>
                  
                  <button 
                    onClick={handleCopyCode}
                    className="bg-primary/10 hover:bg-primary/20 text-primary p-2.5 rounded-xl transition-all cursor-pointer"
                    title="Copy Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <button 
                  onClick={() => alert("Copied referral link to clipboard!")}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
                >
                  Share Link
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
