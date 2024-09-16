// store/recentlyViewedSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  quantity?: number;
  discount: number;
  images: string[];
  description?: string; // Added optional description field
  select?: boolean; // Added optional description field
  stock?: number; // Added optional
  
}

interface RecentlyViewedState {
  products: Product[];
}

const initialState: RecentlyViewedState = {
  products: [],
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      const productExists = state.products.find((p) => p.id === action.payload.id);

      if (!productExists) {
        if (state.products.length === 10) {
          state.products.pop(); // Xóa sản phẩm cũ nhất
        }
        state.products.unshift(action.payload); // Thêm sản phẩm mới lên đầu danh sách
      }
    },
  },
});

export const { addProduct } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
