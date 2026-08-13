"use client";

import React, { useState, useEffect } from "react";
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
    toggleOfferLike 
  } = useApp();

  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  


  // Fetch initial data
  useEffect(() => {
    setCategories(getCategories());
    getBusinessesFromFirebase().then(setBusinesses);
    getOffers().then(setOffers);
  }, []);

  // Auto scroll banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % AD_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
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



  // Filter listings
  const popularOffers = offers.filter(o => o.isTopOffer);
  const recommendedOffers = offers; // Simulated recommendations
  const trendingNow = offers.slice(0, 3); // Mock trending
  const trendingVouchers = businesses.filter(b => b.hasVoucher);

  // Render home page feed
  const renderHomeFeed = () => (
    <div className="w-full pb-28 animate-fade-in select-none bg-white dark:bg-[#0b0f19]">
      {/* 1. Hero Section — Theme-Aware */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-white dark:from-[#05070e] dark:via-[#0b0f19] dark:to-[#0b0f19] px-6 py-12 md:py-24 border-b border-zinc-200 dark:border-zinc-900">
        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-red-200/20 dark:bg-red-900/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Search & Shortcuts */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
              <Ticket className="w-3.5 h-3.5 rotate-90" />
              <span>Smart Savings Hub</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white animate-fade-in">
              Find Best Offers <br />
              <span className="text-primary">Near You!</span>
            </h1>

            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm md:text-base font-semibold max-w-xl leading-relaxed">
              Discover amazing deals, exclusive coupons & exciting dining/shopping offers from top businesses in your city.
            </p>

            {/* Search Box — Theme-Aware */}
            <form onSubmit={handleSearchSubmit} className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-full p-2 shadow-xl dark:shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
              <div className="flex-grow w-full flex items-center gap-2.5 px-3.5">
                <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for offers, stores, categories..."
                  className="w-full bg-transparent border-none text-zinc-900 dark:text-zinc-100 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500 text-xs py-3"
                />
              </div>

              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

              <div className="w-full sm:w-auto flex items-center gap-2 px-3.5 shrink-0">
                <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />
                <select
                  value="Puducherry"
                  onChange={() => {}}
                  className="bg-transparent border-none text-zinc-700 dark:text-zinc-200 text-xs font-black focus:outline-none cursor-pointer py-3 pr-6"
                >
                  <option value="Puducherry">Puducherry</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-black text-xs px-7 py-3.5 rounded-xl sm:rounded-full transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>

            {/* Quick shortcuts pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button 
                onClick={() => { setTab("discover"); }} 
                className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black text-white bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all cursor-pointer shadow-md shadow-amber-500/20 scale-105"
              >
                <Compass className="w-3.5 h-3.5 text-white" />
                <span>Discover Pondicherry 📍</span>
              </button>
              <button 
                onClick={() => { setTab("categories"); }} 
                className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-primary bg-white dark:bg-zinc-900/50 hover:bg-primary/5 dark:hover:bg-zinc-900 rounded-full transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Near Me</span>
              </button>
              <button 
                onClick={() => { setTab("home"); }} 
                className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-primary bg-white dark:bg-zinc-900/50 hover:bg-primary/5 dark:hover:bg-zinc-900 rounded-full transition-all cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 text-primary" />
                <span>Top Offers</span>
              </button>
              <button 
                onClick={() => { setTab("categories"); }} 
                className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-primary bg-white dark:bg-zinc-900/50 hover:bg-primary/5 dark:hover:bg-zinc-900 rounded-full transition-all cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5 text-primary" />
                <span>Coupons</span>
              </button>
              <button 
                onClick={() => { setTab("home"); }} 
                className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-primary bg-white dark:bg-zinc-900/50 hover:bg-primary/5 dark:hover:bg-zinc-900 rounded-full transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>New Arrivals</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating Circle Frame */}
          <div className="lg:col-span-5 flex justify-center relative mt-6 lg:mt-0">
            <div className="relative flex items-center justify-center p-6">
              {/* Rotating dashed ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-primary/30 animate-[spin_60s_linear_infinite] scale-102" />
              
              {/* Circular Image Frame */}
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-zinc-200 dark:border-zinc-900 overflow-hidden relative shadow-2xl z-10">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80" 
                  alt="OUIYA Shopping Model" 
                  className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent" />
              </div>

              {/* Floating Badge Left */}
              <div className="absolute top-10 -left-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-2xl z-20 flex items-center gap-3 max-w-[140px] backdrop-blur-md">
                <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-xl text-primary shrink-0">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-primary uppercase leading-none">50% OFF</span>
                  <span className="text-[8px] font-bold text-zinc-500 dark:text-zinc-400 leading-tight mt-1 block">On First Order</span>
                </div>
              </div>

              {/* Floating Badge Right */}
              <div className="absolute bottom-10 -right-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-2xl z-20 flex items-center gap-3 max-w-[145px] backdrop-blur-md">
                <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-2 rounded-xl text-emerald-500 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase leading-none">100% Verified</span>
                  <span className="text-[8px] font-bold text-zinc-500 dark:text-zinc-400 leading-tight mt-1 block">Trusted Partners</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Red Statistics Banner */}
      <section className="bg-gradient-to-r from-primary-dark via-primary to-primary-dark text-white py-10 shadow-lg relative z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 md:divide-x md:divide-white/10 items-center justify-center text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-white/90" />
              <span className="text-2xl font-black tracking-tight mt-1">10K+</span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-100">Happy Customers</span>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center gap-2">
              <Building2 className="w-6 h-6 text-white/90" />
              <span className="text-2xl font-black tracking-tight mt-1">2K+</span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-100">Top Businesses</span>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center gap-2">
              <Gift className="w-6 h-6 text-white/90" />
              <span className="text-2xl font-black tracking-tight mt-1">5K+</span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-100">Offers & Coupons</span>
            </div>
            {/* Stat 4 */}
            <div className="flex flex-col items-center gap-2">
              <Download className="w-6 h-6 text-white/90" />
              <span className="text-2xl font-black tracking-tight mt-1">50K+</span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-100">App Downloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area Container (Wide max-w-7xl) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12 pb-24">
        
        {/* 3. Categories circular icons scroll (Placed below the Stats Banner) */}
        <section className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-primary" />
              <span>Browse Categories</span>
            </h3>
            
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400 hover:text-primary border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-full px-4 py-2 transition-all bg-white dark:bg-zinc-900 cursor-pointer shadow-sm"
            >
              {showAllCategories ? "Show less" : "Show all"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-4 pt-2">
            {(showAllCategories ? categories : categories.slice(0, 5)).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center gap-2.5 group cursor-pointer focus:outline-none bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 p-4 rounded-2xl hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/5 transition-all duration-300 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 group-hover:scale-105 flex items-center justify-center transition-transform shadow-sm group-hover:text-primary text-zinc-600 dark:text-zinc-400">
                  <IconRenderer name={cat.iconName} className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-zinc-550 dark:text-zinc-400 text-center leading-tight line-clamp-1 group-hover:text-zinc-900 dark:group-hover:text-white uppercase tracking-wider transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Carousel Advertisement Banner */}
        <section className="relative h-56 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-950 flex transition-all duration-500">
            {AD_BANNERS.map((ad, idx) => (
              <div
                key={ad.id}
                className={`absolute inset-0 w-full h-full flex flex-col justify-end p-8 text-white transition-opacity duration-700 ${
                  idx === carouselIndex ? "opacity-100 z-10" : "opacity-0 z-0"
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
                onClick={() => setCarouselIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-350 ${
                  i === carouselIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
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
                  
                  <span className="text-sm font-black text-zinc-900 dark:text-white bg-slate-100 dark:bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    ₹{offer.ouiyaPrice}
                  </span>
                </div>
              </div>
            ))}
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

      {/* Sticky Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
