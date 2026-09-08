"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../lib/AppContext";
import { 
  getOffers, 
  getCategories, 
  getCategoriesFromFirebase,
  getBusinesses, 
  getBusinessesFromFirebase, 
  getBannersFromFirebase,
  getPromoBannersFromFirebase,
  getHotspotsFromFirebase,
  Offer, 
  Category, 
  Business,
  AppBanner,
  PromoBanner,
  Hotspot,
  matchesSubCategory
} from "../lib/db";
import CategoryBannerCarousel from "../components/CategoryBannerCarousel";
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
  Search, Star, Heart, ChevronRight,
  Sparkles, Flame, Ticket, Compass, MapPin, Users, Building2, Gift, Download, ShieldCheck,
  Utensils, Shirt, Smartphone, Home, Plane, Car, Hotel, Scissors, Anchor, Clapperboard, Wine, Flower2, Dumbbell, Tag, MoreHorizontal
} from "lucide-react";

// Helper to render lucide icon dynamically based on name or category title
const IconRenderer = ({ name, categoryTitle, className }: { name?: string; categoryTitle?: string; className?: string }) => {
  const titleLower = (categoryTitle || "").toLowerCase();
  const nameLower = (name || "").toLowerCase();

  if (titleLower.includes("accommodation") || titleLower.includes("hotel") || nameLower.includes("hotel") || nameLower.includes("bed")) {
    return <Hotel className={className} />;
  }
  if (titleLower.includes("beauty") || titleLower.includes("saloon") || titleLower.includes("hair") || nameLower.includes("scissors")) {
    return <Scissors className={className} />;
  }
  if (titleLower.includes("boat") || titleLower.includes("water") || nameLower.includes("anchor") || nameLower.includes("ship")) {
    return <Anchor className={className} />;
  }
  if (titleLower.includes("car") || titleLower.includes("auto") || nameLower.includes("car")) {
    return <Car className={className} />;
  }
  if (titleLower.includes("entertainment") || titleLower.includes("game") || titleLower.includes("movie") || nameLower.includes("clapperboard")) {
    return <Clapperboard className={className} />;
  }
  if (titleLower.includes("food") || titleLower.includes("dine") || titleLower.includes("cafe") || nameLower.includes("utensils")) {
    return <Utensils className={className} />;
  }
  if (titleLower.includes("mobile") || titleLower.includes("phone") || titleLower.includes("tech") || titleLower.includes("repair") || nameLower.includes("smartphone")) {
    return <Smartphone className={className} />;
  }
  if (titleLower.includes("night") || titleLower.includes("party") || titleLower.includes("pub") || titleLower.includes("bar") || nameLower.includes("wine")) {
    return <Wine className={className} />;
  }
  if (titleLower.includes("real estate") || titleLower.includes("home") || nameLower.includes("home") || nameLower.includes("building")) {
    return <Home className={className} />;
  }
  if (titleLower.includes("spa") || titleLower.includes("massage") || titleLower.includes("wellness") || nameLower.includes("flower")) {
    return <Flower2 className={className} />;
  }
  if (titleLower.includes("fashion") || titleLower.includes("apparel") || titleLower.includes("cloth") || nameLower.includes("shirt")) {
    return <Shirt className={className} />;
  }
  if (titleLower.includes("travel") || titleLower.includes("flight") || titleLower.includes("tour") || nameLower.includes("plane")) {
    return <Plane className={className} />;
  }
  if (titleLower.includes("health") || titleLower.includes("fitness") || titleLower.includes("gym") || nameLower.includes("dumbbell")) {
    return <Dumbbell className={className} />;
  }

  switch (name) {
    case "Utensils": return <Utensils className={className} />;
    case "Shirt": return <Shirt className={className} />;
    case "Smartphone": return <Smartphone className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Home": return <Home className={className} />;
    case "Plane": return <Plane className={className} />;
    case "Car": return <Car className={className} />;
    case "Hotel": return <Hotel className={className} />;
    case "Scissors": return <Scissors className={className} />;
    case "Anchor": return <Anchor className={className} />;
    case "Clapperboard": return <Clapperboard className={className} />;
    case "Wine": return <Wine className={className} />;
    case "Flower2": return <Flower2 className={className} />;
    case "Dumbbell": return <Dumbbell className={className} />;
    default: return <Tag className={className} />;
  }
};

