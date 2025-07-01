import { configureStore } from '@reduxjs/toolkit';
import bannersReducer from '../slices/bannersSlice';
import productSaleReducer from '../slices/productSaleSlice';
const store = configureStore({
  reducer: {
    banners: bannersReducer,
    sales: productSaleReducer,
  },
});

export default store;
