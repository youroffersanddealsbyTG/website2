import { db } from "./firebase";
import { collection, getDocs } from "@firebase/firestore";

export interface DestinationActivity {
  id: string;
  name: string;
  categoryFilter: string;
  iconName: string;
  description: string;
  startingPrice?: string;
}

export interface TouristDestination {
  id: string;
  name: string;
  tagline: string;
  category: "Beaches" | "French Quarter" | "Auroville" | "Heritage" | "Gardens" | "Boat Rides" | "Museums";
  coverImage: string;
  gallery: string[];
  rating: number;
  reviewsCount: string;
  distance: string;
  openHours: string;
  entryFee: string;
  estimatedDuration: string;
  history: string;
  importance: string;
  facts: string[];
  experience: string;
  bestTimeToVisit: {
    morning: boolean;
    evening: boolean;
    sunrise: boolean;
    sunset: boolean;
    recommendedSeason: string;
  };
  facilities: string[];
  googleMapsUrl: string;
  travelTime: string;
  activities: DestinationActivity[];
  nearbyCategories: string[];
  lat: number;
  lng: number;
}

export interface RegisteredShopMapPoint {
  id: string;
  name: string;
  category: string;
  discount: string;
  rating: number;
  reviewsCount: string;
  lat: number;
  lng: number;
  address: string;
  imageUrl: string;
}

