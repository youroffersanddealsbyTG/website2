import { db } from "./firebase";
import { collection, addDoc, getDocs } from "@firebase/firestore";

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
  
  // Extended fields for Nearbuy & OUIYA detailed views
  originalPrice?: number;
  ouiyaPrice?: number;
  availabilities?: string[];
  aboutOffer?: string;
  offerPeriod?: string;
  applicableOn?: string;
  termsAndConditions?: string[];
  shopId: string; // Links to the Business
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
  address: string;
  phone: string;
  gallery: string[];
  about: string;
  hasVoucher?: boolean;
  vouchers?: {
    id: string;
    title: string;
    discount: string;
    code: string;
    expiry: string;
  }[];
  subscriptions?: {
    id: string;
    name: string;
    price: number;
    features: string[];
  }[];
  comments: {
    username: string;
    rating: number;
    text: string;
    date: string;
  }[];
}

// Categories from Image 1: circular icons, with a Show all/Show less toggle.
export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Electronics", iconName: "Smartphone", offersCount: 15 },
  { id: "cat-2", name: "Food", iconName: "Utensils", offersCount: 42 },
  { id: "cat-3", name: "Transport", iconName: "Car", offersCount: 8 },
  { id: "cat-4", name: "Hotels", iconName: "Plane", offersCount: 12 },
  { id: "cat-5", name: "Entertainment", iconName: "Sparkles", offersCount: 31 },
  // Show Less/More divider
  { id: "cat-6", name: "Saloon", iconName: "MoreHorizontal", offersCount: 19 },
  { id: "cat-7", name: "Games", iconName: "MoreHorizontal", offersCount: 11 },
  { id: "cat-8", name: "Health", iconName: "MoreHorizontal", offersCount: 22 },
  { id: "cat-9", name: "Spa Deals", iconName: "MoreHorizontal", offersCount: 17 },
  { id: "cat-10", name: "Party", iconName: "MoreHorizontal", offersCount: 25 },
];

