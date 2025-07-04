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
export default function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([
    {
      id: 1001,
      status: 'Chờ xác nhận',
      total: 350000,
      items: [
        {
          productId: 1,
          productName: 'Xe đồ chơi điều khiển',
          quantity: 1,
        },
        {
          productId: 2,
          productName: 'Búp bê Barbie',
          quantity: 2,
        },
      ],
    },
    {
      id: 1002,
      status: 'Đã giao hàng',
      total: 590000,
      items: [
        {
          productId: 3,
          productName: 'LEGO Star Wars',
          quantity: 1,
        },
      ],
    },
  ]);
  /* ----------------- Lấy giỏ hàng khi đã login ----------------- */
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetchMyCart();
        dispatch(setCartItems(res.data.data)); // <- đảm bảo đúng key: .data.data hoặc .data.items tuỳ backend
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
        // gọi API xoá toàn bộ (nếu bạn đã làm); nếu chưa, loop deleteCartItem
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
  const fakeCheckout = () => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để thanh toán!');
      navigate('/login');
      return;
    }
    const fakeOrder = {
      id: Date.now(),
      items,
      total,
      status: 'Chờ xác nhận',
    };
    setOrders((prev) => [...prev, fakeOrder]);
    dispatch(clearCart());
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Giỏ hàng của bạn</h1>

      {/* Giỏ hàng */}
      {items.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <>
          <ul className="divide-y">
            {items.map((it) => (
              <li
                key={it.productId}
                className="py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={it.imageUrl}
                    alt={it.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{it.productName}</h3>
                    <p className="text-sm text-gray-500">
                      {it.priceAtTime.toLocaleString()}₫
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) =>
                      handleUpdateQty(it, parseInt(e.target.value, 10) || 1)
                    }
                    className="w-16 border p-1 text-center rounded"
                  />
                  <button
                    onClick={() => handleRemoveItem(it)}
                    className="text-red-500 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handleClear}
              className="text-gray-500 hover:underline"
            >
              Xóa tất cả
            </button>
            <div>
              <span className="font-bold">Tổng:</span>{' '}
              <span className="text-red-600 font-bold text-xl">
                {total.toLocaleString()}₫
              </span>
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={fakeCheckout}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Thanh toán
            </button>
          </div>
        </>
      )}
      {/* Đơn hàng đã đặt (giả lập) */}
      {orders.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3">🧾 Đơn hàng đã đặt</h2>
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="border p-4 rounded shadow-sm">
                <p className="font-semibold">
                  Mã đơn: #{order.id} | Trạng thái:{' '}
                  <span className="text-blue-600">{order.status}</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Tổng: {order.total.toLocaleString()}₫
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      • {item.productName} x {item.quantity}
                    </li>
                  ))}
                </ul>
                {order.status === 'Chờ xác nhận' && (
                  <button
                    onClick={() => alert(`Huỷ đơn #${order.id}`)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Huỷ đơn
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
