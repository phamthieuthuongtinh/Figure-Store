// src/components/ProductCard.jsx
import React from 'react';

function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
      <img
        src={product.imageUrl}
        alt={product.productName}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-semibold">{product.productName}</h3>
      <p className="text-red-600 font-bold mt-2">
        {product.productPrice.toLocaleString()} ₫
      </p>
    </div>
  );
}

export default ProductCard;
