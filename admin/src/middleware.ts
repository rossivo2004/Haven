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
  const userData = await isA(req);



  if (url.pathname.startsWith('/admin')) {

    try {
      const response = await axios.get(apiConfig.users.getUserFromToken, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Check if role_id is 2 and return true
      if (response.data.role_id === 2) {
        return true; // Return true if role_id is 2
      }
  
      return null; // Role không hợp lệ
    } catch (error) {
      console.error('Error validating token:', (error as Error).message);
      return redirectToSignin(req.url);
    }

    // if (!userData) {
    //   // Nếu không có userData, chuyển hướng tới "/signin"
    //   return redirectToSignin(req.url);
    // }
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