export const MOCK_BUSINESSES: Business[] = [
  {
    id: "biz-pizzahut",
    name: "Pizza Hut",
    logoUrl: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=150&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviewsCount: "1.2K",
    offersCount: 4,
    address: "MG Road, Pondicherry",
    phone: "+91 98765 43210",
    gallery: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
    ],
    about: "Pizza Hut is an American multinational restaurant chain and international franchise founded in 1958. Known for its Italian-American cuisine menu, including signature pan pizzas.",
    hasVoucher: false,
    comments: [
      { username: "Ramesh K.", rating: 5, text: "Excellent taste and very fast service! Highly recommended.", date: "15 July 2026" },
      { username: "Priya M.", rating: 4, text: "Great discounts on weekday combos.", date: "10 July 2026" }
    ]
  },
  {
    id: "biz-burgerhut",
    name: "Burger Hut",
    logoUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=60",
    rating: 4.2,
    reviewsCount: "820",
    offersCount: 3,
    address: "MG Road, Pondicherry",
    phone: "+91 94432 10987",
    gallery: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80"
    ],
    about: "Gourmet burgers made with fresh, hand-pressed patties, fresh farm lettuce, and our house-secret spicy burger sauces.",
    hasVoucher: true,
    vouchers: [
      {
        id: "vouch-bh-1",
        title: "Burger Hut Gift Voucher",
        discount: "50% OFF",
        code: "BHVOUCH50",
        expiry: "10 July 2026"
      }
    ],
    subscriptions: [
      {
        id: "sub-bh-1",
        name: "Weekly Burger Pass",
        price: 299,
        features: ["1 Burger free every week", "Free delivery on all orders", "Extra 10% off on premium meals"]
      },
      {
        id: "sub-bh-2",
        name: "Monthly Feast Pass",
        price: 999,
        features: ["5 Burgers free every month", "Unlimited free delivery", "2 Free beverages per order", "Priority counter pick-up"]
      }
    ],
    comments: [
      { username: "Arun T.", rating: 4, text: "The peri-peri chicken burger is exceptional. Loved the voucher deal!", date: "16 July 2026" }
    ]
  },
  {
    id: "biz-mcd",
    name: "McDonald's",
    logoUrl: "https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=150&auto=format&fit=crop&q=60",
    rating: 4.4,
    reviewsCount: "2.3K",
    offersCount: 2,
    address: "Mission Street, Pondicherry",
    phone: "+91 91234 56789",
    gallery: [
      "https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=800&auto=format&fit=crop&q=80"
    ],
    about: "The world's leading global foodservice retailer with over 38,000 locations serving local-adapted burgers, fries, and shakes.",
    hasVoucher: true,
    vouchers: [
      {
        id: "vouch-mcd-1",
        title: "McDonald's Value Voucher",
        discount: "30% OFF",
        code: "MCDVALUE30",
        expiry: "20 July 2026"
      }
    ],
    comments: [
      { username: "Sunil G.", rating: 5, text: "Always hot and crispy fries. Happy with the vouchers.", date: "12 July 2026" }
    ]
  },
  {
    id: "biz-kfc",
    name: "KFC",
    logoUrl: "https://images.unsplash.com/photo-1513639776629-7b61b0ac5987?w=150&auto=format&fit=crop&q=60",
    rating: 4.3,
    reviewsCount: "1.6K",
    offersCount: 2,
    address: "Ecr Road, Pondicherry",
    phone: "+91 92345 67890",
    gallery: [
      "https://images.unsplash.com/photo-1513639776629-7b61b0ac5987?w=800&auto=format&fit=crop&q=80"
    ],
    about: "Kentucky Fried Chicken, specialized in original recipe pressure-fried chicken pieces seasoned with 11 herbs and spices.",
    hasVoucher: false,
    comments: [
      { username: "Monica R.", rating: 4, text: "Tasty fried chicken, quick service at this store.", date: "05 July 2026" }
    ]
  },
  {
    id: "biz-oceanspray",
    name: "Ocean Spray",
    logoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviewsCount: "940",
    offersCount: 1,
    address: "ECR Highway, Pondicherry",
    phone: "+91 413 2650000",
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
    ],
    about: "A luxury resort in Pondicherry featuring standard fine-dining, pool-side cuisines, spa retreats, and family vacation packages.",
    hasVoucher: true,
    vouchers: [
      {
        id: "vouch-os-1",
        title: "Luxury Dining Voucher",
        discount: "20% OFF",
        code: "OCEAN20",
        expiry: "15 August 2026"
      }
    ],
    comments: [
      { username: "Aditya V.", rating: 5, text: "Incredible couple spa. Highly relaxing ambience.", date: "18 June 2026" }
    ]
  },
  {
    id: "biz-chocroom",
    name: "The Chocolate Room",
    logoUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=60",
    rating: 4.3,
    reviewsCount: "310",
    offersCount: 1,
    address: "White Town, Pondicherry",
    phone: "+91 413 2225432",
    gallery: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80"
    ],
    about: "Indulge in our exquisite collection of hot chocolates, chocolate fondues, waffle cones, and handcrafted custom cakes.",
    hasVoucher: false,
    comments: [
      { username: "Nisha R.", rating: 5, text: "Loved the Belgian sizzling brownie! Amazing atmosphere.", date: "17 July 2026" },
      { username: "Rahul D.", rating: 4, text: "Slightly crowded on weekends but totally worth the wait.", date: "14 July 2026" }
    ]
  },
  {
    id: "biz-lecafe",
    name: "Le Café",
    logoUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviewsCount: "1.8K",
    offersCount: 1,
    address: "Goubert Avenue, Beach Road, Pondicherry",
    phone: "+91 413 2336531",
    gallery: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80"
    ],
    about: "Open 24 hours right next to the sea, serving authentic French pastries, fresh baguettes, and organic filter coffees.",
    hasVoucher: false,
    comments: [
      { username: "Vikram S.", rating: 5, text: "Drinking hot coffee with a view of the sunrise is unmatched.", date: "12 July 2026" }
    ]
  },
  {
    id: "biz-zara",
    name: "ZARA",
    logoUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=150&auto=format&fit=crop&q=60",
    rating: 4.4,
    reviewsCount: "920",
    offersCount: 1,
    address: "Providence Mall, Pondicherry",
    phone: "+91 95000 12345",
    gallery: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80"
    ],
    about: "ZARA offers the latest fashion trends for women, men, and kids, with seasonal clearance sales and fresh weekly collection drops.",
    hasVoucher: true,
    vouchers: [
      {
        id: "vouch-zara-1",
        title: "ZARA Shopping Voucher",
        discount: "15% OFF",
        code: "ZARAOFF15",
        expiry: "30 August 2026"
      }
    ],
    comments: [
      { username: "Shalini P.", rating: 5, text: "Excellent collection of summer wear. Got a great 30% off offer!", date: "18 July 2026" }
    ]
  },
  {
    id: "biz-goldsgym",
    name: "Gold's Gym",
    logoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviewsCount: "540",
    offersCount: 1,
    address: "Kamraj Salai, Pondicherry",
    phone: "+91 96000 67890",
    gallery: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80"
    ],
    about: "The gold standard of fitness. Gold's Gym features state-of-the-art strength training, cardio, zumba, crossfit, and certified personal trainers.",
    hasVoucher: true,
    vouchers: [
      {
        id: "vouch-gym-1",
        title: "Gym Membership Voucher",
        discount: "20% OFF",
        code: "GOLDSGYM20",
        expiry: "31 October 2026"
      }
    ],
    comments: [
      { username: "Harish V.", rating: 4, text: "Spacious gym with premium amenities. The 1-month trial voucher is super.", date: "09 July 2026" }
    ]
  },
  {
    id: "biz-nirvana",
    name: "Nirvana Spa & Salon",
    logoUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviewsCount: "680",
    offersCount: 1,
    address: "Heritage Town, Pondicherry",
    phone: "+91 99887 76655",
    gallery: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80"
    ],
    about: "Nirvana is Pondicherry's premier spa and luxury salon, offering aromatherapies, Ayurvedic massage, styling, haircuts, and bridal makeovers.",
    hasVoucher: true,
    vouchers: [
      {
        id: "vouch-nirv-1",
        title: "Nirvana Bridal Pass",
        discount: "50% OFF",
        code: "NIRVANA50",
        expiry: "05 September 2026"
      }
    ],
    comments: [
      { username: "Sneha G.", rating: 5, text: "Extremely professional staff. The foot reflexology was magical.", date: "15 July 2026" }
    ]
  }
];

