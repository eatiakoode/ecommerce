"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";

export default function Hero() {
  const [slidesData, setSlidesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/frontend/slider/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if data is an array or if it's wrapped in an object
        const slides = Array.isArray(data) ? data : data.slides || data.data || [];
        
        if (!Array.isArray(slides)) {
          throw new Error("Invalid data format received from API");
        }
        
        // Process slides to handle image URLs
        const processedSlides = slides.map(slide => ({
          ...slide,
          // Convert relative image paths to absolute URLs
          image: slide.image && slide.image.startsWith('/') 
            ? `http://localhost:5000${slide.image}` 
            : slide.image,
          images: slide.images?.map(img => 
            img.startsWith('/') ? `http://localhost:5000${img}` : img
          )
        }));
        
        setSlidesData(processedSlides);
        setError(null);
      } catch (err) {
        console.error("Error fetching slider data:", err);
        setError(err.message);
        setSlidesData([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchSliderData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="slider-padding">
        <div className="tf-slideshow slider-default">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading slider...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="slider-padding">
        <div className="tf-slideshow slider-default">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading slider:</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!slidesData.length) {
    return (
      <div className="slider-padding">
        <div className="tf-slideshow slider-default">
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-600">No slides available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="slider-padding">
      <div className="tf-slideshow slider-default slider-effect-fade slider-position slider-nav-sw slider-radius-1">
        <Swiper
          spaceBetween={15}
          dir="ltr"
          className="swiper tf-sw-slideshow"
          breakpoints={{
            768: {
              spaceBetween: 0,
            },
          }}
          loop={false}
          autoplay={false}
          centeredSlides={false}
          modules={[Pagination, Navigation]}
          pagination={{
            clickable: true,
            el: ".spd9",
          }}
          navigation={{
            prevEl: ".snbp4",
            nextEl: ".snbn4",
          }}
        >
          {slidesData.map((slide, index) => (
            <SwiperSlide key={slide.id || index}>
              <div className="wrap-slider slider-group">
                {/* Handle single image or multiple images */}
                {slide.image && (
                  <Image
                    alt={slide.alt || slide.title || "fashion-slideshow"}
                    src={slide.image}
                    width={910}
                    height={780}
                  />
                )}
                {Array.isArray(slide.images) &&
                  slide.images.map((image, idx) => (
                    <Image
                      key={idx}
                      alt={slide.alt || slide.title || "fashion-slideshow"}
                      src={image}
                      width={910}
                      height={780}
                    />
                  ))}

                <div className="box-content">
                  <div className="content-slider">
                    <div className="box-title-slider">
                      <h1 className="fade-item fade-item-1 heading text-white">
                        {slide.title || "Default Title"}
                      </h1>
                      <p className="fade-item fade-item-2 body-text-1 text-white">
                        {slide.description || slide.subtitle || "Default description"}
                      </p>
                    </div>
                    <div className="fade-item fade-item-3 box-btn-slider">
                      <Link
                        href={slide.buttonLink || slide.link || "/shop-default-grid"}
                        className="tf-btn btn-fill btn-white"
                      >
                        <span className="text">
                          {slide.buttonText || slide.button_text || "Shop Now"}
                        </span>
                        <i className="icon icon-arrowUpRight" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="wrap-pagination">
          <div className="container">
            <div className="sw-dots sw-pagination-slider type-circle white-circle-line justify-content-center spd9" />
          </div>
        </div>

        <div className="navigation-prev-slider nav-sw nav-sw-left lg snbp4">
          <i className="icon icon-arrLeft" />
        </div>
        <div className="navigation-next-slider nav-sw nav-sw-right lg snbn4">
          <i className="icon icon-arrRight" />
        </div>
      </div>
    </div>
  );
}