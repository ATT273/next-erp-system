import { ResourcePermission } from "../auth.types";
import { IPaginationRequest } from "./pagination.request";
export interface AssignRoleRequest {
  userId: string;
  roleId: string;
}

export interface IRoleListRequestParams extends IPaginationRequest {
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  };
}

export interface IAssignPermissionsRequest {
  role: string;
  permissions: ResourcePermission;
}

export interface IUpdateRoleRequest {
  id: string;
  name: string;
  code: string;
  active: boolean;
  description: string;
}

export interface ICreateRoleRequest {
  name: string;
  code: string;
  active?: boolean;
  description?: string;
}
