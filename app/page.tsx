"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../lib/AppContext";
import { getOffers, getCategories, getBusinesses, getBusinessesFromFirebase, Offer, Category, Business } from "../lib/db";
import BottomNav from "../components/BottomNav";
import ShopDetailModal from "../components/ShopDetailModal";
import OfferDetailModal from "../components/OfferDetailModal";
import CartModal from "../components/CartModal";
import CouponSuccessModal from "../components/CouponSuccessModal";
import Navbar from "../components/Navbar";
import SideDrawer from "../components/SideDrawer";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import DestinationDetailModal from "../components/DestinationDetailModal";

// Views
import CategoryBrowseView from "./offers/page"; // We can reuse the Category page layout inline!
import DiscoverPondicherryView from "./discover/page";

import { 
  Search, Star, Heart, 
  Sparkles, Flame, Ticket, Compass, MapPin, Users, Building2, Gift, Download, ShieldCheck,
  Utensils, Shirt, Smartphone, Home, Plane, Car, MoreHorizontal
} from "lucide-react";

// Helper to render lucide icon dynamically
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Utensils": return <Utensils className={className} />;
    case "Shirt": return <Shirt className={className} />;
    case "Smartphone": return <Smartphone className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Home": return <Home className={className} />;
    case "Plane": return <Plane className={className} />;
    case "Car": return <Car className={className} />;
    default: return <MoreHorizontal className={className} />;
  }
};

// Mock advertising banners
const AD_BANNERS = [
  {
    id: 1,
    title: "Upgrade Your Tech",
    subtitle: "Flat 15% Off on Electronics & Accessories",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80",
    color: "from-blue-600 to-indigo-700"
  },
  {
    id: 2,
    title: "Indulge in Flavors",
    subtitle: "Buy 1 Get 1 Free combos at top local diners",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    color: "from-red-650 to-orange-600"
  },
  {
    id: 3,
    title: "Fashion Clearance",
    subtitle: "Upto 50% discount on summer collections",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    color: "from-pink-600 to-purple-700"
  }
];

