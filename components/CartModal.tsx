"use client";

import React from "react";
import { useApp } from "../lib/AppContext";
import { Trash2, Plus, Minus, ArrowLeft, PlusCircle, ShoppingBag } from "lucide-react";

export default function CartModal() {
  const { 
    cart, 
    setTab, 
    updateCartQuantity, 
    removeFromCart, 
    processPayment 
  } = useApp();

  // Calculations
  const originalPriceSum = cart.reduce((sum, item) => {
    const price = item.offer.originalPrice || item.offer.ouiyaPrice || 0;
    return sum + (price * item.quantity);
  }, 0);

  const ouiyaPriceSum = cart.reduce((sum, item) => {
    const price = item.offer.ouiyaPrice || 0;
    return sum + (price * item.quantity);
  }, 0);

  const discountSum = originalPriceSum - ouiyaPriceSum;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in select-none">
        <div className="bg-red-50 dark:bg-red-950/20 text-red-500 p-5 rounded-full mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Your Cart is Empty</h3>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 text-center max-w-xs leading-relaxed">
          Looks like you haven&apos;t added any deals or vouchers to your cart yet. Explore popular offers and start saving!
        </p>
        <button
          onClick={() => setTab("home")}
          className="mt-6 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-full text-xs font-bold shadow-lg shadow-red-500/20 cursor-pointer transition-transform active:scale-95"
        >
          Explore Offers
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-3xl shadow-xl overflow-hidden animate-fade-in select-none flex flex-col h-full">
      {/* 1. Header (Red) */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 px-6 py-4.5 flex justify-between items-center text-white shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTab("home")} 
            className="hover:bg-white/10 p-1.5 rounded-full transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-5.5 h-5.5" />
          </button>
          <h2 className="text-lg font-black tracking-wider uppercase">My Cart</h2>
        </div>
        
        {/* Plus icon in right corner */}
        <button 
          onClick={() => setTab("home")}
          className="hover:bg-white/10 p-1.5 rounded-full transition-colors focus:outline-none"
          title="Add more offers"
        >
          <PlusCircle className="w-5.5 h-5.5" />
        </button>
      </div>

      {/* 2. Items List */}
      <div className="p-6 flex-grow space-y-4 max-h-[45vh] overflow-y-auto pr-1 no-scrollbar bg-zinc-50 dark:bg-zinc-950">
        {cart.map((item) => (
          <div 
            key={item.offer.id} 
            className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-4.5 shadow-sm flex gap-4 items-center justify-between"
          >
            {/* Image left */}
            <img
              src={item.offer.businessLogo || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=60"}
              alt={item.offer.businessName}
              className="w-16 h-16 rounded-xl object-cover border border-zinc-100 dark:border-zinc-800 shrink-0"
            />

            {/* Info middle */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white truncate">
                {item.offer.businessName}
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5 font-medium">
                {item.offer.title}
              </p>
              <div className="text-red-500 text-xs font-bold mt-1.5">
                ₹{item.offer.ouiyaPrice}
              </div>
            </div>

            {/* Actions right */}
            <div className="flex flex-col items-end justify-between gap-3 shrink-0">
              {/* Delete Icon */}
              <button
                onClick={() => removeFromCart(item.offer.id)}
                className="text-zinc-300 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Quantity Selector: minus / plus */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl px-1 py-0.5 border border-zinc-200 dark:border-zinc-700/50">
                <button
                  onClick={() => updateCartQuantity(item.offer.id, -1)}
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 focus:outline-none"
                >
                  <Minus className="w-3 h-3 stroke-[3]" />
                </button>
                
                <span className="w-6 text-center text-xs font-extrabold text-zinc-800 dark:text-zinc-200">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateCartQuantity(item.offer.id, 1)}
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 focus:outline-none"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Pricing breakdown & checkout banner */}
      <div className="p-6 border-t border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
        <div className="space-y-3.5 mb-6 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Price</span>
            <span className="font-bold text-zinc-900 dark:text-white">₹{originalPriceSum}</span>
          </div>

          <div className="flex justify-between items-center text-red-500">
            <span className="font-semibold">Offer discount</span>
            <span className="font-bold">- ₹{discountSum}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">Ouiyaa Price</span>
            <span className="font-bold text-zinc-900 dark:text-white">₹{ouiyaPriceSum}</span>
          </div>

          <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-3 text-sm text-zinc-800 dark:text-white">
            <span className="font-black">Total to pay</span>
            <span className="text-lg font-black text-red-600">₹{ouiyaPriceSum}</span>
          </div>
        </div>

        {/* Proceed to Payment Button */}
        <button
          onClick={processPayment}
          className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:to-red-600 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          Proceed To Payment
        </button>
      </div>
    </div>
  );
}
