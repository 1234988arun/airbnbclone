import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = req.nextUrl;//➡️ User kaunsi URL/page khol raha hai, woh nikal raha hai.


  const isAuthPage = pathname === "/login" || pathname === "/signup";//➡️ Check: kya user login/signup page par hai?
  
    if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:slug",          
    "/listingpage1",
    "/listingpage2",
    "/listingpage3",
    "/mylisting",
    "/my-booking",
    "/login",
    "/signup",
    "/booked",
    "/booking",
    "/listing",
    "/listing/:slug*",
  ],
};

