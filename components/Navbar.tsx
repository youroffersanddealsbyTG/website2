"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Tag, Menu, X, User, Building2, LogOut, ArrowRight, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<"customer" | "advertiser">("customer");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Load and sync user role from local storage for easy demo testing
  useEffect(() => {
    const savedRole = localStorage.getItem("ouiya_demo_role") as "customer" | "advertiser";
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Offers", href: "/offers" },
    { name: "Ad Portal", href: "/portal" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-md backdrop-blur-md dark:bg-zinc-950/95"
          : "bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                <Tag className="w-6 h-6 rotate-90" />
              </div>
              <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                ouiya<span className="text-primary">.</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side Options (Role Switcher and Auth buttons) */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Quick Demo Switcher */}
            <button
              onClick={toggleRole}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer transition-all duration-200"
              title="Click to toggle user role for testing"
            >
              <div className={`w-2 h-2 rounded-full ${userRole === "advertiser" ? "bg-emerald-500 animate-pulse" : "bg-primary animate-pulse"}`} />
              <span>Testing: {userRole === "advertiser" ? "Host Portal" : "Customer View"}</span>
            </button>

            {userRole === "advertiser" ? (
              <Link
                href="/portal"
                className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 shadow-md shadow-zinc-900/10 dark:shadow-none"
              >
                <Building2 className="w-4 h-4" />
                <span>Host Dashboard</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/portal"
                  className="text-zinc-700 dark:text-zinc-200 hover:text-primary transition-colors text-sm font-semibold px-4 py-2"
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
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 py-3 px-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
            {userRole === "advertiser" ? (
              <Link
                href="/portal"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 py-3 rounded-xl text-base font-semibold"
              >
                <Building2 className="w-4 h-4" />
                <span>Host Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/portal"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full text-zinc-700 dark:text-zinc-300 py-2.5 font-semibold"
                >
                  Host Login
                </Link>
                <Link
                  href="/portal"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-xl text-base font-semibold shadow-md shadow-primary/20"
                >
                  <span>Post an Ad</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
