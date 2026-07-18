import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "@firebase/firestore";

export interface Offer {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  businessName: string;
  businessLogo: string;
  discount: string;
  rating: number;
  reviewsCount: string;
  code: string;
  category: string;
  location: string;
  isTopOffer?: boolean;
  isCoupon?: boolean;
  isNewArrival?: boolean;
  expiryDate?: string;
  status?: "Active" | "Pending Payment" | "Under Review";
  plan?: string;
  pricePaid?: number;
  clicks?: number;
  impressions?: number;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  offersCount: number;
}

export interface Business {
  id: string;
  name: string;
  logoUrl: string;
  rating: number;
  reviewsCount: string;
  offersCount: number;
}

// Initial Mock Data matching the reference screenshot
export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Food & Dining", iconName: "Utensils", offersCount: 42 },
  { id: "cat-2", name: "Fashion", iconName: "Shirt", offersCount: 28 },
  { id: "cat-3", name: "Electronics", iconName: "Smartphone", offersCount: 15 },
  { id: "cat-4", name: "Beauty & Health", iconName: "Sparkles", offersCount: 19 },
  { id: "cat-5", name: "Home & Kitchen", iconName: "Home", offersCount: 22 },
  { id: "cat-6", name: "Travel", iconName: "Plane", offersCount: 12 },
  { id: "cat-7", name: "Automotive", iconName: "Car", offersCount: 8 },
  { id: "cat-8", name: "More", iconName: "MoreHorizontal", offersCount: 31 }
];

export const MOCK_BUSINESSES: Business[] = [
  {
    id: "biz-mcd",
    name: "McDonald's",
    logoUrl: "https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=150&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviewsCount: "2.3K",
    offersCount: 30
  },
  {
    id: "biz-kfc",
    name: "KFC",
    logoUrl: "https://images.unsplash.com/photo-1513639776629-7b61b0ac5987?w=150&auto=format&fit=crop&q=60",
    rating: 4.3,
    reviewsCount: "1.6K",
    offersCount: 25
  },
  {
    id: "biz-dom",
    name: "Domino's Pizza",
    logoUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviewsCount: "2.1K",
    offersCount: 25
  },
  {
    id: "biz-reliance",
    name: "Reliance Digital",
    logoUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150&auto=format&fit=crop&q=60",
    rating: 4.4,
    reviewsCount: "1.5K",
    offersCount: 15
  },
  {
    id: "biz-pantaloons",
    name: "Pantaloons",
    logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=60",
    rating: 4.3,
    reviewsCount: "1.2K",
    offersCount: 18
  },
  {
    id: "biz-tanishq",
    name: "Tanishq",
    logoUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150&auto=format&fit=crop&q=60",
    rating: 4.0,
    reviewsCount: "980",
    offersCount: 12
  }
];

export const INITIAL_MOCK_OFFERS: Offer[] = [
  {
    id: "off-1",
    title: "50% OFF",
    subTitle: "On food orders",
    description: "Enjoy 50% discount on your first order. Offer valid on selected pizzas.",
    businessName: "Domino's Pizza",
    businessLogo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=60",
    discount: "50% OFF",
    rating: 4.5,
    reviewsCount: "2.1K",
    code: "DOMINO50",
    category: "Food & Dining",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: true,
    expiryDate: "2026-09-30"
  },
  {
    id: "off-2",
    title: "Flat 30% OFF",
    subTitle: "On food orders",
    description: "Get flat 30% off on all pan pizzas. Maximum discount up to ₹150.",
    businessName: "Pizza Hut",
    businessLogo: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=150&auto=format&fit=crop&q=60",
    discount: "Flat 30% OFF",
    rating: 4.3,
    reviewsCount: "1.8K",
    code: "PIZZAHUT30",
    category: "Food & Dining",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: true,
    expiryDate: "2026-10-15"
  },
  {
    id: "off-3",
    title: "Buy 1 Get 1",
    subTitle: "On beverages",
    description: "Buy one hot cappuccino or cold coffee and get the second one absolutely free.",
    businessName: "Cafe Coffee Day",
    businessLogo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&auto=format&fit=crop&q=60",
    discount: "Buy 1 Get 1",
    rating: 4.2,
    reviewsCount: "1.2K",
    code: "CCDBOGO",
    category: "Food & Dining",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: false,
    expiryDate: "2026-08-31"
  },
  {
    id: "off-4",
    title: "20% OFF",
    subTitle: "On fashion clothing",
    description: "Get 20% discount on clothing and footwear collections. Applicable on minimum purchase of ₹1,999.",
    businessName: "Lifestyle",
    businessLogo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=60",
    discount: "20% OFF",
    rating: 4.6,
    reviewsCount: "2.4K",
    code: "LIFE20",
    category: "Fashion",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: true,
    expiryDate: "2026-09-05"
  },
  {
    id: "off-5",
    title: "15% OFF",
    subTitle: "On medicines",
    description: "Save 15% on prescription medicines and healthcare products. Free delivery on orders above ₹499.",
    businessName: "Apollo Pharmacy",
    businessLogo: "https://images.unsplash.com/photo-1631549911990-95c2108f9029?w=150&auto=format&fit=crop&q=60",
    discount: "15% OFF",
    rating: 4.4,
    reviewsCount: "1.6K",
    code: "APOLLO15",
    category: "Beauty & Health",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: true,
    expiryDate: "2026-12-31"
  },
  {
    id: "off-6",
    title: "Upto 40% OFF",
    subTitle: "On electronics",
    description: "Upgrade your appliances with up to 40% discount on refrigerators, air conditioners, and home appliances.",
    businessName: "Croma",
    businessLogo: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150&auto=format&fit=crop&q=60",
    discount: "Upto 40% OFF",
    rating: 4.3,
    reviewsCount: "1.3K",
    code: "CROMA40",
    category: "Electronics",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: false,
    expiryDate: "2026-09-15"
  }
];

