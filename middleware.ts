import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token');
  const url = req.nextUrl.pathname;

  if (url.startsWith('/_next/') || url.startsWith('/favicon.ico') || url.startsWith('/public/')) {
    return NextResponse.next();
  }

  if (!token && url !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && url === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'], 
};