// src/store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/src/interface';

type CartState = {
    items: CartItem[];
};

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<CartItem>) {
            state.items.push(action.payload);
        },
        updateCart(state, action: PayloadAction<CartItem[]>) { // New action to update the cart
            state.items = action.payload; // Replace the current items with the new items
        },
    },
});

export const { addToCart, updateCart } = cartSlice.actions; // Export the new action
export default cartSlice.reducer;