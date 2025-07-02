import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { AiOutlineHeart } from 'react-icons/ai';
import { Link } from 'react-router-dom';
dayjs.extend(duration);

const FlashSaleItem = ({ item }) => {
  const calculateRemainingSeconds = () => {
    const now = dayjs();
    const end = dayjs(item.endDate);
    return Math.max(0, end.diff(now, 'second'));
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateRemainingSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft(calculateRemainingSeconds());
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const dur = dayjs.duration(secondsLeft, 'seconds');
  const days = Math.floor(dur.asDays());
  const hours = dur.hours().toString().padStart(2, '0');
  const minutes = dur.minutes().toString().padStart(2, '0');
  const seconds = dur.seconds().toString().padStart(2, '0');
  const countdown =
    days > 0
      ? `${days} ngày ${hours}:${minutes}:${seconds}`
      : `${hours}:${minutes}:${seconds}`;

  return (
    <div className="bg-white p-4 border rounded shadow hover:shadow-lg transition">
      <img
        src={item.imageUrl}
        alt={item.productName}
        className="w-full h-60 object-cover rounded"
      />
      <h3 className="mt-2 font-semibold line-clamp-2">{item.productName}</h3>

      <div className="flex items-center justify-between mt-1">
        {/* Giá */}
        <div className="flex items-center space-x-2">
          <span className="text-red-600 font-bold text-lg">
            {item.discountedPrice?.toLocaleString()}₫
          </span>
          <span className="text-gray-500 line-through text-sm">
            {item.productPrice?.toLocaleString()}₫
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

      {/* Đếm ngược */}
      <div className="mt-1 text-sm text-orange-600 font-semibold min-h-[20px]">
        Còn lại: {countdown}
      </div>

      <Link to={`/products/detail-product/${item.productId}`}>
        <button className="w-full bg-red-500 text-white py-1.5 rounded hover:bg-red-600 transition">
          Mua ngay
        </button>
      </Link>
    </div>
  );
};

export default FlashSaleItem;
