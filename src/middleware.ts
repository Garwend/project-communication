import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    const isAuth = await getToken({ req });

    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/verify-request")
    ) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } else if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/login",
    "/verify-request",
    "/profile",
    "/projects/:path*",
    "/tasks/:path*",
  ],
};
