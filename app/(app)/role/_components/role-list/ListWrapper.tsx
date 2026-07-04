import React, { ReactNode } from "react";
import { cn } from "@heroui/styles";

interface ListWrapperProps {
  className?: string;
  children: ReactNode;
}
const ListWrapper = ({ className, children }: ListWrapperProps) => {
  return <div className={cn("relative overflow-y-auto border rounded-lg border-zinc-300", className)}>{children}</div>;
};

export default ListWrapper;
