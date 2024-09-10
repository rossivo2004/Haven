import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface CartItem {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  quantity: number;
  images: string[];
  select: boolean;
}

interface CartState {
  items: CartItem[];
  selectedItems: number[];
  point: number;
}

const initialState: CartState = {
  items: [],
  selectedItems: [],
  point: 0,
};

const loadState = (): CartState | undefined => {
  try {
    const serializedState = Cookies.get('cart');
    if (serializedState) {
      const state = JSON.parse(serializedState) as CartState;
      return {
        ...state,
        items: state.items.map(item => ({
          ...item,
          select: item.select || false,
        })),
        selectedItems: state.selectedItems || [],
      };
    }
  } catch (err) {
    console.error('Could not load cart from cookies', err);
  }
  return undefined;
};

const saveState = (state: CartState) => {
  try {
    const serializedState = JSON.stringify(state);
    Cookies.set('cart', serializedState, { expires: 7 });
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
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveState(state);
    },

    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveState(state);
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        saveState(state);
      }
    },

    setSelectedItems: (state, action: PayloadAction<number[]>) => {
      state.selectedItems = action.payload;
      saveState(state);
    },

    setPoints: (state, action: PayloadAction<number>) => {
      state.point = action.payload;
      saveState(state);
    },

    toggleSelectItem: (state, action: PayloadAction<number>) => {
      const updatedItems = state.items.map(item =>
        item.id === action.payload ? { ...item, select: !item.select } : item
      );
      state.items = updatedItems;
      saveState(state);
    },

    selectAllItems: (state, action: PayloadAction<boolean>) => {
      const updatedItems = state.items.map(item => ({
        ...item,
        select: action.payload,
      }));
      state.items = updatedItems;
      saveState(state);
    },
  },
});

export const selectTotalItems = (state: { cart: CartState }) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};

export const { addItem, removeItem, toggleSelectItem, updateQuantity, setSelectedItems, setPoints, selectAllItems } = cartSlice.actions;
export default cartSlice.reducer;
