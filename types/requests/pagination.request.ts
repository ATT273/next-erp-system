export interface IPaginationRequest {
  limit: number;
  page: number;
}

export interface IInfiniteSearchRequest {
  limit: number;
  cursor?: string;
}
