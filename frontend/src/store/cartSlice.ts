// src/store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ItemCart } from '@/src/interface';

type CartState = {
    items: ItemCart[];
};

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<ItemCart>) {
            state.items.push(action.payload);
        },
        updateCart(state, action: PayloadAction<ItemCart[]>) { // New action to update the cart
            state.items = action.payload; // Replace the current items with the new items
        },
    },
});

export const { addToCart, updateCart } = cartSlice.actions; // Export the new action
export default cartSlice.reducer;