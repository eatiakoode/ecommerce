// "use client";
// import ProductCard1 from "@/components/productCards/ProductCard1";
// import { products } from "@/data/products";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// const tabItems = ["Bottoms", "On pieces", "Tops", "Skirts", "Dresses", "Sale"];
// export default function Products({ parentClass = "flat-spacing-3 pt-0" }) {
//   const [activeItem, setActiveItem] = useState(tabItems[0]); // Default the first item as active

//   const [selectedItems, setSelectedItems] = useState([]);
//   useEffect(() => {
//     document.getElementById("newArrivals2").classList.remove("filtered");
//     setTimeout(() => {
//       setSelectedItems(
//         products.filter((elm) => elm.tabFilterOptions.includes(activeItem))
//       );

//       document.getElementById("newArrivals2").classList.add("filtered");
//     }, 300);
//   }, [activeItem]);

//   return (
//     <section className={parentClass}>
//       <div className="container">
//         <div className="heading-section text-center wow fadeInUp">
//           <h3>Today's Top Picks</h3>
//           <ul className="tab-product-v2 justify-content-sm-center">
//             {tabItems.map((item) => (
//               <li key={item} className="nav-tab-item">
//                 <a
//                   className={activeItem === item ? "active" : ""}
//                   onClick={() => setActiveItem(item)}
//                 >
//                   {item}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="flat-animate-tab">
//           <div className="tab-content">
//             <div
//               className="tab-pane active show tabFilter filtered"
//               id="newArrivals2"
//               role="tabpanel"
//             >
//               <div className="tf-grid-layout tf-col-2 lg-col-3 xl-col-4">
//                 {selectedItems.map((product, i) => (
//                   <ProductCard1 key={i} product={product} />
//                 ))}
//               </div>
//               <div className="sec-btn text-center">
//                 <Link href={`/shop-default-grid`} className="btn-line">
//                   View All Products
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import ProductCard1 from "@/components/productCards/ProductCard1";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const tabItems = ["Yoga", "Run", "Tennis", "Train", "Lounge", "Pilates"];

export default function Products({ parentClass = "flat-spacing-3 pt-0" }) {
  const [activeItem, setActiveItem] = useState(tabItems[0]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:5000/api/frontend/category/filter");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const filtered = data.filter((product) =>
            product.categories.some((cat) => cat.name === activeItem)
          );
          setSelectedItems(filtered);
        } else {
          setError("Invalid response format.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [activeItem]);

  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h3>Today's Top Picks</h3>
          <ul className="tab-product-v2 justify-content-sm-center">
            {tabItems.map((item) => (
              <li key={item} className="nav-tab-item">
                <a
                  className={activeItem === item ? "active" : ""}
                  onClick={() => setActiveItem(item)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flat-animate-tab">
          <div className="tab-content">
            <div
              className="tab-pane active show tabFilter filtered"
              id="newArrivals2"
              role="tabpanel"
            >
              <div className="tf-grid-layout tf-col-2 lg-col-3 xl-col-4">
                {loading ? (
                  <div className="text-center w-100">Loading...</div>
                ) : error ? (
                  <div className="text-center text-danger w-100">{error}</div>
                ) : selectedItems.length > 0 ? (
                  selectedItems.map((product, i) => (
                    <ProductCard1 key={i} product={product} />
                  ))
                ) : (
                  <div className="text-center w-100">
                    No products found for {activeItem}
                  </div>
                )}
              </div>
              {!loading && !error && selectedItems.length > 0 && (
                <div className="sec-btn text-center">
                  <Link
                    href={`/shop-default-grid?category=${activeItem}`}
                    className="btn-line"
                  >
                    View All Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
