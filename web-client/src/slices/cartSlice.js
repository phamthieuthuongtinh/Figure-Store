import { createSlice } from '@reduxjs/toolkit';
import {
  addCartItem,
  updateCartItem,
  eleteCartItem,
} from '../services/CartService';
import { toast } from 'react-toastify';

// đọc localStorage lúc khởi tạo
const stored = localStorage.getItem('cart');
const initialState = {
  items: stored ? JSON.parse(stored) : [],
  totalQty: stored
    ? JSON.parse(stored).reduce((sum, it) => sum + it.quantity, 0)
    : 0,
};
const updateTotalQty = (items) =>
  items.reduce((sum, it) => sum + it.quantity, 0);
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, { payload }) => {
      const { productId, quantity } = payload;
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push(payload); // payload là toàn bộ sản phẩm
      }
      state.totalQty = updateTotalQty(state.items);
    },

    removeItem: (state, { payload }) => {
      state.items = state.items.filter((i) => i.productId !== payload);
      state.totalQty = updateTotalQty(state.items);
    },

    updateQty: (state, { payload }) => {
      const { productId, quantity } = payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
      state.totalQty = updateTotalQty(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQty = 0;
    },

    setCartItems: (state, { payload }) => {
      state.items = payload;
      state.totalQty = updateTotalQty(payload);
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart, setCartItems } =
  cartSlice.actions;
export default cartSlice.reducer;
