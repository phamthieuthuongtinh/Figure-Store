import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Zoom, EffectFade } from 'swiper/modules';
import { useState } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/effect-fade';

export default function ProductImageGallery({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div>
      {/* Swiper ảnh lớn */}
      <Swiper
        navigation
        zoom
        effect="fade"
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[Navigation, Thumbs, Zoom, EffectFade]}
        className="mb-4"
        spaceBetween={10}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            {/* bắt buộc bọc trong swiper-zoom-container để Zoom hoạt động */}
            <div className="swiper-zoom-container">
              <img
                src={img}
                alt={`img-${i}`}
                className="w-full h-[440px] object-cover rounded"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper thumbnail */}
      <Swiper
        onSwiper={setThumbsSwiper}
        watchSlidesProgress
        slidesPerView={4}
        spaceBetween={10}
        className="mt-2"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="swiper-zoom-container">
              <img
                src={img}
                alt={`thumb-${i}`}
                className="w-full h-20 object-cover rounded cursor-pointer
                         border-2 border-transparent hover:border-red-400"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
