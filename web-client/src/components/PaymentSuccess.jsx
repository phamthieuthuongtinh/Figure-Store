import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || 'Thanh toán thành công!';
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-green-50 border border-green-200 rounded-2xl shadow-xl p-10 max-w-xl w-full text-center animate-fade-in">
        <div className="text-green-600 text-[80px] font-bold mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-green-700 mb-4">{message}</h1>
        {orderId && (
          <p className="text-gray-700 text-lg mb-6">
            Mã đơn hàng: <span className="font-semibold">{orderId}</span>
          </p>
        )}
        <a
          href="/cart"
          className="inline-block bg-blue-600 text-white text-lg px-8 py-3 rounded-full shadow-md hover:bg-blue-700 transition"
        >
          ⬅ Quay lại giỏ hàng
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