// Dynamic Category Banners matching Mobile App screenshots (Images 1, 2, 3)
const CATEGORY_HERO_BANNERS: Record<string, { title: string; subtitle: string; discount: string; tag: string; bgImage: string }> = {
  "accommodation": {
    title: "Beach Resorts & French Quarters",
    subtitle: "Experience Serene Coastal Stays & Heritage Villas in Pondicherry",
    discount: "Up to 50% OFF",
    tag: "LIMITED TIME OFFER",
    bgImage: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80"
  },
  "beauty parlour": {
    title: "Premium Salons & Hair Styling",
    subtitle: "Bridal Glow & Makeover Packages at Top Salons & Spa Centers",
    discount: "Up to 45% OFF",
    tag: "LIMITED TIME OFFER",
    bgImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80"
  },
  "beauty": {
    title: "Premium Salons & Hair Styling",
    subtitle: "Bridal Glow & Makeover Packages at Top Salons & Spa Centers",
    discount: "Up to 45% OFF",
    tag: "LIMITED TIME OFFER",
    bgImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80"
  },
  "boating service": {
    title: "Chunnambar & Mangrove Cruises",
    subtitle: "Speed Boats, Sunset Sailing & Kayaking Adventures",
    discount: "Flat 30% OFF",
    tag: "LIMITED TIME OFFER",
    bgImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80"
  },
  "car wash": {
    title: "Professional Auto Care & Detailing",
    subtitle: "Foam Wash, Ceramic Coating & Interior Detailing",
    discount: "Up to 40% OFF",
    tag: "EXPRESS SERVICE",
    bgImage: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1200&auto=format&fit=crop&q=80"
  },
  "electronics": {
    title: "Vivo & Electronics Mega Sale",
    subtitle: "Latest Smartphones, Laptops, 4K TVs & Audio Accessories",
    discount: "Up to 60% OFF",
    tag: "MEGA DEALS",
    bgImage: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80"
  },
  "food": {
    title: "Pondicherry Gourmet & French Cafes",
    subtitle: "Authentic Bakeries, Seafood Grills & Multi-Cuisine Dining",
    discount: "Flat 35% OFF",
    tag: "FOODIE SPECIAL",
    bgImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80"
  },
  "food & dining": {
    title: "Pondicherry Gourmet & French Cafes",
    subtitle: "Authentic Bakeries, Seafood Grills & Multi-Cuisine Dining",
    discount: "Flat 35% OFF",
    tag: "FOODIE SPECIAL",
    bgImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80"
  },
  "two wheeler rental": {
    title: "Scooter & Royal Enfield Rentals",
    subtitle: "Explore White Town & Auroville on Rental Bikes & EVs",
    discount: "Up to 30% OFF",
    tag: "EASY RENTALS",
    bgImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop&q=80"
  },
  "real estate": {
    title: "Beach Villas & Property Rentals",
    subtitle: "Rental Homes, Land Plots & Commercial Properties in Pondicherry",
    discount: "Verified Listings",
    tag: "DIRECT OWNERS",
    bgImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80"
  }
};

