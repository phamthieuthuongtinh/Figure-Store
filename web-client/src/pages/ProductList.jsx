// src/pages/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/ProductService';
import ProductCard from '../components/ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        if (res.data.code === 1) {
          setProducts(res.data.data);
        } else {
          console.error('Lấy sản phẩm thất bại');
        }
      })
      .catch(() => console.error('Lỗi kết nối tới server'));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Danh sách sản phẩm</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
