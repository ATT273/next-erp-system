export interface IResponseMeta {
  page: number;
  limit: number;
  total: number;
  count: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number | null;
}

export interface ICursorResponseMeta {
  limit: number;
  total: number;
  count: number;
  hasNextPage: boolean;
  nextCursor: string | null;
}

export interface IBaseOptionParams {
  page: number;
  limit: number;
  keyword?: string;
}
