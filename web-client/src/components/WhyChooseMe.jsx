import React from 'react';
import {
  FaBoxOpen,
  FaShippingFast,
  FaExchangeAlt,
  FaHeadset,
} from 'react-icons/fa';

const reasons = [
  {
    icon: <FaBoxOpen className="text-blue-500 text-4xl mb-3" />,
    text: 'Sản phẩm chính hãng 100%',
  },
  {
    icon: <FaShippingFast className="text-orange-500 text-4xl mb-3" />,
    text: 'Giao hàng nhanh toàn quốc',
  },
  {
    icon: <FaExchangeAlt className="text-purple-500 text-4xl mb-3" />,
    text: 'Đổi trả trong 7 ngày',
  },
  {
    icon: <FaHeadset className="text-teal-500 text-4xl mb-3" />,
    text: 'Hỗ trợ khách hàng 24/7',
  },
];

function WhyChooseUs() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Tại sao chọn ToyVerse?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {reasons.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 border rounded-lg shadow hover:shadow-lg transition duration-300"
            >
              {item.icon}
              <p className="text-lg font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUs;
