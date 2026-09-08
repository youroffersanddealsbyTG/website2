"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../../lib/AppContext";
import { getOffers, getBusinessesFromFirebase, getCategoriesFromFirebase, Offer, Business, Category, matchesSubCategory } from "../../lib/db";
import CategoryBannerCarousel from "../../components/CategoryBannerCarousel";
import { 
  ArrowLeft, Search, Star, Heart, MapPin, 
  Sparkles, Flame, Percent, ChevronRight, Filter, Tag, ArrowUpRight
} from "lucide-react";

// Sub-categories mapping for Wireframe Image 2 compliance
const SUB_CATEGORIES: Record<string, string[]> = {
  "Accommodation": ["All", "Hotels", "Resorts", "Homestays", "Lodges", "Guest Houses", "Villas"],
  "accommodation": ["All", "Hotels", "Resorts", "Homestays", "Lodges", "Guest Houses", "Villas"],
  "Electronics": ["All", "Mobiles", "Audio", "TV & Video", "Accessories"],
  "Mobiles": ["All", "Smartphones", "Feature Phones", "Accessories", "Tablets"],
  "Audio": ["All", "Headphones", "Earbuds", "Speakers", "Soundbars"],
  "TV & Video": ["All", "Smart TVs", "4K TVs", "Projectors", "Set Top Box"],
  "Laptops": ["All", "Gaming", "Business", "Ultrabook", "2-in-1"],
  "Accessories": ["All", "Chargers", "Cables", "Power Banks", "Bags"],
  "Food & Dining": ["All", "Cafes", "Fine Dining", "Bakeries", "Fast Food"],
  "Fashion": ["All", "Men", "Women", "Footwear", "Watches"],
  "Beauty": ["All", "Skincare", "Haircare", "Makeup", "Spa"],
  "Home & Living": ["All", "Furniture", "Decor", "Lighting", "Kitchen"],
  "Travel": ["All", "Hotels", "Resorts", "Tours", "Rentals"],
  "Sports": ["All", "Fitness", "Gyms", "Equipment", "Apparel"]
};

// Category Banners mapping for Wireframe Image 2 compliance
const CATEGORY_BANNERS: Record<string, { title: string; subtitle: string; discount: string; bg: string }> = {
  "Electronics": { title: "Big Electronics Fest!", subtitle: "Latest gadgets. Best offers.", discount: "Up to 60% OFF", bg: "from-blue-700 via-indigo-800 to-purple-900" },
  "Mobiles": { title: "Smartphones Mega Deal", subtitle: "Top smartphones at unbeatable prices", discount: "Up to 50% OFF", bg: "from-slate-900 via-zinc-800 to-blue-900" },
  "Audio": { title: "Sound Like Never Before", subtitle: "Premium headphones & wireless earbuds", discount: "Up to 50% OFF", bg: "from-red-800 via-rose-900 to-zinc-950" },
  "TV & Video": { title: "Big Screen Big Experience", subtitle: "4K Smart TVs & Home Theater setups", discount: "Up to 55% OFF", bg: "from-cyan-900 via-blue-950 to-zinc-950" },
  "Laptops": { title: "Powerful Performance", subtitle: "Gaming, business & ultrabook laptops", discount: "Up to 40% OFF", bg: "from-purple-900 via-indigo-950 to-zinc-950" },
  "Accessories": { title: "Essential Tech Accessories", subtitle: "Fast chargers, durable cables & power banks", discount: "Up to 50% OFF", bg: "from-blue-900 via-cyan-950 to-zinc-950" },
  "Food & Dining": { title: "Pondicherry Foodie Special", subtitle: "Delightful French & South Indian delicacies", discount: "Flat 30% OFF", bg: "from-orange-700 via-red-800 to-amber-900" },
  "Fashion": { title: "Trendy Style Clearance", subtitle: "Apparel, footwear & luxury accessories", discount: "Up to 60% OFF", bg: "from-pink-700 via-rose-800 to-purple-900" }
};

