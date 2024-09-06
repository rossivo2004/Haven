// store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

interface CartState {
  items: CartItem[];
  selectedItems: number[];

}

const initialState: CartState = {
  items: [],
  selectedItems: [],
};

const loadState = (): CartState | undefined => {
  try {
    const serializedState = Cookies.get('cart');
    if (serializedState) {
      return JSON.parse(serializedState);
    }
  } catch (err) {
    console.error('Could not load cart from cookies', err);
  }
  return undefined;
};

// Save the state to cookies
const saveState = (state: CartState) => {
  try {
    const serializedState = JSON.stringify(state);
    Cookies.set('cart', serializedState, { expires: 7 }); // Save cart for 7 days
  } catch (err) {
    console.error('Could not save cart to cookies', err);
  }
};


const cartSlice = createSlice({
  name: 'cart',
  initialState: loadState() || initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        // If the item already exists, increment the quantity
        existingItem.quantity += action.payload.quantity;
      } else {
        // If the item doesn't exist, add it to the cart
        state.items.push(action.payload);
      }
      saveState(state); // Save cart to cookies after adding an item
    },
    
    
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveState(state); // Save cart to cookies after removing an item
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        saveState(state); // Save cart to cookies after updating quantity
      }
    },

    setSelectedItems: (state, action: PayloadAction<number[]>) => {
      state.selectedItems = action.payload;
    },
  },
});

export const selectTotalItems = (state: { cart: CartState }) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};


export const { addItem, removeItem, updateQuantity, setSelectedItems } = cartSlice.actions;
export default cartSlice.reducer;
