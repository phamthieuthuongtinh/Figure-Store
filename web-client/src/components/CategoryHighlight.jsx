// src/components/CategoryHighlight.jsx
import React from 'react';

const categories = [
  {
    name: 'Mô hình',
    image: 'https://cdn.tgdd.vn/Files/2020/07/17/1270575/mo-hinh-4.jpg',
  },
  {
    name: 'LEGO',
    image: 'https://cdn.tgdd.vn/Files/2021/06/21/1360739/lego-2.jpg',
  },
  {
    name: 'Gấu bông',
    image: 'https://cdn.tgdd.vn/Files/2021/03/22/1333881/gaubong.jpg',
  },
  {
    name: 'Đồ chơi giáo dục',
    image: 'https://cdn.tgdd.vn/Files/2021/03/22/1333881/giaoduc.jpg',
  },
  {
    name: 'Đồ chơi cao cấp',
    image: 'https://cdn.tgdd.vn/Files/2021/03/22/1333881/giaoduc.jpg',
  },
];

function CategoryHighlight() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Danh mục nổi bật
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((cate, index) => (
            <div key={index} className="text-center hover:scale-105 transition">
              <img
                src={cate.image}
                alt={cate.name}
                className="w-full h-60 object-cover rounded-lg shadow"
              />
              <h3 className="mt-2 text-lg font-medium">{cate.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryHighlight;
