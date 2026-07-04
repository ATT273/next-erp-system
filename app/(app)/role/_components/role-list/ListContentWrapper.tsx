import { cn } from "@heroui/styles";
import React, { ReactNode } from "react";

interface ListContentProps {
  className?: string;
  children: ReactNode;
}

const ListContentWrapper = ({ children, className }: ListContentProps) => {
  return <div className={cn("h-full overflow-auto px-2", className)}>{children}</div>;
};

export default ListContentWrapper;