// Hotspots definitions
const HOTSPOTS = [
  { name: "Beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80" },
  { name: "Park", image: "https://images.unsplash.com/photo-1585822310626-c6187f55c1e7?w=200&auto=format&fit=crop&q=80" },
  { name: "Cafe", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80" },
  { name: "Mall", image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=200&auto=format&fit=crop&q=80" },
  { name: "Theatre", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=200&auto=format&fit=crop&q=80" }
];

export default function AppHome() {
  const { 
    activeTab, 
    setTab, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    openShopDetails,
    likedOffers,
    toggleOfferLike,
    cartConflictOffer,
    resolveCartConflict
  } = useApp();

  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [carouselIndex1, setCarouselIndex1] = useState(0);
  const [carouselIndex2, setCarouselIndex2] = useState(0);

  // Fetch initial data
  useEffect(() => {
    setCategories(getCategories());
    getBusinessesFromFirebase().then(setBusinesses);
    getOffers().then(setOffers);
  }, []);

  // Auto scroll banners
  useEffect(() => {
    const timer1 = setInterval(() => {
      setCarouselIndex1((prev) => (prev + 1) % 3);
    }, 4500);
    const timer2 = setInterval(() => {
      setCarouselIndex2((prev) => (prev + 1) % 3);
    }, 5500);
    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
    };
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setTab("categories");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      setTab("categories");
    }
  };

  // Algorithm logic: filter recommended offers based on user likes
  const likedCategories = useMemo(() => {
    const cats = new Set<string>();
    offers.forEach(o => {
      if (likedOffers[o.id] && o.category) {
        cats.add(o.category.toLowerCase());
      }
    });
    return Array.from(cats);
  }, [likedOffers, offers]);

  const recommendedOffers = useMemo(() => {
    if (likedCategories.length > 0) {
      const matched = offers.filter(o => o.category && likedCategories.includes(o.category.toLowerCase()));
      if (matched.length >= 2) return matched;
    }
    return offers;
  }, [likedCategories, offers]);

  const popularOffers = offers.filter(o => o.isTopOffer);
  const trendingNow = offers.slice(0, 4);
  const trendingVouchers = businesses.filter(b => b.hasVoucher);

  // Render home page feed
  const renderHomeFeed = () => (
    <div className="w-full pb-28 animate-fade-in select-none bg-zinc-100 dark:bg-[#0b0f19]">
      
      {/* Main Content Area Container (Wide max-w-7xl) */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4 space-y-5 pb-24">
        
        {/* 1. Flipkart Top Categories Scroll Bar (Wireframe & Flipkart Screenshot) */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-sm">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1 scroll-smooth">
            {/* For You / All active tab */}
            <button
              onClick={() => handleCategoryClick("All")}
              className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none shrink-0 min-w-[70px] sm:min-w-[85px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black text-red-600 dark:text-red-400 text-center leading-tight">
                For You
              </span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none shrink-0 min-w-[70px] sm:min-w-[85px]"
              >
                <div className="w-12 h-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 group-hover:bg-red-50 dark:group-hover:bg-red-950/30 group-hover:border-red-500 flex items-center justify-center transition-all shadow-sm text-zinc-700 dark:text-zinc-300 group-hover:text-red-600">
                  <IconRenderer name={cat.iconName} className="w-5.5 h-5.5" />
                </div>
                <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 text-center leading-tight line-clamp-1 group-hover:text-red-600 transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 2. Flipkart Hero Ad Banners Grid (Matching Flipkart Screenshot Image 1) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Banner 1: Nivea / Skincare */}
          <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-800 group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
              alt="Nivea Skincare"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 via-sky-800/40 to-transparent p-5 flex flex-col justify-between text-white">
              <span className="bg-sky-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full w-fit">
                NIVEA
              </span>
              <div>
                <h4 className="text-lg font-black leading-tight drop-shadow-md">Get hydrated skin</h4>
                <p className="text-xl font-extrabold text-yellow-300 mt-0.5">Up to 50% Off</p>
                <p className="text-[10px] text-sky-100 mt-1 font-semibold">Natural & improved formula</p>
              </div>
              <span className="self-end text-[8px] bg-black/40 text-zinc-300 px-1.5 py-0.5 rounded uppercase font-bold">AD</span>
            </div>
          </div>

          {/* Banner 2: Boltt / Tech Launch */}
          <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-800 group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
              alt="ACE 5G Smartphone Launch"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/60 to-transparent p-5 flex flex-col justify-between text-white">
              <div className="flex items-center gap-1.5">
                <span className="bg-yellow-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded">
                  OUIYA Unique
                </span>
              </div>
              <div>
                <h4 className="text-xl font-black tracking-wide text-white">ACE 5G</h4>
                <p className="text-xs font-bold text-yellow-400 mt-0.5">Launch 25th Aug, 12 PM</p>
                <p className="text-[10px] text-zinc-300 mt-1">Pick your perfect shade</p>
              </div>
              <span className="self-end text-[8px] bg-black/40 text-zinc-300 px-1.5 py-0.5 rounded uppercase font-bold">AD</span>
            </div>
          </div>

          {/* Banner 3: Realme / Mobile Launch */}
          <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-800 group cursor-pointer hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80"
              alt="Realme 5G Flagship"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-950/95 via-teal-900/60 to-transparent p-5 flex flex-col justify-between text-white">
              <span className="bg-teal-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full w-fit">
                realme | OUIYA
              </span>
              <div>
                <h4 className="text-lg font-black leading-tight">realme P4s 5G</h4>
                <p className="text-xs font-bold text-teal-300 mt-0.5">Launch 26th Aug</p>
                <p className="text-[10px] text-teal-100 mt-1">Flagship 1.5K 144Hz Screen</p>
              </div>
              <span className="self-end text-[8px] bg-black/40 text-zinc-300 px-1.5 py-0.5 rounded uppercase font-bold">AD</span>
            </div>
          </div>
        </section>

        {/* 3. Flipkart Top Deals Cards Grid (Matching Flipkart Screenshot Image 1) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Water Purifiers */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 mb-3 border border-zinc-100 dark:border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1542013936693-884638332954?w=400&auto=format&fit=crop&q=80"
                alt="Water Purifiers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 text-[8px] bg-black/50 text-white px-1.5 py-0.5 rounded font-bold">AD</span>
            </div>
            <div>
              <button className="w-full bg-red-600 text-white text-xs font-black py-2 rounded-xl mb-1.5 shadow-sm group-hover:bg-red-700 transition-colors">
                Shop now
              </button>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 text-center">Purity in every sip</p>
            </div>
          </div>

          {/* Card 2: L'Oreal Haircare */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 mb-3 border border-zinc-100 dark:border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80"
                alt="L'Oreal Paris Haircare"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 text-[8px] bg-black/50 text-white px-1.5 py-0.5 rounded font-bold">AD</span>
            </div>
            <div>
              <button className="w-full bg-red-600 text-white text-xs font-black py-2 rounded-xl mb-1.5 shadow-sm group-hover:bg-red-700 transition-colors">
                Up to 15% Off
              </button>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 text-center">Easy detangling</p>
            </div>
          </div>

          {/* Card 3: Adidas Shoes */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 mb-3 border border-zinc-100 dark:border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80"
                alt="Adidas Shoes"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 text-[8px] bg-black/50 text-white px-1.5 py-0.5 rounded font-bold">AD</span>
            </div>
            <div>
              <button className="w-full bg-red-600 text-white text-xs font-black py-2 rounded-xl mb-1.5 shadow-sm group-hover:bg-red-700 transition-colors">
                Min. 40% Off
              </button>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 text-center">Gear up with adidas</p>
            </div>
          </div>
        </section>

        {/* 4. Carousel Advertisement Banner */}
        <section className="relative h-56 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-950 flex transition-all duration-500">
            {AD_BANNERS.map((ad, idx) => (
              <div
                key={ad.id}
                className={`absolute inset-0 w-full h-full flex flex-col justify-end p-8 text-white transition-opacity duration-700 ${
                  idx === carouselIndex1 ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="absolute inset-0 w-full h-full object-cover scale-102 hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${ad.color} opacity-40`} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
                
                <div className="relative z-10 space-y-2 max-w-xl">
                  <span className="bg-primary text-white text-[8px] uppercase tracking-widest px-3 py-1 rounded-full font-black">
                    Sponsored Ad
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">{ad.title}</h4>
                  <p className="text-xs text-zinc-300 font-semibold drop-shadow-sm">{ad.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Slides dots */}
          <div className="absolute bottom-6 right-8 flex gap-1.5 z-20">
            {AD_BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex1(i)}
                className={`h-1.5 rounded-full transition-all duration-350 ${
                  i === carouselIndex1 ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </section>

        {/* 5. Popular Offers Horizontal List */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-primary" />
                <span>Top Offers Near You</span>
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 font-semibold">Handpicked popular local deals for you</p>
            </div>
            
            <button 
              onClick={() => { setTab("categories"); }} 
              className="text-[10px] font-black text-primary hover:underline uppercase tracking-wider cursor-pointer"
            >
              See All Offers
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto no-scrollbar py-2 scroll-smooth">
            {popularOffers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => openShopDetails(offer.shopId, offer)}
                className="w-64 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 hover:border-primary/30 dark:hover:border-primary/30 rounded-3xl p-5 shadow-sm hover:shadow-md cursor-pointer shrink-0 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-zinc-200 dark:border-zinc-800">
                  <img
                    src={offer.businessLogo || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80"}
                    alt={offer.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                    {offer.discount}
                  </div>
                </div>

                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white truncate leading-tight">{offer.businessName}</h4>
                    <p className="text-[11px] text-zinc-550 dark:text-zinc-400 font-semibold truncate mt-1">{offer.title}</p>
                  </div>
                  <span className="text-xs font-black text-zinc-900 dark:text-white bg-slate-100 dark:bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 shrink-0">
                    ₹{offer.ouiyaPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Hotspots Section */}
        <section className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm transition-colors">
          <div className="mb-6">
            <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wider">
              Hotspots Near You
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 font-semibold">Explore awesome places in your region</p>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1 scroll-smooth">
            {HOTSPOTS.map((spot, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick("All")}
                className="flex flex-col items-center gap-3 cursor-pointer focus:outline-none shrink-0 group"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden relative shadow-md border border-zinc-200 dark:border-zinc-800 group-hover:border-primary/40 transition-colors">
                  <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-zinc-950/40 group-hover:bg-zinc-950/20 transition-all duration-300 flex items-center justify-center p-2 text-center">
                    <span className="text-white text-[10px] font-black tracking-widest uppercase drop-shadow-md leading-tight">
                      {spot.name}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 7. Ice Bay Banner Section */}
        <section className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-3xl p-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md transition-colors">
          <div className="space-y-2 text-center sm:text-left">
            <span className="bg-amber-500/20 text-amber-500 text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
              Dessert Special
            </span>
            <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white leading-tight">
              Get Cool Scoops at <span className="text-amber-500">ICE BAY</span>
            </h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-md font-medium leading-relaxed">
              Premium artisanal gelatos, loaded shakes, and waffle cones. Buy 1 get 1 single scoop free today.
            </p>
          </div>
          
          <button 
            onClick={() => handleCategoryClick("Food & Dining")}
            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            CLAIM SCOOP
          </button>
        </section>

        {/* 8. Recommended Grid */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-primary fill-primary/20" />
                <span>Recommended For You</span>
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 font-semibold">Personalized offers matching your preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedOffers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => openShopDetails(offer.shopId, offer)}
                className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 hover:border-primary/20 rounded-3xl p-5 shadow-sm flex justify-between gap-4 cursor-pointer hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                      {offer.discount}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-700 text-[10px]">•</span>
                    <div className="flex items-center gap-0.5 text-amber-500 text-[9px] font-black">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{offer.rating}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white truncate group-hover:text-primary transition-colors leading-tight">
                    {offer.businessName}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate font-semibold">
                    {offer.title}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleOfferLike(offer.id); }}
                    className="bg-slate-100 dark:bg-zinc-950 p-2.5 rounded-full text-zinc-500 hover:text-primary border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer animate-scale-up"
                  >
                    <Heart className={`w-4 h-4 ${likedOffers[offer.id] ? "fill-primary text-primary" : ""}`} />
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Carousel Advertisement 2 (Annotated wireframe Image 1 rule) */}
        <section className="relative h-44 rounded-3xl overflow-hidden shadow-xl border border-red-200 dark:border-red-900/40 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 flex items-center justify-between">
          <div className="space-y-2 z-10 max-w-lg">
            <span className="bg-white/20 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/30 backdrop-blur-md">
              EXTRA SAVINGS %
            </span>
            <h3 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">
              Save More with Coupons!
            </h3>
            <p className="text-xs text-red-100 font-semibold drop-shadow-sm">
              Grab exclusive discount codes from top Pondicherry stores instantly.
            </p>
            <button
              onClick={() => handleCategoryClick("Food & Dining")}
              className="bg-white text-red-600 font-black text-xs px-5 py-2.5 rounded-full shadow-lg hover:bg-red-50 transition-all active:scale-95 cursor-pointer mt-2 inline-flex items-center gap-1.5"
            >
              <span>View Coupons</span>
              <Ticket className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="hidden sm:flex items-center justify-center w-36 h-36 bg-white/10 rounded-full border border-white/20 backdrop-blur-md relative shrink-0">
            <Ticket className="w-20 h-20 text-white/90 rotate-12" />
          </div>
        </section>

        {/* 9. Trending Columns Side-By-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Trending Now */}
          <section className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4.5 h-4.5 text-orange-500" />
                  <span>Trending Now !!</span>
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 font-semibold">Fast-selling discount coupons this hour</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingNow.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => openShopDetails(offer.shopId, offer)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 hover:border-primary/20 rounded-3xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 group"
                >
                  <span className="bg-orange-500/10 text-orange-500 dark:text-orange-400 text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider border border-orange-500/10">
                    {offer.discount}
                  </span>
                  
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white mt-3.5 truncate group-hover:text-primary transition-colors leading-tight">
                    {offer.businessName}
                  </h4>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400 truncate font-semibold mt-1">
                    {offer.title}
                  </p>
                  
                  <div className="flex justify-between items-center gap-1.5 mt-4 pt-3.5 border-t border-zinc-150 dark:border-zinc-800">
                    <span className="text-xs font-black text-zinc-900 dark:text-white">
                      ₹{offer.ouiyaPrice}
                    </span>
                    
                    <span className="text-[9px] font-black uppercase text-primary tracking-widest group-hover:underline">
                      CLAIM DEAL
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trending Vouchers */}
          <section className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wider flex items-center gap-1.5">
                  <Ticket className="w-4.5 h-4.5 text-indigo-500" />
                  <span>Trending Vouchers !!</span>
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 font-semibold">Claim luxury dining, spa, and beauty vouchers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingVouchers.map((biz) => {
                const vouch = biz.vouchers?.[0];
                if (!vouch) return null;
                return (
                  <div
                    key={vouch.id}
                    onClick={() => openShopDetails(biz.id)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 hover:border-primary/20 rounded-3xl p-5 shadow-sm hover:shadow-md cursor-pointer flex gap-4 justify-between items-center transition-all duration-300 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="text-[8px] font-black tracking-widest bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-2.5 py-1 rounded-full uppercase border border-indigo-500/10">
                        50% Voucher
                      </span>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white mt-3 truncate group-hover:text-primary transition-colors leading-tight">
                        {biz.name}
                      </h4>
                      <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-semibold mt-1">
                        Valid Till: {vouch.expiry}
                      </p>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                        {vouch.discount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0b0f19] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <Navbar />

      {/* Conditionally Render Custom Page view based on AppContext Tab state */}
      <main className="flex-grow">
        {activeTab === "home" && renderHomeFeed()}
        {activeTab === "categories" && (
          <div className="pb-28">
            <CategoryBrowseView />
          </div>
        )}
        {activeTab === "discover" && <DiscoverPondicherryView />}
        {activeTab === "cart" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">
            <CartModal />
          </div>
        )}
      </main>

      <Footer />

      {/* Global Overlays/Modals */}
      <ShopDetailModal />
      <OfferDetailModal />
      <CouponSuccessModal />
      <SideDrawer />
      <AuthModal />
      <DestinationDetailModal />

      {/* Cart Conflict Warning Modal (Annotated wireframe Image 5 rule: Same shop offers only) */}
      {cartConflictOffer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-scale-up text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-200 dark:border-red-800">
              <Building2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-200 dark:border-red-900/50">
                Single Store Purchase Only
              </span>
              <h3 className="text-base font-black text-zinc-900 dark:text-white pt-1">
                Different Business Selected
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                Your cart contains offers from another store. Each purchase generates a single QR code for one business.
              </p>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-left text-xs space-y-1">
                <p className="text-[11px] text-zinc-500 font-bold">Offer you are trying to add:</p>
                <p className="font-black text-zinc-900 dark:text-white">{cartConflictOffer.title}</p>
                <p className="text-red-600 font-bold text-[11px]">{cartConflictOffer.businessName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => resolveCartConflict(false)}
                className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold py-3 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Keep Current Cart
              </button>
              <button
                onClick={() => resolveCartConflict(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-2xl text-xs shadow-lg shadow-red-600/20 transition-transform active:scale-95 cursor-pointer"
              >
                Clear & Add New Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