export const PONDICHERRY_DESTINATIONS: TouristDestination[] = [
  {
    id: "paradise-beach",
    name: "Paradise Beach (Chunnambar)",
    tagline: "Golden Sands & Golden Sunsets across the Chunnambar Backwaters",
    category: "Beaches",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    reviewsCount: "2.4k reviews",
    distance: "8.5 km from City Center",
    openHours: "9:00 AM – 5:00 PM",
    entryFee: "₹350 (Includes Ferry)",
    estimatedDuration: "3 - 4 Hours",
    history: "Paradise Beach is located at Nonankuppam, right along the Chunnambar River backwaters. Historically developed by Pondicherry Tourism as an isolated coastal sanctuary, it remains one of the cleanest and most serene beaches in Southern India, accessible only via a scenic backwater boat ride.",
    importance: "Known for its pristine soft sands and calm sea, Paradise Beach offers tourists a tranquil island-like experience surrounded by lush mangrove palms.",
    facts: [
      "Accessible exclusively by a 20-minute boat ride through lush palm-fringed backwaters.",
      "Features cool thatched bamboo huts for shade and fresh coconut water stalls.",
      "Renowned for safe water sports under trained lifeguard supervision."
    ],
    experience: "Enjoy a breathtaking ferry cruise through the backwaters, feel soft golden sand between your toes, try thrilling jet-skiing, or relax under beach umbrellas with fresh tender coconut.",
    bestTimeToVisit: {
      morning: true,
      evening: true,
      sunrise: false,
      sunset: true,
      recommendedSeason: "October to March"
    },
    facilities: [
      "Parking Available",
      "Public Restrooms",
      "Drinking Water",
      "Food Court & Shack",
      "Police & Lifeguards",
      "Changing Rooms"
    ],
    googleMapsUrl: "https://maps.google.com/?q=Paradise+Beach+Chunnambar+Pondicherry",
    travelTime: "25 mins by vehicle + 15 mins ferry",
    lat: 11.8906,
    lng: 79.8055,
    activities: [
      {
        id: "act-boat-ride",
        name: "Chunnambar Ferry & Speedboat",
        categoryFilter: "Entertainment",
        iconName: "Ship",
        description: "Scenic backwater ferry ride through palm groves to the beach island.",
        startingPrice: "₹350"
      },
      {
        id: "act-kayaking",
        name: "Backwater Kayaking & Paddle",
        categoryFilter: "Sports",
        iconName: "Waves",
        description: "Explore quiet mangrove channels with guided kayak rentals.",
        startingPrice: "₹500"
      },
      {
        id: "act-scuba",
        name: "Scuba Diving & Snorkeling",
        categoryFilter: "Sports",
        iconName: "Compass",
        description: "Discover coral reefs & marine life with certified dive instructors.",
        startingPrice: "₹3,500"
      },
      {
        id: "act-bike-rental",
        name: "Scooter & Beach Bike Rental",
        categoryFilter: "Electronics",
        iconName: "Bike",
        description: "Rent vintage scooters & bikes to ride down to Nonankuppam boat house.",
        startingPrice: "₹400 / day"
      }
    ],
    nearbyCategories: ["Dining", "Electronics", "Fashion", "Entertainment"]
  },
  {
    id: "promenade-beach",
    name: "Promenade Beach (Rock Beach)",
    tagline: "The iconic 1.5 km seaside boulevard with French heritage and sea breezes",
    category: "French Quarter",
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    reviewsCount: "5.8k reviews",
    distance: "0 km (Heart of White Town)",
    openHours: "24 Hours (Pedestrian only 6 PM – 7.30 AM)",
    entryFee: "Free Entry",
    estimatedDuration: "2 - 3 Hours",
    history: "Constructed during the French colonial era in the 18th century, Promenade Beach borders the historic French Quarter (White Town). It features landmarks such as the 4.2m statue of Mahatma Gandhi, the French War Memorial, and the 19th-century Old Light House.",
    importance: "It is Puducherry's social heart, where tourists and locals gather every morning and evening for seaside walks, sea spray, and heritage architecture.",
    facts: [
      "Vehicles are strictly banned between 6:00 PM and 7:30 AM to allow peaceful walking.",
      "Surrounded by colonial heritage villas, French cafes, and gelato parlors.",
      "Hosts sunrise yoga sessions and weekend cultural music festivals."
    ],
    experience: "Walk along the crashing waves, sip authentic French espresso at street-side cafes, watch the dramatic ocean sunrise, and admire colonial French architecture.",
    bestTimeToVisit: {
      morning: true,
      evening: true,
      sunrise: true,
      sunset: false,
      recommendedSeason: "Year-Round"
    },
    facilities: [
      "Public Restrooms",
      "Drinking Water Kiosks",
      "Food Stalls & Cafes",
      "Police Help Booth",
      "Wheelchair Accessible Ramp",
      "Seaside Benches"
    ],
    googleMapsUrl: "https://maps.google.com/?q=Promenade+Beach+Pondicherry",
    travelTime: "Directly in White Town center",
    lat: 11.9333,
    lng: 79.8354,
    activities: [
      {
        id: "act-heritage-walk",
        name: "French Quarter Heritage Walk",
        categoryFilter: "Entertainment",
        iconName: "Compass",
        description: "Guided walking tour through yellow colonial French lanes & monuments.",
        startingPrice: "₹300"
      },
      {
        id: "act-cafe-voucher",
        name: "French Cafe & Bakery Tasting",
        categoryFilter: "Dining",
        iconName: "Utensils",
        description: "Enjoy croissants, macarons & authentic filter coffee vouchers.",
        startingPrice: "₹250"
      },
      {
        id: "act-cycle-tour",
        name: "Seaside Bicycle Rental",
        categoryFilter: "Electronics",
        iconName: "Bike",
        description: "Rent vintage yellow bicycles to cruise the promenade boulevard.",
        startingPrice: "₹150 / day"
      }
    ],
    nearbyCategories: ["Dining", "Fashion", "Beauty & Wellness"]
  },
  {
    id: "auroville-matrimandir",
    name: "Auroville & Matrimandir",
    tagline: "The City of Dawn – Universal Township dedicated to human unity",
    category: "Auroville",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.7,
    reviewsCount: "4.1k reviews",
    distance: "12 km from City Center",
    openHours: "9:00 AM – 5:30 PM (Visitors Centre)",
    entryFee: "Free (Pass required for Inner Chamber)",
    estimatedDuration: "3 - 5 Hours",
    history: "Founded in 1968 by Mirra Alfassa ('The Mother') and designed by French architect Roger Anger, Auroville is an experimental township endorsed by UNESCO where men and women of all countries live in peace and progressive harmony.",
    importance: "At the center stands the Matrimandir, a massive golden globe surrounded by 12 petal gardens, serving as a silent concentration and meditation hall.",
    facts: [
      "Home to residents from over 50 different nations living without politics or money.",
      "The Matrimandir is covered in 1,415 gold-leaf plated stainless steel discs.",
      "Famous for eco-friendly handicrafts, organic cafes, and handmade paper products."
    ],
    experience: "Walk through shaded botanical paths to the Matrimandir Viewing Point, savor organic vegan delicacies at Solar Kitchen, and shop for handmade incense, pottery, and aromatherapy oils.",
    bestTimeToVisit: {
      morning: true,
      evening: false,
      sunrise: false,
      sunset: true,
      recommendedSeason: "October to March"
    },
    facilities: [
      "Spacious Parking",
      "Public Restrooms",
      "Organic Food Courts",
      "Drinking Water Stations",
      "Information Kiosk",
      "Handicraft Souvenir Shops"
    ],
    googleMapsUrl: "https://maps.google.com/?q=Auroville+Visitors+Centre+Pondicherry",
    travelTime: "30 mins by car/scooter",
    lat: 12.0068,
    lng: 79.8105,
    activities: [
      {
        id: "act-guided-tour",
        name: "Auroville Township Guided Tour",
        categoryFilter: "Entertainment",
        iconName: "Compass",
        description: "Guided excursion covering the Visitor's Centre, Matrimandir & Green Belt.",
        startingPrice: "₹400"
      },
      {
        id: "act-organic-dining",
        name: "Solar Kitchen Organic Buffet",
        categoryFilter: "Dining",
        iconName: "Utensils",
        description: "Farm-to-table organic meals prepared using solar power energy.",
        startingPrice: "₹350"
      },
      {
        id: "act-meditation",
        name: "Sound Healing & Yoga Session",
        categoryFilter: "Beauty & Wellness",
        iconName: "Sparkles",
        description: "Tibetan bowl sound bath & hatha yoga classes in quiet forest pavilions.",
        startingPrice: "₹600"
      }
    ],
    nearbyCategories: ["Dining", "Beauty & Wellness", "Fashion"]
  },
  {
    id: "french-quarter-white-town",
    name: "French Quarter (White Town)",
    tagline: "Charming yellow mustard villas, French street signs, and bougainvillea blossoms",
    category: "French Quarter",
    coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    reviewsCount: "3.9k reviews",
    distance: "0.2 km from Promenade",
    openHours: "24 Hours",
    entryFee: "Free",
    estimatedDuration: "2 - 4 Hours",
    history: "Built on a French grid layout in the 18th century, White Town features preserved colonial structures with arched windows, high ceilings, wrought-iron balconies, and mustard-yellow walls.",
    importance: "It is India's premier French architectural sanctuary, offering an authentic European atmosphere with boutique hotels, art galleries, and bakeries.",
    facts: [
      "Street names are written in both French and Tamil (e.g. Rue Romain Rolland).",
      "Villas showcase classic Franco-Tamil fusion courtyard design.",
      "Top destination for street photography, fashion shoots, and cafe hopping."
    ],
    experience: "Stroll through quiet pastel lanes, admire colorful bougainvillea flowers cascading down yellow colonial walls, explore boutique art stores, and dine in garden bistros.",
    bestTimeToVisit: {
      morning: true,
      evening: true,
      sunrise: true,
      sunset: true,
      recommendedSeason: "October to March"
    },
    facilities: [
      "Public Parking Zones",
      "Heritage Cafes & Hotels",
      "Boutique Shopping",
      "ATM Facilities",
      "Police Patrol"
    ],
    googleMapsUrl: "https://maps.google.com/?q=White+Town+Pondicherry",
    travelTime: "5 mins walk from Beach Road",
    lat: 11.9325,
    lng: 79.8340,
    activities: [
      {
        id: "act-photo-walk",
        name: "Professional Heritage Photo Session",
        categoryFilter: "Entertainment",
        iconName: "Camera",
        description: "1-hour photo shoot with a local photographer around yellow French streets.",
        startingPrice: "₹1,200"
      },
      {
        id: "act-e-scooter",
        name: "Electric Scooter & Vespa Rental",
        categoryFilter: "Electronics",
        iconName: "Bike",
        description: "Eco-friendly electric scooters for cruising White Town hassle-free.",
        startingPrice: "₹350 / day"
      }
    ],
    nearbyCategories: ["Dining", "Fashion", "Beauty & Wellness"]
  },
  {
    id: "botanical-garden",
    name: "Pondicherry Botanical Garden",
    tagline: "A 22-acre lush green retreat established by French botanists in 1826",
    category: "Gardens",
    coverImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.5,
    reviewsCount: "1.8k reviews",
    distance: "1.5 km from Bus Stand",
    openHours: "10:00 AM – 5:00 PM",
    entryFee: "₹20 (Adults), ₹10 (Kids)",
    estimatedDuration: "1 - 2 Hours",
    history: "Established in 1826 by French botanist Perrottet, the Botanical Garden features over 1,500 species of exotic plants imported from around the world. It was also featured as the zoo location in the Hollywood movie 'Life of Pi'.",
    importance: "Serves as Puducherry's primary ecological sanctuary, featuring rare medicinal plants, a musical fountain, and a historic toy train.",
    facts: [
      "Featured prominently in Yann Martel's 'Life of Pi' novel and movie.",
      "Houses an ancient fossil tree section estimated to be over 20 million years old.",
      "Includes a specialized conservatory for orchids and tropical ferns."
    ],
    experience: "Enjoy a peaceful stroll under century-old tree canopies, ride the fun toy train with family, explore exotic plant conservatories, and relax beside flower beds.",
    bestTimeToVisit: {
      morning: true,
      evening: true,
      sunrise: false,
      sunset: false,
      recommendedSeason: "October to March"
    },
    facilities: [
      "Parking Space",
      "Restrooms",
      "Toy Train Rides",
      "Drinking Water",
      "Benches & Shade Shacks"
    ],
    googleMapsUrl: "https://maps.google.com/?q=Botanical+Garden+Pondicherry",
    travelTime: "10 mins from White Town",
    lat: 11.9280,
    lng: 79.8235,
    activities: [
      {
        id: "act-family-pass",
        name: "Botanical Garden Toy Train Pass",
        categoryFilter: "Entertainment",
        iconName: "Ticket",
        description: "Miniature train ride circling the lush botanical gardens.",
        startingPrice: "₹50"
      }
    ],
    nearbyCategories: ["Dining", "Entertainment"]
  },
  {
    id: "serenity-beach",
    name: "Serenity Beach & Surf School",
    tagline: "Golden sands, crashing waves, and South India's premier surfing spot",
    category: "Beaches",
    coverImage: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.7,
    reviewsCount: "2.1k reviews",
    distance: "5 km from City Center",
    openHours: "5:00 AM – 7:30 PM",
    entryFee: "Free Entry",
    estimatedDuration: "2 - 3 Hours",
    history: "Serenity Beach got its name from its quiet, untouched coastal environment. Over the last decade, it has evolved into a vibrant hub for surfers and ocean lovers.",
    importance: "One of the best surfing destinations along the Bay of Bengal, featuring consistent waves suitable for beginners and seasoned surfers.",
    facts: [
      "Home to top ISA-certified surf schools with international instructors.",
      "Features a long rock pier offering panoramic view of sunrise and fishing boats.",
      "Popular weekend beach market selling handmade jewelry and ocean art."
    ],
    experience: "Take a surfing lesson, watch fishermen haul in early morning catches, enjoy fresh seafood at beachside shacks, and catch sunset ocean breezes.",
    bestTimeToVisit: {
      morning: true,
      evening: true,
      sunrise: true,
      sunset: true,
      recommendedSeason: "September to March"
    },
    facilities: [
      "Bike Parking",
      "Restrooms & Showers",
      "Surfing Gear Rental",
      "Seafood Shacks",
      "Lifeguards"
    ],
    googleMapsUrl: "https://maps.google.com/?q=Serenity+Beach+Pondicherry",
    travelTime: "15 mins by vehicle",
    lat: 11.9700,
    lng: 79.8450,
    activities: [
      {
        id: "act-surf-lesson",
        name: "1-on-1 Beginner Surf Lesson",
        categoryFilter: "Sports",
        iconName: "Waves",
        description: "90-minute surfing class with certified instructor & surfboard rental.",
        startingPrice: "₹1,500"
      }
    ],
    nearbyCategories: ["Dining", "Sports", "Fashion"]
  }
];

