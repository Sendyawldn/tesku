import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret should match NestJS JWT_SECRET
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-jwt-key-tesku'
);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('tesku_user_token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard');

  if (isAuthPage && token) {
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (e) {
      // Invalid token, allow access to auth pages
    }
  }

  if (isProtectedPage) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, SECRET);
      // Validate role
      if (payload.role !== 'USER') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (e) {
      // Invalid or expired token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
