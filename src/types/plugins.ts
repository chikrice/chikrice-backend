export interface PaginateOptions {
  sortBy?: string;
  populate?: string;
  limit?: string;
  page?: string;
}

export interface QueryResult<Doc> {
  results: Doc[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}
