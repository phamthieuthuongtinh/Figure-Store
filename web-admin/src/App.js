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
          <Route path="products" element={<ProductPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="brands" element={<BrandPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="orderdetails/:id" element={<OrderDetailPage />} />
          <Route path="coupons" element={<CouponPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
