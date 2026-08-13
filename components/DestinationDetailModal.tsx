"use client";

import React, { useState } from "react";
import { useApp } from "../lib/AppContext";
import { 
  X, MapPin, Clock, Star, DollarSign, Calendar, Compass, 
  ChevronLeft, ChevronRight, Navigation, ShieldCheck, 
  Utensils, Bike, Waves, Ship, Camera, Ticket, Sparkles, ArrowRight, CheckCircle2
} from "lucide-react";
import { DestinationActivity } from "../lib/discoverData";

// Helper to render activity icons dynamically
const renderActivityIcon = (iconName: string) => {
  switch (iconName) {
    case "Ship": return <Ship className="w-5 h-5" />;
    case "Waves": return <Waves className="w-5 h-5" />;
    case "Bike": return <Bike className="w-5 h-5" />;
    case "Utensils": return <Utensils className="w-5 h-5" />;
    case "Camera": return <Camera className="w-5 h-5" />;
    case "Ticket": return <Ticket className="w-5 h-5" />;
    case "Sparkles": return <Sparkles className="w-5 h-5" />;
    default: return <Compass className="w-5 h-5" />;
  }
};

export default function DestinationDetailModal() {
  const { 
    selectedDestination, 
    closeDestinationDetails, 
    bookActivityRedirect 
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedDestination) return null;

  const dest = selectedDestination;
  const galleryImages = dest.gallery && dest.gallery.length > 0 ? dest.gallery : [dest.coverImage];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 select-none overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={closeDestinationDetails}
      />

      {/* Main Modal Window */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0d121f] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-10 my-auto overflow-hidden max-h-[92vh] flex flex-col animate-scale-up">
        
        {/* Top Header / Image Gallery Carousel */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-zinc-900 shrink-0">
          <img 
            src={galleryImages[activeImageIndex]} 
            alt={dest.name} 
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

          {/* Close Button */}
          <button
            onClick={closeDestinationDetails}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer z-20 border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Carousel Controls */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer z-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer z-20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeImageIndex === idx ? "bg-primary w-6" : "bg-white/50 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Cover Header Details Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white z-10">
            <div className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 shadow-md">
              <span>{dest.category}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight drop-shadow-md">
              {dest.name}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium mt-1 drop-shadow-sm max-w-2xl">
              {dest.tagline}
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-8 text-zinc-800 dark:text-zinc-200">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400">Rating</p>
                <p className="text-xs font-black">{dest.rating} <span className="text-[10px] text-zinc-400 font-normal">({dest.reviewsCount})</span></p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400">Distance</p>
                <p className="text-xs font-black truncate">{dest.distance}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400">Duration</p>
                <p className="text-xs font-black">{dest.estimatedDuration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400">Entry Fee</p>
                <p className="text-xs font-black">{dest.entryFee}</p>
              </div>
            </div>
          </div>

          {/* Section 1: Destination Overview & History */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <span>History & Significance</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {dest.history}
            </p>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
              <p className="font-bold text-primary text-xs uppercase tracking-wider">Visitor Experience</p>
              <p className="leading-relaxed">{dest.experience}</p>
            </div>

            {/* Key Facts */}
            {dest.facts && dest.facts.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-black uppercase text-zinc-400 tracking-wider">Interesting Facts</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dest.facts.map((fact, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Best Time to Visit */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>Best Time to Visit</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-bold">
              <div className={`p-3 rounded-xl border ${dest.bestTimeToVisit.morning ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400" : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"}`}>
                <span>Morning 🌅</span>
              </div>
              <div className={`p-3 rounded-xl border ${dest.bestTimeToVisit.evening ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400" : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"}`}>
                <span>Evening 🌇</span>
              </div>
              <div className={`p-3 rounded-xl border ${dest.bestTimeToVisit.sunrise ? "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400" : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"}`}>
                <span>Sunrise ☀️</span>
              </div>
              <div className={`p-3 rounded-xl border ${dest.bestTimeToVisit.sunset ? "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400" : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"}`}>
                <span>Sunset 🌆</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <span>{dest.bestTimeToVisit.recommendedSeason}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Facilities Available */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Available Facilities</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {dest.facilities.map((fac, idx) => (
                <span 
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span>{fac}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: In-App Navigation (Google Maps) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Directions & Navigation</p>
              <h4 className="text-base font-black mt-0.5">{dest.name}</h4>
              <p className="text-xs text-blue-100 mt-1">{dest.distance} • {dest.travelTime}</p>
            </div>
            <a
              href={dest.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-900 hover:bg-blue-50 px-5 py-3 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Section 5: Available Bookable Activities (Redirection to Offers) */}
          {dest.activities && dest.activities.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" />
                  <span>Bookable Activities & Rentals</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Select an activity to view registered business partners, pricing & active discount offers on ouiya.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dest.activities.map((act) => (
                  <div 
                    key={act.id}
                    className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between hover:border-primary/50 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                          {renderActivityIcon(act.iconName)}
                        </div>
                        {act.startingPrice && (
                          <span className="text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            From {act.startingPrice}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                        {act.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    <button
                      onClick={() => bookActivityRedirect(act)}
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all shadow-md shadow-primary/20 active:scale-98 cursor-pointer"
                    >
                      <span>Book Now ({act.categoryFilter})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
