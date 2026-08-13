"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Tag, ShoppingCart, User as UserIcon, LogOut, LogIn } from "lucide-react";
import { useApp } from "../lib/AppContext";

export default function Navbar() {
  const { 
    cart, 
    activeTab, 
    setTab, 
    toggleDrawer, 
    isDrawerOpen,
    user,
    logout,
    openAuthModal
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              <button
                onClick={() => { setTab("discover"); router.push("/"); }}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "discover"
                    ? "bg-primary/10 text-primary font-black"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                Discover Pondicherry
              </button>
            </div>
          </div>

          {/* Right Side Options (Auth buttons, Cart Icon & Navigation Drawer) */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Cart Icon */}
            <button
              onClick={() => { setTab("cart"); router.push("/"); }}
              className="relative p-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:scale-105 transition-all duration-200 cursor-pointer focus:outline-none bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full"
              title="View Cart"
            >
              <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border-2 border-white dark:border-zinc-950 animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Authentication Controls */}
            {user ? (
              <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-full p-1 pl-3 shadow-sm">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || "User"} 
                    className="w-7 h-7 rounded-full object-cover border border-zinc-300 dark:border-zinc-700" 
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary-dark to-primary flex items-center justify-center text-white text-xs font-black uppercase shadow-sm">
                    {user.email ? user.email.charAt(0) : "U"}
                  </div>
                )}

                <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 max-w-[90px] sm:max-w-[120px] truncate hidden sm:inline">
                  {user.displayName || user.email?.split("@")[0] || "Account"}
                </span>

                <button
                  onClick={logout}
                  className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-black transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login / Sign Up</span>
              </button>
            )}

            {/* Menu Drawer Toggle Button */}
            <button
              onClick={toggleDrawer}
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex flex-col justify-center items-center gap-[4.5px] rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-200 focus:outline-none cursor-pointer shrink-0"
              title="Open Navigation Menu"
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
