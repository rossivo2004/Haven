// middleware.js
'use client'

import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';

import apiConfig from './configs/api';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token_admin');
  const url = req.nextUrl.clone();
  let role = 1; // Changed from useState to a simple variable


  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (url.pathname.startsWith('/admin')) {
    
    if (!token) {
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }

    

    try {
      const response = await axios.get(apiConfig.users.getUserFromToken, {
        headers: {
          Authorization: `Bearer ${token.value}`, // Ensure token is used correctly
        },
      });

      if (response.status !== 200) {
        url.pathname = '/signin';
        return NextResponse.redirect(url);
      }

      const userData = response.data;
      role = userData.role_id; // Set role directly
      console.error('User role:', role); // Log the user role for debugging
      

      if (role !== 2) {
        url.pathname = '/signin'; // Điều hướng tới trang không có quyền truy cập
        return NextResponse.redirect(url);
      }



    } catch (error) {
      console.error('Error fetching user data:', error); // Thêm log để kiểm tra lỗi
      // Xử lý khi gọi API bị lỗi hoặc token không hợp lệ
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname === '/signin' && token) {
    url.pathname = '/admin'; // Redirect to admin if already authenticated
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}