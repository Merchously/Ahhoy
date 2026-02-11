import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const activityTypes = [
  { name: "fishing", label: "Fishing Trip", slug: "fishing", iconName: "Fish", description: "Cast your line and enjoy a day of fishing on the water" },
  { name: "jet_ski", label: "Jet Ski Adventure", slug: "jet-ski", iconName: "Waves", description: "Thrilling jet ski rides and water adventures" },
  { name: "yacht_party", label: "Yacht Party", slug: "yacht-party", iconName: "PartyPopper", description: "Celebrate in style aboard a luxury yacht" },
  { name: "sunset_cruise", label: "Sunset Cruise", slug: "sunset-cruise", iconName: "Sunset", description: "Relax and watch the sunset from the water" },
  { name: "snorkeling_diving", label: "Snorkeling / Diving", slug: "snorkeling-diving", iconName: "Glasses", description: "Explore underwater worlds with snorkeling and diving" },
  { name: "wakeboarding", label: "Wakeboarding / Watersports", slug: "wakeboarding", iconName: "Zap", description: "High-energy watersports including wakeboarding and tubing" },
  { name: "boat_rental", label: "Boat Rental", slug: "boat-rental", iconName: "Ship", description: "Rent a boat and captain your own adventure" },
  { name: "custom", label: "Custom Experience", slug: "custom", iconName: "Sparkles", description: "Unique, custom water experiences tailored to you" },
];

async function main() {
  console.log("Seeding activity types...");

  for (const type of activityTypes) {
    await prisma.activityType.upsert({
      where: { slug: type.slug },
      update: type,
      create: type,
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
