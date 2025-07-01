import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../slices/bannersSlice';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

function Banner() {
  const dispatch = useDispatch();
  const { items: banners, loading } = useSelector((state) => state.banners);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  if (loading) return <p className="text-center py-8">Đang tải banner...</p>;

  return (
    <div className="py-0 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
        >
          {banners.map((b) => (
            <SwiperSlide key={b.bannerId}>
              <div
                className="h-[500px] bg-cover bg-center relative"
                style={{ backgroundImage: `url(${b.imageUrl})` }}
              >
                {/* text box ở góc phải‑dưới */}
                {/* <div className="absolute right-8 bottom-8 text-right max-w-[50%]">
              <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md">
                {b.title}
              </h1>

              <a
                href={b.link || '#'}
                className="inline-block mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded shadow"
              >
                Xem&nbsp;ngay
              </a>
            </div> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Banner;