// Sub-categories mapping matching Mobile App screenshots 1, 2, 3
const SUB_CATEGORIES_MAP: Record<string, string[]> = {
  "accommodation": ["All", "Hotels", "Resorts", "French Quarters", "Villas", "Homestays"],
  "beauty parlour": ["All", "Haircut", "Hair Styling", "Facials", "Bridal Glow", "Spa & Massage"],
  "beauty": ["All", "Haircut", "Hair Styling", "Facials", "Bridal Glow", "Spa & Massage"],
  "boating service": ["All", "Mangrove", "Speed Boats", "Sunset Cruise", "Kayaking"],
  "car wash": ["All", "Foam Wash", "Interior Detailing", "Ceramic Coating", "Polishing"],
  "electronics": ["All", "Mobiles", "Laptops", "Audio", "Smart TVs", "Accessories"],
  "food": ["All", "French Cafes", "Fine Dining", "Seafood", "Biryani", "Bakeries", "Quick Bites"],
  "food & dining": ["All", "French Cafes", "Fine Dining", "Seafood", "Biryani", "Bakeries", "Quick Bites"],
  "two wheeler rental": ["All", "Scooters", "Activa", "Geared Bikes", "Royal Enfield", "Electric EV"],
  "real estate": ["All", "Rentals", "Beach Plots", "Villas for Sale", "Commercial Shops"],
  "entertainment": ["All", "Games", "Multiplex", "Events", "Water Parks"],
  "fashion": ["All", "Women", "Men", "Ethnic & Silk", "Footwear", "Boutiques"]
};

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
    selectedCategory,
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
  const [banners, setBanners] = useState<AppBanner[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");

  // Fetch initial data from Cloud Firestore
  useEffect(() => {
    getCategoriesFromFirebase().then(setCategories);
    getBusinessesFromFirebase().then(setBusinesses);
    getOffers().then(setOffers);
    getBannersFromFirebase().then(setBanners);
    getPromoBannersFromFirebase().then(setPromoBanners);
    getHotspotsFromFirebase().then(setHotspots);
  }, []);

  // Reset subcategory when selectedCategory changes
  useEffect(() => {
    setActiveSubCategory("All");
  }, [selectedCategory]);

  // Auto scroll banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % (banners.length || 3));
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
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

  // Dynamic Category Banner matching Firestore `banners` collection & mobile app screens
  const currentCategoryBanner = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All") {
      if (banners.length > 0) {
        const activeHomeBanner = banners[carouselIndex % banners.length];
        return {
          title: activeHomeBanner?.title || "Pondicherry Mega Deals & Discounts",
          subtitle: activeHomeBanner?.subtitle || "Exclusive discount coupons, gift vouchers & local partner offers",
          discount: "UP TO 60% OFF",
          tag: "FEATURED DEALS",
          bgImage: activeHomeBanner?.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
        };
      }
      return {
        title: "Pondicherry Mega Deals & Discounts",
        subtitle: "Exclusive discount coupons, gift vouchers & local partner offers",
        discount: "UP TO 60% OFF",
        tag: "LIMITED TIME OFFER",
        bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
      };
    }

    const catKey = selectedCategory.toLowerCase().trim();
    // 1. Check if Firestore has a specific category banner uploaded for this category
    const firestoreCategoryBanner = banners.find(b => {
      const bCatName = (b.categoryName || "").toLowerCase().trim();
      const bCatId = (b.categoryId || "").toLowerCase().trim();
      return b.targetScreen === "category" && (bCatName === catKey || bCatId === catKey || catKey.includes(bCatName) || bCatName.includes(catKey));
    });

    if (firestoreCategoryBanner) {
      return {
        title: firestoreCategoryBanner.title || `${selectedCategory} Offers`,
        subtitle: firestoreCategoryBanner.subtitle || `Explore top verified offers & partner businesses for ${selectedCategory} in Pondicherry`,
        discount: "SPECIAL DEALS",
        tag: "VERIFIED BANNER",
        bgImage: firestoreCategoryBanner.imageUrl
      };
    }

    return CATEGORY_HERO_BANNERS[catKey] || {
      title: `${selectedCategory} Deals & Vouchers`,
      subtitle: `Explore top verified offers & partner businesses for ${selectedCategory} in Pondicherry`,
      discount: "UP TO 50% OFF",
      tag: "FEATURED CATEGORY",
      bgImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80"
    };
  }, [selectedCategory, banners, carouselIndex]);

  // Subcategories loaded dynamically from Firestore `categories` collection
  const subCategoriesList = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All") return [];
    const catKey = selectedCategory.toLowerCase().trim();
    
    // Check if Firestore category doc has custom subcategories
    const activeCatDoc = categories.find(c => {
      const name = (c.name || "").toLowerCase().trim();
      const id = (c.id || "").toLowerCase().trim();
      return name === catKey || id === catKey || catKey.includes(name) || name.includes(catKey);
    });

    if (activeCatDoc && activeCatDoc.subcategories && activeCatDoc.subcategories.length > 0) {
      return ["All", ...activeCatDoc.subcategories];
    }

    return SUB_CATEGORIES_MAP[catKey] || ["All", "Hotels", "Top Rated", "Best Discounts", "New Arrivals"];
  }, [selectedCategory, categories]);

  // Filtered category offers for real-time category switching
  const filteredCategoryOffers = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All") return offers;
    const catLower = selectedCategory.toLowerCase().trim();
    return offers.filter((o) => {
      const oCat = (o.category || "").toLowerCase();
      const oTitle = (o.title || "").toLowerCase();
      const oBiz = (o.businessName || "").toLowerCase();
      const oSub = (o.subTitle || "").toLowerCase();

      return (
        oCat === catLower ||
        oCat.includes(catLower) ||
        catLower.includes(oCat) ||
        oTitle.includes(catLower) ||
        oBiz.includes(catLower) ||
        oSub.includes(catLower)
      );
    });
  }, [offers, selectedCategory]);

  // Subcategory filtered offers
  const subFilteredOffers = useMemo(() => {
    if (activeSubCategory === "All") return filteredCategoryOffers;
    return filteredCategoryOffers.filter((o) => matchesSubCategory(o, activeSubCategory));
  }, [filteredCategoryOffers, activeSubCategory]);

  // Render home page feed
  const renderHomeFeed = () => {
    const isAll = !selectedCategory || selectedCategory === "All";

    return (
      <div className="w-full pb-28 animate-fade-in select-none bg-zinc-100 dark:bg-[#0b0f19]">
        
        {/* Main Content Area Container (Wide max-w-[1600px]) */}
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 pt-4 space-y-5 pb-24">
          
          {/* 1. Top Categories STICKY Scroll Bar */}
          <section className="sticky top-16 md:top-20 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-md transition-all duration-300">
            <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1 scroll-smooth">
              {/* For You / All active tab */}
              <button
                onClick={() => handleCategoryClick("All")}
                className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none shrink-0 w-[78px] sm:w-[94px]"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isAll
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                    : "border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-red-50 dark:group-hover:bg-red-950/30 group-hover:border-red-500 group-hover:text-red-600"
                }`}>
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className={`text-[10px] sm:text-[11px] text-center leading-tight transition-colors ${
                  isAll
                    ? "font-black text-red-600 dark:text-red-400"
                    : "font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-red-600"
                }`}>
                  For You
                </span>
              </button>

              {categories.map((cat) => {
                const isSelected = !isAll && selectedCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none shrink-0 w-[78px] sm:w-[94px]"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                        : "border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-red-50 dark:group-hover:bg-red-950/30 group-hover:border-red-500 group-hover:text-red-600"
                    }`}>
                      <IconRenderer name={cat.iconName} categoryTitle={cat.name} className="w-5.5 h-5.5" />
                    </div>
                    <span className={`text-[10px] sm:text-[11px] text-center leading-tight line-clamp-2 w-full px-0.5 transition-colors ${
                      isSelected
                        ? "font-black text-red-600 dark:text-red-400"
                        : "font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-red-600"
                    }`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. Hero Banner Section (Category Banner Carousel with Pagination Dots) */}
          <CategoryBannerCarousel
            categoryId={selectedCategory}
            categoryName={selectedCategory}
          />

          {/* 3. Subcategory Filter Pills Row (When Category is Selected) */}
          {!isAll && subCategoriesList.length > 0 && (
            <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {subCategoriesList.map((subName) => {
                  const isSelected = activeSubCategory === subName;
                  return (
                    <button
                      key={subName}
                      onClick={() => setActiveSubCategory(subName)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-red-600 text-white shadow-md scale-105"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                      }`}
                    >
                      <span>{subName}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 4. Real Deals & Offers Grid (Loaded from Cloud Firestore) */}
          <section id="offers-feed-section" className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-600" />
                <span>{isAll ? "Recommended For You" : `All ${selectedCategory} Offers`}</span>
              </h3>
              <span className="text-xs font-extrabold text-zinc-500">
                {(isAll ? offers : subFilteredOffers).length} Verified Deals
              </span>
            </div>

            {(isAll ? offers : subFilteredOffers).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {(isAll ? offers : subFilteredOffers).map((offer) => {
                  const isLiked = likedOffers[offer.id];
                  return (
                    <div
                      key={offer.id}
                      onClick={() => openShopDetails(offer.shopId, offer)}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                    >
                      <div className="absolute top-6 left-6 z-10 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                        {offer.discount}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleOfferLike(offer.id); }}
                        className="absolute top-6 right-6 z-10 bg-white/90 dark:bg-zinc-900/90 p-2 rounded-full text-zinc-400 hover:text-red-500 backdrop-blur-md transition-colors shadow-sm cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-red-600 text-red-600" : ""}`} />
                      </button>
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850">
                        <img
                          src={offer.businessLogo || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80"}
                          alt={offer.businessName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-2 flex-grow">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-extrabold uppercase text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
                            {offer.category || selectedCategory}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 text-[10px] font-black shrink-0">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{offer.rating || 4.5}</span>
                          </div>
                        </div>
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white truncate group-hover:text-red-600 transition-colors leading-tight">
                          {offer.businessName}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 font-medium leading-snug">
                          {offer.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          <span className="truncate">{offer.location || "White Town, Pondicherry"}</span>
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-zinc-900 dark:text-white">₹{offer.ouiyaPrice}</span>
                            {offer.originalPrice && <span className="text-xs text-zinc-400 line-through">₹{offer.originalPrice}</span>}
                          </div>
                          <span className="text-[9px] text-emerald-600 font-bold block">
                            Save ₹{(offer.originalPrice || Math.round(offer.ouiyaPrice * 1.3)) - offer.ouiyaPrice}
                          </span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); openShopDetails(offer.shopId, offer); }}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                        >
                          <span>View Deal</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-zinc-900 dark:text-white">No Offers Found in {selectedCategory}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto font-medium">
                    There are currently no active deals for this specific category in Pondicherry. Check back soon or view all deals!
                  </p>
                </div>
                <button
                  onClick={() => handleCategoryClick("All")}
                  className="bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md hover:bg-red-700 transition-colors"
                >
                  View All Deals
                </button>
              </div>
            )}
          </section>

          {/* 5. Trending Deals & Vouchers Section */}
          {isAll && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
              
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
          )}

        </div>
      </div>
    );
  };

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
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">
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
