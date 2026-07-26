"use client";

import React from "react";
import { useApp } from "../lib/AppContext";
import { Home, Grid, ShoppingCart } from "lucide-react";

export default function BottomNav() {
  const { activeTab, setTab, cart } = useApp();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const tabs = [
    { id: "home", label: "HOME", icon: Home },
    { id: "categories", label: "CATEGORIES", icon: Grid },
    { id: "cart", label: "CART", icon: ShoppingCart, badge: totalItems }
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6 flex justify-center pointer-events-none select-none md:hidden">
      <div className="w-full max-w-md md:max-w-lg bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-2xl rounded-2xl md:rounded-full py-3 px-6 md:px-8 flex justify-around items-center border border-white/20 pointer-events-auto backdrop-blur-md animate-slide-up">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 ${
                isActive 
                  ? "text-white scale-110 font-bold" 
                  : "text-red-100 hover:text-white opacity-70 hover:opacity-100"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5.5 h-5.5 transition-transform duration-300 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-white text-red-600 font-extrabold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-wider uppercase font-semibold">
                {tab.label}
              </span>
              
              {/* Underline Indicator */}
              {isActive && (
                <span className="absolute -bottom-1.5 w-5 h-0.75 bg-white rounded-full animate-scale-up" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
