// src/components/ProductCard.jsx
import React from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    // <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
    //   <img
    //     src={product.imageUrl}
    //     alt={product.productName}
    //     className="w-full h-48 object-cover rounded mb-4"
    //   />
    //   <h3 className="text-lg font-semibold">{product.productName}</h3>
    //   <p className="text-red-600 font-bold mt-2">
    //     {product.productPrice.toLocaleString()} ₫
    //   </p>
    // </div>
    <div className="bg-white p-4 border rounded shadow hover:shadow-lg transition">
      <img
        src={product.imageUrl}
        alt={product.productName}
        className="w-full h-60 object-cover rounded"
      />
      <h3 className="mt-2 font-semibold line-clamp-2">{product.productName}</h3>

      <div className="flex items-center justify-between mt-1">
        {/* Giá */}
        <div className="flex items-center space-x-2">
          <span className="text-red-600 font-bold text-lg">
            {product.productPrice?.toLocaleString()}₫
          </span>
        </div>

        {/* Nút yêu thích */}
        <button
          className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition"
          title="Thêm vào yêu thích"
        >
          <AiOutlineHeart size={20} />
        </button>
      </div>
      <div className="mt-1 text-sm text-orange-600 font-semibold min-h-[14px]"></div>
      <div className="mt-3">
        <Link to={`/products/detail-product/${product.productId}`}>
          <button className="w-full bg-red-500 text-white py-1.5 rounded hover:bg-red-600 transition">
            Mua ngay
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
