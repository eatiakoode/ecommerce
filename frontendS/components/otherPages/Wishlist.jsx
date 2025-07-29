"use client";

import { useWishlist } from "@/context/WishlistContext";
import ProductCard1 from "../productCards/ProductCard1";
import Pagination from "../common/Pagination";
import Link from "next/link";

export default function Wishlist() {
  const { wishlistItems, loading } = useWishlist();

  // Transform wishlist items to match the expected format for ProductCard1
  const transformedItems = wishlistItems.map(item => {
    const product = item.productId;
    return {
      _id: product?._id || item.productId,
      id: product?._id || item.productId,
      title: product?.title || "Product",
      price: product?.sellingPrice || 0,
      sellingPrice: product?.sellingPrice || 0,
      MRP: product?.MRP || 0,
      images: product?.images || [],
      imgSrc: product?.images?.[0]?.url ? 
        `http://localhost:5000${product.images[0].url}` : 
        "/images/products/womens/women-1.jpg", // fallback image
    };
  });

  return (
    <section className="flat-spacing">
      <div className="container">
        {loading ? (
          <div className="p-5 text-center">
            <div>Loading wishlist...</div>
          </div>
        ) : transformedItems.length ? (
          <div className="tf-grid-layout tf-col-2 md-col-3 xl-col-4">
            {/* card product 1 */}
            {transformedItems.map((product, i) => (
              <ProductCard1 key={i} product={product} />
            ))}

            {/* pagination */}
            <ul className="wg-pagination justify-content-center">
              <Pagination />
            </ul>
          </div>
        ) : (
          <div className="p-5">
            Your wishlist is empty. Start adding your favorite products to save
            them for later!{" "}
            <Link className="btn-line" href="/shop-default-grid">
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
