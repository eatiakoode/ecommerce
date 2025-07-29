"use client";

import { useWishlist } from "@/context/WishlistContext";
import ProductCard1 from "../productCards/ProductCard1";
import Pagination from "../common/Pagination";
import Link from "next/link";

export default function Wishlist() {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();

  // Transform wishlist items to match the expected format
  const transformedItems = wishlistItems.map((item) => {
    const product = item.productId;
    return {
      ...product,
      id: product?._id || item._id,
      wishlistItemId: item._id,
      title: product?.title || "Product",
      imgSrc: product?.images?.[0]?.url || "/images/products/no-image.png",
      price: product?.sellingPrice || 0,
    };
  });
  return (
    <section className="flat-spacing">
      <div className="container">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
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
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4">Start adding your favorite products to save them for later!</p>
            <Link className="btn-line" href="/shop-left-sidebar">
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