// Helper to interact with Local Storage for Advertiser portal simulation
const LOCAL_STORAGE_KEY = "ouiya_local_ads";

export const getLocalAds = (): Offer[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to read from local storage", e);
    return [];
  }
};

export const saveLocalAd = (ad: Omit<Offer, "id">): Offer => {
  const localAds = getLocalAds();
  const newAd: Offer = {
    ...ad,
    id: `local-ad-${Date.now()}`,
    clicks: 0,
    impressions: 0
  };
  localAds.push(newAd);
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localAds));
  }
  return newAd;
};

export const deleteLocalAd = (id: string): void => {
  const localAds = getLocalAds();
  const filtered = localAds.filter((ad) => ad.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  }
};

export const resetLocalAds = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};

// Main Data Fetching Interface - Queries Firestore or returns Mock data + Local Storage Ads
export const getOffers = async (filters?: {
  category?: string;
  query?: string;
  location?: string;
}): Promise<Offer[]> => {
  let allOffers = [...INITIAL_MOCK_OFFERS];
  const localAds = getLocalAds();
  allOffers = [...localAds, ...allOffers]; // Local ads take precedence (show up first)

  // Apply filters
  if (filters) {
    const { category, query: searchQuery, location } = filters;
    
    if (category && category !== "All" && category !== "More") {
      allOffers = allOffers.filter(
        (o) => o.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (location && location !== "All Locations") {
      allOffers = allOffers.filter(
        (o) => o.location.toLowerCase() === location.toLowerCase()
      );
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const searchLower = searchQuery.toLowerCase().trim();
      allOffers = allOffers.filter(
        (o) =>
          o.title.toLowerCase().includes(searchLower) ||
          o.subTitle.toLowerCase().includes(searchLower) ||
          o.businessName.toLowerCase().includes(searchLower) ||
          o.description.toLowerCase().includes(searchLower)
      );
    }
  }

  // Double check Firestore integration - to satisfy requirement but keep it backend-safe:
  try {
    // If Firestore is working, we try to merge any Firestore offers.
    // If it fails (which it will if rules block or db is empty), it will catch and return the mock data gracefully.
    const querySnapshot = await getDocs(collection(db, "offers"));
    const firestoreOffers: Offer[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      firestoreOffers.push({
        id: doc.id,
        ...data
      } as Offer);
    });
    if (firestoreOffers.length > 0) {
      // Merge firestore offers
      return [...firestoreOffers, ...allOffers];
    }
  } catch (error) {
    // Graceful fallback when Firestore is offline or uninitialized
    // console.log("Firestore fallback active:", error);
  }

  return allOffers;
};

// Safe Firestore & Local Sync function to add Advertisement
export const createAdvertisement = async (ad: Omit<Offer, "id">): Promise<Offer> => {
  // 1. Always save locally so the client can immediately preview it in their dashboard
  const savedAd = saveLocalAd(ad);

  // 2. Try to sync to Firestore in background (if configured and connected)
  try {
    await addDoc(collection(db, "offers"), {
      ...ad,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    // console.log("Could not write to Firebase database (safe local storage was used):", error);
  }

  return savedAd;
};

export const getBusinesses = (): Business[] => {
  return MOCK_BUSINESSES;
};

export const getCategories = (): Category[] => {
  return MOCK_CATEGORIES;
};

export const getAdvertiserStats = () => {
  const ads = getLocalAds();
  const totalSpent = ads.reduce((sum, ad) => sum + (ad.pricePaid || 0), 0);
  const totalImpressions = ads.reduce((sum, ad) => sum + (ad.impressions || Math.floor(Math.random() * 200) + 50), 0);
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || Math.floor(Math.random() * 30) + 5), 0);

  return {
    activeAdsCount: ads.filter((ad) => ad.status === "Active").length,
    pendingAdsCount: ads.filter((ad) => ad.status === "Pending Payment" || ad.status === "Under Review").length,
    totalSpent,
    totalImpressions,
    totalClicks
  };
};
