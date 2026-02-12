// Standalone seeder — creates fake guest users, COMPLETED bookings, and reviews
// Uses globally installed pg + bcryptjs (same pattern as seed-listings.mjs)
import { createRequire } from "module";
import { randomBytes } from "crypto";

const require = createRequire(import.meta.url);
const pg = require("pg");
const bcrypt = require("bcryptjs");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.log("seed-reviews: DATABASE_URL not set, skipping");
  process.exit(0);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

function genId() {
  return `cm${Date.now().toString(36)}${randomBytes(8).toString("hex")}`;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedRating() {
  // Skew toward 4-5: ~50% get 5, ~30% get 4, ~15% get 3, ~5% get 2
  const r = Math.random();
  if (r < 0.05) return 2;
  if (r < 0.20) return 3;
  if (r < 0.50) return 4;
  return 5;
}

function maybeCategoryRating(overall) {
  // 70% chance of being filled, value near overall rating
  if (Math.random() < 0.3) return null;
  const offset = randomBetween(-1, 1);
  return Math.max(1, Math.min(5, overall + offset));
}

// ─── Guest Users ──────────────────────────────────────────────
const GUESTS = [
  { firstName: "Alex", lastName: "Mitchell", email: "alex.guest@demo.ahhoy.ca" },
  { firstName: "Jessica", lastName: "Park", email: "jessica.guest@demo.ahhoy.ca" },
  { firstName: "David", lastName: "Okafor", email: "david.guest@demo.ahhoy.ca" },
  { firstName: "Maria", lastName: "Santos", email: "maria.guest@demo.ahhoy.ca" },
  { firstName: "Tyler", lastName: "Brooks", email: "tyler.guest@demo.ahhoy.ca" },
];

// ─── Review Comments Pool ────────────────────────────────────
const COMMENTS = [
  "Captain was incredible — knew every fishing spot and made the whole trip so fun!",
  "Such a beautiful sunset cruise. The champagne and cheese board were a nice touch.",
  "Great experience for our family! The kids loved it and felt safe the entire time.",
  "Absolutely stunning views. The captain was knowledgeable and friendly throughout.",
  "Worth every penny. The boat was clean, well-maintained, and the crew was professional.",
  "One of the best water experiences I've had. Will definitely book again next summer!",
  "The snorkeling spots were amazing — we saw sea turtles and so many colorful fish.",
  "Perfect day on the water. The crew went above and beyond to make our trip special.",
  "Booked this for my wife's birthday and it exceeded all expectations. Highly recommend!",
  "The jet ski tour was thrilling! Our guide took us to hidden coves and sandbars.",
  "Really relaxing and peaceful cruise. Just what we needed after a long work week.",
  "Caught more fish than we ever expected! Captain knew exactly where to take us.",
  "The yacht was gorgeous and the food was restaurant quality. Amazing party experience.",
  "First time on a boat and I had a blast. The captain was patient and made us feel comfortable.",
  "We've done several charters before, and this was by far the best one yet.",
  "Incredible sunset views and the captain's narration about the local area was fascinating.",
  "Super well organized. Everything from check-in to the trip itself was smooth and professional.",
  "The dive sites were breathtaking. Visibility was perfect and the marine life was abundant.",
  "Our group of 8 had an amazing time. Plenty of space on the boat and great amenities.",
  "The captain was so fun and knowledgeable. He even helped us spot dolphins along the way!",
  "Best birthday gift I've ever received! The whole experience was magical from start to finish.",
  "Clean boat, excellent equipment, and a captain who truly loves what he does. Five stars!",
  "We were a bit nervous about the weather but the captain made the right call and we had a perfect day.",
  "Took my dad out for Father's Day and he hasn't stopped talking about it since. Thank you!",
  "The water was crystal clear and the spots they took us to were out of this world. Can't wait to come back.",
];

async function main() {
  const client = await pool.connect();

  try {
    // Idempotency check
    const { rows: countRows } = await client.query("SELECT COUNT(*)::int AS cnt FROM reviews");
    if (countRows[0].cnt > 0) {
      console.log(`seed-reviews: ${countRows[0].cnt} reviews already exist, skipping`);
      return;
    }

    // Fetch existing listings with their host and pricing info
    const { rows: listings } = await client.query(`
      SELECT id, "hostId", "pricingType", "pricePerPerson", "flatPrice", "minGuests", "maxGuests", "durationMinutes"
      FROM listings WHERE status = 'PUBLISHED'
    `);

    if (listings.length === 0) {
      console.log("seed-reviews: no published listings found, skipping");
      return;
    }

    console.log(`seed-reviews: found ${listings.length} published listings`);

    // Create or upsert guest users
    const hashedPassword = await bcrypt.hash("DemoGuest123!", 12);
    const now = new Date().toISOString();
    const guestIds = [];

    for (const guest of GUESTS) {
      const { rows: existing } = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [guest.email]
      );

      if (existing.length > 0) {
        guestIds.push(existing[0].id);
      } else {
        const id = genId();
        await client.query(
          `INSERT INTO users (id, "firstName", "lastName", email, "hashedPassword", role, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [id, guest.firstName, guest.lastName, guest.email, hashedPassword, "GUEST", now, now]
        );
        guestIds.push(id);
        console.log(`  Created guest: ${guest.firstName} ${guest.lastName}`);
      }
    }

    // For each guest, create ~6 bookings + reviews on random listings
    let totalReviews = 0;
    const usedListings = new Set(); // avoid duplicate reviews on same listing by same guest

    for (let g = 0; g < guestIds.length; g++) {
      const guestId = guestIds[g];
      const reviewCount = randomBetween(5, 7);

      // Shuffle listings and take a subset
      const shuffled = [...listings].sort(() => Math.random() - 0.5);
      const subset = shuffled.slice(0, reviewCount);

      for (const listing of subset) {
        const key = `${guestId}-${listing.id}`;
        if (usedListings.has(key)) continue;
        usedListings.add(key);

        // Booking with past date (30-180 days ago)
        const daysAgo = randomBetween(30, 180);
        const bookingDate = new Date(Date.now() - daysAgo * 86400000);
        const dateStr = bookingDate.toISOString().split("T")[0];

        const guestCount = randomBetween(listing.minGuests, Math.min(listing.maxGuests, listing.minGuests + 3));
        const pricePerUnit = listing.pricingType === "PER_PERSON"
          ? Number(listing.pricePerPerson || 100)
          : Number(listing.flatPrice || 500);
        const subtotal = listing.pricingType === "PER_PERSON"
          ? pricePerUnit * guestCount
          : pricePerUnit;
        const serviceFee = Math.round(subtotal * 0.15 * 100) / 100;
        const hostPayout = Math.round(subtotal * 0.85 * 100) / 100;
        const totalPrice = Math.round((subtotal + serviceFee) * 100) / 100;

        const durHrs = Math.floor(listing.durationMinutes / 60);
        const durMins = listing.durationMinutes % 60;
        const startTime = "10:00";
        const endTime = `${10 + durHrs}:${String(durMins).padStart(2, "0")}`;

        const bookingId = genId();
        // Stagger IDs slightly to avoid collisions
        await new Promise((r) => setTimeout(r, 2));

        await client.query(
          `INSERT INTO bookings (id, "guestId", "listingId", date, "startTime", "endTime",
            "guestCount", "pricePerUnit", "pricingType", subtotal, "serviceFee", "hostPayout",
            "totalPrice", currency, status, "createdAt", "updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
          [
            bookingId, guestId, listing.id, dateStr, startTime, endTime,
            guestCount, pricePerUnit, listing.pricingType, subtotal, serviceFee, hostPayout,
            totalPrice, "USD", "COMPLETED", now, now,
          ]
        );

        // Create review
        const rating = weightedRating();
        const comment = pick(COMMENTS);
        const reviewId = genId();
        await new Promise((r) => setTimeout(r, 2));

        // Review createdAt = a few days after booking date
        const reviewDate = new Date(bookingDate.getTime() + randomBetween(1, 7) * 86400000);

        await client.query(
          `INSERT INTO reviews (id, "bookingId", "listingId", "authorId", "hostId",
            rating, comment, "ratingAccuracy", "ratingCommunication", "ratingValue",
            "ratingSafety", "ratingCheckin", "ratingCleanliness", "createdAt", "updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
          [
            reviewId, bookingId, listing.id, guestId, listing.hostId,
            rating, comment,
            maybeCategoryRating(rating), maybeCategoryRating(rating), maybeCategoryRating(rating),
            maybeCategoryRating(rating), maybeCategoryRating(rating), maybeCategoryRating(rating),
            reviewDate.toISOString(), reviewDate.toISOString(),
          ]
        );

        totalReviews++;
      }
    }

    console.log(`seed-reviews: created ${totalReviews} reviews across ${listings.length} listings`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("seed-reviews error:", err);
  process.exit(1);
});
