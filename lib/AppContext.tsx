"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Offer, Business, getBusinesses } from "./db";
import { TouristDestination, DestinationActivity } from "./discoverData";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User 
} from "@firebase/auth";
import { auth, googleProvider } from "./firebase";

export interface CartItem {
  offer: Offer;
  quantity: number;
}

interface AppContextProps {
  cart: CartItem[];
  activeTab: "home" | "categories" | "cart" | "discover";
  selectedCategory: string;
  selectedShop: Business | null;
  selectedOffer: Offer | null;
  selectedDestination: TouristDestination | null;
  couponCode: string | null;
  couponExpiry: string | null;
  searchQuery: string;
  themeMode: "light" | "dark" | "system";
  theme: "light" | "dark";
  location: string;
  isLocationModalOpen: boolean;
  cartConflictOffer: Offer | null;
  
  // Auth state & actions
  user: User | null;
  authLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;

  // Discover Pondicherry actions
  openDestinationDetails: (dest: TouristDestination) => void;
  closeDestinationDetails: () => void;
  bookActivityRedirect: (activity: DestinationActivity) => void;

  // Setters & Actions
  setTab: (tab: "home" | "categories" | "cart" | "discover") => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setLocation: (loc: string) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  openShopDetails: (shopId: string, clickedOffer?: Offer) => void;
  closeShopDetails: () => void;
  openOfferDetails: (offer: Offer) => void;
  closeOfferDetails: () => void;
  addToCart: (offer: Offer) => void;
  removeFromCart: (offerId: string) => void;
  updateCartQuantity: (offerId: string, delta: number) => void;
  clearCart: () => void;
  resolveCartConflict: (clearAndAdd: boolean) => void;
  processPayment: () => void;
  closeCouponSuccess: () => void;
  setThemeMode: (mode: "light" | "dark" | "system") => void;
  toggleTheme: () => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  likedShops: Record<string, boolean>;
  toggleShopLike: (shopId: string) => void;
  likedOffers: Record<string, boolean>;
  toggleOfferLike: (offerId: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<"home" | "categories" | "cart" | "discover">("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedShop, setSelectedShop] = useState<Business | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<TouristDestination | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponExpiry, setCouponExpiry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [location, setLocation] = useState<string>("White Town, Pondicherry");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [cartConflictOffer, setCartConflictOffer] = useState<Offer | null>(null);

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  // Discover Pondicherry actions
  const openDestinationDetails = (dest: TouristDestination) => {
    setSelectedDestination(dest);
  };

  const closeDestinationDetails = () => {
    setSelectedDestination(null);
  };

  const bookActivityRedirect = (activity: DestinationActivity) => {
    setSelectedDestination(null);
    setSelectedCategory(activity.categoryFilter);
    setActiveTab("categories");
  };
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [pendingActionOffer, setPendingActionOffer] = useState<Offer | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingActionOffer(null);
  };

  const addToCartDirect = (offer: Offer) => {
    // Single-store restriction: all cart items must belong to the same business/shop
    if (cart.length > 0) {
      const firstShopName = cart[0].offer.businessName.trim().toLowerCase();
      const newShopName = offer.businessName.trim().toLowerCase();
      if (firstShopName !== newShopName) {
        setCartConflictOffer(offer);
        return;
      }
    }

    const existingIndex = cart.findIndex((item) => item.offer.id === offer.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCartToStorage(updated);
    } else {
      saveCartToStorage([...cart, { offer, quantity: 1 }]);
    }
    setTab("cart");
  };

  const resolveCartConflict = (clearAndAdd: boolean) => {
    if (clearAndAdd && cartConflictOffer) {
      const offerToAdd = cartConflictOffer;
      setCartConflictOffer(null);
      saveCartToStorage([{ offer: offerToAdd, quantity: 1 }]);
      setTab("cart");
    } else {
      setCartConflictOffer(null);
    }
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    setIsAuthModalOpen(false);
    if (pendingActionOffer) {
      const offerToCart = pendingActionOffer;
      setPendingActionOffer(null);
      addToCartDirect(offerToCart);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    setIsAuthModalOpen(false);
    if (pendingActionOffer) {
      const offerToCart = pendingActionOffer;
      setPendingActionOffer(null);
      addToCartDirect(offerToCart);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
    setIsAuthModalOpen(false);
    if (pendingActionOffer) {
      const offerToCart = pendingActionOffer;
      setPendingActionOffer(null);
      addToCartDirect(offerToCart);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Theme management: support light, dark, and system preference
  const [themeMode, setThemeModeState] = useState<"light" | "dark" | "system">("dark");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Global Favourites state
  const [likedShops, setLikedShops] = useState<Record<string, boolean>>({});
  const [likedOffers, setLikedOffers] = useState<Record<string, boolean>>({});

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  // Helper function to apply theme to HTML document root and set theme state
  const applyTheme = (mode: "light" | "dark" | "system") => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let active: "light" | "dark" = "dark";
    if (mode === "system") {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      active = isSystemDark ? "dark" : "light";
    } else {
      active = mode;
    }

    setTheme(active);
    root.classList.add(active);
  };

  const setThemeMode = (mode: "light" | "dark" | "system") => {
    setThemeModeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("ouiya_theme_mode", mode);
      applyTheme(mode);
    }
  };

  const toggleTheme = () => {
    let nextMode: "light" | "dark" | "system" = "light";
    if (themeMode === "dark") nextMode = "light";
    else if (themeMode === "light") nextMode = "system";
    else nextMode = "dark";

    setThemeMode(nextMode);
  };

  // Sync Theme choice on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("ouiya_theme_mode") as "light" | "dark" | "system" | null;
      const initialMode = savedMode || "dark";
      setThemeModeState(initialMode);
      applyTheme(initialMode);
    }
  }, []);

