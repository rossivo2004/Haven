import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const cartCookie = request.cookies.get('cart')?.value;

    let cart = [];
    if (cartCookie) {
        try {
            cart = JSON.parse(cartCookie);
        } catch (error) {
            console.error('Error parsing cart cookie:', error);
            return NextResponse.redirect(new URL('/cart', request.url));
        }
    }

    // Redirect if the cart is empty or does not exist
    if (cart.length === 0) {
        return NextResponse.redirect(new URL('/cart', request.url));
    }

    // Allow request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: '/checkout',
};
