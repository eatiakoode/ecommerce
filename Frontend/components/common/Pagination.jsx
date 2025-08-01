"use client";
import React from "react";

export default function Pagination({ 
  totalPages = 1, 
  currentPage = 1, 
  onPageChange = () => {} 
}) {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust start page if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages.map(page => (
      <li
        key={page}
        className={page === currentPage ? "active" : ""}
        onClick={() => handlePageClick(page)}
      >
        <div className="pagination-item text-button">{page}</div>
      </li>
    ));
  };

  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <>
      <li onClick={() => handlePageClick(currentPage - 1)}>
        <a
          className={`pagination-item text-button ${
            currentPage === 1 ? "disabled" : ""
          }`}
        >
          <i className="icon-arrLeft" />
        </a>
      </li>
      {renderPageNumbers()}
      <li onClick={() => handlePageClick(currentPage + 1)}>
        <a
          className={`pagination-item text-button ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <i className="icon-arrRight" />
        </a>
      </li>
    </>
  );
}