export const REGISTERED_PARTNER_SHOPS: RegisteredShopMapPoint[] = [
  {
    id: "baker-street",
    name: "Baker Street French Bakery",
    category: "Dining",
    discount: "20% OFF",
    rating: 4.8,
    reviewsCount: "1.2k",
    lat: 11.9355,
    lng: 79.8310,
    address: "Bussy St, White Town, Puducherry",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300"
  },
  {
    id: "le-cafe",
    name: "Le Café Promenade",
    category: "Dining",
    discount: "15% OFF",
    rating: 4.6,
    reviewsCount: "3.4k",
    lat: 11.9335,
    lng: 79.8358,
    address: "Beach Rd, White Town, Puducherry",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300"
  },
  {
    id: "pizza-hut-pondicherry",
    name: "Pizza Hut White Town",
    category: "Dining",
    discount: "30% OFF",
    rating: 4.5,
    reviewsCount: "980",
    lat: 11.9340,
    lng: 79.8320,
    address: "Mission St, Heritage Town, Puducherry",
    imageUrl: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=300"
  },
  {
    id: "chunnambar-boat-house",
    name: "Chunnambar Water Sports Center",
    category: "Sports",
    discount: "10% OFF",
    rating: 4.7,
    reviewsCount: "850",
    lat: 11.8920,
    lng: 79.8020,
    address: "Cuddalore Main Rd, Nonankuppam",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300"
  },
  {
    id: "serenity-surf-school",
    name: "Kallialay Surf School",
    category: "Sports",
    discount: "25% OFF",
    rating: 4.9,
    reviewsCount: "640",
    lat: 11.9710,
    lng: 79.8460,
    address: "Serenity Beach, Kottakuppam",
    imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=300"
  },
  {
    id: "tanto-pizzeria",
    name: "Tanto Pizzeria Auroville",
    category: "Dining",
    discount: "15% OFF",
    rating: 4.7,
    reviewsCount: "1.5k",
    lat: 11.9950,
    lng: 79.8120,
    address: "Main Road, Auroville",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300"
  }
];

