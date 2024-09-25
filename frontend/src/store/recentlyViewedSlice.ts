// store/recentlyViewedSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SingleProduct } from '../interface';

interface RecentlyViewedState {
  products: SingleProduct[];
}

const initialState: RecentlyViewedState = {
  products: [],
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<SingleProduct>) => {
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
