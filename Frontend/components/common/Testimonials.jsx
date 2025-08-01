"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import { useContextElement } from "@/context/Context";

export default function Testimonials({ parentClass = "flat-spacing" }) {
  const { setQuickViewItem } = useContextElement();
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/frontend/testimonials/lists");
        if (!res.ok) throw new Error("Failed to fetch testimonials");
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        setTestimonials([]); // fallback: empty or static data
      }
    }
    fetchTestimonials();
  }, []);

  function getImageUrl(image) {
    if (!image || typeof image !== "string") return null;
    if (image.startsWith("http")) return image;
    // Remove leading slashes to avoid double slashes in URL
    return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
  }

  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center">
          <h3 className="heading wow fadeInUp">Customer Say!</h3>
          <p className="subheading wow fadeInUp">
            Our customers adore our products, and we constantly aim to delight
            them.
          </p>
        </div>
        <div className="swiper tf-sw-testimonial">
          <Swiper
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 15,
                pagination: { clickable: true },
              },
              768: {
                spaceBetween: 30,
                slidesPerView: 1.3,
                pagination: { clickable: true },
              },
              1024: {
                spaceBetween: 30,
                slidesPerView: 2,
                pagination: { clickable: true },
              },
            }}
            modules={[Pagination]}
            pagination={{
              clickable: true,
              el: ".spd7",
            }}
            dir="ltr"
          >
            {testimonials.length > 0 ? testimonials.map((testimonial, index) => {
              const imageUrl = getImageUrl(testimonial.image);
        
              // Only render <Image> if imageUrl is a valid http(s) URL and not just the base URL
              const isValidImageUrl = typeof imageUrl === 'string' &&
                /^https?:\/\/.+\..+/.test(imageUrl) &&
                !/http:\/\/localhost:5000\/?$/.test(imageUrl) &&
                !/http:\/\/localhost:5000$/.test(imageUrl);
              return (
                <SwiperSlide key={index}>
                  <div className="testimonial-item hover-img">
                    <div className="img-style">
                      {isValidImageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={testimonial.title || "testimonial"}
                          width={468}
                          height={624}
                        />
                      ) : (
                        <div style={{width:468, height:624, background:'#eee', display:'flex', alignItems:'center', justifyContent:'center'}}>No image</div>
                      )}
                    </div>
                    <div className="content">
                      <div className="content-top">
                        <div className="list-star-default">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="icon icon-star" />
                          ))}
                        </div>
                        <p className="text-secondary">{testimonial.description}</p>
                        <div className="box-author">
                          <div className="text-title author">
                            {testimonial.title}
                          </div>
                          <svg
                            className="icon"
                            width={20}
                            height={21}
                            viewBox="0 0 20 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0)">
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
                              <clipPath id="clip0">
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
              );
            }) : <div>No testimonials available.</div>}
            <div className="sw-pagination-testimonial sw-dots type-circle d-flex justify-content-center spd7" />
          </Swiper>
        </div>
      </div>
    </section>
  );
}
