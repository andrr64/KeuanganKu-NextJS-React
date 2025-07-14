import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;

  const authRoutes = ['/auth/login', '/auth/register'];

  if (authRoutes.includes(request.nextUrl.pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/app', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/app')) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

// HARUS hardcoded seperti ini
export const config = {
  matcher: ['/auth/login', '/auth/register', '/app/:path*'],
};
