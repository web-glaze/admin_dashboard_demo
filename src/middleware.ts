import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { IUser } from "./types/user";

// Role → allowed routes mapping
const roleRoutesMap: Record<string, string[]> = {
  admin: ["/dashboard"],
  partner: [
    "/dashboard/team/employee",
    "/dashboard/team/manager",
    "/dashboard/kra",
    "/dashboard/assignedKra",
    "/dashboard/profile",
    "/dashboard/daily-entry",
  ],
  user: [
    "/dashboard/assignedKra",
    "/dashboard/daily-entry",
    "/dashboard/profile",
  ],
  manager: [
    "/dashboard/team/employee",
    "/dashboard/assignedKra",
    "/dashboard/kra",
    "/dashboard/profile",
    "/dashboard/daily-entry",
  ],
};

// Prepare secret for jose
const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET!
);

// Verify JWT in edge runtime (using jose)
async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as IUser;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  if (pathname === "/") {
    return NextResponse.next();
  }
  // Redirect to home if no token
  if (!token && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const user = token ? await verifyJWT(token) : null;
  if (!user?.role) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // if (token && user && pathname === "/") {
  //   return NextResponse.redirect(new URL("/dashboard/profile", request.url));
  // }
  if (token && user && (pathname === "/" || pathname === "")) {
    return NextResponse.redirect(new URL("/dashboard/profile", request.url));
  }

  const allowedRoutes = roleRoutesMap[user.role] || [];
  // console.log(allowedRoutes, "allowed routes for user role", user.role);

  // Exact match or subpath match only for allowed routes
  const isAllowed = allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/dashboard/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
