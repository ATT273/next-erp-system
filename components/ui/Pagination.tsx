import { Pagination } from "@heroui/react";
import React from "react";

interface PaginationProps {
  showControls?: boolean;
  total?: number;
  initialPage?: number;
  onChange?: (page: number) => void;
  className?: string;
}
const CustomPagination = ({
  showControls = true,
  total = 0,
  initialPage = 1,
  onChange = () => {},
  className = "",
}: PaginationProps) => {
  if (total <= 0) {
    return null; // Don't render pagination if there are no items
  }
  return (
    <Pagination
      showControls={showControls}
      total={total}
      initialPage={initialPage}
      onChange={onChange}
      className={`flex justify-end ${className}`}
    />
  );
};

export default CustomPagination;
