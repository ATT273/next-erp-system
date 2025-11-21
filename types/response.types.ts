export interface IResponseMeta {
  page: number;
  limit: number;
  total: number;
  count: number;
  totalPages: number;
}

export interface IBaseOptionParams {
  page: number;
  limit: number;
  keyword?: string;
}
