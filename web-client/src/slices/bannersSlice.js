import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllBanners } from '../services/BannerService';

export const fetchBanners = createAsyncThunk(
  'banners/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await getAllBanners();
      return res.data?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Lỗi khi tải banner'
      );
    }
  }
);

const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;
