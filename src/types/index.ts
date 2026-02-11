import type {
  Listing,
  ListingPhoto,
  ActivityType,
  User,
  Booking,
  Review,
  AvailabilityRule,
  BlockedDate,
} from "@/generated/prisma";

export type ListingWithRelations = Listing & {
  photos: ListingPhoto[];
  activityTypes: { activityType: ActivityType }[];
  host: Pick<User, "id" | "firstName" | "lastName" | "avatarUrl">;
  reviews: Pick<Review, "rating">[];
  _count?: { bookings: number };
};

export type ListingCardData = {
  id: string;
  title: string;
  slug: string;
  locationName: string;
  pricePerPerson: number | null;
  flatPrice: number | null;
  pricingType: string;
  currency: string;
  maxGuests: number;
  durationMinutes: number;
  primaryPhoto: string | null;
  activityTypes: string[];
  averageRating: number | null;
  reviewCount: number;
  host: {
    id: string;
    firstName: string;
    avatarUrl: string | null;
  };
};

export type BookingWithRelations = Booking & {
  listing: Listing & {
    photos: ListingPhoto[];
    host: Pick<User, "id" | "firstName" | "lastName" | "avatarUrl">;
  };
  guest: Pick<User, "id" | "firstName" | "lastName" | "avatarUrl" | "email">;
  review?: Review | null;
};

export type SearchParams = {
  q?: string;
  location?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  activityType?: string[];
  minPrice?: number;
  maxPrice?: number;
  date?: string;
  guests?: number;
  sort?: string;
  page?: number;
  limit?: number;
};

export type SearchResults = {
  results: ListingCardData[];
  total: number;
  page: number;
  totalPages: number;
};
