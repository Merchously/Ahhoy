export const ACTIVITY_TYPES = [
  { name: "fishing", label: "Fishing Trip", slug: "fishing", iconName: "Fish" },
  { name: "jet_ski", label: "Jet Ski Adventure", slug: "jet-ski", iconName: "Waves" },
  { name: "yacht_party", label: "Yacht Party", slug: "yacht-party", iconName: "PartyPopper" },
  { name: "sunset_cruise", label: "Sunset Cruise", slug: "sunset-cruise", iconName: "Sunset" },
  { name: "snorkeling_diving", label: "Snorkeling / Diving", slug: "snorkeling-diving", iconName: "Glasses" },
  { name: "wakeboarding", label: "Wakeboarding / Watersports", slug: "wakeboarding", iconName: "Zap" },
  { name: "boat_rental", label: "Boat Rental", slug: "boat-rental", iconName: "Ship" },
  { name: "custom", label: "Custom Experience", slug: "custom", iconName: "Sparkles" },
] as const;

export const BOAT_TYPES = [
  "Sailboat",
  "Motorboat",
  "Catamaran",
  "Yacht",
  "Pontoon",
  "Jet Ski",
  "Fishing Boat",
  "Speedboat",
  "Houseboat",
  "Kayak/Canoe",
  "Other",
] as const;

export const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT || 15);

export const CANCELLATION_POLICIES = {
  FLEXIBLE: { label: "Flexible", description: "Full refund up to 24 hours before the trip" },
  MODERATE: { label: "Moderate", description: "Full refund up to 5 days before the trip" },
  STRICT: { label: "Strict", description: "50% refund up to 7 days before the trip" },
} as const;
