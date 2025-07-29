"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ProductCard1 from "../productCards/ProductCard1";

export default function RelatedProducts({ slug = "tank-top" }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/frontend/product/related/tank-top`)
      .then((res) => res.json())
      .then((data) => {
        const productsWithImg = (Array.isArray(data) ? data : []).map((product) => ({
          ...product,
          imgSrc:
            product.images && product.images[0]
              ? `http://localhost:5000${product.images[0].url}`
              : "",
        }));
        setRelatedProducts(productsWithImg);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  return (
    <section className="flat-spacing">
      <div className="container flat-animate-tab">
        <ul
          className="tab-product justify-content-sm-center wow fadeInUp"
          data-wow-delay="0s"
          role="tablist"
        >
          <li className="nav-tab-item" role="presentation">
            <a href="#ralatedProducts" className="active" data-bs-toggle="tab">
              Related Products
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div className="tab-pane active show" id="ralatedProducts" role="tabpanel">
            {loading ? (
              <p>Loading...</p>
            ) : relatedProducts.length === 0 ? (
              <p>No related products found.</p>
            ) : (
              <Swiper
                className="swiper tf-sw-latest"
                dir="ltr"
                spaceBetween={15}
                breakpoints={{
                  0: { slidesPerView: 2, spaceBetween: 15 },
                  768: { slidesPerView: 3, spaceBetween: 30 },
                  1200: { slidesPerView: 4, spaceBetween: 30 },
                }}
                modules={[Pagination]}
                pagination={{
                  clickable: true,
                  el: ".spd4",
                }}
              >
                {relatedProducts.map((product) => (
                  <SwiperSlide key={product._id} className="swiper-slide">
                    <ProductCard1 product={product} />
                  </SwiperSlide>
                ))}
                <div className="sw-pagination-latest spd4 sw-dots type-circle justify-content-center" />
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
