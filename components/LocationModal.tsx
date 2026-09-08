"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Navigation, X, Check, Search } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  onSelectLocation: (loc: string, coords?: { lat: number; lng: number }) => void;
}

export const POPULAR_LOCATIONS = [
  { name: "All Locations", area: "Puducherry Union Territory" },
  { name: "White Town / Heritage Town", area: "French Quarter, Beach Rd" },
  { name: "Mission Street / MG Road", area: "Central Shopping District" },
  { name: "ECR / Lawspet", area: "North Pondicherry" },
  { name: "Auroville / Kottakuppam", area: "International City Area" },
  { name: "Subbiah Salai / Railway Station", area: "South Pondicherry" },
  { name: "Muthialpet", area: "East Coastal Zone" },
  { name: "Villianur", area: "West Heritage Zone" },
  { name: "JIPMER / Gorimedu", area: "North Academic Zone" },
];

export default function LocationModal({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
}: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDetectGPS = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setIsLocating(false);
          const formatted = `Pondicherry (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`;
          setDetectedAddress(formatted);
          onSelectLocation(formatted, { lat: latitude, lng: longitude });
          onClose();
        },
        (error) => {
          console.warn("GPS Location error:", error);
          setIsLocating(false);
          // Fallback to Pondicherry City Center
          onSelectLocation("Pondicherry City Center", { lat: 11.9416, lng: 79.8083 });
          onClose();
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
      onSelectLocation("Pondicherry City Center", { lat: 11.9416, lng: 79.8083 });
      onClose();
    }
  };

  const filteredLocations = POPULAR_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-surface border border-border-main rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border-main flex items-center justify-between bg-surface-elevated">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Select Your Location</h3>
              <p className="text-xs text-muted">Find offers and deals near you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auto Detect GPS button */}
        <div className="p-4 border-b border-border-subtle bg-primary/5">
          <button
            onClick={handleDetectGPS}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all shadow-md active:scale-[0.98] disabled:opacity-70 cursor-pointer"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
            {isLocating ? "Locating your position..." : "Use Current GPS Location"}
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-border-subtle">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <input
              type="text"
              placeholder="Search area, landmark or street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-hover border border-border-subtle text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Locations List */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-border-subtle">
          {filteredLocations.map((loc) => {
            const isSelected = selectedLocation.toLowerCase() === loc.name.toLowerCase();
            return (
              <button
                key={loc.name}
                onClick={() => {
                  onSelectLocation(loc.name);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-colors group ${
                  isSelected
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-surface-hover text-foreground"
                }`}
              >
                <div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    {loc.name}
                  </div>
                  <div className="text-xs text-muted mt-0.5">{loc.area}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
