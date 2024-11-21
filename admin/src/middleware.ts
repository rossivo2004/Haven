import { NextResponse, NextRequest } from 'next/server';
import { validateToken } from './middlewares/helpers/auth';
import { redirectToSignin, redirectToAdmin } from './middlewares/helpers/redirects';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token_admin');
  const url = req.nextUrl.clone();

  // Nếu user truy cập "/" => Điều hướng sang "/admin"
  if (url.pathname === '/') {
    return redirectToAdmin(req.url);
  }

  // Logic kiểm tra cho "/admin"
  if (url.pathname.startsWith('/admin')) {
    if (!token) {
      // Nếu không có token, điều hướng tới "/signin"
      return redirectToSignin(req.url);
    }

    const userData = await validateToken(token.value);
    if (!userData || userData.role_id !== 2) {
      // Nếu token không hợp lệ hoặc user không phải admin
      return redirectToSignin(req.url);
    }
  }

  // Logic kiểm tra cho "/signin"
  if (url.pathname === '/signin' && token) {
    const userData = await validateToken(token.value);
    if (userData) {
      // Nếu token hợp lệ, điều hướng tới "/admin"
      return redirectToAdmin(req.url);
    }
  }

  // Mặc định cho phép tiếp tục xử lý request
  return NextResponse.next();
}
