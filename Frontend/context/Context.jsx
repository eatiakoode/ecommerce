"use client";
import { allProducts } from "../data/products";
import { openCartModal } from "../utlis/openCartModal";
import { openWistlistModal } from "../utlis/openWishlist";

import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { useAuth } from "./AuthContext";
const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([1, 2, 3]);
  const [compareItem, setCompareItem] = useState([1, 2, 3]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    if (isAuthenticated() && user) {
      // User is logged in, load cart from localStorage
      const savedCart = localStorage.getItem("cartProducts");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartProducts(parsedCart);
        } catch (error) {
          console.error("Error parsing saved cart:", error);
          setCartProducts([]);
        }
      } else {
        setCartProducts([]);
      }
    } else {
      // User is not logged in, clear cart
      setCartProducts([]);
      localStorage.removeItem("cartProducts");
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated() && user && cartProducts.length > 0) {
      localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    }
  }, [cartProducts, isAuthenticated, user]);
  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const isAddedToCartProducts = (id) => {
    if (cartProducts.filter((elm) => elm.id == id || elm._id == id)[0]) {
      return true;
    }
    return false;
  };
  const addProductToCart = (id, qty, isModal = true) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      alert("Please login to add items to cart. You will be redirected to the login page.");
      window.location.href = '/login';
      return;
    }

    if (!isAddedToCartProducts(id)) {
      const productFromAllProducts = allProducts.filter((elm) => elm.id == id)[0];
      if (productFromAllProducts) {
        const item = {
          ...productFromAllProducts,
          quantity: qty ? qty : 1,
        };
        setCartProducts((pre) => [...pre, item]);
        if (isModal) {
          openCartModal();
        }
      } else {
        console.warn(`Product with id ${id} not found in allProducts`);
      }
    }
  };

  const addProductToCartDirect = (product, qty = 1, isModal = true) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      alert("Please login to add items to cart. You will be redirected to the login page.");
      window.location.href = '/login';
      return;
    }

    if (!isAddedToCartProducts(product.id || product._id)) {
      const item = {
        ...product,
        id: product.id || product._id,
        quantity: qty,
        price: product.price || product.sellingPrice || 0,
        title: product.title || product.name || 'Product',
        imgSrc: product.imgSrc || product.images?.[0]?.url || '/images/products/no-image.png',
      };
      setCartProducts((pre) => [...pre, item]);
      if (isModal) {
        openCartModal();
      }
    }
  };

  const updateQuantity = (id, qty) => {
    if (isAddedToCartProducts(id)) {
      let item = cartProducts.filter((elm) => elm.id == id)[0];
      let items = [...cartProducts];
      const itemIndex = items.indexOf(item);

      item.quantity = qty / 1;
      items[itemIndex] = item;
      setCartProducts(items);
    }
  };

  const addToWishlist = (id) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      alert("Please login to add items to wishlist. You will be redirected to the login page.");
      window.location.href = '/login';
      return;
    }

    if (!wishList.includes(id)) {
      setWishList((pre) => [...pre, id]);
      openWistlistModal();
    }
  };

  const removeFromWishlist = (id) => {
    if (wishList.includes(id)) {
      setWishList((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  const addToCompareItem = (id) => {
    if (!compareItem.includes(id)) {
      setCompareItem((pre) => [...pre, id]);
    }
  };
  const removeFromCompareItem = (id) => {
    if (compareItem.includes(id)) {
      setCompareItem((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  const isAddedtoWishlist = (id) => {
    if (wishList.includes(id)) {
      return true;
    }
    return false;
  };
  const isAddedtoCompareItem = (id) => {
    if (compareItem.includes(id)) {
      return true;
    }
    return false;
  };
  // Remove old localStorage operations that conflict with our new system
  // useEffect(() => {
  //   const items = JSON.parse(localStorage.getItem("cartList"));
  //   if (items?.length) {
  //     setCartProducts(items);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("cartList", JSON.stringify(cartProducts));
  // }, [cartProducts]);
  // useEffect(() => {
  //   const items = JSON.parse(localStorage.getItem("wishlist"));
  //   if (items?.length) {
  //     setWishList(items);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("wishlist", JSON.stringify(wishList));
  // }, [wishList]);

  const clearCart = () => {
    setCartProducts([]);
    localStorage.removeItem("cartProducts");
  };

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    addProductToCartDirect,
    isAddedToCartProducts,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    updateQuantity,
    clearCart,
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
