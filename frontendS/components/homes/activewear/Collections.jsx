"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Collections() {
  const [collectionsData, setCollectionsData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/frontend/category/category-list");
        const result = await res.json();
        console.log("Fetched categories:", result);
        setCollectionsData(result?.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="flat-spacing-2">
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h3 className="heading">Shop By Category</h3>
          <p className="subheading">
            Browse our Top Trending: the hottest picks loved by all.
          </p>
        </div>

        <div className="flat-collection-circle wow fadeInUp" data-wow-delay="0.1s">
          <div className="swiper tf-sw-collection">
            <Swiper
              slidesPerView={5}
              spaceBetween={15}
              breakpoints={{
                1200: { slidesPerView: 5, spaceBetween: 20 },
                992: { slidesPerView: 4, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                0: { slidesPerView: 2, spaceBetween: 15 },
              }}
              modules={[Pagination, Navigation]}
              pagination={{ clickable: true, el: ".spd8" }}
              navigation={{ prevEl: ".snbp3", nextEl: ".snbn3" }}
              dir="ltr"
            >
              {collectionsData.map((collection, index) => (
                <SwiperSlide key={index}>
                  <div className="collection-circle hover-img">
                    <Link href={`/shop-collection`} className="img-style radius-12">
                      {collection.image && (
                        <Image
                          src={
                            collection.image.startsWith("http")
                              ? collection.image
                              : `http://localhost:5000${collection.image}`
                          }
                          alt="collection-img"
                          width={468}
                          height={624}
                        />
                      )}
                    </Link>
                    <div className="collection-content text-center">
                      <div>
                        <Link href={`/shop-collection`} className="cls-title">
                          <h6 className="text">{collection.name}</h6> {/* ✅ FIXED */}
                          <i className="icon icon-arrowUpRight" />
                        </Link>
                      </div>
                      <div className="count text-secondary">
                        {collection.productCount ?? 0} items {/* ✅ FIXED */}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="d-flex d-lg-none sw-pagination-collection sw-dots type-circle justify-content-center spd8" />
          </div>

          <div className="nav-prev-collection d-none d-lg-flex nav-sw style-line nav-sw-left snbp3">
            <i className="icon icon-arrLeft" />
          </div>
          <div className="nav-next-collection d-none d-lg-flex nav-sw style-line nav-sw-right snbn3">
            <i className="icon icon-arrRight" />
          </div>
        </div>
      </div>
    </section>
  );
}
