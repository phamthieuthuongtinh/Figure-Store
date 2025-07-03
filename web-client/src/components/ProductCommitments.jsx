// src/components/ProductCommitments.jsx

export default function ProductCommitments() {
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
      desc: 'Nội thành TP.HCM 2 h, tỉnh thành 1–3 ngày.',
    },
  ];

  const notes = [
    'Giá trên chưa bao gồm phí vận chuyển (tính tại trang thanh toán).',
    'Sản phẩm cần giặt tay, tránh máy sấy nhiệt cao để giữ độ bền.',
    'Màu sắc có thể chênh lệch 5 % do ánh sáng khi chụp.',
  ];

  return (
    <div className="bg-gray-50 p-4 rounded shadow-sm">
      <h2 className="font-semibold mb-3 text-lg">Cam kết bán hàng</h2>
      <ul className="space-y-2 list-disc ml-5 text-gray-700 text-sm">
        {commitments.map((c) => (
          <li key={c.title}>
            <span className="font-medium">{c.title}:</span> {c.desc}
          </li>
        ))}
      </ul>

      <h2 className="font-semibold mb-3 mt-3 text-lg">Lưu ý khi mua hàng</h2>
      <ul className="list-disc ml-6 space-y-2 text-gray-700">
        {notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
