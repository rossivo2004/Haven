import { NextResponse, NextRequest } from 'next/server';
import { validateToken } from './middlewares/helpers/auth';
import { redirectToSignin, redirectToAdmin } from './middlewares/helpers/redirects';
import axios from 'axios';
import apiConfig from './configs/api';
import { isA } from './middlewares/helpers/auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token_admin');
  const url = req.nextUrl.clone();

    // Logic chuyển hướng
    if (url.pathname === '/') {
      // Nếu truy cập "/", điều hướng tới "/admin"
      return redirectToAdmin(req.url);
    }

  // Nếu không có token, đẩy user đến "/signin"
  if (!token) {
    if (url.pathname.startsWith('/admin')) {
      return redirectToSignin(req.url);
    }
    return NextResponse.next();
  }

  // Kiểm tra userData từ token
  // const userData = await isA(req);
  const userDataFromCookie = req.cookies.get('user_data_admin')?.value ? JSON.parse(req.cookies.get('user_data_admin')!.value) : null; // Get user data from cookie

  if (url.pathname.startsWith('/admin')) {
    if (userDataFromCookie && userDataFromCookie.role_id === 2) { // Check if role_id is 2
      return NextResponse.next(); // Allow access to /admin
    } else {
      return redirectToSignin(req.url); // Redirect to /signin if role_id is not 2
    }
  }

  if (url.pathname === '/signin') {
    if (token) {
      // Nếu user đã đăng nhập, chặn truy cập "/signin"
      return redirectToAdmin(req.url);
    }
    return NextResponse.next();
  }

  // Mặc định tiếp tục request
  return NextResponse.next();
}
