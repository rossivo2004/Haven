import { NextResponse, NextRequest } from 'next/server';
import { validateToken } from './middlewares/helpers/auth';
import { redirectToSignin, redirectToAdmin } from './middlewares/helpers/redirects';
import axios from 'axios';
import apiConfig from './configs/api';
import { isA } from './middlewares/helpers/auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token_admin');
  const url = req.nextUrl.clone();

  const userData = await isA(req);
  // Nếu không có token, đẩy user đến "/signin"
  if (!token) {
    if (url.pathname.startsWith('/admin')) {
      return redirectToSignin(req.url);
    }
    return NextResponse.next();
  }

  // Kiểm tra userData từ token

  // Logic chuyển hướng
  if (url.pathname === '/') {
    // Nếu truy cập "/", điều hướng tới "/admin"
    return redirectToAdmin(req.url);
  }

  if (url.pathname.startsWith('/admin')) {
    if (!userData) {
      // Nếu không có userData, chuyển hướng tới "/signin"
      return redirectToSignin(req.url);
    }
    return NextResponse.next();
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
