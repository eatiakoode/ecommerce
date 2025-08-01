"use client";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function CustomerReview() {
  const { testimonials, loading, error } = useTestimonials();

  if (loading) {
    return (
      <section className="flat-spacing">
        <div className="container">
          <div className="heading-section text-center wow fadeInUp">
            <h3 className="heading">Customer  Review</h3>
            <p className="subheading text-secondary-2">
              Discover exceptional experiences through testimonials from our
              satisfied customers.
            </p>
          </div>
          <div className="text-center">
            <p>Loading customer reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="flat-spacing">
        <div className="container">
          <div className="heading-section text-center wow fadeInUp">
            <h3 className="heading">Customer Review</h3>
            <p className="subheading text-secondary-2">
              Discover exceptional experiences through testimonials from our
              satisfied customers.
            </p>
          </div>
          <div className="text-center">
            <p>No customer reviews found.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h3 className="heading">Customer Review</h3>
          <p className="subheading text-secondary-2">
            Discover exceptional experiences through testimonials from our
            satisfied customers.
          </p>
        </div>
        {error && (
          <div className="text-center mb-3">
            <small className="text-warning">
              Using fallback data - {error}
            </small>
          </div>
        )}
        
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
                slidesPerView: 2,
                pagination: { clickable: true },
              },
              1024: {
                spaceBetween: 30,
                slidesPerView: 3,
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
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="testimonial-item hover-img wow fadeInUp" data-wow-delay={testimonial.delay}>
                  <div className="content">
                    <div className="content-top">
                      {/* Quote Icon */}
                      <div className="quote-icon" style={{
                        width: "40px",
                        height: "40px",
                        background: "#000",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px"
                      }}>
                        <span style={{
                          color: "white",
                          fontSize: "18px",
                          fontWeight: "bold"
                        }}>
                          "
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h5 className="text-title" style={{
                        fontWeight: "bold",
                        marginBottom: "15px",
                        color: "#333",
                        fontSize: "18px"
                      }}>
                        {testimonial.title}
                      </h5>
                      
                      {/* Review Text */}
                      <p className="text-secondary" style={{
                        color: "#666",
                        lineHeight: "1.6",
                        marginBottom: "20px",
                        fontSize: "14px"
                      }}>
                        {testimonial.text}
                      </p>
                      
                      {/* Author and Stars */}
                      <div className="box-author" style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div className="text-title author" style={{
                          fontWeight: "bold",
                          color: "#333",
                          fontSize: "16px"
                        }}>
                          {testimonial.author}
                        </div>
                        
                        {/* Stars */}
                        <div className="list-star-default" style={{ display: "flex", gap: "2px" }}>
                          {[...Array(testimonial.stars || 5)].map((_, i) => (
                            <i key={i} className="icon icon-star" style={{ color: "#ff4444", fontSize: "16px" }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="sw-pagination-testimonial sw-dots type-circle d-flex justify-content-center spd7" />
          </Swiper>
        </div>
      </div>
    </section>
  );
} 