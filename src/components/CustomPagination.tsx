import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// ==============================
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

// ==============================
const generatePages = (current: number, total: number) => {
  const pages: (number | string)[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", total);
    } else if (current >= total - 3) {
      pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(
        1,
        "...",
        current - 1,
        current,
        current + 1,
        "...",
        total
      );
    }
  }

  return pages;
};

// ==============================
const CustomPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onChange,
}) => {
  const pages = generatePages(currentPage, totalPages);

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
        style={{
          border: "1px solid #ccc",
          background: "white",
          padding: "8px",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <FaChevronLeft />
      </button>

      {/* Pages */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i}>...</span>
        ) : (
          <button
            key={i}
            onClick={() => onChange(Number(p))}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: currentPage === p ? "#0d6efd" : "white",
              color: currentPage === p ? "white" : "black",
              fontWeight: currentPage === p ? "bold" : "normal",
            }}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
        style={{
          border: "1px solid #ccc",
          background: "white",
          padding: "8px",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default CustomPagination;