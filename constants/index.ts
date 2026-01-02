import { IMenu } from "@/types/auth.types";

export * from "./environment.constants";
export * from "./rbac.constants";
export * from "./dashboard.constants";

export const MENU: IMenu[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: "Dashboard",
    href: "/dashboard",
    permissions: ["ACCESS", "EDIT", "DELETE"],
  },
  {
    key: "product",
    title: "Products",
    icon: "Products",
    href: "/product",
    permissions: ["ACCESS", "EDIT", "DELETE"],
  },
  {
    key: "inventory",
    title: "Inventory",
    icon: "Inventory",
    href: "/inventory",
    permissions: ["ACCESS", "EDIT", "DELETE"],
  },
  {
    key: "role",
    title: "Roles",
    icon: "Roles",
    href: "/role",
    permissions: ["ACCESS", "EDIT", "DELETE"],
  },
  {
    key: "user",
    title: "Users",
    icon: "Users",
    href: "/user",
    permissions: ["ACCESS", "EDIT", "DELETE", "ASSIGN"],
  },
];

export const mainCategory = [
  { label: "Nam", value: "1", code: "M" },
  { label: "Nữ", value: "2", code: "W" },
  { label: "Unisex", value: "3", code: "U" },
  { label: "Bé trai", value: "4", code: "B" },
  { label: "Bé gái", value: "5", code: "G" },
];

export const subCategory = [
  { label: "Áo Polo", value: "1", code: "PL" },
  { label: "Quần", value: "2", code: "PN" },
  { label: "Vest", value: "3", code: "VS" },
  { label: "Váy", value: "4", code: "SK" },
];
