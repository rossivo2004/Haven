import { useDispatch, useSelector } from 'react-redux';
import { CartItem } from '@/src/interface';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const cart = useSelector((state: { cart: { items: CartItem[] } }) => state.cart.items);

    if (cart.length === 0) {
        return NextResponse.redirect(new URL('/cart', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/checkout',
};