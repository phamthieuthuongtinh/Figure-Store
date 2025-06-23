import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaFacebookMessenger,
} from 'react-icons/fa';

const news = [
  {
    title: 'Ra mắt bộ sưu tập đồ chơi mới',
    image: 'https://cdn.tgdd.vn/Files/2021/03/22/1333881/gaubong.jpg',
    date: '18/06/2025',
  },
  {
    title: 'Khuyến mãi lớn dịp hè',
    date: '15/06/2025',
  },
  {
    title: 'Top 10 đồ chơi bán chạy tháng 5',
    date: '10/06/2025',
  },
  {
    title: 'Lego chính hãng giảm giá 30%',
    date: '05/06/2025',
  },
];

function NewsAndSocial() {
  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Cột Tin tức 2/3 */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Tin tức mới</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Tin nổi bật */}
            <div className="border rounded overflow-hidden shadow">
              <img
                src={news[0].image}
                alt={news[0].title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{news[0].title}</h3>
                <p className="text-sm text-gray-500">{news[0].date}</p>
              </div>
            </div>

            {/* Danh sách tin còn lại */}
            <div className="space-y-4">
              {news.slice(1).map((item, idx) => (
                <div key={idx} className="border-b pb-2">
                  <h4 className="font-medium hover:underline cursor-pointer">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột MXH 1/3 */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Kết nối với chúng tôi</h2>
          <div className="flex flex-col gap-4">
            <a
              href="#"
              className="flex items-center gap-3 text-blue-600 hover:underline"
            >
              <FaFacebookF className="text-xl" />
              Facebook
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-pink-500 hover:underline"
            >
              <FaInstagram className="text-xl" />
              Instagram
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-black hover:underline"
            >
              <FaTiktok className="text-xl" />
              TikTok
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-blue-400 hover:underline"
            >
              <FaTwitter className="text-xl" />
              Twitter
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-blue-600 hover:underline"
            >
              <FaFacebookMessenger className="text-xl" />
              Zalo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsAndSocial;
