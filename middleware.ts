import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
 const token = await getToken({
  req: request,
  secret: process.env.NEXTAUTH_SECRET,
 });

 const PUBLIC_PATHS = ["/login", "/register", "/events", "/"];
 const isPublicPath = PUBLIC_PATHS.includes(request.nextUrl.pathname);

 if (token && isPublicPath) {
  return NextResponse.redirect(new URL("/dashboard", request.url));
 }

 if (!token && !isPublicPath) {
  return NextResponse.redirect(new URL("/", request.url));
 }

 return NextResponse.next();
}

export const config = {
 matcher: ["/dashboard/:path*", "/login", "/register", "/"],
};
