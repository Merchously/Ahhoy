// Standalone seeder — creates 60 fake listings with hosts, activity types, photos, and availability
// Uses globally installed pg + bcryptjs (same pattern as seed-admin.mjs)
import { createRequire } from "module";
import { randomBytes } from "crypto";

const require = createRequire(import.meta.url);
const pg = require("pg");
const bcrypt = require("bcryptjs");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.log("seed-listings: DATABASE_URL not set, skipping");
  process.exit(0);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

function genId() {
  return `cm${Date.now().toString(36)}${randomBytes(8).toString("hex")}`;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ─── Activity Types ─────────────────────────────────────────────
const ACTIVITY_TYPES = [
  { name: "fishing", label: "Fishing Trip", slug: "fishing", iconName: "Fish" },
  { name: "jet_ski", label: "Jet Ski Adventure", slug: "jet-ski", iconName: "Waves" },
  { name: "yacht_party", label: "Yacht Party", slug: "yacht-party", iconName: "PartyPopper" },
  { name: "sunset_cruise", label: "Sunset Cruise", slug: "sunset-cruise", iconName: "Sunset" },
  { name: "snorkeling_diving", label: "Snorkeling / Diving", slug: "snorkeling-diving", iconName: "Glasses" },
  { name: "wakeboarding", label: "Wakeboarding / Watersports", slug: "wakeboarding", iconName: "Zap" },
  { name: "boat_rental", label: "Boat Rental", slug: "boat-rental", iconName: "Ship" },
  { name: "custom", label: "Custom Experience", slug: "custom", iconName: "Sparkles" },
];

// ─── Host Users ─────────────────────────────────────────────────
const HOSTS = [
  { firstName: "Marcus", lastName: "Rivera", email: "marcus@demo.ahhoy.ca", city: "Miami", state: "FL", bio: "Professional captain with 15 years of experience in South Florida waters. USCG licensed and insured." },
  { firstName: "Sarah", lastName: "Chen", email: "sarah@demo.ahhoy.ca", city: "San Diego", state: "CA", bio: "Marine biologist turned boat charter operator. Passionate about ocean conservation and sharing the sea." },
  { firstName: "Jake", lastName: "Thompson", email: "jake@demo.ahhoy.ca", city: "Key West", state: "FL", bio: "Born and raised in the Keys. I know every fishing spot, reef, and hidden cove." },
  { firstName: "Elena", lastName: "Petrova", email: "elena@demo.ahhoy.ca", city: "Seattle", state: "WA", bio: "Sailing instructor and yacht enthusiast. Let me show you the beauty of the Pacific Northwest." },
  { firstName: "Carlos", lastName: "Mendez", email: "carlos@demo.ahhoy.ca", city: "Cancun", state: "QR", bio: "Certified dive master with 10+ years experience in Caribbean waters." },
  { firstName: "Olivia", lastName: "Banks", email: "olivia@demo.ahhoy.ca", city: "Charleston", state: "SC", bio: "Third-generation charter captain. Southern hospitality on the water." },
  { firstName: "Ryan", lastName: "Nakamura", email: "ryan@demo.ahhoy.ca", city: "Honolulu", state: "HI", bio: "Hawaii native offering authentic ocean experiences. From whale watching to deep-sea fishing." },
  { firstName: "Amara", lastName: "Johnson", email: "amara@demo.ahhoy.ca", city: "Tampa", state: "FL", bio: "Luxury yacht captain specializing in corporate events and private parties on the Gulf." },
];

// ─── Locations ──────────────────────────────────────────────────
const LOCATIONS = [
  { name: "Miami Beach Marina", city: "Miami", state: "FL", country: "US", lat: 25.7781, lng: -80.1341 },
  { name: "Bayside Marketplace", city: "Miami", state: "FL", country: "US", lat: 25.7784, lng: -80.1868 },
  { name: "San Diego Harbor", city: "San Diego", state: "CA", country: "US", lat: 32.7157, lng: -117.1611 },
  { name: "Mission Bay", city: "San Diego", state: "CA", country: "US", lat: 32.7709, lng: -117.2301 },
  { name: "Key West Bight Marina", city: "Key West", state: "FL", country: "US", lat: 24.5597, lng: -81.8076 },
  { name: "Mallory Square Dock", city: "Key West", state: "FL", country: "US", lat: 24.5601, lng: -81.8080 },
  { name: "Elliott Bay Marina", city: "Seattle", state: "WA", country: "US", lat: 47.6310, lng: -122.3860 },
  { name: "Lake Union", city: "Seattle", state: "WA", country: "US", lat: 47.6411, lng: -122.3328 },
  { name: "Cancun Hotel Zone Marina", city: "Cancun", state: "QR", country: "MX", lat: 21.1307, lng: -86.7627 },
  { name: "Puerto Aventuras", city: "Cancun", state: "QR", country: "MX", lat: 20.4948, lng: -87.2282 },
  { name: "Charleston City Marina", city: "Charleston", state: "SC", country: "US", lat: 32.7765, lng: -79.9311 },
  { name: "Patriots Point", city: "Charleston", state: "SC", country: "US", lat: 32.7873, lng: -79.9084 },
  { name: "Ala Wai Harbor", city: "Honolulu", state: "HI", country: "US", lat: 21.2841, lng: -157.8421 },
  { name: "Kewalo Basin Harbor", city: "Honolulu", state: "HI", country: "US", lat: 21.2921, lng: -157.8585 },
  { name: "Tampa Bay Marina", city: "Tampa", state: "FL", country: "US", lat: 27.9395, lng: -82.4595 },
  { name: "Clearwater Beach Marina", city: "Clearwater", state: "FL", country: "US", lat: 27.9775, lng: -82.8320 },
];

const BOAT_TYPES = ["Sailboat", "Motorboat", "Catamaran", "Yacht", "Pontoon", "Jet Ski", "Fishing Boat", "Speedboat"];
const BOAT_NAMES = [
  "Sea Breeze", "Ocean Spirit", "Blue Horizon", "Coral Queen", "Wave Runner", "Island Time",
  "Aqua Dream", "Tide Chaser", "Sun Dancer", "Pearl Diver", "Marina Belle", "Pacific Star",
  "Gulf Stream", "Reef Rider", "Tropical Mist", "Starfish", "Neptune's Pride", "Coastal Wind",
  "Golden Sunset", "Silver Fin", "Deep Blue", "Crystal Waters", "Sea Glass", "Dolphin Song",
];
const MANUFACTURERS = ["Boston Whaler", "Sea Ray", "Beneteau", "Jeanneau", "Grady-White", "Azimut", "Sunseeker", "Viking", "Yellowfin", "Robalo"];

const INCLUDED_ITEMS_POOL = [
  "Life jackets", "Fishing rods & tackle", "Bait & lures", "Cooler with ice", "Snorkeling gear",
  "Towels", "Sunscreen", "Snacks & refreshments", "Bottled water", "Bluetooth speaker",
  "GoPro rental", "Professional fish cleaning", "Photos of your trip", "Captain & crew",
  "Fuel costs", "Fishing license", "Wakeboard & rope", "Paddleboards", "Kayaks", "Wi-Fi on board",
];

const NOT_INCLUDED_POOL = [
  "Alcohol (BYOB welcome)", "Meals", "Gratuity for captain", "Parking fees",
  "Transportation to marina", "Personal items", "Travel insurance",
];

const REQUIREMENTS_POOL = [
  "Must be 18+ to book", "Children must be accompanied by an adult", "Non-slip shoes required",
  "Swim experience recommended", "Valid ID required", "No smoking on board",
  "Arrive 15 minutes early", "Motion sickness medication recommended",
];

// ─── Listing Templates ─────────────────────────────────────────
const LISTINGS = [
  // FISHING (10)
  { title: "Deep Sea Fishing Adventure", desc: "Head offshore for an unforgettable deep-sea fishing experience targeting marlin, tuna, and mahi-mahi. Our experienced captain knows the best spots and will put you on the fish.", activity: "fishing", pricing: "PER_PERSON", price: 150, duration: 480, minG: 2, maxG: 6, boat: "Fishing Boat" },
  { title: "Inshore Flats Fishing Charter", desc: "Explore the pristine flats and mangroves in search of snook, redfish, and tarpon. Perfect for both beginners and experienced anglers. Light tackle and fly fishing available.", activity: "fishing", pricing: "FLAT_RATE", price: 450, duration: 240, minG: 1, maxG: 4, boat: "Fishing Boat" },
  { title: "Family-Friendly Fishing Trip", desc: "A relaxed fishing experience perfect for families with children. We'll target easy-to-catch species and make sure everyone has a great time. All equipment provided.", activity: "fishing", pricing: "PER_PERSON", price: 85, duration: 180, minG: 2, maxG: 8, boat: "Pontoon" },
  { title: "Trophy Sportfishing Expedition", desc: "Full-day offshore expedition targeting trophy-class gamefish. Professional tournament-grade equipment included. Ideal for serious anglers chasing their personal best.", activity: "fishing", pricing: "FLAT_RATE", price: 1200, duration: 600, minG: 1, maxG: 6, boat: "Fishing Boat" },
  { title: "Sunset Bay Fishing Tour", desc: "Enjoy the golden hour while casting lines in calm bay waters. A perfect combination of scenic beauty and fishing excitement as the sun sets over the water.", activity: "fishing", pricing: "PER_PERSON", price: 95, duration: 180, minG: 2, maxG: 6, boat: "Motorboat" },
  { title: "Reef Fishing & Snorkeling Combo", desc: "Best of both worlds — spend the morning fishing the reefs and the afternoon snorkeling crystal-clear waters. Lunch and refreshments included.", activity: "fishing", pricing: "PER_PERSON", price: 175, duration: 360, minG: 2, maxG: 8, boat: "Motorboat" },
  { title: "Night Fishing Experience", desc: "A unique after-dark fishing adventure. Target snapper, grouper, and other species that come alive at night. All lights and equipment provided.", activity: "fishing", pricing: "FLAT_RATE", price: 550, duration: 240, minG: 2, maxG: 6, boat: "Fishing Boat" },
  { title: "Fly Fishing Masterclass", desc: "Learn the art of fly fishing from a certified casting instructor. Includes all gear, personalized coaching, and access to our favorite backcountry spots.", activity: "fishing", pricing: "PER_PERSON", price: 200, duration: 300, minG: 1, maxG: 3, boat: "Fishing Boat" },

  // JET SKI (7)
  { title: "Jet Ski Island Hopping Tour", desc: "Cruise across turquoise waters on a guided jet ski tour hitting the best islands and sandbars. No experience necessary — full instruction provided.", activity: "jet_ski", pricing: "PER_PERSON", price: 120, duration: 120, minG: 1, maxG: 10, boat: "Jet Ski" },
  { title: "Extreme Jet Ski Adventure", desc: "For thrill-seekers! Push the limits on our high-performance jet skis. Race through open waters and experience adrenaline-pumping speeds.", activity: "jet_ski", pricing: "PER_PERSON", price: 150, duration: 90, minG: 1, maxG: 6, boat: "Jet Ski" },
  { title: "Sunset Jet Ski Ride", desc: "Glide across calm waters as the sun paints the sky in brilliant colors. A magical experience combining jet skiing with one of nature's best shows.", activity: "jet_ski", pricing: "PER_PERSON", price: 95, duration: 60, minG: 2, maxG: 8, boat: "Jet Ski" },
  { title: "Jet Ski & Beach Picnic Combo", desc: "Ride jet skis to a secluded beach, enjoy a prepared gourmet picnic, then cruise back. The ultimate beach day experience.", activity: "jet_ski", pricing: "PER_PERSON", price: 180, duration: 180, minG: 2, maxG: 6, boat: "Jet Ski" },
  { title: "Jet Ski Dolphin Discovery Tour", desc: "Ride alongside pods of wild dolphins in their natural habitat. Our guides know exactly where to find them. An unforgettable wildlife encounter.", activity: "jet_ski", pricing: "PER_PERSON", price: 135, duration: 90, minG: 2, maxG: 8, boat: "Jet Ski" },
  { title: "Beginner Jet Ski Lesson & Tour", desc: "Never been on a jet ski? No problem! Start with hands-on instruction in calm waters, then head out for a guided bay tour. Perfect for first-timers.", activity: "jet_ski", pricing: "PER_PERSON", price: 85, duration: 90, minG: 1, maxG: 4, boat: "Jet Ski" },
  { title: "Full Day Jet Ski Rental", desc: "Take a jet ski for the entire day and explore at your own pace. GPS navigation included so you never get lost. Fuel and safety gear included.", activity: "jet_ski", pricing: "FLAT_RATE", price: 350, duration: 480, minG: 1, maxG: 2, boat: "Jet Ski" },

  // YACHT PARTY (8)
  { title: "Luxury Sunset Yacht Party", desc: "Celebrate in style aboard a luxury 65-foot yacht. Premium open bar, gourmet appetizers, DJ sound system, and stunning sunset views. Perfect for birthdays and celebrations.", activity: "yacht_party", pricing: "FLAT_RATE", price: 2500, duration: 240, minG: 10, maxG: 30, boat: "Yacht" },
  { title: "Private Yacht Birthday Bash", desc: "Make your birthday unforgettable with a private yacht party. Includes decorations, champagne toast, catered food, and a dedicated party host.", activity: "yacht_party", pricing: "FLAT_RATE", price: 1800, duration: 240, minG: 8, maxG: 20, boat: "Yacht" },
  { title: "Corporate Yacht Event", desc: "Impress clients and reward your team with a premium yacht experience. Full catering, AV equipment, and professional service staff included.", activity: "yacht_party", pricing: "FLAT_RATE", price: 3500, duration: 300, minG: 15, maxG: 40, boat: "Yacht" },
  { title: "Bachelorette Yacht Cruise", desc: "The ultimate bachelorette party! Music, drinks, decorations, and amazing photo opportunities. Optional add-ons include onboard photographer and spa treatments.", activity: "yacht_party", pricing: "FLAT_RATE", price: 1500, duration: 240, minG: 6, maxG: 15, boat: "Yacht" },
  { title: "VIP Catamaran Party", desc: "Spacious catamaran with two levels of entertainment. Swimming platform, water slides, and premium bar service. The most fun you can have on the water.", activity: "yacht_party", pricing: "PER_PERSON", price: 120, duration: 300, minG: 10, maxG: 35, boat: "Catamaran" },
  { title: "Intimate Cocktail Cruise", desc: "An elegant evening aboard a classic motor yacht. Craft cocktails, charcuterie boards, and city skyline views. Limited to 12 guests for an exclusive experience.", activity: "yacht_party", pricing: "PER_PERSON", price: 175, duration: 180, minG: 4, maxG: 12, boat: "Yacht" },
  { title: "NYE Yacht Spectacular", desc: "Ring in the New Year on the water with fireworks views, champagne, live DJ, and a midnight balloon drop. Black-tie optional, memories guaranteed.", activity: "yacht_party", pricing: "PER_PERSON", price: 250, duration: 300, minG: 20, maxG: 50, boat: "Yacht" },
  { title: "Boozy Brunch Boat Party", desc: "Bottomless mimosas, a chef-prepared brunch spread, and chill vibes on a stunning catamaran. The perfect weekend morning on the water.", activity: "yacht_party", pricing: "PER_PERSON", price: 95, duration: 180, minG: 8, maxG: 25, boat: "Catamaran" },

  // SUNSET CRUISE (8)
  { title: "Romantic Sunset Sail", desc: "Set sail into the golden hour on a classic sailboat. Includes champagne, cheese board, and a captain who knows exactly when and where the magic happens.", activity: "sunset_cruise", pricing: "PER_PERSON", price: 85, duration: 120, minG: 2, maxG: 6, boat: "Sailboat" },
  { title: "Luxury Sunset Catamaran Cruise", desc: "Relax on a spacious catamaran with panoramic views, open bar, and appetizers. Live acoustic music sets the mood as the sun dips below the horizon.", activity: "sunset_cruise", pricing: "PER_PERSON", price: 110, duration: 150, minG: 4, maxG: 20, boat: "Catamaran" },
  { title: "Private Sunset Charter", desc: "Your own private vessel for the evening. Choose your own route, bring your own playlist, and enjoy a sunset experience tailored just for you.", activity: "sunset_cruise", pricing: "FLAT_RATE", price: 600, duration: 120, minG: 2, maxG: 8, boat: "Motorboat" },
  { title: "Sunset & Stargazing Voyage", desc: "Watch the sunset, then stay on the water for stargazing under the open sky. Telescope and astronomy guide provided. Hot cocoa and blankets included.", activity: "sunset_cruise", pricing: "PER_PERSON", price: 95, duration: 180, minG: 2, maxG: 10, boat: "Sailboat" },
  { title: "Sunset Dolphin Watch Cruise", desc: "Cruise through dolphin territory during the most beautiful time of day. Our spotters have a 95% success rate. Drinks and snacks provided.", activity: "sunset_cruise", pricing: "PER_PERSON", price: 75, duration: 120, minG: 2, maxG: 12, boat: "Motorboat" },
  { title: "Dinner & Sunset Sailing Experience", desc: "A 3-course dinner prepared by a private chef while sailing through breathtaking sunset waters. Wine pairings available. The ultimate date night.", activity: "sunset_cruise", pricing: "PER_PERSON", price: 195, duration: 180, minG: 2, maxG: 8, boat: "Sailboat" },
  { title: "Family Sunset Pontoon Cruise", desc: "A relaxed, family-friendly sunset cruise on a comfortable pontoon boat. Kid-approved snacks, soft drinks, and plenty of space for everyone.", activity: "sunset_cruise", pricing: "PER_PERSON", price: 55, duration: 120, minG: 2, maxG: 12, boat: "Pontoon" },
  { title: "Champagne Sunset Experience", desc: "Premium champagne, Belgian chocolate truffles, and the most spectacular sunset views. An elevated experience for those who appreciate the finer things.", activity: "sunset_cruise", pricing: "PER_PERSON", price: 145, duration: 120, minG: 2, maxG: 6, boat: "Yacht" },

  // SNORKELING & DIVING (8)
  { title: "Coral Reef Snorkeling Adventure", desc: "Explore vibrant coral reefs teeming with tropical fish. All gear provided plus underwater camera rental. Suitable for all skill levels.", activity: "snorkeling_diving", pricing: "PER_PERSON", price: 89, duration: 240, minG: 2, maxG: 12, boat: "Motorboat" },
  { title: "Beginner Scuba Diving Experience", desc: "Always wanted to try diving? This intro course includes poolside training and a shallow reef dive with a certified instructor by your side the entire time.", activity: "snorkeling_diving", pricing: "PER_PERSON", price: 175, duration: 300, minG: 1, maxG: 4, boat: "Motorboat" },
  { title: "Shipwreck Diving Expedition", desc: "Dive historic shipwrecks with experienced guides. Multiple dive sites, underwater photography opportunities, and fascinating maritime history.", activity: "snorkeling_diving", pricing: "PER_PERSON", price: 195, duration: 360, minG: 2, maxG: 8, boat: "Motorboat" },
  { title: "Private Snorkeling & Island Tour", desc: "Your own boat, your own snorkeling paradise. Visit secret spots that the big tour boats can't reach. Lunch on a deserted beach included.", activity: "snorkeling_diving", pricing: "FLAT_RATE", price: 750, duration: 360, minG: 2, maxG: 6, boat: "Speedboat" },
  { title: "Night Snorkeling with Manta Rays", desc: "An otherworldly experience — float on the surface while giant manta rays dance below you, attracted by underwater lights. Truly once in a lifetime.", activity: "snorkeling_diving", pricing: "PER_PERSON", price: 145, duration: 120, minG: 2, maxG: 10, boat: "Motorboat" },
  { title: "Sea Turtle Snorkeling Safari", desc: "Swim alongside endangered sea turtles in their natural habitat. Our marine biologist guide will share fascinating insights about these gentle giants.", activity: "snorkeling_diving", pricing: "PER_PERSON", price: 110, duration: 180, minG: 2, maxG: 8, boat: "Motorboat" },
  { title: "Advanced 2-Tank Dive Trip", desc: "For certified divers — two epic dive sites with depths up to 100ft. Wall dives, drift dives, and abundant marine life. Tanks and weights included.", activity: "snorkeling_diving", pricing: "PER_PERSON", price: 165, duration: 300, minG: 2, maxG: 6, boat: "Motorboat" },
  { title: "Snorkel, Kayak & Beach Day", desc: "The ultimate ocean adventure combo. Snorkel pristine reefs, paddle through mangroves, and relax on a white-sand beach. All equipment and lunch included.", activity: "snorkeling_diving", pricing: "PER_PERSON", price: 130, duration: 360, minG: 2, maxG: 10, boat: "Motorboat" },

  // WAKEBOARDING (7)
  { title: "Wakeboarding Lesson & Session", desc: "Learn to wakeboard with a patient, certified instructor. All equipment provided. We'll have you up and riding in no time.", activity: "wakeboarding", pricing: "PER_PERSON", price: 110, duration: 120, minG: 1, maxG: 4, boat: "Speedboat" },
  { title: "Extreme Watersports Package", desc: "Wakeboarding, tubing, water skiing, and kneeboarding — all in one session. Switch between activities as much as you want. Maximum fun guaranteed.", activity: "wakeboarding", pricing: "FLAT_RATE", price: 500, duration: 180, minG: 2, maxG: 6, boat: "Speedboat" },
  { title: "Kids Watersports Camp", desc: "A safe, fun introduction to watersports for kids ages 8-16. Tubing, kneeboarding, and beginner wakeboarding with patient instructors.", activity: "wakeboarding", pricing: "PER_PERSON", price: 75, duration: 120, minG: 2, maxG: 6, boat: "Speedboat" },
  { title: "Wakeboard & Wakesurf Session", desc: "Advanced riders welcome! Our competition-spec boat creates perfect wakes for wakeboarding and wakesurfing. Pro-level equipment provided.", activity: "wakeboarding", pricing: "FLAT_RATE", price: 400, duration: 120, minG: 1, maxG: 4, boat: "Speedboat" },
  { title: "Full Day Watersports Boat Rental", desc: "Rent our fully-equipped watersports boat for the entire day. Comes with wakeboard, tubes, skis, and all safety gear. Driver required.", activity: "wakeboarding", pricing: "FLAT_RATE", price: 800, duration: 480, minG: 1, maxG: 8, boat: "Speedboat" },
  { title: "Parasailing & Tubing Combo", desc: "Soar 500 feet above the ocean with parasailing, then get pulled through the waves on a giant inflatable tube. The ultimate adrenaline combo.", activity: "wakeboarding", pricing: "PER_PERSON", price: 140, duration: 120, minG: 2, maxG: 6, boat: "Speedboat" },
  { title: "Sunset Wakeboarding Session", desc: "Ride the wake as the sun goes down. Glassy evening water makes for perfect conditions. Bring your camera for incredible golden hour photos.", activity: "wakeboarding", pricing: "FLAT_RATE", price: 350, duration: 120, minG: 1, maxG: 4, boat: "Speedboat" },

  // BOAT RENTAL (6)
  { title: "Self-Drive Pontoon Boat Rental", desc: "No captain needed! Rent a pontoon boat and explore at your own pace. Easy to drive, spacious, and perfect for a day on the water with family or friends.", activity: "boat_rental", pricing: "FLAT_RATE", price: 350, duration: 480, minG: 1, maxG: 12, boat: "Pontoon" },
  { title: "Luxury Yacht Day Charter", desc: "Charter a fully crewed luxury yacht for the day. Includes captain, first mate, and optional chef. Visit islands, swim, and relax in total luxury.", activity: "boat_rental", pricing: "FLAT_RATE", price: 2200, duration: 480, minG: 2, maxG: 12, boat: "Yacht" },
  { title: "Sailboat Day Rental", desc: "Experienced sailors — take the helm of a beautiful 36-foot sailboat. Full rigging, navigation equipment, and safety gear included. Sailing certification required.", activity: "boat_rental", pricing: "FLAT_RATE", price: 500, duration: 480, minG: 2, maxG: 6, boat: "Sailboat" },
  { title: "Center Console Half-Day Rental", desc: "Perfect for fishing or island hopping. This versatile center console handles everything from calm bays to offshore waters. Fuel included.", activity: "boat_rental", pricing: "FLAT_RATE", price: 400, duration: 240, minG: 1, maxG: 6, boat: "Motorboat" },
  { title: "Catamaran Week Charter", desc: "Live aboard a stunning 42-foot catamaran for a week. Visit multiple islands, sleep under the stars, and experience the ultimate sailing vacation.", activity: "boat_rental", pricing: "FLAT_RATE", price: 8500, duration: 10080, minG: 2, maxG: 8, boat: "Catamaran" },
  { title: "Speed Boat Half-Day Rental", desc: "Zip across the water in a powerful speedboat. Great for water sports, island hopping, or just the thrill of speed. Fuel and safety gear included.", activity: "boat_rental", pricing: "FLAT_RATE", price: 450, duration: 240, minG: 1, maxG: 6, boat: "Speedboat" },

  // CUSTOM (6)
  { title: "Proposal at Sea Package", desc: "Pop the question in the most romantic setting imaginable. Private boat, champagne, rose petals, photographer, and a sunset backdrop. She'll say yes.", activity: "custom", pricing: "FLAT_RATE", price: 1200, duration: 180, minG: 2, maxG: 4, boat: "Sailboat" },
  { title: "Photography Boat Tour", desc: "Designed for photographers — visit the most photogenic spots at golden hour. Tripod-friendly boat with stabilized platforms. Know the best angles and light.", activity: "custom", pricing: "PER_PERSON", price: 110, duration: 180, minG: 2, maxG: 6, boat: "Motorboat" },
  { title: "Whale Watching Expedition", desc: "Seasonal whale watching on a comfortable vessel with marine biologist narration. Humpback whales, blue whales, and dolphins frequently spotted.", activity: "custom", pricing: "PER_PERSON", price: 95, duration: 240, minG: 4, maxG: 20, boat: "Motorboat" },
  { title: "Fireworks Cruise", desc: "Watch the fireworks from the best seat in the house — on the water! Available for holiday shows and special events. Drinks and snacks included.", activity: "custom", pricing: "PER_PERSON", price: 85, duration: 150, minG: 4, maxG: 15, boat: "Pontoon" },
  { title: "Eco Mangrove Kayak & Boat Tour", desc: "Explore pristine mangrove ecosystems by boat and kayak. Spot manatees, rays, and exotic birds with our naturalist guide. An eco-conscious adventure.", activity: "custom", pricing: "PER_PERSON", price: 75, duration: 180, minG: 2, maxG: 8, boat: "Motorboat" },
  { title: "Ash Scattering Memorial Voyage", desc: "A dignified, peaceful voyage for scattering ashes at sea. Private ceremony with floral wreath, moment of silence, and certificate of coordinates.", activity: "custom", pricing: "FLAT_RATE", price: 600, duration: 120, minG: 2, maxG: 12, boat: "Sailboat" },
];

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

try {
  // Check if listings already seeded
  const existingCount = await pool.query(`SELECT COUNT(*) as cnt FROM listings`);
  if (parseInt(existingCount.rows[0].cnt) > 0) {
    console.log(`seed-listings: ${existingCount.rows[0].cnt} listings already exist, skipping`);
    process.exit(0);
  }

  console.log("seed-listings: Starting...");

  // ─── 1. Upsert Activity Types ──────────────────────────────
  const activityTypeIds = {};
  for (const at of ACTIVITY_TYPES) {
    const existing = await pool.query(`SELECT id FROM activity_types WHERE name = $1`, [at.name]);
    if (existing.rows.length > 0) {
      activityTypeIds[at.name] = existing.rows[0].id;
    } else {
      const id = genId();
      await pool.query(
        `INSERT INTO activity_types (id, name, label, slug, "iconName") VALUES ($1, $2, $3, $4, $5)`,
        [id, at.name, at.label, at.slug, at.iconName]
      );
      activityTypeIds[at.name] = id;
    }
  }
  console.log(`seed-listings: Activity types ready (${Object.keys(activityTypeIds).length})`);

  // ─── 2. Upsert Host Users ─────────────────────────────────
  const hostIds = [];
  const hashedPassword = bcrypt.hashSync("DemoHost123!", 12);
  for (const host of HOSTS) {
    const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [host.email]);
    if (existing.rows.length > 0) {
      hostIds.push(existing.rows[0].id);
    } else {
      const id = genId();
      await pool.query(
        `INSERT INTO users (id, email, "firstName", "lastName", "hashedPassword", role, city, state, country, bio, "stripeOnboardingComplete", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false, NOW(), NOW())`,
        [id, host.email, host.firstName, host.lastName, hashedPassword, "HOST", host.city, host.state, "US", host.bio]
      );
      hostIds.push(id);
    }
  }
  console.log(`seed-listings: ${hostIds.length} host users ready`);

  // ─── 3. Create Listings ────────────────────────────────────
  let created = 0;
  for (let i = 0; i < LISTINGS.length; i++) {
    const l = LISTINGS[i];
    const slug = slugify(l.title) + "-" + randomBytes(3).toString("hex");
    const hostId = hostIds[i % hostIds.length];
    const loc = LOCATIONS[i % LOCATIONS.length];
    const boatName = pick(BOAT_NAMES);
    const manufacturer = pick(MANUFACTURERS);
    const boatYear = randomBetween(2015, 2024);
    const boatLength = l.boat === "Jet Ski" ? randomBetween(10, 14) : l.boat === "Yacht" ? randomBetween(45, 75) : randomBetween(18, 40);
    const listingId = genId();

    const pricePerPerson = l.pricing === "PER_PERSON" ? l.price : null;
    const flatPrice = l.pricing === "FLAT_RATE" ? l.price : null;
    const cancellation = pick(["FLEXIBLE", "MODERATE", "STRICT"]);
    const instantBook = Math.random() > 0.5;
    const includedItems = pickN(INCLUDED_ITEMS_POOL, randomBetween(3, 7));
    const notIncluded = pickN(NOT_INCLUDED_POOL, randomBetween(2, 4));
    const requirements = pickN(REQUIREMENTS_POOL, randomBetween(2, 4));

    await pool.query(
      `INSERT INTO listings (
        id, "hostId", status, title, description, slug,
        "pricePerPerson", "flatPrice", "pricingType", currency,
        "minGuests", "maxGuests", "durationMinutes",
        "locationName", city, state, country, latitude, longitude,
        "boatName", "boatType", "boatLength", "boatCapacity", "boatYear", "boatManufacturer",
        "includedItems", "notIncludedItems", requirements,
        "cancellationPolicy", "instantBook",
        "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, 'PUBLISHED', $3, $4, $5,
        $6, $7, $8, 'USD',
        $9, $10, $11,
        $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23,
        $24, $25, $26,
        $27, $28,
        NOW(), NOW()
      )`,
      [
        listingId, hostId, l.title, l.desc, slug,
        pricePerPerson, flatPrice, l.pricing,
        l.minG, l.maxG, l.duration,
        loc.name, loc.city, loc.state, loc.country, loc.lat, loc.lng,
        boatName, l.boat, boatLength, l.maxG, boatYear, manufacturer,
        includedItems, notIncluded, requirements,
        cancellation, instantBook,
      ]
    );

    // ─── Link activity type ─────────────────────────────────
    await pool.query(
      `INSERT INTO listing_activity_types ("listingId", "activityTypeId") VALUES ($1, $2)`,
      [listingId, activityTypeIds[l.activity]]
    );

    // ─── Add photos (4 per listing) ─────────────────────────
    // Using picsum.photos with deterministic seeds for consistent placeholder images
    const photoSeeds = [i * 4 + 1, i * 4 + 2, i * 4 + 3, i * 4 + 4];
    for (let p = 0; p < 4; p++) {
      const photoId = genId();
      const url = `https://picsum.photos/seed/ahhoy${photoSeeds[p]}/800/600`;
      await pool.query(
        `INSERT INTO listing_photos (id, "listingId", url, "altText", "order", "isPrimary")
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [photoId, listingId, url, `${l.title} photo ${p + 1}`, p, p === 0]
      );
    }

    // ─── Add availability rules (weekdays + weekends) ───────
    const availableDays = pickN(DAYS, randomBetween(4, 7));
    for (const day of availableDays) {
      const ruleId = genId();
      const startHour = randomBetween(6, 10);
      const endHour = Math.min(startHour + Math.ceil(l.duration / 60) + 2, 22);
      await pool.query(
        `INSERT INTO availability_rules (id, "listingId", "dayOfWeek", "startTime", "endTime")
         VALUES ($1, $2, $3, $4, $5)`,
        [ruleId, listingId, day, `${String(startHour).padStart(2, "0")}:00`, `${String(endHour).padStart(2, "0")}:00`]
      );
    }

    created++;
    if (created % 10 === 0) console.log(`seed-listings: Created ${created}/${LISTINGS.length} listings`);
  }

  console.log(`seed-listings: Done! Created ${created} listings with photos and availability.`);
} catch (err) {
  console.error("seed-listings: Error:", err.message);
  process.exit(1);
} finally {
  await pool.end();
}
