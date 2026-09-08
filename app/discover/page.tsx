"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../lib/AppContext";
import { PONDICHERRY_DESTINATIONS, getDestinationsFromFirebase, DESTINATION_CATEGORIES, REGISTERED_PARTNER_SHOPS, TouristDestination } from "../../lib/discoverData";
import { Search, Compass, Star, MapPin, Clock, ArrowRight, Sparkles, Navigation, Layers, Map } from "lucide-react";
import PondicherryMapModal from "../../components/PondicherryMapModal";

const HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=80",
    title: "French Quarter (White Town)"
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
    title: "Paradise Beach, Chunnambar"
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
    title: "Matrimandir, Auroville"
  },
  {
    url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=80",
    title: "Promenade Beach Boulevard"
  },
  {
    url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1920&q=80",
    title: "Pondicherry Botanical Gardens"
  }
];

export default function DiscoverPondicherryView() {
  const { openDestinationDetails } = useApp();
  const [destinations, setDestinations] = useState<TouristDestination[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    getDestinationsFromFirebase().then(setDestinations);
  }, []);

  // Auto cross-fade background slides every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Filter destinations by category & search query
  const filteredDestinations = destinations.filter((dest) => {
    const matchesCategory = selectedCategory === "All" || dest.category === selectedCategory;
    const matchesSearch = 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.history.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full pb-28 animate-fade-in select-none bg-white dark:bg-[#0b0f19]">
      
      {/* 1. Hero Section — French Riviera Theme with Dynamic Background Slideshow */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-indigo-950 to-[#0b0f19] text-white px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-zinc-800">
        
        {/* Dynamic Background Image Carousel */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
              currentSlideIndex === idx ? "opacity-35" : "opacity-0"
            }`}
          >
            <img 
              src={slide.url} 
              alt={slide.title} 
              className="w-full h-full object-cover mix-blend-overlay scale-105 transition-transform duration-10000"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-indigo-950/70 to-transparent z-0" />

        <div className="relative z-10 max-w-[1600px] mx-auto space-y-6 text-center lg:text-left">
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-light px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
              <Compass className="w-4 h-4" />
              <span>Digital Tourist Guide • Puducherry</span>
            </div>

            {/* Currently Showing Slide Badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 px-3.5 py-1.5 rounded-full text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Featured: {HERO_SLIDES[currentSlideIndex].title}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-primary">Pondicherry</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl font-medium leading-relaxed">
            Immerse yourself in French colonial charm, tranquil golden beaches, spiritual retreats, and vibrant local experiences. Explore curated destinations and book authentic local activities.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto lg:mx-0 relative pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search beaches, French quarter, Auroville..."
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-primary transition-all shadow-xl"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-4">
            {DESTINATION_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                    : "bg-white/10 hover:bg-white/20 text-zinc-300 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 2. Interactive Map Explorer Banner Widget */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div 
          onClick={() => setIsMapOpen(true)}
          className="bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 border border-zinc-700/60 hover:border-primary rounded-3xl p-5 sm:p-6 shadow-2xl transition-all hover:scale-[1.01] cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-6 group"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform shrink-0">
              <Map className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-black text-amber-400 uppercase tracking-widest">
                <Navigation className="w-3.5 h-3.5" />
                <span>OpenStreetMap Interactive Map</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Explore Pondicherry Live Map
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Touch map to view {PONDICHERRY_DESTINATIONS.length} tourist spots 📍 & {REGISTERED_PARTNER_SHOPS.length} registered partner shops 🛍️ on live coordinates.
              </p>
            </div>
          </div>

          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-2xl text-xs font-black transition-all shadow-lg shadow-primary/30 group-hover:translate-x-1 cursor-pointer shrink-0">
            <span>Open Map Explorer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Destination Card Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Popular Destinations
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Showing {filteredDestinations.length} curated tourism spots in Puducherry
            </p>
          </div>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <Compass className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No destinations found</h3>
            <p className="text-xs text-zinc-500 mt-1">Try adjusting your search query or category filter.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="mt-4 bg-primary text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => openDestinationDetails(dest)}
                className="group bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-zinc-800">
                  <img
                    src={dest.coverImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider">
                    {dest.category}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md text-zinc-900 dark:text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{dest.rating}</span>
                  </div>

                  {/* Bottom Image Overlay Text */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{dest.distance}</span>
                    </div>
                    <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed font-medium">
                    {dest.tagline}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{dest.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{dest.entryFee}</span>
                    </div>
                  </div>

                  {/* Footer Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDestinationDetails(dest);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 group-hover:bg-primary text-zinc-800 dark:text-zinc-200 group-hover:text-white py-3 px-4 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-sm"
                  >
                    <span>Explore Destination</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Pondicherry Interactive Map Modal */}
      <PondicherryMapModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
      />

    </div>
  );
}
