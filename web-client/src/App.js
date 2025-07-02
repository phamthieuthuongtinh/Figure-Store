import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductsByCategory from './pages/ProductsByCategory';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Router>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
