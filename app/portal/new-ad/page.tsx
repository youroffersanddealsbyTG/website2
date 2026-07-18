"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { getCategories, Category } from "../../../lib/db";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, FileImage } from "lucide-react";

// Pre-defined high-quality unsplash images by category
const PRESET_IMAGES = [
  { id: "img-food", name: "Food & Dining", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80" },
  { id: "img-fashion", name: "Fashion", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop&q=80" },
  { id: "img-electronic", name: "Electronics", url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&auto=format&fit=crop&q=80" },
  { id: "img-health", name: "Beauty & Health", url: "https://images.unsplash.com/photo-1631549911990-95c2108f9029?w=400&auto=format&fit=crop&q=80" },
  { id: "img-kitchen", name: "Home & Kitchen", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80" },
  { id: "img-travel", name: "Travel", url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&auto=format&fit=crop&q=80" },
  { id: "img-auto", name: "Automotive", url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&auto=format&fit=crop&q=80" }
];

export default function CreateNewAdPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form Fields
  const [businessName, setBusinessName] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [location, setLocation] = useState("Puducherry");
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">("premium");

  const [formStep, setFormStep] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    setCategories(getCategories());
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("ouiya_logged_in_host") === "true";
      setIsLoggedIn(logged);
    }
  }, []);

  const handleNextStep = () => {
    if (formStep === 1) {
      if (!businessName || !title || !discount || !description) {
        setError("Please fill out all mandatory fields in Step 1.");
        return;
      }
      setError("");
      setFormStep(2);
    }
  };

  const handleBackStep = () => {
    if (formStep === 2) {
      setFormStep(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create draft object
    const draftAd = {
      businessName,
      title,
      subTitle: subTitle || "Special Promo",
      discount,
      code: code.toUpperCase() || "NOCODE",
      description,
      category,
      location,
      businessLogo: customImageUrl || selectedImage,
      plan: selectedPlan === "basic" ? "Basic Plan" : "Premium Plan",
      pricePaid: selectedPlan === "basic" ? 499 : 1499,
      status: "Pending Payment"
    };

    // Save to temp storage for checkout retrieval
    if (typeof window !== "undefined") {
      localStorage.setItem("ouiya_temp_ad", JSON.stringify(draftAd));
    }

    // Go to payment screen
    router.push("/portal/payment");
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-12">
        
        {/* Back link */}
        <button
          onClick={() => router.push("/portal")}
          className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-6 focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Form Wizard Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${formStep === 1 ? "bg-primary text-white" : "bg-emerald-500 text-white"}`}>
                1
              </span>
              <span className={`text-xs font-bold ${formStep === 1 ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
                Coupon Details
              </span>
            </div>
            
            <div className="w-16 h-0.5 bg-zinc-200 dark:bg-zinc-800" />
            
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${formStep === 2 ? "bg-primary text-white" : "bg-zinc-150 dark:bg-zinc-800 text-zinc-400"}`}>
                2
              </span>
              <span className={`text-xs font-bold ${formStep === 2 ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
                Select Pricing Plan
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: Offer Details */}
            {formStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-zinc-900 dark:text-white">Create Advertisement Draft</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Provide attractive details about your offer to catch shoppers' attention.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Brand Name */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                      Business/Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Starbucks, Domino's"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Promo Code */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                      Coupon Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. COFFEE50, BOGOFREE"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary uppercase font-mono tracking-widest font-bold"
                    />
                  </div>

                  {/* Offer Title */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                      Discount Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. 50% OFF, Buy 1 Get 1"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Offer Subtitle */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                      Offer Subtitle (Optional)
                    </label>
                    <input
                      type="text"
                      value={subTitle}
                      onChange={(e) => setSubTitle(e.target.value)}
                      placeholder="e.g. On food orders, On beverages"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {categories.filter(c => c.name !== "More").map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Dropdown */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                      Location *
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="Puducherry">Puducherry</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Bangalore">Bangalore</option>
                    </select>
                  </div>
                </div>

                {/* Discount Description */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                    Detailed Offer Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how users can redeem this discount, minimum billing requirements, or other conditions..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary resize-none leading-relaxed"
                  />
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-1.5">
                    <FileImage className="w-4 h-4 text-primary" />
                    <span>Select Campaign Banner Banner Image</span>
                  </label>
                  
                  {/* Preset Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => { setSelectedImage(img.url); setCustomImageUrl(""); }}
                        className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer ${
                          selectedImage === img.url && !customImageUrl
                            ? "border-primary scale-[1.02] shadow-md shadow-primary/20"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/40 flex items-end p-1.5 text-[8px] font-extrabold text-white uppercase tracking-wider">
                          {img.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Custom URL Option */}
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase">
                      Or use custom image URL
                    </label>
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => { setCustomImageUrl(e.target.value); setSelectedImage(""); }}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-lg cursor-pointer"
                  >
                    <span>Choose Pricing Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Choose Pricing Plan */}
            {formStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-zinc-900 dark:text-white">Choose Campaign Budget</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Select a promotion window suitable for your business needs.</p>
                </div>

                {/* Plan Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Basic Plan */}
                  <div
                    onClick={() => setSelectedPlan("basic")}
                    className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      selectedPlan === "basic"
                        ? "border-primary bg-primary/5 text-primary scale-[1.01] shadow-lg shadow-primary/5"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950"
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-extrabold uppercase tracking-widest text-zinc-400">
                        Basic Plan
                      </span>
                      <span className="block text-4xl font-black mt-4 text-zinc-900 dark:text-white">
                        ₹499
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block mt-1">
                        Active for 7 Days
                      </span>
                      
                      <ul className="mt-6 space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        <li className="flex items-center gap-2">
                          <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                          <span>1 City wide location listing</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                          <span>Basic analytics reporting</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Premium Plan */}
                  <div
                    onClick={() => setSelectedPlan("premium")}
                    className={`border-2 rounded-2xl p-6 cursor-pointer relative overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                      selectedPlan === "premium"
                        ? "border-primary bg-primary/5 text-primary scale-[1.01] shadow-lg shadow-primary/5"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950"
                    }`}
                  >
                    {/* Hot Badge */}
                    <div className="absolute -right-12 -top-12 w-24 h-24 bg-primary text-white rotate-45 flex items-end justify-center pb-2 select-none shadow">
                      <Sparkles className="w-4.5 h-4.5 mb-1" />
                    </div>

                    <div>
                      <span className="block text-xs font-extrabold uppercase tracking-widest text-zinc-400">
                        Premium Plan
                      </span>
                      <span className="block text-4xl font-black mt-4 text-zinc-900 dark:text-white">
                        ₹1,499
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block mt-1">
                        Active for 30 Days
                      </span>
                      
                      <ul className="mt-6 space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        <li className="flex items-center gap-2">
                          <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                          <span>Multi-city location optimization</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                          <span>Priority grid placement (Homepage)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                          <span>Advanced dashboard conversion insights</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Navigation Controls */}
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-8 py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-lg cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
