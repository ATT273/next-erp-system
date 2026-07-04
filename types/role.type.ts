import { ResourcePermission } from "./auth.types";

export type RoleType = {
  id?: string;
  name: string;
  description: string;
  code: string;
  active: boolean;
  permissions: ResourcePermission;
};
