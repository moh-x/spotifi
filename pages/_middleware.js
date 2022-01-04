import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
	// Token will exist if user is logged in
	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	const { pathname } = req.nextUrl;

	if (pathname.includes("/api/auth") || token) {
		// If the request is to get Auth data or has a valid token
		return NextResponse.next();
	}

	if (!token && pathname !== "/login") {
		// If there is no valid token on request to protected route
		// redirect to login
		return NextResponse.redirect("/login");
	}

	if (token && pathname === "/login") {
		// If there's a valid token bounce off login page to home
		return NextResponse.redirect("/");
	}
}
