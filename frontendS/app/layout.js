"use client";
import { usePathname } from "next/navigation";
import "../public/scss/main.scss";
import "photoswipe/style.css";
import "react-range-slider-input/dist/style.css";
import "../public/css/image-compare-viewer.min.css";
import { useEffect, useState } from "react";
import Header1 from "@/components/headers/Header1";
// import ScrollTop from "../../Frontend/components/common/ScrollTop";
// import Context from "@/context/Context";
// import { AuthProvider } from "@/context/AuthContext";
// import CartModal from "@/components/modals/CartModal";
// import QuickView from "@/components/modals/QuickView";


import ScrollTop from "@/components/common/ScrollTop";
import Context from "@/context/Context";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartModal from "@/components/modals/CartModal";
import QuickView from "@/components/modals/QuickView";

// import QuickAdd from "@/components/modals/QuickAdd";
// import Compare from "@/components/modals/Compare";
// import MobileMenu from "@/components/modals/MobileMenu";
// import NewsLetterModal from "@/components/modals/NewsLetterModal";

import QuickAdd from "@/components/modals/QuickAdd";
import Compare from "@/components/modals/Compare";
import MobileMenu from "@/components/modals/MobileMenu";
import NewsLetterModal from "@/components/modals/NewsLetterModal";

import SearchModal from "@/components/modals/SearchModal";
import SizeGuide from "@/components/modals/SizeGuide";
import Wishlist from "@/components/modals/Wishlist";
import DemoModal from "@/components/modals/DemoModal";
import Categories from "../components/modals/Categories";
import RtlToggler from "../components/common/RtlToggler";
import Image from "next/image";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [headerBg, setHeaderBg] = useState(false);
  const [headerTop, setHeaderTop] = useState("0px");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Import the script only on the client side
      import("bootstrap/dist/js/bootstrap.esm").then(() => {
        // Module is imported, you can access any exported functionality if
      });
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHeaderBg(currentScrollY > 100);
      if (currentScrollY > 250) {
        setHeaderTop(currentScrollY > (handleScroll.lastScrollY || 0) ? "-185px" : "0px");
      } else {
        setHeaderTop("0px");
      }
      handleScroll.lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);
  useEffect(() => {
    // Close any open modal
    const bootstrap = require("bootstrap"); // dynamically import bootstrap
    const modalElements = document.querySelectorAll(".modal.show");
    modalElements.forEach((modal) => {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    });

    // Close any open offcanvas
    const offcanvasElements = document.querySelectorAll(".offcanvas.show");
    offcanvasElements.forEach((offcanvas) => {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    });
  }, [pathname]); // Runs every time the route changes

  useEffect(() => {
    const WOW = require("@/utlis/wow");
    const wow = new WOW.default({
      mobile: false,
      live: false,
    });
    wow.init();
  }, [pathname]);
  return (
    <html lang="en">
      <body className="preload-wrapper popup-loader">
        <AuthProvider>
          <WishlistProvider>
            <Context>
              <Header1 style={{ top: headerTop }} className={headerBg ? "header-bg" : ""} />
              <RtlToggler />
              <div id="wrapper">{children}</div>
              <CartModal />
              <QuickView />
              <QuickAdd />
              <Compare />
              <MobileMenu />

              <NewsLetterModal />
              <SearchModal />
              <SizeGuide />
              <Wishlist />
              <DemoModal />
              <Categories />
            </Context>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
