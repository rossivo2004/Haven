'use client';

import { NextResponse, NextRequest } from 'next/server';

import apiConfig from './configs/api';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token_admin');
  const url = req.nextUrl.clone();

  // Nếu user truy cập "/" => Điều hướng sang "/admin"
  if (url.pathname === '/') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Logic kiểm tra cho "/admin"
  if (url.pathname.startsWith('/admin')) {
    if (!token) {
      // Nếu không có token, điều hướng tới "/signin"
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }

    try {
      // Xác thực token bằng API
      const response = await fetch(apiConfig.users.getUserFromToken, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`, // Đảm bảo token được truyền đúng
        },
      });

      // Nếu token không hợp lệ hoặc API trả lỗi
      if (response.status !== 200) {
        url.pathname = '/signin';
        alert('333')
        return NextResponse.redirect(url);
      }

      const userData = await response.json(); // Chuyển đổi response thành JSON
      const role = userData.role_id; // Trích xuất role từ API

      // Nếu user không phải là admin (role !== 2)
      if (role !== 2) {
        console.error('Unauthorized access attempt by role:', role); // Log để kiểm tra
        url.pathname = '/signin';
        alert('111')
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API thất bại
      console.error('Error fetching user data:', (error as Error).message);
      url.pathname = '/signin';
      alert('222')
      return NextResponse.redirect(url);
    }
  }

  // Logic kiểm tra cho "/signin"
  if (url.pathname === '/signin' && token) {
    try {
      // Nếu đã có token, xác thực token
      const response = await fetch(apiConfig.users.getUserFromToken, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      // Nếu user đã xác thực, điều hướng tới "/admin"
      if (response.status === 200) {
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Error validating token on /signin:', (error as Error).message);
      // Nếu token không hợp lệ, tiếp tục cho phép truy cập "/signin"
    }
  }

  // Mặc định cho phép tiếp tục xử lý request
  return NextResponse.next();
}
