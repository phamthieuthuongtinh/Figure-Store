import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlashSaleProducts } from '../slices/productSaleSlice';
import FlashSaleItem from './FlashSaleItem';

function FlashSale() {
  const dispatch = useDispatch();
  const { items: sales, loading, error } = useSelector((s) => s.sales);

  useEffect(() => {
    dispatch(fetchFlashSaleProducts());
  }, [dispatch]);

  return (
    <div className="bg-red-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
          ⚡ Khuyến mãi sốc – Flash Sale!
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">
            Đang tải sản phẩm giảm giá…
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : sales.length === 0 ? (
          <p className="text-center text-gray-500">
            Hiện chưa có sản phẩm khuyến mãi.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {sales.map((item) => (
              <FlashSaleItem key={item.saleId} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FlashSale;
