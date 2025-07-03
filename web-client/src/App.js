import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductsByCategory from './pages/ProductsByCategory';
import ProductDetail from './pages/ProductDetail';
import ScrollToTop from './components/ScrollToTop';
import CartPage from './pages/CartPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route
            path="/products/category/:categoryId"
            element={<ProductsByCategory />}
          />
          <Route
            path="/products/detail-product/:productId"
            element={<ProductDetail />}
          />
          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
