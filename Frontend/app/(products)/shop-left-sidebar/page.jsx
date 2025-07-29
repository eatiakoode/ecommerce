import Footer1 from "@/components/footers/Footer1";
import Products11 from "@/components/products/Products11";
import WishlistTest from "@/components/test/WishlistTest";
import ProductDebug from "@/components/test/ProductDebug";

import Link from "next/link";
import React from "react";

export default function ShopLeftSidebarPage() {
  return (
    <>
      <div
        className="page-title"
        style={{ backgroundImage: "url(/images/section/page-title.jpg)" }}
      >
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <h3 className="heading text-center">Women</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center">
                <li>
                  <Link className="link" href={`/`}>
                    Homepage
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>Women</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <WishlistTest />
      <ProductDebug />
      <Products11 />
      <Footer1 />
    </>
  );
}
