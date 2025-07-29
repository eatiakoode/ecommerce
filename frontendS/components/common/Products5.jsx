// "use client";

// import ProductCard1 from "@/components/productCards/ProductCard1";
// import { products8 } from "@/data/products";
// import { Pagination } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";

// export default function Products5() {
//   return (
//     <section className="flat-spacing">
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
//             el: ".spd6",
//           }}
//         >
//           {products8.map((product, i) => (
//             <SwiperSlide key={i} className="swiper-slide">
//               <ProductCard1 product={product} />
//             </SwiperSlide>
//           ))}

//           <div className="sw-pagination-latest spd6 sw-dots type-circle justify-content-center" />
//         </Swiper>
//       </div>
//     </section>
//   );
// }

"use client";

import ProductCard1 from "@/components/productCards/ProductCard1";
import React, { useEffect, useState } from "react";

const tabItems = ["Yoga", "Run", "Tennis", "Train", "Lounge", "Pilates"];

export default function Products5() {
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
    <section className="flat-spacing">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold">Today's Top Picks</h3>
          <p className="text-gray-600">Fresh styles just in! Elevate your look.</p>

          {/* Tabs */}
          <ul className="flex justify-center flex-wrap gap-3 mt-4" role="tablist">
            {tabItems.map((item, i) => (
              <li key={i} role="presentation">
                <button
                  onClick={() => setActiveItem(item)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeItem === item
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Display */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : selectedItems.length === 0 ? (
          <div className="text-center">No products found for {activeItem}</div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-6 w-full">

            {selectedItems.map((product, index) => (
              <ProductCard1 key={index} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
