"use client";
import { slides } from "@/data/singleProductSliders";
import Drift from "drift-zoom";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { useEffect, useRef, useState } from "react";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

export default function Slider1({
  activeColor = "gray",
  setActiveColor = () => {},
  firstItem,
  slideItems = slides,
  thumbSlidePerView = 6,
  thumbSlidePerViewOnMobile = 6,
  productImages = [],
}) {
  // Use product images if available, otherwise fall back to static slides
  const items = productImages && productImages.length > 0 
    ? productImages.map((image, index) => {
        const imageUrl = image.url ? `http://localhost:5000${image.url}` : image.url;
        console.log(`Processing image ${index}:`, image, 'URL:', imageUrl);
        return {
          id: index + 1,
          color: "gray", // Default color since we don't have color info from backend
          src: imageUrl,
          alt: "",
          width: 600,
          height: 800,
        };
      })
    : [...slideItems];
  
  // Set first item if provided
  if (firstItem && items.length > 0) {
    items[0].src = firstItem;
  }

  useEffect(() => {
    // Function to initialize Drift with proper checks
    const imageZoom = () => {
      const driftAll = document.querySelectorAll(".tf-image-zoom");
      const pane = document.querySelector(".tf-zoom-main");

      // Check if elements exist before initializing
      if (!driftAll || driftAll.length === 0) {
        console.log("Drift elements not found, retrying...");
        return false;
      }

      if (!pane) {
        console.log("Pane container not found, retrying...");
        return false;
      }

      try {
        driftAll.forEach((el) => {
          if (el && pane) {
            new Drift(el, {
              zoomFactor: 2,
              paneContainer: pane,
              inlinePane: false,
              handleTouch: false,
              hoverBoundingBox: true,
              containInline: true,
            });
          }
        });
        return true;
      } catch (error) {
        console.error("Error initializing Drift:", error);
        return false;
      }
    };

    // Try to initialize immediately
    let initialized = imageZoom();
    
    // If not initialized, retry after a short delay
    if (!initialized) {
      const retryInterval = setInterval(() => {
        initialized = imageZoom();
        if (initialized) {
          clearInterval(retryInterval);
        }
      }, 100);

      // Clear interval after 5 seconds to prevent infinite retries
      setTimeout(() => {
        clearInterval(retryInterval);
      }, 5000);
    }

    const zoomElements = document.querySelectorAll(".tf-image-zoom");

    const handleMouseOver = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.add("zoom-active");
      }
    };

    const handleMouseLeave = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.remove("zoom-active");
      }
    };

    zoomElements.forEach((element) => {
      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup event listeners on component unmount
    return () => {
      zoomElements.forEach((element) => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [items]); // Add items as dependency to reinitialize when images change

  const lightboxRef = useRef(null);
  useEffect(() => {
    // Initialize PhotoSwipeLightbox
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-swiper-started",
      children: ".item",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();

    // Store the lightbox instance in the ref for later use
    lightboxRef.current = lightbox;

    // Cleanup: destroy the lightbox when the component unmounts
    return () => {
      lightbox.destroy();
    };
  }, []);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  
  useEffect(() => {
    if (!(items[activeIndex].color == activeColor)) {
      const slideIndex =
        items.filter((elm) => elm.color == activeColor)[0]?.id - 1;
      swiperRef.current.slideTo(slideIndex);
    }
  }, [activeColor]);
  
  useEffect(() => {
    setTimeout(() => {
      if (swiperRef.current) {
        swiperRef.current.slideTo(1);
        swiperRef.current.slideTo(
          items.filter((elm) => elm.color == activeColor)[0]?.id - 1
        );
      }
    });
  }, []);

  return (
    <div className="thumbs-slider">
      <Swiper
        className="swiper tf-product-media-thumbs other-image-zoom"
        dir="ltr"
        direction="vertical"
        spaceBetween={10}
        slidesPerView={thumbSlidePerView}
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        initialSlide={1}
        breakpoints={{
          0: {
            direction: "horizontal",
            slidesPerView: thumbSlidePerViewOnMobile,
          },
          820: {
            direction: "horizontal",
            slidesPerView:
              thumbSlidePerViewOnMobile < 4
                ? thumbSlidePerViewOnMobile + 1
                : thumbSlidePerViewOnMobile,
          },
          920: {
            direction: "horizontal",
            slidesPerView:
              thumbSlidePerViewOnMobile < 4
                ? thumbSlidePerViewOnMobile + 2
                : thumbSlidePerViewOnMobile,
          },
          1020: {
            direction: "horizontal",
            slidesPerView:
              thumbSlidePerViewOnMobile < 4
                ? thumbSlidePerViewOnMobile + 2.5
                : thumbSlidePerViewOnMobile,
          },
          1200: {
            direction: "vertical",
            slidesPerView: thumbSlidePerView,
          },
        }}
      >
        {items.map((slide, index) => (
          <SwiperSlide
            className="swiper-slide stagger-item"
            data-color={slide.color}
            key={index}
          >
            <div className="item">
              {slide.src.startsWith('http') ? (
                <img
                  className="lazyload"
                  data-src={slide.src}
                  alt={slide.alt}
                  src={slide.src}
                  width={slide.width}
                  height={slide.height}
                />
              ) : (
                <Image
                  className="lazyload"
                  data-src={slide.src}
                  alt={slide.alt}
                  src={slide.src}
                  width={slide.width}
                  height={slide.height}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        dir="ltr"
        className="swiper tf-product-media-main"
        id="gallery-swiper-started"
        spaceBetween={10}
        slidesPerView={1}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          if (items[swiper.activeIndex]) {
            setActiveIndex(swiper.activeIndex);
            setActiveColor(items[swiper.activeIndex]?.color.toLowerCase());
          }
        }}
      >
        {items.map((slide, index) => (
          <SwiperSlide key={index} className="swiper-slide" data-color="gray">
            <a
              href={slide.src}
              target="_blank"
              className="item"
              data-pswp-width={slide.width}
              data-pswp-height={slide.height}
              //   onClick={() => openLightbox(index)}
            >
              {slide.src.startsWith('http') ? (
                <img
                  className="tf-image-zoom lazyload"
                  data-zoom={slide.src}
                  data-src={slide.src}
                  alt=""
                  src={slide.src}
                  width={slide.width}
                  height={slide.height}
                />
              ) : (
                <Image
                  className="tf-image-zoom lazyload"
                  data-zoom={slide.src}
                  data-src={slide.src}
                  alt=""
                  src={slide.src}
                  width={slide.width}
                  height={slide.height}
                />
              )}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
