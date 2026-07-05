import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret should match NestJS JWT_SECRET
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-jwt-key-tesku'
);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('tesku_admin_token')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // Skip middleware for static files and api routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If no token and not on login page -> redirect to login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      // Verify token
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Must be ADMIN
      if (payload.role !== 'ADMIN') {
        throw new Error('Not an admin');
      }

      // If valid token and on login page -> redirect to dashboard
      if (isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      // Invalid token -> redirect to login (if not already there)
      const response = isLoginPage 
        ? NextResponse.next() 
        : NextResponse.redirect(new URL('/login', request.url));
        
      response.cookies.delete('tesku_admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
