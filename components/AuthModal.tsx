"use client";

import React, { useState } from "react";
import { useApp } from "../lib/AppContext";
import { X, Mail, Lock, Sparkles, AlertCircle, Loader2 } from "lucide-react";

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    loginWithGoogle, 
    loginWithEmail, 
    signUpWithEmail 
  } = useApp();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err?.code === "auth/popup-closed-by-user") {
        setErrorMessage("Sign in popup was closed before completing.");
        return;
      }
      console.error("Google Auth error:", err);
      if (err?.code === "auth/unauthorized-domain") {
        setErrorMessage("Domain not authorized in Firebase Auth settings. Please use email sign-in or authorize localhost.");
      } else {
        setErrorMessage(err?.message || "Failed to sign in with Google.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error("Email Auth error:", err);
      if (err?.code === "auth/wrong-password" || err?.code === "auth/user-not-found" || err?.code === "auth/invalid-credential") {
        setErrorMessage("Invalid email or password.");
      } else if (err?.code === "auth/email-already-in-use") {
        setErrorMessage("An account with this email already exists.");
      } else if (err?.code === "auth/weak-password") {
        setErrorMessage("Password should be at least 6 characters.");
      } else {
        setErrorMessage(err?.message || "Authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={closeAuthModal}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-scale-up overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{mode === "signin" ? "Welcome Back" : "Join ouiya Today"}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black text-zinc-900 dark:text-white leading-tight">
          {mode === "signin" ? "Sign In to Your Account" : "Create a Free Account"}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mt-1.5 leading-relaxed">
          Sign in to claim exclusive discount coupons, save deals, and complete purchases.
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full mt-6 flex items-center justify-center gap-3 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-750 font-black text-xs py-3.5 px-4 rounded-2xl transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 border-t border-zinc-200 dark:border-zinc-800" />
          <span className="relative bg-white dark:bg-zinc-900 px-3 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
            OR EMAIL
          </span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-black text-xs py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-6 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          {mode === "signin" ? (
            <span>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => { setMode("signup"); setErrorMessage(null); }}
                className="text-primary font-black hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { setMode("signin"); setErrorMessage(null); }}
                className="text-primary font-black hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
