"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Tag, Building2, ArrowRight, ShoppingCart } from "lucide-react";
import { useApp } from "../lib/AppContext";

export default function Navbar() {
  const { cart, activeTab, setTab, toggleDrawer, isDrawerOpen } = useApp();
  const [userRole, setUserRole] = useState<"customer" | "advertiser">("customer");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Load and sync user role from local storage for easy demo testing
  useEffect(() => {
    const savedRole = localStorage.getItem("ouiya_demo_role") as "customer" | "advertiser";
    if (savedRole) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserRole(savedRole);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleRole = () => {
    const newRole = userRole === "customer" ? "advertiser" : "customer";
    setUserRole(newRole);
    localStorage.setItem("ouiya_demo_role", newRole);
    
    if (newRole === "advertiser") {
      router.push("/portal");
    } else {
      router.push("/");
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-zinc-950/95 shadow-md backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800"
          : "bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" onClick={() => setTab("home")}>
              <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                <Tag className="w-5 h-5 md:w-6 md:h-6 rotate-90" />
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                ouiya<span className="text-primary">.</span>
              </span>
            </Link>
 
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              <button
                onClick={() => { setTab("home"); router.push("/"); }}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "home" && pathname === "/"
                    ? "bg-primary/10 text-primary font-black"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => { setTab("categories"); router.push("/"); }}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "categories" && pathname === "/"
                    ? "bg-primary/10 text-primary font-black"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                Offers
              </button>
              <Link
                href="/portal"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  pathname.startsWith("/portal")
                    ? "bg-primary/10 text-primary font-black"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                Ad Portal
              </Link>
            </div>
          </div>

          {/* Right Side Options (Role Switcher and Auth buttons) */}
          <div className="hidden md:flex md:items-center md:gap-3">

            {/* Cart Icon (only in customer mode) */}
            {userRole === "customer" && (
              <button
                onClick={() => { setTab("cart"); router.push("/"); }}
                className="relative p-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:scale-105 transition-all duration-200 cursor-pointer focus:outline-none bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full"
                title="View Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border-2 border-white dark:border-zinc-950 animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            {/* Quick Demo Switcher */}
            <button
              onClick={toggleRole}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 cursor-pointer transition-all duration-200"
              title="Click to toggle user role for testing"
            >
              <div className={`w-2 h-2 rounded-full ${userRole === "advertiser" ? "bg-emerald-500 animate-pulse" : "bg-primary animate-pulse"}`} />
              <span>Testing: {userRole === "advertiser" ? "Host Portal" : "Customer View"}</span>
            </button>

            {userRole === "advertiser" ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/portal"
                  className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300 shadow-md"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Host Dashboard</span>
                </Link>
                
                <button
                  onClick={toggleDrawer}
                  className="relative w-10 h-10 flex flex-col justify-center items-center gap-[4.5px] rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-200 focus:outline-none cursor-pointer"
                  title="Open Navigation Menu"
                >
                  <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${isDrawerOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
                  <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${isDrawerOpen ? "opacity-0" : ""}`} />
                  <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${isDrawerOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/portal"
                  className="text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors text-sm font-semibold px-4 py-2"
                >
                  Host Login
                </Link>
                <Link
                  href="/portal"
                  className="flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-hover transition-all duration-300 shadow-md shadow-primary/25 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span>Post an Ad</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={toggleDrawer}
                  className="relative w-10 h-10 flex flex-col justify-center items-center gap-[4.5px] rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-200 focus:outline-none cursor-pointer"
                  title="Open Navigation Menu"
                >
                  <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${isDrawerOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
                  <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${isDrawerOpen ? "opacity-0" : ""}`} />
                  <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${isDrawerOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
                </button>
              </div>
            )}
          </div>
 
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={toggleRole}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
            >
              <span>Test: {userRole === "advertiser" ? "Host" : "Cust"}</span>
            </button>
            <button
              onClick={toggleDrawer}
              className="w-10 h-10 flex flex-col justify-center items-center gap-[4.5px] rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-all duration-200 focus:outline-none cursor-pointer"
              title="Open Menu"
            >
              <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${isDrawerOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${isDrawerOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${isDrawerOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

    </nav>
  );
}
