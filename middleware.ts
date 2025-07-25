import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // If user is logged in and tries to access login or register, redirect to dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Additional middleware logic can be added here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Protect dashboard and learning routes
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/learning") ||
          pathname.startsWith("/exercise") ||
          pathname.startsWith("/games") ||
          pathname.startsWith("/garden") ||
          pathname.startsWith("/profile")
        ) {
          return !!token;
        }

        // Allow access to login/register pages (redirect logic is handled in middleware function above)
        if (pathname === "/login" || pathname === "/register") {
          return true;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/learning/:path*",
    "/exercise/:path*",
    "/games/:path*",
    "/garden/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
