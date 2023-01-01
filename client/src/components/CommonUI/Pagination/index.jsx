import React from "react";
import { usePagination, DOTS } from "../../../hooks/usePagination";
import "./pagination.scss";

// This code was inspired by this article: https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/
const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className = "",
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If the currentPage is 0 we shall not render the component
  if (currentPage === 0) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className={`pagination-container ${className}`}>
      {/* Left navigation arrow */}
      <li className="pagination-item">
        <button
          className={`pagination-btn-container ${
            currentPage === 1 ? "disabled" : ""
          }`}
          type="button"
          onClick={onPrevious}
        >
          <div className="arrow left" />
        </button>
      </li>
      {paginationRange.map((pageNumber, index) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return (
            <li
              key={`pagination-dots-${pageNumber}-${index}`}
              className="pagination-item dots"
            >
              &#8230;
            </li>
          );
        }

        // Render our Page Pills
        return (
          <li key={`pagination-${pageNumber}`} className="pagination-item">
            <button
              className={`pagination-btn-container ${
                pageNumber === currentPage ? "selected" : ""
              }`}
              type="button"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        );
      })}
      {/*  Right Navigation arrow */}
      <li className="pagination-item">
        <button
          className={`pagination-btn-container ${
            currentPage === lastPage ? "disabled" : ""
          }`}
          type="button"
          onClick={onNext}
        >
          <div className="arrow right" />
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
