export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/profile",
    "/admin/:path*",
  ],
};
