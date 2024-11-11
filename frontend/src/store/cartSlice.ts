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
        deleteCart(state, action: PayloadAction<CartItem[]>) { // New action to delete the cart items
            state.items = []; // Clear the current items in the cart
        },
    },
});

export const { addToCart, updateCart, deleteCart } = cartSlice.actions; // Export the new action
export default cartSlice.reducer;