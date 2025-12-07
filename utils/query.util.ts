import { IBaseOptionParams } from "@/types/response.types";

export const queryParamString = (options: IBaseOptionParams) => {
  const params = new URLSearchParams();
  if (options.page) params.append("page", options.page.toString());
  if (options.limit) params.append("limit", options.limit.toString());
  if (options.keyword) params.append("keyword", options.keyword);
  return params.toString();
};
