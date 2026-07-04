import { ResourcePermission } from "../auth.types";
import { IResponseMeta } from "../response.types";

export interface GetRolesListData {
  id: string;
  name: string;
  code: string;
  active: boolean;
  description: string;
  permissions: ResourcePermission;
  createdAt: string;
  updatedAt: string;
}

export interface IGetRolesListResponse {
  data: GetRolesListData[];
  meta: IResponseMeta | null;
  success: boolean;
  message: string;
}
