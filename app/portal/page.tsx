"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getAdvertiserStats, getLocalAds, deleteLocalAd, Offer } from "../../lib/db";
import { 
  Building2, 
  TrendingUp, 
  Eye, 
  MousePointerClick, 
  Coins, 
  Plus, 
  Trash2, 
  Mail, 
  Lock, 
  LogOut, 
  AlertCircle, 
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function AdvertiserPortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Dashboard states
  const [stats, setStats] = useState({
    activeAdsCount: 0,
    pendingAdsCount: 0,
    totalSpent: 0,
    totalImpressions: 0,
    totalClicks: 0
  });
  const [ads, setAds] = useState<Offer[]>([]);

  const loadDashboardData = () => {
    setStats(getAdvertiserStats());
    setAds(getLocalAds());
  };

  useEffect(() => {
    // Check if user is logged in via local storage
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("ouiya_logged_in_host") === "true";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        loadDashboardData();
      }
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    // Simple verification check
    if (email.includes("@") && password.length >= 6) {
      localStorage.setItem("ouiya_logged_in_host", "true");
      setIsLoggedIn(true);
      setError("");
      loadDashboardData();
    } else {
      setError("Invalid email address or password (must be at least 6 characters).");
    }
  };

  const handleBypassLogin = () => {
    localStorage.setItem("ouiya_logged_in_host", "true");
    localStorage.setItem("ouiya_demo_role", "advertiser");
    setIsLoggedIn(true);
    setError("");
    loadDashboardData();
  };

  const handleLogout = () => {
    localStorage.setItem("ouiya_logged_in_host", "false");
    localStorage.setItem("ouiya_demo_role", "customer");
    setIsLoggedIn(false);
  };

  const handleDeleteAd = (id: string) => {
    if (confirm("Are you sure you want to delete this ad?")) {
      deleteLocalAd(id);
      loadDashboardData();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-primary/10 text-primary p-3.5 rounded-2xl w-fit mx-auto mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
                Ouiya Host Portal
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Grow your business by advertising coupons & discounts to thousands of local buyers.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 mb-6">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  Business Email
                </label>
                <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5">
                  <Mail className="w-4 h-4 text-zinc-400 shrink-0 mr-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@yourbrand.com"
                    className="w-full bg-transparent border-none text-xs text-zinc-800 dark:text-white focus:outline-none placeholder-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  Password
                </label>
                <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5">
                  <Lock className="w-4 h-4 text-zinc-400 shrink-0 mr-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-none text-xs text-zinc-800 dark:text-white focus:outline-none placeholder-zinc-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-primary/25 cursor-pointer mt-6"
              >
                Sign In to Dashboard
              </button>
            </form>

            {/* Test Bypass Options */}
            <div className="relative mt-8 mb-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-zinc-100 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-zinc-900 px-3 text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 tracking-widest">
                  Quick Demo Access
                </span>
              </div>
            </div>

            <button
              onClick={handleBypassLogin}
              className="w-full bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-950 dark:hover:bg-zinc-700 text-white py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Test Account Bypass (One-Click)
            </button>

          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
              Host Dashboard
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Manage your active campaigns and analyze advertisement performance.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/portal/new-ad"
              className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Ad</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-xs font-bold px-4 py-3 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-zinc-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Active Ads */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Active Campaigns
              </span>
              <span className="block text-3xl font-black text-zinc-900 dark:text-white mt-2">
                {stats.activeAdsCount}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">
                {stats.pendingAdsCount} awaiting review
              </span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Impressions */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Impressions
              </span>
              <span className="block text-3xl font-black text-zinc-900 dark:text-white mt-2">
                {stats.totalImpressions.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.4% this week</span>
              </span>
            </div>
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
              <Eye className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Total Clicks */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Coupon Claims
              </span>
              <span className="block text-3xl font-black text-zinc-900 dark:text-white mt-2">
                {stats.totalClicks.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">
                CTR: {stats.totalImpressions ? ((stats.totalClicks / stats.totalImpressions) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl">
              <MousePointerClick className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Total Spent */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Total Budget Spent
              </span>
              <span className="block text-3xl font-black text-zinc-900 dark:text-white mt-2">
                ₹{stats.totalSpent.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">
                Billed via UPI / Cards
              </span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 p-3 rounded-xl">
              <Coins className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Ads Campaigns Table */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
            <h2 className="text-base font-black text-zinc-900 dark:text-white">
              Your Promotions
            </h2>
            <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
              {ads.length} Campaigns
            </span>
          </div>

          {ads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider bg-zinc-50/20 dark:bg-zinc-900/10">
                    <th className="px-6 py-4">Brand & Offer Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Plan Name</th>
                    <th className="px-6 py-4">Amount Paid</th>
                    <th className="px-6 py-4">Campaign Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-850">
                  {ads.map((ad) => (
                    <tr key={ad.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ad.businessLogo || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&auto=format&fit=crop&q=60"}
                            alt={ad.businessName}
                            className="w-10 h-10 rounded-xl object-cover border border-zinc-100 dark:border-zinc-850"
                          />
                          <div>
                            <span className="block text-sm font-bold text-zinc-900 dark:text-white">
                              {ad.businessName}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 font-medium mt-0.5">
                              {ad.title} • Code: <span className="font-mono text-zinc-800 dark:text-zinc-200 font-bold">{ad.code}</span>
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        {ad.category}
                      </td>
                      
                      <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400">
                        {ad.plan || "Premium Plan"}
                      </td>
                      
                      <td className="px-6 py-4 text-xs font-bold text-zinc-900 dark:text-white">
                        ₹{(ad.pricePaid || 1499).toLocaleString()}
                      </td>
                      
                      <td className="px-6 py-4">
                        {ad.status === "Active" ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{ad.status || "Under Review"}</span>
                          </span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all cursor-pointer"
                          title="Delete Ad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-50/10 dark:bg-zinc-900/10 p-6">
              <Building2 className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">No Ads Created Yet</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed max-w-sm mx-auto">
                Promote your brand to shoppers by posting your first coupon. Select a plan and list your discount in minutes.
              </p>
              <Link
                href="/portal/new-ad"
                className="mt-6 inline-flex bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow shadow-primary/20 cursor-pointer"
              >
                Post Your First Ad
              </Link>
            </div>
          )}
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
