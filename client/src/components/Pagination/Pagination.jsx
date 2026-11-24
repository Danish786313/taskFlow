import React from 'react';
import { IconChevronLeft, IconChevronRight } from '../Icons/Icons';
import './Pagination.css';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing <span className="font-semibold">{startItem}</span> to{' '}
        <span className="font-semibold">{endItem}</span> of{' '}
        <span className="font-semibold">{totalItems}</span> results
      </div>

      <div className="pagination-controls">
        {onPageSizeChange && (
          <div className="pagination-page-size">
            <span className="page-size-label">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="page-size-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        )}

        <div className="pagination-nav">
          <button
            type="button"
            className="pagination-btn pagination-arrow"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <IconChevronLeft size={16} />
          </button>

          {pages.map((p) => (
            <button
              key={p}
              type="button"
              className={`pagination-btn pagination-num ${
                p === currentPage ? 'active' : ''
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            className="pagination-btn pagination-arrow"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
