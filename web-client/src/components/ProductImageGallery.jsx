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
        fadeEffect={{ crossFade: true }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[Navigation, Thumbs, Zoom, EffectFade]}
        className="mb-4 h-[440px]"
        spaceBetween={10}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="swiper-zoom-container relative">
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
            {/* class này sẽ được Swiper tự động thêm khi thumbnail được active */}
            <div
              className="
          swiper-zoom-container
          swiper-thumb-img-wrapper
        "
            >
              <img
                src={img}
                alt={`thumb-${i}`}
                className="w-full h-20 object-cover rounded cursor-pointer
                   border-2 border-transparent"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
