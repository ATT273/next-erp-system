import { cn } from "@heroui/styles";
import React, { ReactNode } from "react";

interface ListHeaderProps {
  className?: string;
  children: ReactNode;
}
const ListHeaderWrapper = ({ children, className }: ListHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start gap-1 px-2 py-1 border-b border-zinc-300 bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ListHeaderWrapper;
