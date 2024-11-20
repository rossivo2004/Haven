'use client';

import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';

import apiConfig from './configs/api';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token_admin');
  const url = req.nextUrl.clone();

  // Redirect to "/admin" if accessing root
  if (url.pathname === '/') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Logic for "/admin" access
  if (url.pathname.startsWith('/admin')) {
    if (!token) {
      // Redirect to "/signin" if no token
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }

    try {
      console.log('Calling API to validate token with URL:', apiConfig.users.getUserFromToken);
      const response = await axios.get(apiConfig.users.getUserFromToken, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      console.log('API response status:', response.status);

      // Check if token is valid
      if (response.status !== 200) {
        url.pathname = '/signin';
        return NextResponse.redirect(url);
      }

      const userData = response.data;
      const role = userData.role_id;

      // Check user role
      if (role !== 2) {
        console.error('Unauthorized access attempt by role:', role);
        url.pathname = '/signin';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Error fetching user data:', (error as Error).message);
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
  }

  // Logic for "/signin" access
  if (url.pathname === '/signin' && token) {
    try {
      // Validate token if already signed in
      const response = await axios.get(apiConfig.users.getUserFromToken, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      // Redirect to "/admin" if user is authenticated
      if (response.status === 200) {
        // Call the API to get user profile data
        const userProfileResponse = await axios.get(apiConfig.users.getUserFromToken, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        console.log('User profile data:', userProfileResponse.data);
        
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    } catch (error) {
      console.error('Error validating token on /signin:', (error as Error).message);
      // Allow access to "/signin" if token is invalid
    }
  }

  // Default to continue processing the request
  return NextResponse.next();
}
