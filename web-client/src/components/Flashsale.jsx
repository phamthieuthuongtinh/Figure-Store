// src/components/FlashSale.jsx
import React from 'react';

const flashProducts = [
  {
    id: 1,
    name: 'Mô hình One Piece Luffy',
    image: 'https://cdn.tgdd.vn/Files/2020/07/17/1270575/mo-hinh-4.jpg',
    price: 1200000,
    oldPrice: 1450000,
  },
  {
    id: 2,
    name: 'LEGO Speed Champions',
    image: 'https://cdn.tgdd.vn/Files/2021/06/21/1360739/lego-2.jpg',
    price: 890000,
    oldPrice: 1090000,
  },
  {
    id: 3,
    name: 'Gấu bông Totoro cực đáng yêu',
    image: 'https://cdn.tgdd.vn/Files/2021/03/22/1333881/gaubong.jpg',
    price: 150000,
    oldPrice: 190000,
  },
  {
    id: 3,
    name: 'Gấu bông Totoro cực đáng yêu',
    image: 'https://cdn.tgdd.vn/Files/2021/03/22/1333881/gaubong.jpg',
    price: 150000,
    oldPrice: 190000,
  },
];

function FlashSale() {
  return (
    <div className="bg-red-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
          ⚡Khuyến mãi sốc - Flash Sale!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {flashProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 border rounded shadow hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold line-clamp-2">{item.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-red-600 font-bold text-lg">
                  {item.price.toLocaleString()}₫
                </span>
                <span className="text-gray-500 line-through text-sm">
                  {item.oldPrice.toLocaleString()}₫
                </span>
              </div>
              <button className="mt-3 w-full bg-red-500 text-white py-1.5 rounded hover:bg-red-600 transition">
                Mua ngay
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FlashSale;
