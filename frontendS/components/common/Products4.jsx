// "use client";
// import ProductCard1 from "@/components/productCards/ProductCard1";
// import { products } from "@/data/products";
// import React from "react";
// import { Pagination } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";

// export default function Products4({ parentClass = "" }) {
//   return (
//     <section className={parentClass}>
//       <div className="container">
//         <div className="heading-section text-center wow fadeInUp">
//           <h3 className="heading">Today's Top Picks</h3>
//           <p className="subheading text-secondary">
//             Fresh styles just in! Elevate your look.
//           </p>
//         </div>
//         <Swiper
//           className="swiper tf-sw-latest"
//           dir="ltr"
//           spaceBetween={15}
//           breakpoints={{
//             0: { slidesPerView: 2, spaceBetween: 15 },

//             768: { slidesPerView: 3, spaceBetween: 30 },
//             1200: { slidesPerView: 4, spaceBetween: 30 },
//           }}
//           modules={[Pagination]}
//           pagination={{
//             clickable: true,
//             el: ".spd5",
//           }}
//         >
//           {products.slice(0, 4).map((product, i) => (
//             <SwiperSlide key={i} className="swiper-slide">
//               <ProductCard1 product={product} />
//             </SwiperSlide>
//           ))}

//           <div className="sw-pagination-latest spd5 sw-dots type-circle justify-content-center" />
//         </Swiper>
//       </div>
//     </section>
//   );
// }


"use client";

import ProductCard1 from "@/components/productCards/ProductCard1";
import React, { useEffect, useState } from "react";
import { Pagination } from "s               wiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const tabItems = ["Yoga", "Run", "Tennis", "Train", "Lounge", "Pilates"];

export default function Products4({ parentClass = "" }) {
  const [activeItem, setActiveItem] = useState(tabItems[0]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/api/frontend/category/filter");
        const data = await res.json();

        if (Array.isArray(data)) {
          const filtered = data.filter((product) =>
            product.categories.some((cat) => cat.name === activeItem)
          );
          setSelectedItems(filtered);
        } else {
          setSelectedItems([]);
          setError("Invalid data format from server.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
        setSelectedItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeItem]);

  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h3 className="heading">Today's Top Picks</h3>
          <p className="subheading text-secondary">
            Fresh styles just in! Elevate your look.
          </p>
          <ul className="tab-product-v2 justify-content-sm-center" role="tablist">
            {tabItems.map((item, i) => (
              <li key={i} className="nav-tab-item" role="presentation">
                <a
                  href="#"
                  className={activeItem === item ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveItem(item);
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : selectedItems.length === 0 ? (
          <div className="text-center">No products found for {activeItem}</div>
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
              el: ".spd5",
            }}
          >
            {selectedItems.map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <ProductCard1 product={product} />
              </SwiperSlide>
            ))}
            <div className="sw-pagination-latest spd5 sw-dots type-circle justify-content-center" />
          </Swiper>
        )}
      </div>
    </section>
  );
}
