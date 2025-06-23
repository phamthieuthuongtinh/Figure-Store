// src/components/Banner.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
const banners = [
  {
    image: 'https://cdn.tgdd.vn/Files/2022/11/22/1489441/dochoi-4.jpg',
    title: 'Thế giới đồ chơi chính hãng',
    subtitle: 'Khám phá hàng trăm sản phẩm mới mỗi tuần',
  },
  {
    image: 'https://cdn.tgdd.vn/Files/2021/12/10/1401346/lego-banner.jpg',
    title: 'LEGO siêu giảm giá',
    subtitle: 'Giảm đến 40% cho tất cả dòng LEGO',
  },
  {
    image: 'https://cdn.tgdd.vn/Files/2020/07/17/1270575/mo-hinh-4.jpg',
    title: 'Mô hình cực chất',
    subtitle: 'Siêu phẩm cho người mê sưu tầm',
  },
];

function Banner() {
  return (
    <Swiper
      modules={[Autoplay]} // ← Bật module Autoplay
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      slidesPerView={1}
    >
      {banners.map((item, idx) => (
        <SwiperSlide key={idx}>
          <div
            className="h-[400px] bg-cover bg-center relative"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {item.title}
                </h1>
                <p className="text-lg md:text-xl mb-6">{item.subtitle}</p>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Banner;
