export interface ISession {
  id?: string;
  email?: string;
  name: string;
  accessToken?: string;
  roleCode?: string;
  roleActive?: boolean;
  permissions?: ResourcePermission;
}

export interface IMenu {
  key: Resource;
  title: string;
  icon: string;
  href: string;
  permissions: Action[];
}

export type Action = "access" | "view" | "create" | "edit" | "delete" | "assign";
export type Resource = "dashboard" | "product" | "user" | "role" | "inventory" | "profile";
export type ResourcePermission = Partial<Record<Resource, Action[]>>;
// export type Permissions = Partial<ResourcePermission>;
