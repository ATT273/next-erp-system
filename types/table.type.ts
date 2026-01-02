import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type ActionMenuKey = "edit" | "delete" | "reset-password" | "assign";
export type TableActionMenuItem = {
  key: ActionMenuKey;
  onClick: () => void;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  title: string;
};
