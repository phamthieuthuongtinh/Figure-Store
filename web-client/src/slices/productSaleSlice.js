import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFlashSaleProducts } from '../services/ProductService';

export const fetchFlashSaleProducts = createAsyncThunk(
  'flashSale/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await getFlashSaleProducts();
      return res.data?.data || res.data; // hỗ trợ cả 2 kiểu response
    } catch (err) {
      return thunkAPI.rejectWithValue('Lỗi tải Flash‑Sale');
    }
  }
);

const flashSaleSlice = createSlice({
  name: 'flashSale',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) =>
    b
      .addCase(fetchFlashSaleProducts.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchFlashSaleProducts.fulfilled, (s, a) => {
        s.items = a.payload;
        s.loading = false;
      })
      .addCase(fetchFlashSaleProducts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      }),
});

export default flashSaleSlice.reducer;
