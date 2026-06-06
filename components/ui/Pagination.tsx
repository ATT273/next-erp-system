import { Pagination } from "@heroui/react";
import React, { useState } from "react";

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
  const [page, setPage] = useState(initialPage);

  if (total <= 0) return null;

  const handleChange = (newPage: number) => {
    setPage(newPage);
    onChange(newPage);
  };

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className={`flex justify-end ${className}`}>
      <Pagination>
        <Pagination.Content>
          {showControls && (
            <Pagination.Item>
              <Pagination.Previous
                onPress={() => handleChange(Math.max(1, page - 1))}
              />
            </Pagination.Item>
          )}
          {pages.map((p) => (
            <Pagination.Item key={p}>
              <Pagination.Link
                isActive={p === page}
                onPress={() => handleChange(p)}
              >
                {p}
              </Pagination.Link>
            </Pagination.Item>
          ))}
          {showControls && (
            <Pagination.Item>
              <Pagination.Next
                onPress={() => handleChange(Math.min(total, page + 1))}
              />
            </Pagination.Item>
          )}
        </Pagination.Content>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
