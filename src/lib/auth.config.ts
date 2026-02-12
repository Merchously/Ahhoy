import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role || "GUEST";
        token.stripeConnectId = user.stripeConnectId;
      }

      // Allow session updates
      if (trigger === "update" && session) {
        token.role = session.role || token.role;
        token.stripeConnectId = session.stripeConnectId || token.stripeConnectId;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.stripeConnectId = token.stripeConnectId as string | null | undefined;
      return session;
    },
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
