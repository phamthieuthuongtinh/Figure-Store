import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import ProductImageGallery from '../components/ProductImageGallery';
import { getProductById } from '../services/ProductService';
import ProductCommitments from '../components/ProductCommitments';

import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../slices/cartSlice';
import { addCartItem } from '../services/CartService';
import { toast } from 'react-toastify';

dayjs.extend(duration);

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await getProductById(productId);
        const data = res.data.data;
        /* --- Chuẩn hóa images thành string[] --- */
        let imgs = data.images;
        // TH1: images là chuỗi JSON → parse
        if (typeof imgs === 'string') {
          try {
            imgs = JSON.parse(imgs);
          } catch {
            imgs = [];
          }
        }
        // TH2: imgs có string + object → rút ra URL thuần
        const imageArray = Array.isArray(imgs)
          ? imgs.map((img) => (typeof img === 'string' ? img : img.imageUrl))
          : [];
        if (data.imageUrl && !imageArray.includes(data.imageUrl)) {
          imageArray.unshift(data.imageUrl);
        }
        data.images = imageArray;
        setProduct(data); // dùng data đã xử lý
        setError(null);
      } catch (err) {
        console.error('Lỗi lấy sản phẩm:', err);
        setError('Không thể tải sản phẩm.');
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);
  const [mainImage, setMainImage] = useState(null);
  useEffect(() => {
    if (product?.images?.length) {
      setMainImage(product.images[0]); // ảnh đầu tiên
    }
  }, [product]);

  const [secondsLeft, setSecondsLeft] = useState(0);
  useEffect(() => {
    if (!product?.discountedPrice) return;
    const calc = () =>
      Math.max(0, dayjs(product.endDate).diff(dayjs(), 'second'));
    setSecondsLeft(calc());
    const id = setInterval(() => setSecondsLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [product]);

  const dur = dayjs.duration(secondsLeft, 'second');
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

  //Add giỏ hàng
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const handleAddToCart = async () => {
    const qty = parseInt(document.getElementById('qty').value, 10) || 1;

    if (user) {
      try {
        const res = await addCartItem({
          productId: product.productId,
          quantity: qty,
        });

        // serverItem phải lấy đúng key (code/message/data)
        const serverItem = res.data.data;
        // console.log(serverItem);
        dispatch(
          addItem({
            productId: product.productId,
            productName: product.productName,
            imageUrl: product.imageUrl,
            priceAtTime: product.priceAtTime || serverItem.priceAtTime,
            cartItemId: serverItem.cartItemId,
            quantity: qty,
          })
        );

        toast.success('Đã thêm vào giỏ hàng!');
      } catch (err) {
        console.error(err.response?.data || err.message);
        toast.error('Không lưu được giỏ hàng!');
      }
    } else {
      dispatch(
        addItem({
          ...product,
          quantity: qty,
          priceAtTime:
            typeof product.discountedPrice === 'number'
              ? product.discountedPrice
              : product.productPrice ?? 0,
        })
      );
      toast.success('Đã thêm vào giỏ hàng!');
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-72">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );

  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  if (!product)
    return <p className="text-center py-10">Không tìm thấy sản phẩm.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Ảnh */}
        <ProductImageGallery images={product.images} />
        {/* Thông tin */}
        <div className="md:col-span-1 flex flex-col gap-6 mt-5">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
            <p className="text-gray-500 mb-3">
              Thương hiệu:{' '}
              <span className="font-medium">{product.brandName}</span> | Mã SP:{' '}
              <span className="font-medium">{product.productId}</span>
            </p>

            {/* Giá */}
            <div className="flex items-end space-x-3 mb-3">
              {product.discountedPrice ? (
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
            {product.discountedPrice && secondsLeft > 0 && (
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
                (Còn {product.quantity} sản phẩm)
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-red-500 text-white px-8 py-3 rounded hover:bg-red-600 transition uppercase tracking-wide font-semibold"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>

        {/* Cam kết */}
        <ProductCommitments />
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
    </div>
  );
}