  // Sync System theme changes in real-time when system theme is active
  useEffect(() => {
    if (themeMode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system");
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [themeMode]);

  // Sync global likes from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedShops = localStorage.getItem("ouiya_liked_shops");
      if (savedShops) {
        try { setLikedShops(JSON.parse(savedShops)); } catch {}
      }
      const savedOffers = localStorage.getItem("ouiya_liked_offers");
      if (savedOffers) {
        try { setLikedOffers(JSON.parse(savedOffers)); } catch {}
      }
    }
  }, []);

  const toggleShopLike = (shopId: string) => {
    setLikedShops(prev => {
      const next = { ...prev, [shopId]: !prev[shopId] };
      if (typeof window !== "undefined") {
        localStorage.setItem("ouiya_liked_shops", JSON.stringify(next));
      }
      return next;
    });
  };

  const toggleOfferLike = (offerId: string) => {
    setLikedOffers(prev => {
      const next = { ...prev, [offerId]: !prev[offerId] };
      if (typeof window !== "undefined") {
        localStorage.setItem("ouiya_liked_offers", JSON.stringify(next));
      }
      return next;
    });
  };

  // Sync Cart with LocalStorage on Client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("ouiya_cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart local storage", e);
        }
      }
    }
  }, []);

  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("ouiya_cart", JSON.stringify(newCart));
    }
  };

  const setTab = (tab: "home" | "categories" | "cart" | "discover") => {
    setActiveTab(tab);
    if (tab === "home" || tab === "discover") {
      setSelectedShop(null);
      setSelectedOffer(null);
    }
  };

  const openShopDetails = async (shopId: string, clickedOffer?: Offer) => {
    const { getBusinessesFromFirebase } = await import("./db");
    const businesses = await getBusinessesFromFirebase();
    let foundShop = businesses.find(b => b.id === shopId || (clickedOffer && b.name.toLowerCase() === clickedOffer.businessName.toLowerCase()));
    
    if (!foundShop && clickedOffer) {
      foundShop = {
        id: shopId,
        name: clickedOffer.businessName,
        logoUrl: clickedOffer.businessLogo,
        rating: clickedOffer.rating,
        reviewsCount: clickedOffer.reviewsCount,
        offersCount: 1,
        address: clickedOffer.location,
        phone: "+91 98765 43210",
        gallery: [clickedOffer.businessLogo],
        about: clickedOffer.aboutOffer || clickedOffer.description || "Partner Business on Ouiya",
        comments: []
      };
    }

    if (foundShop) {
      setSelectedShop(foundShop);
      if (clickedOffer) {
        setSelectedOffer(clickedOffer);
      }
    }
  };

  const closeShopDetails = () => {
    setSelectedShop(null);
  };

  const openOfferDetails = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  const closeOfferDetails = () => {
    setSelectedOffer(null);
  };

  const addToCart = (offer: Offer) => {
    if (!user) {
      setPendingActionOffer(offer);
      setIsAuthModalOpen(true);
      return;
    }
    addToCartDirect(offer);
  };

  const removeFromCart = (offerId: string) => {
    const filtered = cart.filter((item) => item.offer.id !== offerId);
    saveCartToStorage(filtered);
  };

  const updateCartQuantity = (offerId: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.offer.id === offerId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const processPayment = () => {
    if (typeof window !== "undefined") {
      const existingPurchasesStr = localStorage.getItem("ouiya_purchased_coupons") || "[]";
      let existingPurchases = [];
      try {
        existingPurchases = JSON.parse(existingPurchasesStr);
      } catch {
        existingPurchases = [];
      }
      
      const timestampStr = Date.now().toString(36).toUpperCase();
      const newPurchases = cart.map((item, idx) => ({
        id: `purch-${Date.now()}-${idx}`,
        businessName: item.offer.businessName,
        title: item.offer.title,
        discount: item.offer.discount,
        code: item.offer.code || `OUIYA-${item.offer.id.substring(0, 6).toUpperCase()}`,
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }),
        qrText: `OUIYA-${item.offer.code || "DEAL"}-${timestampStr}`
      }));

      localStorage.setItem("ouiya_purchased_coupons", JSON.stringify([...newPurchases, ...existingPurchases]));
    }

    const orderCouponCode = "OUIYA-" + Date.now().toString(36).toUpperCase();
    setCouponCode(orderCouponCode);
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    
    const formattedDate = targetDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    
    setCouponExpiry(formattedDate);
    clearCart();
  };

  const closeCouponSuccess = () => {
    setCouponCode(null);
    setCouponExpiry(null);
    setTab("home");
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        activeTab,
        selectedCategory,
        selectedShop,
        selectedOffer,
        selectedDestination,
        couponCode,
        couponExpiry,
        searchQuery,
        themeMode,
        theme,
        location,
        isLocationModalOpen,
        cartConflictOffer,
        user,
        authLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        logout,
        openDestinationDetails,
        closeDestinationDetails,
        bookActivityRedirect,
        setTab,
        setSelectedCategory,
        setSearchQuery,
        setLocation,
        openLocationModal,
        closeLocationModal,
        openShopDetails,
        closeShopDetails,
        openOfferDetails,
        closeOfferDetails,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        resolveCartConflict,
        processPayment,
        closeCouponSuccess,
        setThemeMode,
        toggleTheme,
        isDrawerOpen,
        toggleDrawer,
        likedShops,
        toggleShopLike,
        likedOffers,
        toggleOfferLike
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
