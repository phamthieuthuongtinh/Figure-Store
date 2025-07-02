import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import ProductImageGallery from '../components/ProductImageGallery';

dayjs.extend(duration);

/**
 * Trang chi tiết sản phẩm – hiện dùng dữ liệu fake.
 * Khi backend sẵn sàng chỉ cần thay thế phần fetch thật.
 */

export default function ProductDetail() {
  const { productId } = useParams();

  /* ---------------------  FAKE DATA  --------------------- */
  const [product, setProduct] = useState({
    productId,
    productName: 'Gấu Bông Pikachu 30cm',
    productPrice: 300000,
    discountPercent: 20,
    discountedPrice: 240000,
    isOnSale: 1,
    endDate: dayjs().add(1, 'day').toISOString(),
    imageUrl: [
      'https://picsum.photos/id/237/800/800',
      'https://picsum.photos/id/238/800/800',
      'https://picsum.photos/id/239/800/800',
      'https://picsum.photos/id/240/800/800',
    ],
    description:
      'Gấu bông siêu dễ thương, chất bông mịn, an toàn tuyệt đối cho trẻ em.\n\n• Kích thước: 30cm.\n• Chất liệu: Bông PP cao cấp, vải nhung mềm.\n• Xuất xứ: Việt Nam.\n• Bảo hành: 12 tháng đường chỉ.\n',
    brandName: 'PikaToys',
    categoryName: 'Gấu bông',
    sku: 'PIKA-30-Y',
    stock: 42,
  });

  /* Sản phẩm liên quan FAKE */
  const [related, setRelated] = useState([
    {
      productId: 'r1',
      productName: 'Gấu Bông Eevee 25cm',
      productPrice: 250000,
      imageUrl: 'https://via.placeholder.com/300x300?text=Eevee',
      isOnSale: 0,
    },
    {
      productId: 'r2',
      productName: 'Gấu Bông Charmander 35cm',
      productPrice: 320000,
      discountPercent: 15,
      discountedPrice: 272000,
      isOnSale: 1,
      endDate: dayjs().add(3, 'day').toISOString(),
    },
    {
      productId: 'r3',
      productName: 'Gấu Bông Bulbasaur 28cm',
      productPrice: 280000,
      imageUrl: 'https://via.placeholder.com/300x300?text=Bulbasaur',
      isOnSale: 0,
    },
  ]);

  /* Cam kết và lưu ý FAKE */
  const commitments = [
    {
      title: '100% chính hãng',
      desc: 'Sản phẩm đầy đủ hoá đơn, tem VAT trực tiếp từ nhà sản xuất.',
    },
    {
      title: 'Đổi trả 7 ngày',
      desc: 'Hỗ trợ đổi trả miễn phí nếu có lỗi do NSX hoặc giao nhầm.',
    },
    {
      title: 'Giao hàng hỏa tốc',
      desc: 'Nội thành TP.HCM 2h, tỉnh thành 1–3 ngày.',
    },
  ];

  const notes = [
    'Giá trên chưa bao gồm phí vận chuyển (tính tại trang thanh toán).',
    'Sản phẩm cần giặt tay, tránh máy sấy nhiệt cao để giữ độ bền.',
    'Màu sắc có thể chênh lệch 5% do ánh sáng khi chụp.',
  ];

  /* ---------------------  COUNTDOWN  --------------------- */
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (product.isOnSale) {
      const calc = () =>
        Math.max(0, dayjs(product.endDate).diff(dayjs(), 'second'));
      setSecondsLeft(calc());

      const interval = setInterval(() => {
        setSecondsLeft(calc());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [product]);

  const dur = dayjs.duration(secondsLeft, 'seconds');
  const [mainImage, setMainImage] = useState(product.imageUrl[0]);
  const countdown =
    secondsLeft > 0
      ? `${Math.floor(dur.asDays())} ngày ${dur
          .hours()
          .toString()
          .padStart(2, '0')}:${dur.minutes().toString().padStart(2, '0')}:${dur
          .seconds()
          .toString()
          .padStart(2, '0')}`
      : 'Hết hạn';

  /* ---------------------  JSX  --------------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Ảnh */}
        <ProductImageGallery images={product.imageUrl} />

        {/* Thông tin */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
            <p className="text-gray-500 mb-3">
              Thương hiệu:{' '}
              <span className="font-medium">{product.brandName}</span> | Mã SP:{' '}
              <span className="font-medium">{product.sku}</span>
            </p>

            {/* Giá */}
            <div className="flex items-end space-x-3 mb-3">
              {product.isOnSale ? (
                <>
                  <span className="text-red-600 text-3xl font-bold">
                    {product.discountedPrice.toLocaleString()}₫
                  </span>
                  <span className="line-through text-gray-500 text-lg">
                    {product.productPrice.toLocaleString()}₫
                  </span>
                  <span className="bg-red-100 text-red-500 px-2 py-0.5 rounded text-sm">
                    -{product.discountPercent}%
                  </span>
                </>
              ) : (
                <span className="text-2xl text-gray-800 font-semibold">
                  {product.productPrice.toLocaleString()}₫
                </span>
              )}
            </div>

            {/* Đếm ngược */}
            {product.isOnSale && (
              <div className="mb-4 text-orange-600 font-medium">
                🔥 Ưu đãi còn lại: {countdown}
              </div>
            )}

            {/* Chọn số lượng */}
            <div className="flex items-center space-x-2 mb-6">
              <label htmlFor="qty" className="text-gray-700 font-medium">
                Số lượng:
              </label>
              <input
                id="qty"
                type="number"
                min="1"
                max={product.stock}
                defaultValue={1}
                className="w-20 border rounded p-2"
              />
              <span className="text-gray-500 text-sm">
                (Còn {product.stock} sản phẩm)
              </span>
            </div>

            <button className="bg-red-500 text-white px-8 py-3 rounded hover:bg-red-600 transition uppercase tracking-wide font-semibold">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
        {/* Cam kết */}
        <div className="bg-gray-50 p-4 rounded shadow-sm">
          <h2 className="font-semibold mb-3 text-lg">Cam kết bán hàng</h2>
          <ul className="space-y-2 list-disc ml-5 text-gray-700 text-sm">
            {commitments.map((c) => (
              <li key={c.title}>
                <span className="font-medium">{c.title}:</span> {c.desc}
              </li>
            ))}
          </ul>
          <h2 className="font-semibold mb-3 mt-3 text-lg">
            Lưu ý khi mua hàng
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mô tả chi tiết */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
        <pre
          className="whitespace-pre-wrap leading-relaxed text-gray-700 bg-gray-50 p-4 rounded"
          style={{ fontFamily: 'inherit' }}
        >
          {product.description}
        </pre>
      </div>

      {/* Sản phẩm liên quan */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((r) => (
            <Link
              key={r.productId}
              to={`/products/detail-product/${r.productId}`}
              className="block border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <img
                src={r.imageUrl}
                alt={r.productName}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h4 className="font-semibold mb-1 line-clamp-2 min-h-[40px]">
                {r.productName}
              </h4>
              {r.isOnSale ? (
                <>
                  <span className="text-red-600 font-bold mr-2">
                    {r.discountedPrice.toLocaleString()}₫
                  </span>
                  <span className="line-through text-sm text-gray-500">
                    {r.productPrice.toLocaleString()}₫
                  </span>
                </>
              ) : (
                <span className="text-gray-800 font-semibold">
                  {r.productPrice.toLocaleString()}₫
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
