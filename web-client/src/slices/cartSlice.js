import { createSlice } from '@reduxjs/toolkit';

// đọc localStorage lúc khởi tạo
const stored = localStorage.getItem('cart');
const initialState = {
  items: stored ? JSON.parse(stored) : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, { payload }) => {
      // payload = { product, quantity }
      const { product, quantity } = payload;
      const existing = state.items.find(
        (i) => i.productId === product.productId
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
    },
    removeItem: (state, { payload }) => {
      state.items = state.items.filter((i) => i.productId !== payload);
    },
    updateQty: (state, { payload }) => {
      const { productId, quantity } = payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
