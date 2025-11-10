import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/", "/about", "/features", "/pricing"]
const authRoutes = ["/setup-profile"]
const protectedRoutes = ["/app", "/profile", "/portfolio", "/discover", "/trade", "/trader"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)"],
}
