"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OfferCard from "../components/OfferCard";
import CouponModal from "../components/CouponModal";
import { 
  getOffers, 
  getBusinesses, 
  getCategories, 
  Offer, 
  Business, 
  Category 
} from "../lib/db";
import { 
  Search, 
  MapPin, 
  Star, 
  Ticket, 
  Store, 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  Users, 
  Building, 
  Gift, 
  Download,
  Utensils,
  Shirt,
  Smartphone,
  Home,
  Plane,
  Car,
  MoreHorizontal
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

export default function HomePage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Puducherry");
  const [activeCategory, setActiveCategory] = useState("All");

  const locations = ["Puducherry", "Chennai", "Bangalore", "All Locations"];

  // Fetch offers & data on mount and whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      const filteredOffers = await getOffers({
        category: activeCategory,
        query: searchQuery,
        location: selectedLocation
      });
      setOffers(filteredOffers);
    };
    fetchData();
  }, [activeCategory, selectedLocation]);

  useEffect(() => {
    setBusinesses(getBusinesses());
    setCategories(getCategories());
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredOffers = await getOffers({
      category: activeCategory,
      query: searchQuery,
      location: selectedLocation
    });
    setOffers(filteredOffers);
  };

  const handleQuickShortcutClick = (shortcut: string) => {
    if (shortcut === "Top Offers") {
      setActiveCategory("All");
      setOffers(offers.filter(o => o.isTopOffer));
    } else if (shortcut === "Coupons") {
      setActiveCategory("All");
      setOffers(offers.filter(o => o.isCoupon));
    } else {
      setActiveCategory("All");
      // refresh all
      getOffers({
        location: selectedLocation
      }).then(setOffers);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-zinc-50 to-red-50/20 dark:from-zinc-900 dark:via-zinc-950 dark:to-primary/5 py-12 lg:py-24 border-b border-zinc-100 dark:border-zinc-800">
        {/* Floating circles decoration */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-0 bottom-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Form & Title */}
            <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
              <span className="inline-flex self-center lg:self-start items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <Ticket className="w-3.5 h-3.5 rotate-90" />
                <span>Smart Savings Hub</span>
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white">
                Find Best Offers <br />
                <span className="text-primary bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                  Near You!
                </span>
              </h1>
              
              <p className="mt-4 text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover amazing deals, exclusive coupons & exciting dining/shopping offers from top businesses in your city.
              </p>

              {/* Search & Location Bar */}
              <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto lg:mx-0 bg-white dark:bg-zinc-900 p-2 rounded-2xl sm:rounded-full border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search className="w-5 h-5 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for offers, stores, categories..."
                    className="w-full bg-transparent border-none text-zinc-800 dark:text-white focus:outline-none focus:ring-0 placeholder-zinc-400 text-sm py-2"
                  />
                </div>
                
                <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-zinc-100 dark:border-zinc-800 px-4 py-2 sm:py-0 select-none">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-transparent border-none text-zinc-700 dark:text-zinc-300 focus:outline-none text-xs font-semibold cursor-pointer py-1 pr-6"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc} className="dark:bg-zinc-900">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl sm:rounded-full font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-primary/20 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </form>

              {/* Quick Filter Shortcuts */}
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                {[
                  { name: "Near Me", icon: MapPin },
                  { name: "Top Offers", icon: Star },
                  { name: "Coupons", icon: Ticket },
                  { name: "New Arrivals", icon: Sparkles }
                ].map((shortcut) => (
                  <button
                    key={shortcut.name}
                    onClick={() => handleQuickShortcutClick(shortcut.name)}
                    className="flex items-center gap-1.5 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 px-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-sm hover:shadow transition-all duration-200"
                  >
                    <shortcut.icon className="w-3.5 h-3.5 text-primary rotate-90" />
                    <span>{shortcut.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Graphic */}
            <div className="lg:col-span-5 flex justify-center relative select-none">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                {/* Visual Circles */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 animate-spin" style={{ animationDuration: "60s" }} />
                <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-primary to-primary-hover opacity-10 animate-pulse" />
                
                {/* Floating Tags */}
                <div className="absolute top-[10%] -left-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-3 shadow-lg flex items-center gap-2.5 animate-bounce" style={{ animationDuration: "3s" }}>
                  <div className="bg-primary/10 text-primary p-2 rounded-xl">
                    <Ticket className="w-5 h-5 rotate-90" />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-zinc-900 dark:text-white">50% OFF</span>
                    <span className="text-[10px] text-zinc-400 font-semibold">On First Order</span>
                  </div>
                </div>

                <div className="absolute bottom-[20%] -right-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-3 shadow-lg flex items-center gap-2.5 animate-bounce" style={{ animationDuration: "4s" }}>
                  <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 p-2 rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-zinc-900 dark:text-white">100% Verified</span>
                    <span className="text-[10px] text-zinc-400 font-semibold">Trusted Partners</span>
                  </div>
                </div>

                {/* Main Illustration Placeholder (Beautiful rounded frame) */}
                <div className="absolute inset-10 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80"
                    alt="Shopping Illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Red Banner */}
      <section className="bg-gradient-to-r from-primary-dark via-primary-medium to-primary text-white py-8 shadow-inner shadow-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="flex flex-col items-center gap-1.5 md:border-r border-white/20">
              <Users className="w-6 h-6 opacity-95" />
              <span className="text-2xl font-black tracking-tight">10K+</span>
              <span className="text-xs text-zinc-100 font-semibold uppercase tracking-wider">Happy Customers</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 md:border-r border-white/20">
              <Building className="w-6 h-6 opacity-95" />
              <span className="text-2xl font-black tracking-tight">2K+</span>
              <span className="text-xs text-zinc-100 font-semibold uppercase tracking-wider">Top Businesses</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 md:border-r border-white/20">
              <Gift className="w-6 h-6 opacity-95" />
              <span className="text-2xl font-black tracking-tight">5K+</span>
              <span className="text-xs text-zinc-100 font-semibold uppercase tracking-wider">Offers & Coupons</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <Download className="w-6 h-6 opacity-95" />
              <span className="text-2xl font-black tracking-tight">50K+</span>
              <span className="text-xs text-zinc-100 font-semibold uppercase tracking-wider">App Downloads</span>
            </div>

          </div>
        </div>
      </section>

      {/* Top Offers Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              Top Offers Near You
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Explore exclusive deals from top-rated businesses in {selectedLocation}.
            </p>
          </div>
          <button
            onClick={() => setActiveCategory("All")}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline hover:text-primary-hover focus:outline-none"
          >
            <span>View All Offers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Offers Grid */}
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onViewOffer={setSelectedOffer}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-md mx-auto">
            <Ticket className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto rotate-90 mb-4" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No Offers Found</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              There are no current offers matching your filters. Try selecting a different category or location.
            </p>
          </div>
        )}
      </section>

      {/* Popular Categories Section */}
      <section id="categories" className="py-16 bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              Popular Categories
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Browse awesome offers by category type
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? "All" : cat.name)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary/5 border-primary text-primary shadow-sm"
                      : "bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 border-transparent text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <div className={`p-3 rounded-xl ${isActive ? "bg-primary text-white" : "bg-white dark:bg-zinc-900 shadow-sm text-zinc-500"}`}>
                    <IconRenderer name={cat.iconName} className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold tracking-tight text-center leading-tight">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Businesses Section */}
      <section id="businesses" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-lg mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Top Businesses
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Discover top-rated, trusted brands offering exciting discounts
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {businesses.map((biz) => (
            <div 
              key={biz.id} 
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <img
                src={biz.logoUrl}
                alt={biz.name}
                className="w-16 h-16 rounded-full object-cover shadow border border-zinc-50 dark:border-zinc-800 mb-4"
              />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">
                {biz.name}
              </h3>
              
              <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold mt-1 mb-3">
                <Star className="w-3 h-3 fill-current" />
                <span>{biz.rating}</span>
                <span className="text-zinc-400 font-medium ml-1">({biz.reviewsCount})</span>
              </div>
              
              <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
                {biz.offersCount}+ Offers
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Banner */}
      <section className="py-12 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                Never Miss an Offer!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-normal max-w-sm">
                Get the best offers & exclusive discounts straight to your inbox weekly.
              </p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); alert("Successfully subscribed!"); }} className="w-full md:w-auto flex items-center bg-white dark:bg-zinc-950 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm min-w-[280px] sm:min-w-[350px]">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full bg-transparent border-none text-zinc-800 dark:text-white focus:outline-none px-3 text-xs placeholder-zinc-400"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Coupon Claim Modal */}
      <CouponModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
      />

      <Footer />
    </div>
  );
}
