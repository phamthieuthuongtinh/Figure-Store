import React from 'react';

function ContactInfo() {
  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột 1: Thông tin liên hệ */}
        <div>
          <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
          <p>Email: support@webtoy.vn</p>
          <p>Điện thoại: 0123 456 789</p>
          <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
        </div>

        {/* Cột 2: Form liên hệ */}
        <div>
          <h3 className="text-xl font-bold mb-4">Gửi phản hồi</h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Họ tên"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <textarea
              placeholder="Nội dung"
              rows="4"
              className="w-full border border-gray-300 rounded px-4 py-2"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Gửi
            </button>
          </form>
        </div>

        {/* Cột 3: Video YouTube */}
        <div>
          <h3 className="text-xl font-bold mb-4">Video giới thiệu</h3>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-48 md:h-56 lg:h-64"
              src="https://www.youtube.com/embed/Bl8hsoo8OZE?si=YnlscS6Z6RST8Tti"
              title="YouTube video"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
