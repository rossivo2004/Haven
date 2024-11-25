import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest

export default function middleware(request: NextRequest) {
  const userId = request.cookies.get('access_token'); // Get user_id cookie
  const checkoutData = request.cookies.get('checkout_data'); // Get checkout_data cookie
  const userFor = request.cookies.get('user'); // Get checkout_data cookie
  const otp_code = request.cookies.get('otp_code'); // Get checkout_data cookie
  const userDataCode = request.cookies.get('userDataCode'); // Get userDataCode cookie
  // Check if user_id exists and if the request is for login or register
  if (userId && (request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/forgotpassword' || request.nextUrl.pathname === '/resetpassword' || request.nextUrl.pathname === '/verify')) {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to home
  }

  // Check if user_id does not exist and if the request is for profile
  if (!userId && (request.nextUrl.pathname === '/profile' || request.nextUrl.pathname === '/profile/account' || request.nextUrl.pathname === '/profile/order' || request.nextUrl.pathname === '/profile/favourite')) {
    return NextResponse.redirect(new URL('/signin', request.url)); // Redirect to signin
  }

  if (!userFor && (request.nextUrl.pathname === '/resetpassword'  )) {
    return NextResponse.redirect(new URL('/signin', request.url)); // Redirect to signin
  }

  if (!otp_code && (request.nextUrl.pathname === '/verify'  )) {
    return NextResponse.redirect(new URL('/signin', request.url)); // Redirect to signin
  }

  if (!userDataCode && (request.nextUrl.pathname === '/verifysignup')) {
    return NextResponse.redirect(new URL('/signup', request.url)); // Redirect to signin
  }

  // Check if checkout_data is missing or empty and block access to /checkout
  const checkoutDataValue = checkoutData ? checkoutData.value : ''; // Get the value of checkout_data cookie
  if (!checkoutDataValue) {
    if (request.nextUrl.pathname === '/checkout') {
      return NextResponse.redirect(new URL('/', request.url)); // Redirect to home or another page
    }
  }

  return NextResponse.next();
}