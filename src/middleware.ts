import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use authConfig (Edge-compatible) instead of the full auth export
// which imports bcryptjs/prisma/pg that require Node.js crypto
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/profile",
    "/admin/:path*",
  ],
};
