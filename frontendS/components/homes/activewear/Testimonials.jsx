"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import React, { useEffect, useState } from "react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/frontend/testimonials/lists")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        } else if (Array.isArray(data?.data)) {
          setTestimonials(data.data);
        } else {
          console.error("Invalid testimonials response:", data);
        }
      })
      .catch((err) => console.error("Error fetching testimonials:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h3 className="heading">Customer Say!</h3>
          <p className="subheading">
            Our customers adore our products, and we constantly aim to delight
            them.
          </p>
        </div>

        {loading ? (
          <p className="text-center">Loading testimonials...</p>
        ) : (
          <Swiper
            dir="ltr"
            spaceBetween={30}
            breakpoints={{
              1024: { slidesPerView: 2 },
              768: { slidesPerView: 1.3 },
              0: { slidesPerView: 1 },
            }}
            modules={[Pagination]}
            pagination={{
              clickable: true,
              el: ".spd12",
            }}
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={item._id || index}>
                <div className="testimonial-item hover-img">
                  <div className="img-style">
                    <Image
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : `http://localhost:5000${item.image}`
                      }
                      alt={item.title || "testimonial"}
                      width={351}
                      height={468}
                    />
                  </div>
                  <div className="content">
                    <div className="content-top">
                      <div className="list-star-default">
                        {Array(5)
                          .fill()
                          .map((_, i) => (
                            <i className="icon icon-star" key={i} />
                          ))}
                      </div>
                      <p className="text-secondary">{item.description}</p>
                      <div className="box-author">
                        <div className="text-title author">{item.title}</div>
                        <svg
                          className="icon"
                          width={20}
                          height={21}
                          viewBox="0 0 20 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_15758_14563)">
                            <path
                              d="M6.875 11.6255L8.75 13.5005L13.125 9.12549"
                              stroke="#3DAB25"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10 18.5005C14.1421 18.5005 17.5 15.1426 17.5 11.0005C17.5 6.85835 14.1421 3.50049 10 3.50049C5.85786 3.50049 2.5 6.85835 2.5 11.0005C2.5 15.1426 5.85786 18.5005 10 18.5005Z"
                              stroke="#3DAB25"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_15758_14563">
                              <rect
                                width={20}
                                height={20}
                                fill="white"
                                transform="translate(0 0.684082)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="sw-pagination-testimonial sw-dots type-circle d-flex justify-content-center spd12" />
          </Swiper>
        )}
      </div>
    </section>
  );
}
