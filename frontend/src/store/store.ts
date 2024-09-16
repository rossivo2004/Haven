// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cartSlice';
import recentlyViewedSlice from './recentlyViewedSlice';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    recentlyViewed: recentlyViewedSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
