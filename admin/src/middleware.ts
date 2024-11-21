import { NextResponse, NextRequest } from 'next/server';
import apiConfig from './configs/api';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token_admin');
  const url = req.nextUrl.clone();

  // Điều hướng "/" sang "/admin"
  if (url.pathname === '/') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Xử lý logic cho "/admin"
  if (url.pathname.startsWith('/admin')) {
    if (!token) {
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }

    try {
      const response = await fetch(apiConfig.users.getUserFromToken, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      const responseBody = await response.text();

      if (!response.ok) {
        console.error('Invalid token or API error:', response.status, responseBody);
        url.pathname = '/signin';
        return NextResponse.redirect(url);
      }

      try {
        const userData = JSON.parse(responseBody);
        const role = userData.role_id;

        if (role !== 2) {
          console.error('Unauthorized access attempt by role:', role);
          url.pathname = '/signin';
          return NextResponse.redirect(url);
        }
      } catch (error) {
        console.error('Failed to parse API response:', responseBody, error);
        url.pathname = '/signin';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Error fetching user data:', (error as Error).message);
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
  }

  // Xử lý logic cho "/signin"
  if (url.pathname === '/signin' && token) {
    try {
      const response = await fetch(apiConfig.users.getUserFromToken, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (response.ok) {
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Error validating token on /signin:', (error as Error).message);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/signin'],
};
