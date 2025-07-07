import { useSelector, useDispatch } from 'react-redux';
import {
  removeItem,
  updateQty,
  clearCart,
  setCartItems,
} from '../slices/cartSlice';
import {
  deleteCartItem,
  fetchMyCart,
  getMyCart,
  updateCartItem,
} from '../services/CartService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  cancelOrder,
  checkoutOrder,
  checkoutVnpay,
  fetchMyOrders,
} from '../services/OrderService';
export default function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handleCheckout = () => setOpenConfirm(true);
  const handleConfirm = () => {
    setOpenConfirm(false);
    checkout();
  };
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetchMyOrders();
        // console.log(res.data.data);
        setOrders(res.data.data); // Tuỳ theo định dạng bạn trả về từ backend
      } catch (err) {
        console.error('Lỗi lấy đơn hàng:', err);
      }
    };

    loadOrders();
  }, []);
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    try {
      await cancelOrder(orderId);
      toast.success('Hủy đơn hàng thành công');
      // reload lại danh sách đơn
      const res = await fetchMyOrders();
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Không thể hủy đơn hàng');
    }
  };

  /* ----------------- Lấy giỏ hàng khi đã login ----------------- */
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetchMyCart();
        dispatch(setCartItems(res.data.data));
      } catch (err) {
        console.log('Lỗi khi lấy giỏ hàng:', err);
        toast.error('Không lấy được giỏ hàng');
      }
    })();
  }, [user, dispatch]);
  /* ---------- Hàm helper gọi API + dispatch Redux ---------- */
  const handleUpdateQty = async (cartItem, newQty) => {
    if (user) {
      try {
        await updateCartItem(cartItem.cartItemId, { quantity: newQty });
      } catch {
        toast.error('Lỗi cập nhật số lượng');
        return;
      }
    }
    dispatch(updateQty({ productId: cartItem.productId, quantity: newQty }));
  };
  const handleRemoveItem = async (cartItem) => {
    if (user) {
      try {
        await deleteCartItem(cartItem.cartItemId);
      } catch {
        toast.error('Lỗi xoá sản phẩm');
        return;
      }
    }
    dispatch(removeItem(cartItem.productId));
  };

  const handleClear = async () => {
    if (user) {
      try {
        await Promise.all(items.map((it) => deleteCartItem(it.cartItemId)));
      } catch {
        toast.error('Lỗi xoá giỏ hàng');
        return;
      }
    }
    dispatch(clearCart());
  };
  /* -------------------- Tính tổng tiền -------------------- */
  const total = items.reduce(
    (sum, it) => sum + it.quantity * it.priceAtTime,
    0
  );

  /* ------------------ Thanh toán giả ------------------ */
  const checkout = async () => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để thanh toán!');
      navigate('/login');
      return;
    }
    const payload = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: item.priceAtTime,
      })),
      // couponId: selectedCouponId || null,
      // discountAmount: discount || 0,
      totalPrice: total, // tổng giá từ client
      paymentMethod,
    };
    try {
      if (paymentMethod === 'COD') {
        await checkoutOrder(payload);

        toast.success('Đặt hàng thành công!');
        handleClear();
        navigate('/cart');
      } else if (paymentMethod === 'VNPAY') {
        const { data } = await checkoutVnpay({ payload }); // POST /payment/vnpay
        window.location.href = data.url;
      } else if (paymentMethod === 'MOMO') {
        // Chưa làm, sau sẽ xử lý ở đây
        toast.info('Chức năng MOMO đang phát triển...');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Thanh toán thất bại!';
      toast.error(msg);
    }
  };
  useEffect(() => {
    const onKeyDown = (e) => e.key === 'Escape' && setOpenConfirm(false);
    if (openConfirm) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openConfirm]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Giỏ hàng của bạn</h1>

      {/* Giỏ hàng */}
      {items.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">
          🛒 Giỏ hàng trống.
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {items.map((it) => (
              <li
                key={it.productId}
                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={it.imageUrl}
                    alt={it.productName}
                    className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{it.productName}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Giá:{' '}
                      <span className="text-red-500 font-medium">
                        {it.priceAtTime.toLocaleString()}₫
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) =>
                      handleUpdateQty(it, parseInt(e.target.value, 10) || 1)
                    }
                    className="w-16 border rounded px-2 py-1 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleRemoveItem(it)}
                    className="text-red-600 font-medium hover:underline hover:text-red-800 transition"
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t pt-4">
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-red-600 hover:underline transition mb-4 sm:mb-0"
            >
              🗑️ Xóa tất cả
            </button>

            <div className="text-lg">
              <span className="font-semibold">Tổng tiền: </span>
              <span className="text-red-600 font-bold text-xl">
                {total.toLocaleString()}₫
              </span>
            </div>
          </div>

          <div className="mt-6 text-right space-y-3">
            {/* Label + Select */}
            <div className="flex items-center justify-end space-x-3">
              <label className="font-medium text-gray-700">
                Phương thức thanh toán:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">-- Chọn phương thức --</option>
                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                <option value="VNPAY">VNPAY</option>
                <option value="MOMO">MOMO</option>
              </select>
            </div>

            {/* Nút Thanh toán */}
            <button
              onClick={handleCheckout}
              disabled={!paymentMethod} // disable nếu chưa chọn
              className={`bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg
                transition-all duration-300 shadow-md
                hover:bg-orange-600
                ${!paymentMethod ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Thanh toán
            </button>
          </div>
        </>
      )}

      {/* Đơn hàng đã đặt */}

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🧾 Đơn hàng đã đặt
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-600 italic">Bạn chưa có đơn hàng nào.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.orderId}
              className="border rounded-xl p-6 mb-6 shadow-md bg-white hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-lg text-blue-700">
                  Mã đơn: #{order.orderId}
                </span>

                <span
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'confirmed'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'shipping'
                      ? 'bg-purple-100 text-purple-800'
                      : order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  trạng thái: {order.status.toLowerCase()}
                </span>
              </div>

              <div className="text-gray-700 mb-4 space-y-1">
                <p>
                  <strong>Tổng tiền:</strong>{' '}
                  {order.totalPrice?.toLocaleString()}₫
                </p>
                <p>
                  <strong>Giảm giá:</strong>{' '}
                  {order.discount?.toLocaleString() || 0}₫
                </p>
              </div>

              <div className="mt-3">
                <p className="font-semibold text-gray-800 mb-2">📦 Sản phẩm:</p>
                <ul className="pl-5 list-disc text-sm text-gray-700 space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.productName} – SL: {item.quantity} – Giá mua:{' '}
                      {item.priceAtTime.toLocaleString()}₫
                    </li>
                  ))}
                </ul>
              </div>

              {order.status === 'pending' && (
                <div className="text-right mt-4">
                  <button
                    onClick={() => handleCancelOrder(order.orderId)}
                    className="text-red-600 text-sm font-medium hover:underline"
                  >
                    ❌ Hủy đơn
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* modal */}
      {openConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">Xác nhận thanh toán</h3>
            <p className="mb-6">Bạn có chắc chắn muốn đặt đơn hàng này?</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenConfirm(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Huỷ
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white
                           hover:bg-orange-600"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
