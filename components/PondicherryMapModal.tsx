"use client";

import React, { useEffect, useState, useRef } from "react";
import { useApp } from "../lib/AppContext";
import { PONDICHERRY_DESTINATIONS, REGISTERED_PARTNER_SHOPS, TouristDestination, RegisteredShopMapPoint } from "../lib/discoverData";
import { X, MapPin, Compass, Store, Star, ArrowRight, Tag, Layers, Navigation, AlertCircle } from "lucide-react";

interface PondicherryMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PondicherryMapModal({ isOpen, onClose }: PondicherryMapModalProps) {
  const { openDestinationDetails, setSelectedCategory, setTab } = useApp();
  const [filterType, setFilterType] = useState<"all" | "destinations" | "shops">("all");
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{
    id: string;
    name: string;
    category: string;
    type: "destination" | "shop";
    rating: number;
    reviewsCount: string;
    discount?: string;
    address: string;
    imageUrl: string;
    lat: number;
    lng: number;
    rawObject?: any;
  } | null>(PONDICHERRY_DESTINATIONS[0] ? {
    id: PONDICHERRY_DESTINATIONS[0].id,
    name: PONDICHERRY_DESTINATIONS[0].name,
    category: PONDICHERRY_DESTINATIONS[0].category,
    type: "destination",
    rating: PONDICHERRY_DESTINATIONS[0].rating,
    reviewsCount: PONDICHERRY_DESTINATIONS[0].reviewsCount,
    address: PONDICHERRY_DESTINATIONS[0].distance,
    imageUrl: PONDICHERRY_DESTINATIONS[0].coverImage,
    lat: PONDICHERRY_DESTINATIONS[0].lat,
    lng: PONDICHERRY_DESTINATIONS[0].lng,
    rawObject: PONDICHERRY_DESTINATIONS[0]
  } : null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Load Leaflet library dynamically
  useEffect(() => {
    if (!isOpen) return;

    let timeoutId: NodeJS.Timeout;

    const loadLeaflet = () => {
      if ((window as any).L) {
        initMap();
        return;
      }

      // Load CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Load JS
      if (!document.getElementById("leaflet-js")) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
          initMap();
        };
        script.onerror = () => {
          setUseIframeFallback(true);
        };
        document.head.appendChild(script);
      } else {
        initMap();
      }

      // Fallback timer if Leaflet CDN is delayed
      timeoutId = setTimeout(() => {
        if (!(window as any).L && !mapInstanceRef.current) {
          setUseIframeFallback(true);
        }
      }, 1500);
    };

    const timer = setTimeout(loadLeaflet, 100);
    return () => {
      clearTimeout(timer);
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  const initMap = () => {
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) {
      setUseIframeFallback(true);
      return;
    }

    try {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Centered on Puducherry (11.9416, 79.8083)
      const map = L.map(mapContainerRef.current, {
        center: [11.9416, 79.8083],
        zoom: 12,
        zoomControl: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      mapInstanceRef.current = map;

      // Invalidate size after layout stabilization
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 300);

      renderMarkers();
    } catch (e) {
      console.warn("Leaflet map init warning, falling back to OSM embed:", e);
      setUseIframeFallback(true);
    }
  };

  const renderMarkers = () => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const map = mapInstanceRef.current;

    // Tourist Spots
    if (filterType === "all" || filterType === "destinations") {
      PONDICHERRY_DESTINATIONS.forEach((dest) => {
        const customIcon = L.divIcon({
          className: "custom-map-pin",
          html: `<div style="background-color:#f59e0b; width:34px; height:34px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.5); cursor:pointer;">
                  <span style="color:white; font-size:15px; font-weight:bold;">📍</span>
                 </div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const marker = L.marker([dest.lat, dest.lng], { icon: customIcon }).addTo(map);
        
        marker.on("click", () => {
          setSelectedPoint({
            id: dest.id,
            name: dest.name,
            category: dest.category,
            type: "destination",
            rating: dest.rating,
            reviewsCount: dest.reviewsCount,
            address: dest.distance,
            imageUrl: dest.coverImage,
            lat: dest.lat,
            lng: dest.lng,
            rawObject: dest
          });
        });

        markersRef.current.push(marker);
      });
    }

    // Registered Shops
    if (filterType === "all" || filterType === "shops") {
      REGISTERED_PARTNER_SHOPS.forEach((shop) => {
        const customIcon = L.divIcon({
          className: "custom-shop-pin",
          html: `<div style="background-color:#fa0303; width:36px; height:36px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(250,3,3,0.6); cursor:pointer;">
                  <span style="color:white; font-size:15px; font-weight:bold;">🛍️</span>
                 </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = L.marker([shop.lat, shop.lng], { icon: customIcon }).addTo(map);

        marker.on("click", () => {
          setSelectedPoint({
            id: shop.id,
            name: shop.name,
            category: shop.category,
            type: "shop",
            rating: shop.rating,
            reviewsCount: shop.reviewsCount,
            discount: shop.discount,
            address: shop.address,
            imageUrl: shop.imageUrl,
            lat: shop.lat,
            lng: shop.lng
          });
        });

        markersRef.current.push(marker);
      });
    }
  };

  useEffect(() => {
    if (mapInstanceRef.current) {
      renderMarkers();
    }
  }, [filterType]);

  if (!isOpen) return null;

  const handleFlyTo = (point: any) => {
    setSelectedPoint(point);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([point.lat, point.lng], 15, { duration: 1.2 });
    }
  };

  const handleAction = () => {
    if (!selectedPoint) return;
    onClose();
    if (selectedPoint.type === "destination" && selectedPoint.rawObject) {
      openDestinationDetails(selectedPoint.rawObject);
    } else {
      setSelectedCategory(selectedPoint.category);
      setTab("categories");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 select-none overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-6xl h-[92vh] bg-white dark:bg-[#0b0f19] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 shrink-0 z-20">
          <div>
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-black uppercase tracking-wider">
              <Navigation className="w-4 h-4" />
              <span>Interactive OpenStreetMap • Puducherry</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
              Pondicherry Live Map Explorer
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="hidden md:flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filterType === "all" ? "bg-primary text-white shadow-md" : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900"
              }`}
            >
              All Pins
            </button>

            <button
              onClick={() => setFilterType("destinations")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                filterType === "destinations" ? "bg-amber-500 text-white shadow-md" : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900"
              }`}
            >
              <span>Tourist Spots 📍</span>
            </button>

            <button
              onClick={() => setFilterType("shops")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                filterType === "shops" ? "bg-red-600 text-white shadow-md" : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900"
              }`}
            >
              <span>Registered Shops 🛍️</span>
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Filter Bar */}
        <div className="flex md:hidden p-3 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap ${filterType === "all" ? "bg-primary text-white" : "bg-zinc-200 dark:bg-zinc-800"}`}
          >
            All Pins
          </button>
          <button
            onClick={() => setFilterType("destinations")}
            className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap ${filterType === "destinations" ? "bg-amber-500 text-white" : "bg-zinc-200 dark:bg-zinc-800"}`}
          >
            Tourist Spots 📍
          </button>
          <button
            onClick={() => setFilterType("shops")}
            className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap ${filterType === "shops" ? "bg-red-600 text-white" : "bg-zinc-200 dark:bg-zinc-800"}`}
          >
            Registered Shops 🛍️
          </button>
        </div>

        {/* Main Body Grid: Map + Side Panel */}
        <div className="relative flex-grow flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* OpenStreetMap Canvas Area */}
          <div className="relative flex-grow min-h-[350px] md:min-h-0 w-full bg-zinc-900 overflow-hidden">
            
            {/* Native Leaflet Container */}
            <div 
              ref={mapContainerRef} 
              className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-300 ${
                useIframeFallback ? "opacity-0 pointer-events-none" : "opacity-100"
              }`} 
            />

            {/* Fallback Interactive OpenStreetMap Iframe */}
            {useIframeFallback && (
              <iframe
                title="Pondicherry OpenStreetMap"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=79.7500%2C11.8500%2C79.8800%2C12.0300&layer=mapnik&marker=${selectedPoint?.lat || 11.9416}%2C${selectedPoint?.lng || 79.8083}`}
                className="absolute inset-0 w-full h-full border-0 z-0"
              />
            )}

            {/* Floating Quick Action Popup Overlay when point is selected */}
            {selectedPoint && (
              <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-2xl z-30 animate-scale-up">
                <div className="flex gap-3">
                  <img 
                    src={selectedPoint.imageUrl} 
                    alt={selectedPoint.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0" 
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        selectedPoint.type === "destination" ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        {selectedPoint.type === "destination" ? "Tourist Spot 📍" : "Partner Shop 🛍️"}
                      </span>
                      {selectedPoint.discount && (
                        <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                          {selectedPoint.discount}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white truncate mt-1">
                      {selectedPoint.name}
                    </h4>

                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mt-0.5">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {selectedPoint.rating}
                      </span>
                      <span>•</span>
                      <span className="truncate">{selectedPoint.address}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAction}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md shadow-primary/20 cursor-pointer"
                >
                  <span>{selectedPoint.type === "destination" ? "Explore Destination" : "View Business Offers"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Side Panel: Location List */}
          <div className="w-full md:w-80 lg:w-96 bg-zinc-50 dark:bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 p-4 overflow-y-auto shrink-0 max-h-64 md:max-h-none">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" />
              <span>Tap Location to View on Map</span>
            </h4>

            <div className="space-y-2.5">
              {/* Destinations */}
              {(filterType === "all" || filterType === "destinations") && (
                <div>
                  <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-2">Tourist Destinations (📍)</p>
                  <div className="space-y-2">
                    {PONDICHERRY_DESTINATIONS.map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => handleFlyTo({
                          id: dest.id,
                          name: dest.name,
                          category: dest.category,
                          type: "destination",
                          rating: dest.rating,
                          reviewsCount: dest.reviewsCount,
                          address: dest.distance,
                          imageUrl: dest.coverImage,
                          lat: dest.lat,
                          lng: dest.lng,
                          rawObject: dest
                        })}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          selectedPoint?.id === dest.id 
                            ? "bg-amber-500/10 border-amber-500 text-zinc-900 dark:text-white shadow-md" 
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                        }`}
                      >
                        <img src={dest.coverImage} alt={dest.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0 flex-grow">
                          <p className="text-xs font-black truncate text-zinc-900 dark:text-white">{dest.name}</p>
                          <p className="text-[10px] text-zinc-400 truncate">{dest.distance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registered Shops */}
              {(filterType === "all" || filterType === "shops") && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-2">Registered Partner Businesses (🛍️)</p>
                  <div className="space-y-2">
                    {REGISTERED_PARTNER_SHOPS.map((shop) => (
                      <div
                        key={shop.id}
                        onClick={() => handleFlyTo({
                          id: shop.id,
                          name: shop.name,
                          category: shop.category,
                          type: "shop",
                          rating: shop.rating,
                          reviewsCount: shop.reviewsCount,
                          discount: shop.discount,
                          address: shop.address,
                          imageUrl: shop.imageUrl,
                          lat: shop.lat,
                          lng: shop.lng
                        })}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          selectedPoint?.id === shop.id 
                            ? "bg-red-500/10 border-red-500 text-zinc-900 dark:text-white shadow-md" 
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                        }`}
                      >
                        <img src={shop.imageUrl} alt={shop.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0 flex-grow">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-black truncate text-zinc-900 dark:text-white">{shop.name}</p>
                            <span className="text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                              {shop.discount}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 truncate">{shop.address}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