export const INITIAL_MOCK_OFFERS: Offer[] = [
  {
    id: "off-1",
    title: "Double Cheese Pizza",
    subTitle: "Pizza Hut Special Offer",
    description: "Indulge in our signature Double Cheese pizza with loaded mozzarella and fresh toppings.",
    businessName: "Pizza Hut",
    businessLogo: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=150&auto=format&fit=crop&q=60",
    discount: "34% OFF",
    rating: 4.5,
    reviewsCount: "1.2K",
    code: "PIZZAHUT34",
    category: "Food",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: true,
    expiryDate: "2026-09-30",
    originalPrice: 1235,
    ouiyaPrice: 1000,
    availabilities: ["Monday - Sunday: 11:00 AM - 11:00 PM"],
    aboutOffer: "Get 34% OFF on Pizza Hut's best-selling Double Cheese Pizzas. Perfect for small gatherings or pizza nights.",
    offerPeriod: "Valid until 30th Sept 2026",
    applicableOn: "Dine-in and Takeaway only. Not valid on delivery.",
    termsAndConditions: [
      "Cannot be combined with any other offer/promotion.",
      "Coupon must be presented to the cashier before placing the order.",
      "Taxes applicable extra as per local rates."
    ],
    shopId: "biz-pizzahut"
  },
  {
    id: "off-2",
    title: "Veggie Supreme Pizza",
    subTitle: "Fresh Garden Veggies Pizza",
    description: "A combination of onion, capsicum, mushroom, tomato, baby corn & black olives.",
    businessName: "Pizza Hut",
    businessLogo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=60",
    discount: "20% OFF",
    rating: 4.4,
    reviewsCount: "430",
    code: "VEGSUP20",
    category: "Food",
    location: "Puducherry",
    isTopOffer: false,
    isCoupon: true,
    expiryDate: "2026-09-30",
    originalPrice: 250,
    ouiyaPrice: 200,
    availabilities: ["Monday - Sunday: 11:00 AM - 11:00 PM"],
    aboutOffer: "Delicious Veggie Supreme Pan Pizza with premium toppings.",
    offerPeriod: "Valid until 30th Sept 2026",
    applicableOn: "Dine-in and Takeaway.",
    termsAndConditions: ["Valid on Medium and Large sizes only."],
    shopId: "biz-pizzahut"
  },
  {
    id: "off-3",
    title: "Crispy Maharaja Burger",
    subTitle: "Double-decker chicken burger",
    description: "Double chicken patty with fresh lettuce, onions, jalapeños and spicy Maharaja sauce.",
    businessName: "Burger Hut",
    businessLogo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=60",
    discount: "34% OFF",
    rating: 4.2,
    reviewsCount: "820",
    code: "BURGER34",
    category: "Food",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: true,
    expiryDate: "2026-09-30",
    originalPrice: 1235,
    ouiyaPrice: 1000,
    availabilities: ["Daily: 12:00 PM - 10:00 PM"],
    aboutOffer: "Signature Double Burger at Burger Hut. Handcrafted patties with melting cheddar cheese.",
    offerPeriod: "Valid until 30th Sept 2026",
    applicableOn: "All orders.",
    termsAndConditions: ["One coupon valid per billing invoice."],
    shopId: "biz-burgerhut"
  },
  {
    id: "off-4",
    title: "Chicken Bucket Combo",
    subTitle: "10 Pcs Hot & Spicy Chicken",
    description: "Enjoy a large bucket of crunchy hot & spicy fried chicken with 2 dips and large fries.",
    businessName: "KFC",
    businessLogo: "https://images.unsplash.com/photo-1513639776629-7b61b0ac5987?w=150&auto=format&fit=crop&q=60",
    discount: "25% OFF",
    rating: 4.3,
    reviewsCount: "1.6K",
    code: "KFCOFFER25",
    category: "Food",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: false,
    expiryDate: "2026-08-31",
    originalPrice: 800,
    ouiyaPrice: 600,
    availabilities: ["Daily: 11:00 AM - 11:00 PM"],
    aboutOffer: "Crunchy fried chicken bucket combo. Authentic 11 herbs and spices recipe.",
    offerPeriod: "Valid until 31st August 2026",
    applicableOn: "Takeaway & Dine-in.",
    termsAndConditions: ["Valid across Pondicherry outlets only."],
    shopId: "biz-kfc"
  },
  {
    id: "off-5",
    title: "Premium Couple Spa Retreat",
    subTitle: "Ocean Spray Wellness Spa",
    description: "60 mins full body Swedish massage followed by 15 mins steam and jacuzzi bath.",
    businessName: "Ocean Spray",
    businessLogo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&auto=format&fit=crop&q=60",
    discount: "40% OFF",
    rating: 4.6,
    reviewsCount: "940",
    code: "OSSPA40",
    category: "Spa Deals",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: true,
    expiryDate: "2026-10-31",
    originalPrice: 5000,
    ouiyaPrice: 3000,
    availabilities: ["Monday - Thursday: 9:00 AM - 7:00 PM"],
    aboutOffer: "Relax your senses with a premium couple massage package at the luxurious Ocean Spray Spa resort.",
    offerPeriod: "Valid until 31st Oct 2026",
    applicableOn: "Prior appointment booking required. Subject to slot availability.",
    termsAndConditions: [
      "Must book at least 24 hours in advance.",
      "Cancellation policies apply."
    ],
    shopId: "biz-oceanspray"
  },
  {
    id: "off-6",
    title: "Sizzling Chocolate Brownie",
    subTitle: "Belgian Fudge Hot Brownie with Vanilla Scoop",
    description: "Our legendary sizzling brownie drenched in hot liquid chocolate syrup on a hot iron skillet.",
    businessName: "The Chocolate Room",
    businessLogo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=60",
    discount: "40% OFF",
    rating: 4.3,
    reviewsCount: "310",
    code: "CHOCBROWN40",
    category: "Food",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: true,
    expiryDate: "2026-09-30",
    originalPrice: 300,
    ouiyaPrice: 180,
    availabilities: ["Monday - Sunday: 11:00 AM - 10:30 PM"],
    aboutOffer: "Mouth-watering chocolate brownie on a sizzler plate.",
    offerPeriod: "Valid until 30th Sept 2026",
    applicableOn: "Dine-in only.",
    termsAndConditions: ["Subject to table availability during rush hours."],
    shopId: "biz-chocroom"
  },
  {
    id: "off-7",
    title: "French Sunrise Breakfast",
    subTitle: "Croissant + Baguette + Hot Latte Combo",
    description: "Start your morning with butter croissants, fresh warm baguettes, jam and a warm latte.",
    businessName: "Le Café",
    businessLogo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&auto=format&fit=crop&q=60",
    discount: "30% OFF",
    rating: 4.5,
    reviewsCount: "1.8K",
    code: "SUNRISE30",
    category: "Food",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: true,
    expiryDate: "2026-10-15",
    originalPrice: 350,
    ouiyaPrice: 245,
    availabilities: ["Daily: 6:00 AM - 11:00 AM"],
    aboutOffer: "Authentic French breakfast overlooking the rock beach waves.",
    offerPeriod: "Valid until 15th October 2026",
    applicableOn: "Dine-in only.",
    termsAndConditions: ["Not valid for home deliveries."],
    shopId: "biz-lecafe"
  },
  {
    id: "off-8",
    title: "Flat 30% Off Storewide",
    subTitle: "Providence Mall Store Coupon",
    description: "Unlock an extra flat 30% discount on clothing, accessories, jackets and coats.",
    businessName: "ZARA",
    businessLogo: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=150&auto=format&fit=crop&q=60",
    discount: "30% OFF",
    rating: 4.4,
    reviewsCount: "920",
    code: "ZARASTORE30",
    category: "Entertainment",
    location: "Puducherry",
    isTopOffer: false,
    isCoupon: true,
    expiryDate: "2026-08-31",
    originalPrice: 1000,
    ouiyaPrice: 700,
    availabilities: ["Daily: 10:00 AM - 9:30 PM"],
    aboutOffer: "Exclusive outlet storewide coupon discount card.",
    offerPeriod: "Valid until 31st August 2026",
    applicableOn: "Applicable on non-sale clearance items.",
    termsAndConditions: ["Cannot be combined with mid-season sale tags."],
    shopId: "biz-zara"
  },
  {
    id: "off-9",
    title: "1-Month Trial Membership",
    subTitle: "Full Gym Access & Diet Plan Consultation",
    description: "Get full access to gym machines, cardio zones, steam rooms and a one-time fitness diet consultation.",
    businessName: "Gold's Gym",
    businessLogo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&auto=format&fit=crop&q=60",
    discount: "50% OFF",
    rating: 4.6,
    reviewsCount: "540",
    code: "GOLDSFIT50",
    category: "Health",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: true,
    expiryDate: "2026-10-31",
    originalPrice: 4000,
    ouiyaPrice: 1999,
    availabilities: ["Monday - Saturday: 5:00 AM - 10:00 PM", "Sunday: 6:00 AM - 12:00 PM"],
    aboutOffer: "Experience international standards of fitness with a 1-month trial access membership.",
    offerPeriod: "Valid until 31st October 2026",
    applicableOn: "First-time registrations only.",
    termsAndConditions: ["Requires registration with government ID."],
    shopId: "biz-goldsgym"
  },
  {
    id: "off-10",
    title: "Premium Hair Styling & Facial",
    subTitle: "Nirvana Premium Salon Package",
    description: "Receive a professional haircut, hair styling spa, beard trim and detan fruit facial combo.",
    businessName: "Nirvana Spa & Salon",
    businessLogo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&auto=format&fit=crop&q=60",
    discount: "40% OFF",
    rating: 4.7,
    reviewsCount: "680",
    code: "NIRVANASPA40",
    category: "Saloon",
    location: "Puducherry",
    isTopOffer: true,
    isCoupon: true,
    expiryDate: "2026-09-05",
    originalPrice: 2500,
    ouiyaPrice: 1500,
    availabilities: ["Daily: 9:00 AM - 8:30 PM"],
    aboutOffer: "Makeover package at Nirvana Spa & Salon. Expert styles, premium face treatment.",
    offerPeriod: "Valid until 5th Sept 2026",
    applicableOn: "Dine-in/Walk-in salon slots.",
    termsAndConditions: ["Prior slot booking via phone recommended."],
    shopId: "biz-nirvana"
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

// Interfaces matching Ouiya Firestore Database Schema
export interface FirestoreReview {
  id: string;
  userId: string;
  userName: string;
  userImageUrl?: string;
  shopId: string;
  offerId?: string;
  rating: number;
  comment: string;
  createdAt?: any;
}

export interface FirestoreCoupon {
  id: string;
  offerId: string;
  userId: string;
  shopId: string;
  code: string;
  status: "unused" | "redeemed";
  offerTitle: string;
  createdAt?: any;
  redeemedAt?: any;
}

export function mapFirestoreOffer(docId: string, data: any): Offer {
  let discountStr = data.discount || "";
  if (!discountStr) {
    if (data.discountPercent) discountStr = `${data.discountPercent}% OFF`;
    else if (data.discountAmount) discountStr = `₹${data.discountAmount} OFF`;
    else discountStr = "Special Offer";
  }

  let ouiyaPriceVal = typeof data.discountedPrice === 'number' ? data.discountedPrice : parseFloat(data.discountedPrice) || data.ouiyaPrice || 499;
  let origPriceVal = typeof data.originalPrice === 'number' ? data.originalPrice : parseFloat(data.originalPrice) || data.originalPrice || 999;

  let logoUrl = data.businessLogo || (Array.isArray(data.imageUrls) && data.imageUrls[0]) || "";
  if (!logoUrl) {
    logoUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80";
  }

  let expiryStr = data.expiryDate || "";
  if (!expiryStr && data.expiresAt) {
    if (typeof data.expiresAt === 'object' && typeof data.expiresAt.toDate === 'function') {
      expiryStr = data.expiresAt.toDate().toLocaleDateString("en-GB");
    } else if (typeof data.expiresAt === 'string') {
      expiryStr = data.expiresAt;
    }
  }

  return {
    id: docId,
    title: data.title || "Special Deal",
    subTitle: data.subTitle || data.shopName || data.businessName || "Exclusive Offer",
    description: data.description || "",
    businessName: data.shopName || data.businessName || "Local Business",
    businessLogo: logoUrl,
    discount: discountStr,
    rating: typeof data.rating === 'number' ? data.rating : 4.5,
    reviewsCount: data.reviewCount ? `${data.reviewCount} reviews` : (data.reviewsCount || "120 reviews"),
    code: data.promoCode || data.code || `PROMO${Math.floor(Math.random() * 9000 + 1000)}`,
    category: data.category ? (data.category.charAt(0).toUpperCase() + data.category.slice(1)) : "Food",
    location: data.shopAddress || data.location || "Puducherry",
    isTopOffer: Boolean(data.isFeatured || data.isTopOffer),
    isCoupon: true,
    isNewArrival: true,
    expiryDate: expiryStr || "2026-12-31",
    originalPrice: origPriceVal,
    ouiyaPrice: ouiyaPriceVal,
    shopId: data.shopId || `biz-${docId}`,
    aboutOffer: data.description || "",
    termsAndConditions: Array.isArray(data.termsAndConditions) ? data.termsAndConditions : ["Terms apply."]
  };
}

export function mapFirestoreBusiness(docId: string, data: any): Business {
  return {
    id: docId || data.uid,
    name: data.displayName || data.name || "Local Shop",
    logoUrl: data.logoUrl || "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=150&auto=format&fit=crop&q=60",
    rating: typeof data.rating === 'number' ? data.rating : 4.5,
    reviewsCount: data.reviewsCount || "100+",
    offersCount: data.offersCount || 1,
    address: data.address || data.locationText || "Puducherry",
    phone: data.phone || "+91 98765 43210",
    gallery: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"
    ],
    about: data.businessDescription || data.about || "Quality local business offering top deals.",
    hasVoucher: Boolean(data.hasVoucher),
    comments: Array.isArray(data.comments) ? data.comments : []
  };
}

// Main Data Fetching Interface - Queries Firestore & merges seamlessly with existing UI data
export const getOffers = async (filters?: {
  category?: string;
  query?: string;
  location?: string;
}): Promise<Offer[]> => {
  let firestoreOffers: Offer[] = [];

  // Query Cloud Firestore `offers` collection according to schema
  try {
    const querySnapshot = await getDocs(collection(db, "offers"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      firestoreOffers.push(mapFirestoreOffer(doc.id, data));
    });
  } catch {
    // Silent catch if Firebase rules deny unauthenticated read access
  }

  const localAds = getLocalAds();

  let allOffers: Offer[] = [];
  if (firestoreOffers.length > 0) {
    // When Firebase data is present, display ONLY Firebase offers (and user local ads)
    allOffers = [...firestoreOffers, ...localAds];
  } else if (localAds.length > 0) {
    allOffers = [...localAds];
  } else {
    // Fallback to mock offers only when no Firebase data exists
    allOffers = [...INITIAL_MOCK_OFFERS];
  }

  // Map and apply fallbacks for missing/empty fields
  allOffers = allOffers.map(o => {
    const fallbackLogos: Record<string, string> = {
      "Food": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80",
      "Electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&auto=format&fit=crop&q=80",
      "Spa Deals": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&auto=format&fit=crop&q=80",
      "Saloon": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop&q=80",
      "Health": "https://images.unsplash.com/photo-1631549911990-95c2108f9029?w=400&auto=format&fit=crop&q=80",
      "Entertainment": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=80"
    };

    const categoryKey = o.category || "Food";
    const defaultLogo = fallbackLogos[categoryKey] || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80";

    return {
      ...o,
      businessLogo: o.businessLogo || defaultLogo,
      rating: o.rating || 4.5,
      reviewsCount: o.reviewsCount || "150 reviews",
      ouiyaPrice: o.ouiyaPrice || 499,
      originalPrice: o.originalPrice || 999,
      discount: o.discount || "50% OFF",
      shopId: o.shopId || `biz-${o.businessName.toLowerCase().replace(/\s+/g, "")}`
    };
  });

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
          (o.subTitle && o.subTitle.toLowerCase().includes(searchLower)) ||
          o.businessName.toLowerCase().includes(searchLower) ||
          (o.description && o.description.toLowerCase().includes(searchLower))
      );
    }
  }

  return allOffers;
};

