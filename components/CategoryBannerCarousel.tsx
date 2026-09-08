"use client";

import React, { useState, useEffect } from "react";
import { AppBanner, getCategoryBannersFromFirebase, getOffers, Offer } from "../lib/db";
import { useApp } from "../lib/AppContext";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface CategoryBannerCarouselProps {
  categoryId?: string;
  categoryName?: string;
  onSelectBannerOffer?: (offerId: string) => void;
}

export default function CategoryBannerCarousel({
  categoryId,
  categoryName,
  onSelectBannerOffer,
}: CategoryBannerCarouselProps) {
  const { openOfferDetails, openShopDetails, setSelectedCategory, setTab, selectedCategory } = useApp();
  const [banners, setBanners] = useState<AppBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getCategoryBannersFromFirebase(categoryId, categoryName).then((data) => {
      if (isMounted) {
        setBanners(data);
        setCurrentIndex(0);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [categoryId, categoryName]);

  // Auto-slide every 5 seconds if there are multiple banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="w-full h-44 sm:h-52 rounded-3xl bg-surface-hover animate-pulse border border-border-main" />
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleBannerClick = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (currentBanner.targetOfferId && onSelectBannerOffer) {
      onSelectBannerOffer(currentBanner.targetOfferId);
    }

    // 1. If targetOfferId is provided on banner, open offer modal
    if (currentBanner.targetOfferId) {
      const allOffers = await getOffers();
      const targetOffer = allOffers.find((o) => o.id === currentBanner.targetOfferId);
      if (targetOffer) {
        openOfferDetails(targetOffer);
        return;
      }
    }

    // 2. If targetShopId is provided on banner, open shop modal
    if (currentBanner.targetShopId) {
      openShopDetails(currentBanner.targetShopId);
      return;
    }

    // 3. Fallback: Find matching offer or filter by banner category
    const activeCategory =
      currentBanner.categoryName ||
      currentBanner.categoryId ||
      categoryName ||
      categoryId ||
      selectedCategory;

    if (activeCategory && activeCategory !== "All") {
      setSelectedCategory(activeCategory);
    }

    const allOffers = await getOffers({
      category: activeCategory && activeCategory !== "All" ? activeCategory : undefined,
    });

    if (allOffers.length > 0) {
      const match =
        allOffers.find(
          (o) =>
            (currentBanner.title && o.title.toLowerCase().includes(currentBanner.title.toLowerCase())) ||
            (currentBanner.subtitle && o.title.toLowerCase().includes(currentBanner.subtitle.toLowerCase()))
        ) || allOffers[0];

      if (match) {
        openOfferDetails(match);
        return;
      }
    }

    // 4. Navigate tab to categories view
    setTab("categories");
    const offersSection = document.getElementById("offers-section") || document.getElementById("offers-grid");
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-border-main group bg-surface-elevated">
      {/* Active Slide Image */}
      <div 
        className="relative h-44 sm:h-52 md:h-60 w-full overflow-hidden cursor-pointer"
        onClick={handleBannerClick}
      >
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title || "Category Banner"}
          className="w-full h-full object-cover transition-all duration-700 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5 sm:p-7">
          <div className="max-w-xl space-y-2 z-10">
            {currentBanner.subtitle && (
              <span className="bg-primary text-white text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider shadow-sm inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{currentBanner.subtitle}</span>
              </span>
            )}
            {currentBanner.title && (
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
                {currentBanner.title}
              </h3>
            )}

            {/* Shop Now CTA Button matching Mobile App */}
            <div className="pt-1">
              <button
                onClick={handleBannerClick}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-[#DC0101] hover:bg-zinc-100 rounded-full text-xs font-black shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Shop Now</span>
                <span className="w-4 h-4 rounded-full bg-[#DC0101] text-white flex items-center justify-center">
                  <ChevronRight className="w-3 h-3 stroke-[3]" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows (visible if > 1 banner) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
            title="Previous Banner"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
            title="Next Banner"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Pagination Dots (Matching screenshot: Red & White dots at bottom) */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-white/60 hover:bg-white"
              }`}
              title={`Go to banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
