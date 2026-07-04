import { Action, Resource } from "@/types/auth.types";

export const ACTIONS: Action[] = ["view", "edit", "delete", "assign"];
export const RESOURCE_PERMISSIONS: Record<Resource, Action[]> = {
  dashboard: ["view"],
  role: ["view", "edit", "delete", "assign"],
  product: ["view", "create", "edit", "delete"],
  // product_sku: ["view", "create", "edit", "delete"],
  inventory: ["view", "create", "edit", "delete"],
  user: ["view", "create", "edit", "delete", "assign"],
  profile: ["view", "create", "edit", "delete", "assign"],
};

export const ACTION_VALUE = {
  EDIT: "edit",
  CREATE: "create",
  VIEW: "view",
  ASSIGN: "assign",
  DELETE: "delete",
} as const;