// Query Firestore `users` collection for Businesses (with fallback to public `offers` collection)
export const getBusinessesFromFirebase = async (): Promise<Business[]> => {
  let firestoreBusinesses: Business[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.role === "business" || data.businessCategory || data.ownerName) {
        firestoreBusinesses.push(mapFirestoreBusiness(doc.id, data));
      }
    });
  } catch {
    // If users collection requires auth permission, extract shop details from public offers collection
    try {
      const offersSnap = await getDocs(collection(db, "offers"));
      const shopsMap: Record<string, Business> = {};
      offersSnap.forEach((doc) => {
        const data = doc.data();
        const shopId = data.shopId || `biz-${(data.shopName || data.businessName || doc.id).toLowerCase().replace(/\s+/g, "")}`;
        if (!shopsMap[shopId]) {
          shopsMap[shopId] = {
            id: shopId,
            name: data.shopName || data.businessName || "Local Partner",
            logoUrl: (Array.isArray(data.imageUrls) && data.imageUrls[0]) || data.businessLogo || "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=150&auto=format&fit=crop&q=80",
            rating: typeof data.rating === 'number' ? data.rating : 4.5,
            reviewsCount: data.reviewCount ? `${data.reviewCount} reviews` : "100+",
            offersCount: 1,
            address: data.shopAddress || data.location || "Puducherry",
            phone: "+91 98765 43210",
            gallery: Array.isArray(data.imageUrls) && data.imageUrls.length > 0 ? data.imageUrls : [
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"
            ],
            about: data.description || "Verified partner business on Ouiya.",
            hasVoucher: false,
            comments: []
          };
        }
      });
      firestoreBusinesses = Object.values(shopsMap);
    } catch {
      // Graceful fallback
    }
  }

  // When Firebase data exists, return ONLY Firebase businesses
  if (firestoreBusinesses.length > 0) {
    return firestoreBusinesses;
  }

  return MOCK_BUSINESSES;
};

