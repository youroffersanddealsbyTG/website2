import React from "react";
import Link from "next/link";
import { Tag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800">
      <div className="max-w-[1600px] mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Logo & Intro Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <div className="bg-primary text-white p-2 rounded-xl shadow-md">
                <Tag className="w-5 h-5 rotate-90" />
              </div>
              <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                ouiya<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed mb-6">
              Your one-stop destination for the best offers, coupons & exciting deals from top businesses in your city. Save on dining, fashion, electronics, and more!
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary hover:scale-105 transition-all duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary hover:scale-105 transition-all duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary hover:scale-105 transition-all duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary hover:scale-105 transition-all duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          {/* Links Column 1: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wider uppercase mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors duration-150">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-sm text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors duration-150">
                  Offers
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="text-sm text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors duration-150">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#businesses" className="text-sm text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors duration-150">
                  Top Businesses
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: For Users */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wider uppercase mb-5">
              For Users
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors duration-150">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors duration-150">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors duration-150">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors duration-150">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: For Businesses (Idea Scrapped) */}
          {/* <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-wider uppercase mb-5">
              For Businesses
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#partner" className="text-sm text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors duration-150">
                  List Your Business
                </Link>
              </li>
              <li>
                <Link href="/#partner" className="text-sm text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors duration-150">
                  Partner with Us
                </Link>
              </li>
            </ul>
          </div> */}

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} ouiya. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* App Store Badge */}
            <a href="#" className="block hover:scale-[1.02] transition-transform">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
                className="h-10 dark:invert dark:brightness-200"
              />
            </a>
            {/* Play Store Badge */}
            <a href="#" className="block hover:scale-[1.02] transition-transform">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-10"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
