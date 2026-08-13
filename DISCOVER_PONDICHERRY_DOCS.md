# Discover Pondicherry Tourism Module & Live OpenStreetMap Explorer - Complete Technical Documentation

## Executive Summary
The **Discover Pondicherry** module is a digital tourism guide built into **ouiya**. It adheres strictly to the core design principle of separating information from commerce:
- **Destination Pages (Information Modules)**: Provide rich educational content, history, photos, best visit times, facilities, and live map coordinates.
- **Business Pages (Commerce Modules)**: Handle shopping, offers, reservations, and checkout.
- **Commercial Redirection**: When a tourist selects a bookable activity (e.g. *Chunnambar Ferry*, *Backwater Kayaking*, *Surf Lessons*) or taps a partner shop pin on the live map, the application seamlessly transitions to registered business offers under that category on **ouiya**.

---

## 1. Project Files Created & Modified

| File Path | Description |
| :--- | :--- |
| `lib/discoverData.ts` | **New Data Layer**: Defines interfaces (`TouristDestination`, `DestinationActivity`, `RegisteredShopMapPoint`), curated destination datasets, GPS coordinates, and registered partner shop map points. |
| `app/discover/page.tsx` | **Main Tourism Hub View**: Features French Riviera hero styling, dynamic 4.5s background slideshow of iconic Pondicherry landmarks, category filters, live search, destination cards, and map modal trigger. |
| `components/DestinationDetailModal.tsx` | **Destination Detail Overlay**: Full-screen modal with cover carousel gallery, quick stats, history, visitor experience, best visit times, facilities badges, Google Maps links, and bookable activities. |
| `components/PondicherryMapModal.tsx` | **Interactive OpenStreetMap Explorer**: Full-screen interactive map centered on Puducherry (`11.9416, 79.8083`) with gold pin markers for tourist spots and red pin markers for registered partner shops displaying active discounts (*e.g., 20% OFF*). Includes fail-safe OpenStreetMap embed fallback. |
| `components/BottomNav.tsx` | **Mobile Navigation Bar**: Integrated dedicated **`DISCOVER`** tab with Compass icon into sticky bottom navigation pill (`[HOME]`, `[OFFERS]`, `[DISCOVER]`, `[CART]`). |
| `lib/AppContext.tsx` | **App Context Integration**: Added `"discover"` tab state, modal management, `bookActivityRedirect` helper, and fixed JavaScript function hoisting order to prevent TDZ execution errors. |
| `components/Navbar.tsx` & `components/SideDrawer.tsx` | **Navigation Bar & Drawer**: Added "Discover Pondicherry" links to desktop navigation and mobile side drawer menu. |
| `app/page.tsx` | **Main Entry Point**: Added prominent `"Discover Pondicherry 📍"` hero quick action pill button, integrated `<DiscoverPondicherryView />`, and embedded `<DestinationDetailModal />` in global overlays. |

---

## 2. Detailed Feature Breakdown

### A. Curated Tourism Dataset (`lib/discoverData.ts`)
Curated data for top Puducherry destinations:
1. **Paradise Beach (Chunnambar)**: Backwater ferry, kayaking, scuba diving, and scooter rentals.
2. **Promenade Beach (Rock Beach)**: Heritage walk, French cafe tasting, and bicycle rentals.
3. **Auroville & Matrimandir**: Township guided tours, Solar Kitchen organic dining, sound healing & yoga.
4. **French Quarter (White Town)**: Professional photo shoots and electric Vespa rentals.
5. **Pondicherry Botanical Garden**: Historic toy train passes and exotic plant conservatories.
6. **Serenity Beach & Surf School**: 1-on-1 beginner surfing classes and surfboard rentals.
7. **Sri Aurobindo Ashram**: Spiritual library & meditation hall.
8. **Arikamedu Archaeological Ruins**: Ancient Indo-Roman trading port site.

### B. Mobile Navigation Accessibility (`components/BottomNav.tsx` & `components/SideDrawer.tsx`)
- **Sticky Mobile Bottom Navigation**: Added dedicated `DISCOVER` tab with Compass icon directly on the bottom floating bar (`[HOME] [OFFERS] [DISCOVER] [CART]`).
- **Hero Shortcut Pill**: Prominent gradient pill button `Discover Pondicherry 📍` under search bar on home view.
- **Mobile Drawer**: Featured item in hamburger side menu.

### C. Dynamic Hero Background Slideshow (`app/discover/page.tsx`)
- Automatically cross-fades every 4.5 seconds between high-resolution imagery of Puducherry's iconic locations.
- Includes a floating location title badge (*"Featured: French Quarter (White Town) ✨"*).

### D. Interactive OpenStreetMap Explorer (`components/PondicherryMapModal.tsx`)
- **Coordinates & Engine**: Centered on Puducherry (`11.9416° N, 79.8083° E`) with Leaflet tiles and an automatic OpenStreetMap iframe fallback (`https://www.openstreetmap.org/export/embed.html?...`).
- **Interactive Pins**:
  - **Tourist Destinations 📍**: Gold pin markers.
  - **Registered Partner Businesses 🛍️**: Primary red pin markers displaying active discount badges (*e.g. 20% OFF*).
- **Controls & Navigation**:
  - Filter toggle bar (*"All Pins"*, *"Tourist Spots"*, *"Registered Shops"*).
  - Side panel location list with smooth `flyTo` camera transitions.
  - Quick-action popup card with direct redirect buttons (*"Explore Destination"* or *"View Business Offers"*).

### E. Commercial Redirection Architecture
- Clicking **"Book Now"** on any activity or **"View Business Offers"** on a shop pin invokes `bookActivityRedirect(activity)`, which:
  1. Closes the destination modal.
  2. Sets `selectedCategory` in `AppContext` to the relevant category (*e.g. "Dining", "Sports", "Entertainment"*).
  3. Switches `activeTab` to `"categories"`, immediately presenting all matching business offers to the user.

---

## 3. Build & Production Verification
- Executed production build (`npm run build`):
  - **Compilation**: Compiled successfully with **0 errors**.
  - **Static Generation**: All 9 routes prerendered as static content:
    - `/` (Home)
    - `/discover` (Discover Pondicherry Tourism Hub)
    - `/offers` (Category Browse View)
    - `/portal` (Partner Portal)
    - `/_not-found`
