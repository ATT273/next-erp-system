import { PERMISSION_VALUE } from "@/constants";

export interface ISession {
  id?: string;
  email?: string;
  name: string;
  accessToken?: string;
  roleCode?: string;
  roleActive?: boolean;
  permissions?: Permissions;
}

export interface IPermissions {
  dashboard: number;
  user: number;
  product: number;
  role: number;
}

export interface IMenu {
  key: Resource;
  title: string;
  icon: string;
  href: string;
  permissions: PermissionKey[];
}

export type PermissionKey = keyof typeof PERMISSION_VALUE;
export type Resource = "dashboard" | "product" | "user" | "role" | "inventory" | "profile";
export type Permissions = Record<Resource, number>;
