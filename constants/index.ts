import { IMenu } from "@/types/auth.types";
import { RESOURCE_PERMISSIONS } from "./rbac.constants";

export * from "./environment.constants";
export * from "./rbac.constants";
export * from "./dashboard.constants";

export const MENU: IMenu[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: "Dashboard",
    href: "/dashboard",
    permissions: RESOURCE_PERMISSIONS.dashboard,
  },
  {
    key: "product",
    title: "Products",
    icon: "Products",
    href: "/product",
    permissions: RESOURCE_PERMISSIONS.product,
  },
  {
    key: "inventory",
    title: "Inventory",
    icon: "Inventory",
    href: "/inventory",
    permissions: RESOURCE_PERMISSIONS.inventory,
  },
  {
    key: "role",
    title: "Roles",
    icon: "Roles",
    href: "/role",
    permissions: RESOURCE_PERMISSIONS.role,
  },
  {
    key: "user",
    title: "Users",
    icon: "Users",
    href: "/user",
    permissions: RESOURCE_PERMISSIONS.role,
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
