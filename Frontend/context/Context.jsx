"use client";
import { allProducts } from "../data/products";
import { openCartModal } from "../utlis/openCartModal";
import { openWistlistModal } from "../utlis/openWishlist";
import { getCart, removeFromCart, updateCartItem } from "../api/auth";

import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { useAuth } from "./AuthContext";
const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const { isAuthenticated, user, token } = useAuth();
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([1, 2, 3]);
  const [compareItem, setCompareItem] = useState([1, 2, 3]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);

  // Load cart from backend when user logs in
  useEffect(() => {
    const loadUserCart = async () => {
      if (isAuthenticated() && token) {
        setCartLoading(true);
        try {
          const result = await getCart(token);
          
          if (result.success) {
            // Transform backend cart data to match frontend format
            const transformedCart = result.data.map(item => ({
              id: item.productId?._id || item.productId?.id,
              _id: item.productId?._id || item.productId?.id,
              title: item.productId?.title || item.productId?.name || 'Product',
              name: item.productId?.title || item.productId?.name || 'Product',
              price: item.productId?.price || item.productId?.sellingPrice || 0,
              sellingPrice: item.productId?.price || item.productId?.sellingPrice || 0,
              images: item.productId?.images || [],
              imgSrc: item.productId?.images?.[0]?.url || item.productId?.images?.[0]?.src || '/images/products/no-image.png',
              quantity: item.quantity || 1,
              selectedColor: item.color?.name || item.color?.title || item.color?.value || null,
              selectedSize: item.size?.name || item.size?.title || item.size?.value || null,
              cartItemId: item._id, // Store the cart item ID for backend operations
            }));
            
            setCartProducts(transformedCart);
            
            // Save to localStorage for offline access
            localStorage.setItem("cartProducts", JSON.stringify(transformedCart));
          }
        } catch (error) {
          console.error("Error loading user cart:", error);
        } finally {
          setCartLoading(false);
        }
      }
    };

    loadUserCart();
  }, [isAuthenticated, token, setCartProducts]);

  // Save cart to localStorage whenever it changes (for offline access)
  useEffect(() => {
    if (isAuthenticated() && user && cartProducts.length > 0) {
      localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    }
  }, [cartProducts, isAuthenticated, user]);

  // Periodic sync with backend (every 5 minutes when user is logged in)
  useEffect(() => {
    if (!isAuthenticated() || !token) return;

    const syncInterval = setInterval(() => {
      syncCartWithBackend();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(syncInterval);
  }, [isAuthenticated, token]);

  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const isAddedToCartProducts = (id, color = null, size = null) => {
    // Normalize color and size values for comparison
    const normalizeValue = (value) => {
      if (!value) return '';
      return value.toString().toLowerCase().trim();
    };
    
    const normalizedColor = normalizeValue(color);
    const normalizedSize = normalizeValue(size);
    
    // Create a unique identifier that includes color and size
    const uniqueId = normalizedColor || normalizedSize ? 
      `${id}-${normalizedColor || ''}-${normalizedSize || ''}` : id;
    
    // Check if item exists (for display purposes only)
    if (cartProducts.filter((elm) => {
      const elmColor = normalizeValue(elm.selectedColor);
      const elmSize = normalizeValue(elm.selectedSize);
      const elmUniqueId = elmColor || elmSize ? 
        `${elm.id || elm._id}-${elmColor || ''}-${elmSize || ''}` : 
        elm.id || elm._id;
      return elmUniqueId === uniqueId;
    })[0]) {
      return true;
    }
    return false;
  };
  
  const addProductToCart = (id, qty, isModal = true, color = null, size = null) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      alert("Please login to add items to cart. You will be redirected to the login page.");
      window.location.href = '/login';
      return;
    }

    if (!isAddedToCartProducts(id, color, size)) {
      const productFromAllProducts = allProducts.filter((elm) => elm.id == id)[0];
      if (productFromAllProducts) {
        const item = {
          ...productFromAllProducts,
          quantity: qty ? qty : 1,
          selectedColor: color,
          selectedSize: size,
        };
        setCartProducts((pre) => [...pre, item]);
        if (isModal) {
          openCartModal();
        }
      } else {
        console.warn(`Product with id ${id} not found in allProducts`);
      }
    } else {
      // Product already in cart, not adding
    }
  };

  const addProductToCartDirect = (product, qty = 1, isModal = true) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      alert("Please login to add items to cart. You will be redirected to the login page.");
      window.location.href = '/login';
      return;
    }

    const productId = product.id || product._id;
    const color = product.selectedColor;
    const size = product.selectedSize;

    // Check if item already exists in cart
    const normalizeValue = (value) => {
      if (!value) return '';
      return value.toString().toLowerCase().trim();
    };
    
    const normalizedColor = normalizeValue(color);
    const normalizedSize = normalizeValue(size);
    
    const existingItem = cartProducts.find((elm) => {
      const elmColor = normalizeValue(elm.selectedColor);
      const elmSize = normalizeValue(elm.selectedSize);
      return elm.id === productId && 
             elmColor === normalizedColor && 
             elmSize === normalizedSize;
    });

    if (existingItem) {
      // Item exists, update quantity
      const updatedCart = cartProducts.map(item => {
        const itemColor = normalizeValue(item.selectedColor);
        const itemSize = normalizeValue(item.selectedSize);
        
        if (item.id === productId && 
            itemColor === normalizedColor && 
            itemSize === normalizedSize) {
          return { ...item, quantity: item.quantity + qty };
        }
        return item;
      });
      
      setCartProducts(updatedCart);
      if (isModal) {
        openCartModal();
      }
    } else {
      // New item, add to cart
      const item = {
        ...product,
        id: productId,
        quantity: qty,
        price: product.price || product.sellingPrice || 0,
        title: product.title || product.name || 'Product',
        imgSrc: product.imgSrc || product.images?.[0]?.url || '/images/products/no-image.png',
        selectedColor: color,
        selectedSize: size,
      };
      setCartProducts((pre) => [...pre, item]);
      if (isModal) {
        openCartModal();
      }
    }
  };

  const updateQuantity = async (id, qty, color = null, size = null) => {
    // Normalize color and size values for comparison
    const normalizeValue = (value) => {
      if (!value) return '';
      return value.toString().toLowerCase().trim();
    };
    
    const normalizedColor = normalizeValue(color);
    const normalizedSize = normalizeValue(size);
    
    const uniqueId = normalizedColor || normalizedSize ? 
      `${id}-${normalizedColor || ''}-${normalizedSize || ''}` : id;
    
    const existingItem = cartProducts.find((elm) => {
      const elmColor = normalizeValue(elm.selectedColor);
      const elmSize = normalizeValue(elm.selectedSize);
      const elmUniqueId = elmColor || elmSize ? 
        `${elm.id || elm._id}-${elmColor || ''}-${elmSize || ''}` : 
        elm.id || elm._id;
      return elmUniqueId === uniqueId;
    });
    
    if (existingItem) {
      // Update local state immediately for better UX
      let items = [...cartProducts];
      const itemIndex = items.indexOf(existingItem);
      existingItem.quantity = qty / 1;
      items[itemIndex] = existingItem;
      setCartProducts(items);

      // Sync with backend if user is authenticated and item has cartItemId
      if (isAuthenticated() && token && existingItem.cartItemId) {
        try {
          const result = await updateCartItem(token, existingItem.cartItemId, qty);
          
          if (!result.success) {
            console.error("Failed to update quantity in backend:", result.error);
            // Could revert local state here if needed
          }
        } catch (error) {
          console.error("Error updating quantity in backend:", error);
          // Could revert local state here if needed
        }
      }
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

  // Remove item from cart (both local and backend)
  const removeFromCartLocal = async (cartItemId) => {
    if (!isAuthenticated() || !token) {
      console.error("User not authenticated, cannot remove from cart");
      return;
    }

    if (!cartItemId) {
      // Remove from local state only if no cartItemId
      setCartProducts((pre) => pre.filter((item) => !item.cartItemId || item.cartItemId !== cartItemId));
      return;
    }

    try {
      const result = await removeFromCart(token, cartItemId);
      
      if (result.success) {
        // Remove from local state
        setCartProducts((pre) => pre.filter((item) => item.cartItemId !== cartItemId));
      } else {
        console.error("Failed to remove item from backend:", result.error);
        // Even if backend fails, remove from local state for better UX
        setCartProducts((pre) => pre.filter((item) => item.cartItemId !== cartItemId));
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      // Remove from local state even if backend fails
      setCartProducts((pre) => pre.filter((item) => item.cartItemId !== cartItemId));
    }
  };

  // Sync local cart changes with backend
  const syncCartWithBackend = async () => {
    if (!isAuthenticated() || !token) return;
    
    try {
      // This function can be called periodically or when needed
      // to ensure local cart stays in sync with backend
      const result = await getCart(token);
      if (result.success) {
        const transformedCart = result.data.map(item => ({
          id: item.productId?._id || item.productId?.id,
          _id: item.productId?._id || item.productId?.id,
          title: item.productId?.title || item.productId?.name || 'Product',
          name: item.productId?.title || item.productId?.name || 'Product',
          price: item.productId?.price || item.productId?.sellingPrice || 0,
          sellingPrice: item.productId?.price || item.productId?.sellingPrice || 0,
          images: item.productId?.images || [],
          imgSrc: item.productId?.images?.[0]?.url || item.productId?.images?.[0]?.src || '/images/products/no-image.png',
          quantity: item.quantity || 1,
          selectedColor: item.color?.name || item.color?.title || item.color?.value || null,
          selectedSize: item.size?.name || item.size?.title || item.size?.value || null,
          cartItemId: item._id,
        }));
        setCartProducts(transformedCart);
        localStorage.setItem("cartProducts", JSON.stringify(transformedCart));
      }
    } catch (error) {
      console.error("Error syncing cart with backend:", error);
    }
  };

  return (
    <dataContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        wishList,
        setWishList,
        compareItem,
        setCompareItem,
        quickViewItem,
        setQuickViewItem,
        quickAddItem,
        setQuickAddItem,
        totalPrice,
        cartLoading,
        addProductToCart,
        addProductToCartDirect,
        isAddedToCartProducts,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        isAddedtoWishlist,
        addToCompareItem,
        removeFromCompareItem,
        isAddedtoCompareItem,
        clearCart,
        removeFromCartLocal,
        syncCartWithBackend,
      }}
    >
      {children}
    </dataContext.Provider>
  );
}
