import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQty, clearCart } from '../slices/cartSlice';
import { useState } from 'react';

export default function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
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

  const total = items.reduce(
    (sum, item) =>
      sum + item.quantity * (item.discountedPrice ?? item.productPrice),
    0
  );
  const fakeCheckout = () => {
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
            {items.map((item) => (
              <li
                key={item.productId}
                className="py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-500">
                      {(
                        item.discountedPrice ?? item.productPrice
                      ).toLocaleString()}
                      ₫
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(
                        updateQty({
                          productId: item.productId,
                          quantity: parseInt(e.target.value, 10) || 1,
                        })
                      )
                    }
                    className="w-16 border p-1 text-center rounded"
                  />
                  <button
                    onClick={() => dispatch(removeItem(item.productId))}
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
              onClick={() => dispatch(clearCart())}
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

          {/* Nút Thanh toán (fake) */}
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
