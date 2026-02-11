import { z } from "zod/v4";

export const basicInfoSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  activityTypeIds: z.array(z.string()).min(1, "Select at least one activity type"),
});

export const locationSchema = z.object({
  locationName: z.string().min(1, "Location is required"),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().default("US"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const boatDetailsSchema = z.object({
  boatName: z.string().optional(),
  boatType: z.string().optional(),
  boatLength: z.number().int().positive().optional(),
  boatCapacity: z.number().int().positive().optional(),
  boatYear: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  boatManufacturer: z.string().optional(),
});

export const pricingSchema = z.object({
  pricingType: z.enum(["PER_PERSON", "FLAT_RATE"]),
  pricePerPerson: z.number().positive().optional(),
  flatPrice: z.number().positive().optional(),
  currency: z.string().default("USD"),
  minGuests: z.number().int().min(1).default(1),
  maxGuests: z.number().int().min(1),
  durationMinutes: z.number().int().min(30, "Duration must be at least 30 minutes"),
  includedItems: z.array(z.string()).default([]),
  notIncludedItems: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  cancellationPolicy: z.enum(["FLEXIBLE", "MODERATE", "STRICT"]).default("MODERATE"),
  instantBook: z.boolean().default(false),
});

export const createListingSchema = basicInfoSchema
  .merge(locationSchema)
  .merge(boatDetailsSchema)
  .merge(pricingSchema);

export type CreateListingInput = z.infer<typeof createListingSchema>;
