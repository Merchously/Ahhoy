import { z } from "zod/v4";

export const createBookingSchema = z.object({
  listingId: z.string().min(1),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  guestCount: z.number().int().min(1, "At least 1 guest is required"),
  messageToHost: z.string().max(500).optional(),
});

export const updateBookingSchema = z.object({
  status: z.enum([
    "CONFIRMED",
    "CANCELLED_GUEST",
    "CANCELLED_HOST",
    "COMPLETED",
  ]),
  hostNotes: z.string().max(500).optional(),
  cancellationReason: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
