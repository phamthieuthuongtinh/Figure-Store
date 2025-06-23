import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/ProductService';
import { useNavigate } from 'react-router-dom';

function ProductHighlight() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        if (res.data.code === 1) {
          setProducts(res.data.data.slice(0, 5)); // chỉ lấy 5 sản phẩm đầu
        }
      })
      .catch(() => console.log('Lỗi khi tải sản phẩm'));
  }, []);

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.map((item) => (
            <div
              key={item.productId}
              className="border rounded shadow p-4 hover:shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-full h-60 object-cover rounded"
              />
              <h3 className="font-semibold mt-2 line-clamp-2">
                {item.productName}
              </h3>
              <p className="text-red-600 font-bold mt-1">
                {Number(item.productPrice).toLocaleString()} ₫
              </p>
            </div>
          ))}
        </div>

        {/* Nút Xem thêm */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate('/products')}
            className="text-orange-600 font-semibold text-base hover:underline"
          >
            Xem thêm →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductHighlight;
