import { NextResponse } from 'next/server';

export function redirectToSignin(reqUrl: string) {
  const url = new URL('/signin', reqUrl);
  return NextResponse.redirect(url);
}

export function redirectToAdmin(reqUrl: string) {
  const url = new URL('/admin', reqUrl);
  return NextResponse.redirect(url);
}