export default function CategoryBrowseView() {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    setTab, 
    searchQuery, 
    setSearchQuery,
    openShopDetails,
    likedOffers,
    toggleOfferLike,
    likedShops,
    toggleShopLike
  } = useApp();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");

  useEffect(() => {
    getCategoriesFromFirebase().then(setCategoriesList);
  }, []);

  useEffect(() => {
    setActiveSubCategory("All");
  }, [selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      const activeOffers = await getOffers({
        category: selectedCategory,
        query: searchQuery
      });
      setOffers(activeOffers);

      const allBiz = await getBusinessesFromFirebase();
      if (selectedCategory && selectedCategory !== "All") {
        const filteredBiz = allBiz.filter((b) => 
          activeOffers.some((o) => o.shopId === b.id || o.businessName.toLowerCase() === b.name.toLowerCase())
        );
        setBusinesses(filteredBiz.length > 0 ? filteredBiz : allBiz);
      } else {
        setBusinesses(allBiz);
      }
    };
    fetchData();
  }, [selectedCategory, searchQuery]);

  const handleBack = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setTab("home");
  };

  const subCategoriesList = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All") return ["All", "Top Rated", "New Arrivals", "Best Discount"];
    const catKey = selectedCategory.toLowerCase().trim();
    
    const activeCatDoc = categoriesList.find(c => {
      const name = (c.name || "").toLowerCase().trim();
      const id = (c.id || "").toLowerCase().trim();
      return name === catKey || id === catKey || catKey.includes(name) || name.includes(catKey);
    });

    if (activeCatDoc && activeCatDoc.subcategories && activeCatDoc.subcategories.length > 0) {
      return ["All", ...activeCatDoc.subcategories];
    }

    return SUB_CATEGORIES[selectedCategory] || ["All", "Top Rated", "New Arrivals", "Best Discount"];
  }, [selectedCategory, categoriesList]);

  const categoryBanner = useMemo(() => {
    return CATEGORY_BANNERS[selectedCategory] || {
      title: `${selectedCategory === "All" ? "OUIYA Mega Deals" : selectedCategory}`,
      subtitle: "Discover best local offers & discount vouchers in Pondicherry",
      discount: "Up to 50% OFF",
      bg: "from-red-600 via-rose-700 to-primary-dark"
    };
  }, [selectedCategory]);

  // Filtered offers by sub-category tab
  const filteredOffers = useMemo(() => {
    if (activeSubCategory === "All") return offers;
    return offers.filter((o) => matchesSubCategory(o, activeSubCategory));
  }, [offers, activeSubCategory]);

  return (
    <div className="w-full pb-24 animate-fade-in select-none bg-zinc-50 dark:bg-[#0b0f19]">
      
      {/* 1. Header Navigation */}
      <div className="sticky top-16 z-30 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack} 
            className="hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-zinc-700 dark:text-zinc-300" />
          </button>
          <div>
            <h2 className="text-base font-black tracking-wider uppercase text-zinc-900 dark:text-white leading-tight">
              {searchQuery ? `Search: "${searchQuery}"` : (selectedCategory === "All" ? "All Categories" : selectedCategory)}
            </h2>
            <span className="text-[10px] text-zinc-500 font-semibold">
              {filteredOffers.length} Deals Available in Pondicherry
            </span>
          </div>
        </div>

        {/* Main Category Quick Selector Bar */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "All" 
                ? "bg-red-600 text-white shadow-md" 
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
            }`}
          >
            All
          </button>
          {categoriesList.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.name 
                  ? "bg-red-600 text-white shadow-md" 
                  : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* 2. Sub-Category Scrollable Pills Row */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black uppercase text-zinc-400 shrink-0 px-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-red-500" />
            <span>Sub-Category:</span>
          </span>
          {subCategoriesList.map((subCat) => (
            <button
              key={subCat}
              onClick={() => setActiveSubCategory(subCat)}
              className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                activeSubCategory === subCat
                  ? "bg-red-600 text-white shadow-md scale-102"
                  : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {subCat}
            </button>
          ))}
        </div>

        {/* 3. Category Promotional Hero Banner Slideshow (Category Banners Carousel) */}
        <CategoryBannerCarousel
          categoryId={selectedCategory}
          categoryName={selectedCategory}
        />

        {/* 4. Filtered Deal Offers (Wireframe Image 2 Grid & Cards) */}
        <section className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-red-600" />
              <span>{selectedCategory} Deals & Offers</span>
            </h3>
            <span className="text-xs font-bold text-zinc-500">
              {filteredOffers.length} Deals
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredOffers.map((offer) => {
              const isLiked = likedOffers[offer.id];
              return (
                <div
                  key={offer.id}
                  onClick={() => openShopDetails(offer.shopId, offer)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Discount Badge */}
                  <div className="absolute top-6 left-6 z-10 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                    {offer.discount}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleOfferLike(offer.id); }}
                    className="absolute top-6 right-6 z-10 bg-white/90 dark:bg-zinc-900/90 p-2 rounded-full text-zinc-400 hover:text-red-500 backdrop-blur-md transition-colors shadow-sm cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-red-600 text-red-600" : ""}`} />
                  </button>

                  {/* Product Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850">
                    <img
                      src={offer.businessLogo || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80"}
                      alt={offer.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="space-y-2 flex-grow">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-extrabold uppercase text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
                        {offer.category || "Offer"}
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
                      <span className="truncate">{offer.location || "White Town, Pondicherry"} • 1.2 km</span>
                    </p>
                  </div>

                  {/* Pricing Footer */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-zinc-900 dark:text-white">
                          ₹{offer.ouiyaPrice}
                        </span>
                        {offer.originalPrice && (
                          <span className="text-xs text-zinc-400 line-through">
                            ₹{offer.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-emerald-600 font-bold block">
                        Save ₹{(offer.originalPrice || offer.ouiyaPrice * 1.3) - offer.ouiyaPrice}
                      </span>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); openShopDetails(offer.shopId, offer); }}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <span>Claim</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