// Query Firestore `reviews` collection for a shop
export const getReviewsForShop = async (shopId: string): Promise<FirestoreReview[]> => {
  let reviews: FirestoreReview[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "reviews"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.shopId === shopId) {
        reviews.push({
          id: doc.id,
          userId: data.userId || "",
          userName: data.userName || "Customer",
          userImageUrl: data.userImageUrl,
          shopId: data.shopId,
          offerId: data.offerId,
          rating: data.rating || 5,
          comment: data.comment || "",
          createdAt: data.createdAt
        });
      }
    });
  } catch (e) {
    console.warn("Firestore reviews fetch notice:", e);
  }
  return reviews;
};

// Query Firestore `coupons` collection for a user
export const getCouponsForUser = async (userId: string): Promise<FirestoreCoupon[]> => {
  let coupons: FirestoreCoupon[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "coupons"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === userId) {
        coupons.push({
          id: doc.id,
          offerId: data.offerId || "",
          userId: data.userId || "",
          shopId: data.shopId || "",
          code: data.code || "",
          status: data.status || "unused",
          offerTitle: data.offerTitle || "",
          createdAt: data.createdAt,
          redeemedAt: data.redeemedAt
        });
      }
    });
  } catch (e) {
    console.warn("Firestore coupons fetch notice:", e);
  }
  return coupons;
};

// Safe Firestore & Local Sync function to create local Advertisement
export const createAdvertisement = async (ad: Omit<Offer, "id">): Promise<Offer> => {
  const savedAd = saveLocalAd(ad);
  try {
    await addDoc(collection(db, "offers"), {
      ...ad,
      createdAt: new Date().toISOString()
    });
  } catch {
    // Graceful fallback
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

