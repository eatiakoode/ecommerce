"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";

export default function ShopGram({ parentClass = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/frontend/instagram/lists")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 5));
        } else if (Array.isArray(data?.data)) {
          setProducts(data.data.slice(0, 5));
        } else {
          console.error("Invalid response:", data);
        }
      })
      .catch((err) => console.error("API fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center">
          <h3 className="heading wow fadeInUp">Shop Instagram</h3>
          <p className="subheading text-secondary wow fadeInUp">
            Elevate your wardrobe with fresh finds today!
          </p>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <Swiper
            dir="ltr"
            className="swiper tf-sw-shop-gallery"
            spaceBetween={10}
            breakpoints={{
              1200: { slidesPerView: 5 },
              768: { slidesPerView: 3 },
              0: { slidesPerView: 2 },
            }}
            modules={[Pagination]}
            pagination={{
              clickable: true,
              el: ".spb222",
            }}
          >
            {products.map((item, i) => (
              <SwiperSlide key={i}>
                <div
                  className="gallery-item hover-overlay hover-img wow fadeInUp"
                  data-wow-delay={item.delay || "0s"}
                >
                  <div className="img-style">
                    {item?.imageLink && typeof item.imageLink === "string" ? (
                      <Image
                        className="lazyload img-hover"
                        src={
                          item.imageLink.startsWith("http")
                            ? item.imageLink
                            : `http://localhost:5000${item.imageLink}`
                        }
                        alt={item.title || "instagram-product"}
                        width={640}
                        height={640}
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-[320px] flex items-center justify-center text-gray-500 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  <Link
                    href={item.instaLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="box-icon hover-tooltip"
                  >
                    <span className="icon icon-eye" />
                    <span className="tooltip">View on Instagram</span>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
            <div className="sw-pagination-gallery sw-dots type-circle justify-content-center spb222"></div>
          </Swiper>
        )}
      </div>
    </section>
  );
}
