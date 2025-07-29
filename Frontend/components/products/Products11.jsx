"use client";

import LayoutHandler from "./LayoutHandler";
import Sorting from "./Sorting";
import Listview from "./Listview";
import GridView from "./GridView";
import { useEffect, useReducer, useState } from "react";
import FilterModal from "./FilterModal";
import { initialState, reducer } from "@/reducer/filterReducer";
import { productMain } from "@/data/products";
import FilterMeta from "./FilterMeta";
import FilterSidebar from "./FilterSidebar";

export default function Products11() {
  const [activeLayout, setActiveLayout] = useState(4);
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    price,
    availability,
    color,
    size,
    brands,
    filtered,
    sortingOption,
    sorted,
    activeFilterOnSale,
    currentPage,
    itemPerPage,
  } = state;

  const allProps = {
    ...state,
    setPrice: (value) => dispatch({ type: "SET_PRICE", payload: value }),

    setColor: (value) => {
      value == color
        ? dispatch({ type: "SET_COLOR", payload: "All" })
        : dispatch({ type: "SET_COLOR", payload: value });
    },
    setSize: (value) => {
      value == size
        ? dispatch({ type: "SET_SIZE", payload: "All" })
        : dispatch({ type: "SET_SIZE", payload: value });
    },
    setAvailability: (value) => {
      value == availability
        ? dispatch({ type: "SET_AVAILABILITY", payload: "All" })
        : dispatch({ type: "SET_AVAILABILITY", payload: value });
    },

    setBrands: (newBrand) => {
      const updated = [...brands].includes(newBrand)
        ? [...brands].filter((elm) => elm != newBrand)
        : [...brands, newBrand];
      dispatch({ type: "SET_BRANDS", payload: updated });
    },
    removeBrand: (newBrand) => {
      const updated = [...brands].filter((brand) => brand != newBrand);

      dispatch({ type: "SET_BRANDS", payload: updated });
    },
    setSortingOption: (value) =>
      dispatch({ type: "SET_SORTING_OPTION", payload: value }),
    toggleFilterWithOnSale: () => dispatch({ type: "TOGGLE_FILTER_ON_SALE" }),
    setCurrentPage: (value) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: value }),
    setItemPerPage: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }),
        dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
    },
    clearFilter: () => {
      dispatch({ type: "CLEAR_FILTER" });
    },
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Apply filters to products
  const applyFilters = (productsToFilter) => {
    let filteredProducts = [...productsToFilter];

    // Filter by price range
    if (price && price.length === 2) {
      filteredProducts = filteredProducts.filter(
        product => product.sellingPrice >= price[0] && product.sellingPrice <= price[1]
      );
    }

    // Filter by size
    if (size !== 'All') {
      filteredProducts = filteredProducts.filter(product => {
        if (size === 'Free Size') {
          return !product.size || product.size.length === 0;
        }
        return product.size && product.size.includes(size);
      });
    }

    // Filter by color
    if (color !== 'All') {
      filteredProducts = filteredProducts.filter(product => {
        return product.color && product.color.name === color.name;
      });
    }

    // Filter by availability
    if (availability !== 'All') {
      filteredProducts = filteredProducts.filter(product => {
        if (availability.value === 'In Stock') {
          return product.quantity > 0;
        } else if (availability.value === 'Out of Stock') {
          return product.quantity === 0;
        }
        return true;
      });
    }

    // Filter by brands
    if (brands.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        return product.brand && brands.includes(product.brand.title);
      });
    }

    // Filter by sale items
    if (activeFilterOnSale) {
      filteredProducts = filteredProducts.filter(product => {
        return product.MRP && product.MRP > product.sellingPrice;
      });
    }

    return filteredProducts;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all products using the correct endpoint
        const res = await fetch(`http://localhost:5000/api/frontend/product/lists`);
        const result = await res.json();
        
        let fetchedProducts = [];
        if (result.success && Array.isArray(result.data)) {
          fetchedProducts = result.data;
        } else if (Array.isArray(result)) {
          fetchedProducts = result;
        } else {
          console.error("Invalid response format:", result);
          fetchedProducts = [];
        }

        setProducts(fetchedProducts);
        
        // Apply initial filters
        const filteredProducts = applyFilters(fetchedProducts);
        dispatch({ type: "SET_FILTERED", payload: filteredProducts });
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Failed to fetch products');
        setProducts([]);
        dispatch({ type: "SET_FILTERED", payload: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Re-apply filters when filter state changes
  useEffect(() => {
    if (products.length > 0) {
      const filteredProducts = applyFilters(products);
      dispatch({ type: "SET_FILTERED", payload: filteredProducts });
    }
  }, [price, size, color, availability, brands, activeFilterOnSale, products]);

  useEffect(() => {
    if (sortingOption === "Price Ascending") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a, b) => a.sellingPrice - b.sellingPrice),
      });
    } else if (sortingOption === "Price Descending") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a, b) => b.sellingPrice - a.sellingPrice),
      });
    } else if (sortingOption === "Title Ascending") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a, b) => a.title.localeCompare(b.title)),
      });
    } else if (sortingOption === "Title Descending") {
      dispatch({
        type: "SET_SORTED",
        payload: [...filtered].sort((a, b) => b.title.localeCompare(a.title)),
      });
    } else {
      dispatch({ type: "SET_SORTED", payload: filtered });
    }
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
  }, [filtered, sortingOption]);

  return (
    <>
      <section className="flat-spacing">
        <div className="container">
          <div className="tf-shop-control">
            <div className="tf-control-filter">
              <button 
                className="filterShop tf-btn-filter hidden-mx-1200"
                suppressHydrationWarning
              >
                <span className="icon icon-filter" />
                <span className="text">Filters</span>
              </button>
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                aria-controls="filterShop"
                className="tf-btn-filter show-mx-1200"
              >
                <span className="icon icon-filter" />
                <span className="text">Filters</span>
              </a>
              <div
                onClick={allProps.toggleFilterWithOnSale}
                className={`d-none d-lg-flex shop-sale-text ${
                  activeFilterOnSale ? "active" : ""
                }`}
              >
                <i className="icon icon-checkCircle" />
                <p className="text-caption-1">Shop sale items only</p>
              </div>
            </div>
            <ul className="tf-control-layout">
              <LayoutHandler
                setActiveLayout={setActiveLayout}
                activeLayout={activeLayout}
                hasSidebar
              />
            </ul>
            <div className="tf-control-sorting">
              <p className="d-none d-lg-block text-caption-1">Sort by:</p>
              <Sorting allProps={allProps} />
            </div>
          </div>
          <div className="wrapper-control-shop">
            <FilterMeta productLength={sorted.length} allProps={allProps} />
            <div className="row">
              <div className="col-xl-3">
                <FilterSidebar allProps={allProps} />
              </div>
              <div className="col-xl-9">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading products...</p>
                  </div>
                ) : error ? (
                  <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <p>{error}</p>
                  </div>
                ) : activeLayout == 1 ? (
                  <div className="tf-list-layout wrapper-shop" id="listLayout">
                    <Listview products={sorted} />
                  </div>
                ) : (
                  <div
                    className={`tf-grid-layout wrapper-shop tf-col-${activeLayout}`}
                    id="gridLayout"
                  >
                    <GridView products={sorted} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      <FilterModal allProps={allProps} />
    </>
  );
}
