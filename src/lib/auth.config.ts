import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Admin routes
      if (pathname.startsWith("/admin")) {
        // Admin login page is accessible to anyone
        if (pathname === "/admin/login") return true;
        // All other admin routes require ADMIN role
        if (!isLoggedIn || auth?.user?.role !== "ADMIN") {
          return Response.redirect(new URL("/admin/login", nextUrl));
        }
        return true;
      }

      // Regular protected routes
      const protectedPaths = ["/dashboard", "/bookings", "/profile"];
      const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        return false;
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
