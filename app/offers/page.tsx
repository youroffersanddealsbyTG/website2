"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OfferCard from "../../components/OfferCard";
import CouponModal from "../../components/CouponModal";
import { getOffers, getCategories, Offer, Category } from "../../lib/db";
import { Search, MapPin, SlidersHorizontal, RefreshCw, ChevronRight } from "lucide-react";

export default function OffersBrowsePage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Puducherry");
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const locations = ["Puducherry", "Chennai", "Bangalore", "All Locations"];

  // Fetch initial data
  useEffect(() => {
    setCategories(getCategories());
    fetchFilteredOffers();
  }, [selectedLocation, checkedCategories]);

  const fetchFilteredOffers = async () => {
    const activeCategory = checkedCategories.length === 1 ? checkedCategories[0] : "All";
    
    let list = await getOffers({
      category: activeCategory,
      query: searchQuery,
      location: selectedLocation
    });

    // If multiple categories are checked
    if (checkedCategories.length > 1) {
      list = list.filter(o => checkedCategories.some(c => c.toLowerCase() === o.category.toLowerCase()));
    }

    setOffers(list);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredOffers();
  };

  const handleCategoryCheckboxChange = (catName: string) => {
    setCheckedCategories(prev => {
      if (prev.includes(catName)) {
        return prev.filter(c => c !== catName);
      } else {
        return [...prev, catName];
      }
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedLocation("Puducherry");
    setCheckedCategories([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
              Browse Offers & Coupons
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Find the perfect deal for you from {offers.length} active listings.
            </p>
          </div>
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className={`lg:block ${sidebarOpen ? "block fixed inset-0 z-40 bg-zinc-50 dark:bg-zinc-950 p-6 overflow-y-auto" : "hidden"} lg:relative lg:inset-auto lg:z-auto lg:p-0 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 h-fit shadow-sm`}>
            
            {/* Sidebar Title */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <h2 className="text-sm font-black uppercase text-zinc-900 dark:text-white tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>Filters</span>
              </h2>
              
              <div className="flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                {sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden text-[10px] font-black uppercase text-zinc-400 hover:text-zinc-700"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>

            {/* Location Filter */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider mb-2.5">
                Location
              </label>
              <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950">
                <MapPin className="w-4 h-4 text-primary" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent border-none text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none w-full cursor-pointer pr-4"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc} className="dark:bg-zinc-900">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categories Checklist */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider mb-3">
                Categories
              </label>
              <div className="space-y-2.5">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checkedCategories.includes(cat.name)}
                      onChange={() => handleCategoryCheckboxChange(cat.name)}
                      className="w-4.5 h-4.5 rounded border-zinc-300 dark:border-zinc-800 text-primary focus:ring-primary accent-primary"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* Main Offers Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Inline Search Bar */}
            <form onSubmit={handleSearchSubmit} className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-3">
                <Search className="w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for offers, brands..."
                  className="w-full bg-transparent border-none text-zinc-800 dark:text-white focus:outline-none placeholder-zinc-400 text-sm py-2"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-primary/10 cursor-pointer transition-colors"
              >
                Search
              </button>
            </form>

            {/* Offers Listing Grid */}
            {offers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                {offers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onViewOffer={setSelectedOffer}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-16 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">No Offers Match Your Criteria</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Try clearing your filters or changing your search terms to discover active discounts in your location.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 inline-flex bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

          </div>
        </div>
      </main>

      <CouponModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
      />

      <Footer />
    </div>
  );
}
