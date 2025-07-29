// "use client";

// import React, { useEffect, useState } from "react";
// import ProductCard1 from "@/components/productCards/ProductCard1";
// import Link from "next/link";

// const tabItems = ["Yoga", "Run", "Tennis", "Train", "Lounge", "Pilates"];

// export default function Products() {
//   const [activeItem, setActiveItem] = useState(tabItems[0]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFilteredProducts = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const apiUrl = `/api/frontend/product/filter?category=${encodeURIComponent(activeItem)}`;
//         const res = await fetch(apiUrl);

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const data = await res.json();
//         console.log("Filtered Products Response:", data);

//         if (data.success && Array.isArray(data.data)) {
//           setSelectedItems(data.data);
//         } else {
//           console.error("API Error:", data.message || "Invalid response");
//           setSelectedItems([]);
//           setError(data.message || "Failed to fetch products");
//         }
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setSelectedItems([]);
//         setError("Failed to fetch products. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFilteredProducts();
//   }, [activeItem]);

//   const handleTabClick = (item) => {
//     setActiveItem(item);
//   };

//   return (
//     <section className="flat-spacing-3 pt-0">
//       <div className="container">
//         <div className="heading-section text-center wow fadeInUp">
//           <h3>Today's Top Picks</h3>
//           <ul className="tab-product-v2 justify-content-sm-center" role="tablist">
//             {tabItems.map((item, i) => (
//               <li key={i} className="nav-tab-item" role="presentation">
//                 <a
//                   href="#"
//                   className={activeItem === item ? "active" : ""}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleTabClick(item);
//                   }}
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
//               className={`tab-pane active show tabFilter`}
//               id={activeItem}
//               role="tabpanel"
//             >
//               <div className="tf-grid-layout tf-col-2 lg-col-3 xl-col-4">
//                 {loading ? (
//                   <div className="text-center w-100">
//                     <p>Loading {activeItem} products...</p>
//                   </div>
//                 ) : error ? (
//                   <div className="text-center w-100">
//                     <p className="text-danger">{error}</p>
//                   </div>
//                 ) : selectedItems.length > 0 ? (
//                   selectedItems.map((product) => (
//                     <ProductCard1 key={product._id} product={product} />
//                   ))
//                 ) : (
//                   <div className="text-center w-100">
//                     <p>No products found for {activeItem} category.</p>
//                   </div>
//                 )}
//               </div>

//               {!loading && !error && selectedItems.length > 0 && (
//                 <div className="sec-btn text-center">
//                   <Link
//                     href={`/shop-default-list?category=${activeItem}`}
//                     className="btn-line"
//                   >
//                     View All {activeItem} Products
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const categories = ["Yoga", "Run", "Tennis", "Train", "Lounge", "Pilates"];

const Activewear = () => {
  const [selectedCategory, setSelectedCategory] = useState("Yoga");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/frontend/category/filter");
        const allProducts = res.data;

        const filtered = allProducts.filter((product) =>
          product.categories.some((cat) => cat.name === selectedCategory)
        );

        setFilteredProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory]);

  return (
  <div className="py-10 px-6 max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold mb-6 text-center">Today's Top Picks</h2>

    {/* Category Buttons */}
    <div className="flex flex-wrap gap-3 mb-8 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            selectedCategory === category
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>

    {/* Products Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white p-3 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center"
          >
            {product.images?.[0]?.url ? (
              <Image
                src={`http://localhost:5000${product.images[0].url}`}
                alt={product.title}
                width={300}
                height={300}
                className="w-full h-[350px] object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-[350px] bg-gray-100 flex items-center justify-center rounded-md">
                No Image
              </div>
            )}
            <h3 className="text-base font-medium mt-3 text-gray-800 text-center">
              {product.title}
            </h3>
          </div>
        ))
      ) : (
        <p className="text-gray-500 col-span-full text-center">No products found.</p>
      )}
    </div>
  </div>
);

};

export default Activewear;
