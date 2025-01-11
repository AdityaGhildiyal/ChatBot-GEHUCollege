import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Import getToken for JWT-based auth checks
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Public paths (i.e., login/signup)
  const publicPaths = ['/login', '/signup'];

  // If the request URL is a public path, skip the middleware
  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next(); // Allow access to public pages
  }

  // Get the JWT token from the request
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If no token (not authenticated), redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); // Allow access to protected routes
}

export const config = {
  matcher: ['/protected/:path*', '/dashboard/:path*'], // Apply middleware to protected routes
};
