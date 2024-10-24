  // store/store.ts
  import { configureStore } from '@reduxjs/toolkit';
  import cartSlice from './cartSlice';
  import recentlyViewedSlice from './recentlyViewedSlice';
  import userSlice from './userSlice';

  export const store = configureStore({
    reducer: {
      cart: cartSlice,
      recentlyViewed: recentlyViewedSlice,
      user: userSlice,
    },
  });

  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
