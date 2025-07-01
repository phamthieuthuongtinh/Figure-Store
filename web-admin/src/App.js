import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import BrandPage from './pages/BrandPage';
import LoginPage from './pages/LoginPage';
import RequireAuth from './components/Auth/RequireAuth';
import OrderPage from './pages/OrderPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CouponPage from './pages/CouponPage';
import UserPage from './pages/UserPage';
import SalePage from './pages/SalePage';
import BannerPage from './pages/BannerPage';
function App() {
  return (
    <Router>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Bảo vệ admin layout */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<h2>Chào mừng đến trang admin!</h2>} />
          <Route path="users" element={<UserPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="brands" element={<BrandPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="orderdetails/:id" element={<OrderDetailPage />} />
          <Route path="coupons" element={<CouponPage />} />
          <Route path="sales" element={<SalePage />} />
          <Route path="banners" element={<BannerPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
