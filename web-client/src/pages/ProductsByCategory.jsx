import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductByCategoryId } from '../services/ProductService';
import ProductDisplay from '../components/ProductDisplay';

const priceRanges = [
  { label: 'Tất cả', value: '' },
  { label: 'Dưới 200k', value: '0-200000' },
  { label: '200k - 500k', value: '200000-500000' },
  { label: '500k - 1 triệu', value: '500000-1000000' },
  { label: 'Trên 1 triệu', value: '1000000-' },
];

export default function ProductsByCategory() {
  const { categoryId } = useParams();
  const [sortOption, setSortOption] = useState('');
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');

  const fetchProducts = async () => {
    const res = await getProductByCategoryId(categoryId);
    setProducts(res.data.data);
  };

  /** Lấy danh sách thương hiệu theo category (1 lần) */
  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  //   /** Fetch sản phẩm mỗi khi categoryId / filter thay đổi */
  //   useEffect(() => {
  //     fetchProducts();
  //   }, [categoryId, brand, price]);
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.productName.localeCompare(b.productName);
      case 'name-desc':
        return b.productName.localeCompare(a.productName);
      case 'price-asc':
        return a.productPrice - b.productPrice;
      case 'price-desc':
        return b.productPrice - a.productPrice;
      default:
        return 0;
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Bộ lọc (1/3) */}
        <aside className="col-span-1">
          <div className="border rounded p-4 shadow">
            <h3 className="font-semibold text-lg mb-4">Bộ lọc</h3>

            {/* Thương hiệu */}
            <div className="mb-5">
              <h4 className="font-medium mb-2">Thương hiệu</h4>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Tất cả</option>
                {brands.map((b) => (
                  <option key={b.brandId} value={b.brandId}>
                    {b.brandName}
                  </option>
                ))}
              </select>
            </div>

            {/* Giá */}
            <div>
              <h4 className="font-medium mb-2">Khoảng giá</h4>
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded p-2"
              >
                {priceRanges.map((pr) => (
                  <option key={pr.label} value={pr.value}>
                    {pr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Danh sách sản phẩm (2/3) */}
        <section className="md:col-span-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold mb-4">Sản phẩm</h2>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">-- Sắp xếp --</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>

          {products.length === 0 ? (
            <p>Không có sản phẩm phù hợp.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {sortedProducts.map((product) => (
                <ProductDisplay key={product.productId} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
