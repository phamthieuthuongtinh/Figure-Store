import { configureStore } from '@reduxjs/toolkit';
import bannersReducer from '../slices/bannersSlice';
import productSaleReducer from '../slices/productSaleSlice';
import cartReducer from '../slices/cartSlice';
import authReducer from '../slices/authSlice';
const store = configureStore({
  reducer: {
    banners: bannersReducer,
    sales: productSaleReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});
// persist cart to localStorage mỗi khi thay đổi
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('cart', JSON.stringify(state.cart.items));
});
export default store;
