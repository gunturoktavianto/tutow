import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can be added here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard and learning routes
        if (
          req.nextUrl.pathname.startsWith("/dashboard") ||
          req.nextUrl.pathname.startsWith("/learning") ||
          req.nextUrl.pathname.startsWith("/exercise") ||
          req.nextUrl.pathname.startsWith("/games")
        ) {
          return !!token;
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
  ],
};