export const DESTINATION_CATEGORIES = [
  "All",
  "Beaches",
  "French Quarter",
  "Auroville",
  "Heritage",
  "Gardens",
  "Boat Rides"
];

export const getDestinationsFromFirebase = async (): Promise<TouristDestination[]> => {
  let destinations: TouristDestination[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "tourist_destinations"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const cover = data.coverImage || (Array.isArray(data.coverImages) && data.coverImages[0]) || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800";
      destinations.push({
        id: doc.id,
        name: data.name || "Tourist Attraction",
        tagline: data.tagline || data.about || "Explore Pondicherry",
        category: data.category || "Beaches",
        coverImage: cover,
        gallery: Array.isArray(data.coverImages) && data.coverImages.length > 0 ? data.coverImages : [cover],
        rating: typeof data.rating === 'number' ? data.rating : parseFloat(data.rating) || 4.5,
        reviewsCount: data.reviewCount ? `${data.reviewCount} reviews` : (data.reviewsCount || "500 reviews"),
        distance: data.distance || "1.0 km from city center",
        openHours: data.openHours || "9:00 AM - 5:00 PM",
        entryFee: data.entryFee || "Free Entry",
        estimatedDuration: data.estVisitDuration || data.estimatedDuration || "2 Hours",
        history: data.history || "Historical attraction in Pondicherry.",
        importance: data.importance || data.about || "Must visit spot.",
        facts: Array.isArray(data.facts) ? data.facts : ["Beautiful coastal attraction."],
        experience: data.experience || data.about || "Great tourist experience.",
        bestTimeToVisit: typeof data.bestTime === 'object' && data.bestTime !== null ? data.bestTime : {
          morning: true,
          evening: true,
          sunrise: false,
          sunset: true,
          recommendedSeason: "Year-Round"
        },
        facilities: Array.isArray(data.facilities) ? data.facilities : ["Parking", "Restrooms"],
        googleMapsUrl: data.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(data.name || "Pondicherry")}`,
        travelTime: data.travelTime || "15 mins",
        lat: typeof data.lat === 'number' ? data.lat : 11.9333,
        lng: typeof data.lng === 'number' ? data.lng : 79.8354,
        activities: Array.isArray(data.activities) ? data.activities : (Array.isArray(data.mustTryActivities) ? data.mustTryActivities.map((act: any, idx: number) => ({
          id: `act-${doc.id}-${idx}`,
          name: typeof act === 'string' ? act : (act.name || "Attraction Activity"),
          categoryFilter: "Entertainment",
          iconName: "Compass",
          description: typeof act === 'string' ? act : (act.description || "Activity at destination"),
          startingPrice: "Free"
        })) : []),
        nearbyCategories: Array.isArray(data.nearbyCategories) ? data.nearbyCategories : ["Dining", "Entertainment"]
      });
    });
  } catch (e) {
    console.warn("Firestore destinations fetch notice:", e);
  }

  return destinations.length > 0 ? destinations : PONDICHERRY_DESTINATIONS;
};

