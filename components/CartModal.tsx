"use client";

import React, { useState } from "react";
import { useApp } from "../lib/AppContext";
import { Trash2, Plus, Minus, ArrowLeft, PlusCircle, ShoppingBag, ShieldCheck, CreditCard, Smartphone, Building2 } from "lucide-react";
import { validateVoucherCode, calculateConvenienceFee, VoucherValidationResult } from "../lib/db";

export default function CartModal() {
  const { 
    cart, 
    setTab, 
    updateCartQuantity, 
    removeFromCart, 
    processPayment 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherResult, setVoucherResult] = useState<VoucherValidationResult | null>(null);

  // Calculations
  const originalPriceSum = cart.reduce((sum, item) => {
    const price = item.offer.originalPrice || Math.round((item.offer.ouiyaPrice || 100) * 1.3);
    return sum + (price * item.quantity);
  }, 0);

  const ouiyaPriceSum = cart.reduce((sum, item) => {
    const price = item.offer.ouiyaPrice || 0;
    return sum + (price * item.quantity);
  }, 0);

  const discountSum = originalPriceSum - ouiyaPriceSum;
  const storeName = cart.length > 0 ? cart[0].offer.businessName : "";
  const storeCategory = cart.length > 0 ? cart[0].offer.category : undefined;

  const convenienceFee = calculateConvenienceFee(ouiyaPriceSum, storeCategory);
  const voucherDiscount = voucherResult?.isValid ? (voucherResult.discountAmount || 0) : 0;
  const finalTotal = Math.max(0, ouiyaPriceSum - voucherDiscount + convenienceFee);

  const handleApplyVoucher = () => {
    const res = validateVoucherCode(voucherInput, ouiyaPriceSum);
    setVoucherResult(res);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in select-none">
        <div className="bg-red-50 dark:bg-red-950/20 text-red-600 p-5 rounded-full mb-6 border border-red-200 dark:border-red-900">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-black text-zinc-900 dark:text-white">Your Cart is Empty</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center max-w-xs leading-relaxed font-medium">
          Looks like you haven&apos;t added any offers yet. Discover deals in Pondicherry and start saving!
        </p>
        <button
          onClick={() => setTab("home")}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-red-600/20 cursor-pointer transition-transform active:scale-95"
        >
          Explore Offers
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in select-none flex flex-col h-full">
      {/* 1. Header (Red) */}
      <div className="bg-red-600 px-6 py-4.5 flex justify-between items-center text-white shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTab("home")} 
            className="hover:bg-white/10 p-1.5 rounded-full transition-colors focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-black tracking-wider uppercase">My Cart</h2>
            <span className="text-[10px] text-red-100 font-bold block">{cart.length} Item{cart.length > 1 ? "s" : ""} from {storeName}</span>
          </div>
        </div>
        
        <button 
          onClick={() => setTab("home")}
          className="hover:bg-white/10 p-1.5 rounded-full transition-colors focus:outline-none cursor-pointer"
          title="Add more offers"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Savings Notice Banner (Wireframe Image 5) */}
      {discountSum > 0 && (
        <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-100 dark:border-red-900/40 px-6 py-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-bold">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>You are saving ₹{discountSum.toLocaleString()} on this order!</span>
        </div>
      )}

      {/* 3. Cart Items List */}
      <div className="p-6 flex-grow space-y-4 max-h-[40vh] overflow-y-auto pr-1 no-scrollbar bg-zinc-50 dark:bg-zinc-950">
        {cart.map((item) => (
          <div 
            key={item.offer.id} 
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex gap-4 items-center justify-between"
          >
            <img
              src={item.offer.businessLogo || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=60"}
              alt={item.offer.businessName}
              className="w-16 h-16 rounded-xl object-cover border border-zinc-100 dark:border-zinc-850 shrink-0"
            />

            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-red-600 uppercase block mb-0.5">{item.offer.discount || "DEAL"}</span>
              <h3 className="text-xs font-black text-zinc-900 dark:text-white truncate">
                {item.offer.businessName}
              </h3>
              <p className="text-xs text-zinc-500 truncate mt-0.5 font-medium">
                {item.offer.title}
              </p>
              <div className="flex items-baseline gap-1.5 mt-1.5 font-black text-xs">
                <span className="text-zinc-900 dark:text-white">₹{item.offer.ouiyaPrice}</span>
                {item.offer.originalPrice && (
                  <span className="text-[10px] text-zinc-400 line-through font-normal">₹{item.offer.originalPrice}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end justify-between gap-3 shrink-0">
              <button
                onClick={() => removeFromCart(item.offer.id)}
                className="text-zinc-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl px-1 py-0.5 border border-zinc-200 dark:border-zinc-700/50">
                <button
                  onClick={() => updateCartQuantity(item.offer.id, -1)}
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 focus:outline-none cursor-pointer"
                >
                  <Minus className="w-3 h-3 stroke-[3]" />
                </button>
                
                <span className="w-6 text-center text-xs font-black text-zinc-800 dark:text-zinc-200">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateCartQuantity(item.offer.id, 1)}
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 focus:outline-none cursor-pointer"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Payment Method & Price Details (Wireframe Image 5) */}
      <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 space-y-6">
        
        {/* Price Details Card */}
        <div className="space-y-2 text-xs">
          <h4 className="font-black uppercase tracking-wider text-muted text-[10px]">VOUCHER CODE</h4>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Enter Voucher Code (e.g. WELCOME50)"
              value={voucherInput}
              onChange={(e) => {
                setVoucherInput(e.target.value);
                setVoucherResult(null);
              }}
              className="flex-1 px-3.5 py-2 rounded-xl bg-surface-hover border border-border-main text-foreground text-xs uppercase font-bold focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleApplyVoucher}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>

          {voucherResult && (
            <div className={`p-2.5 rounded-xl text-xs font-bold ${
              voucherResult.isValid
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
            }`}>
              {voucherResult.message}
            </div>
          )}

          <h4 className="font-black uppercase tracking-wider text-muted text-[10px] pt-2">PRICE BREAKDOWN</h4>
          <div className="flex justify-between items-center text-muted font-semibold">
            <span>Subtotal ({cart.length} Item{cart.length > 1 ? "s" : ""})</span>
            <span className="font-bold text-foreground">₹{originalPriceSum.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-emerald-500 font-bold">
            <span>Offer Savings</span>
            <span>- ₹{discountSum.toLocaleString()}</span>
          </div>

          {voucherDiscount > 0 && (
            <div className="flex justify-between items-center text-emerald-500 font-bold">
              <span>Voucher Discount</span>
              <span>- ₹{voucherDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-muted font-semibold">
            <span>Convenience Fee (Platform & Service)</span>
            <span className="font-bold text-foreground">
              {convenienceFee > 0 ? `₹${convenienceFee}` : "FREE"}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-border-subtle pt-2.5 text-sm text-foreground">
            <span className="font-black">Final Amount</span>
            <span className="text-base font-black text-primary">₹{finalTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Methods Options */}
        <div className="space-y-2">
          <h4 className="font-black uppercase tracking-wider text-muted text-[10px]">PAYMENT METHOD</h4>
          
          <div className="space-y-2 text-xs">
            <label 
              onClick={() => setPaymentMethod("upi")}
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === "upi"
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-border-main text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>UPI / Net Banking / Wallets</span>
              </div>
              <input type="radio" checked={paymentMethod === "upi"} readOnly className="accent-primary" />
            </label>

            <label 
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === "card"
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-border-main text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Credit / Debit Card</span>
              </div>
              <input type="radio" checked={paymentMethod === "card"} readOnly className="accent-primary" />
            </label>

            <label 
              onClick={() => setPaymentMethod("netbanking")}
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === "netbanking"
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-border-main text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-primary" />
                <span>Net Banking (All Major Banks)</span>
              </div>
              <input type="radio" checked={paymentMethod === "netbanking"} readOnly className="accent-primary" />
            </label>
          </div>
        </div>

        {/* Proceed to Payment Button */}
        <button
          onClick={processPayment}
          className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl text-xs font-black shadow-xl shadow-primary/20 cursor-pointer transition-transform active:scale-95 text-center uppercase tracking-wider"
        >
          Proceed to Pay ₹{finalTotal.toLocaleString()}
        </button>
      </div>
    </div>
  );
}
