// import createMiddleware from 'next-intl/middleware';
// import {routing} from './i18n/routing';
 
// export default createMiddleware(routing);
 
// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(vi|en)/:path*']
// };

// ... existing code ...
// ... existing code ...
import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest

export default function middleware(request: NextRequest) {
  return NextResponse.next();
}
// ... existing code ...