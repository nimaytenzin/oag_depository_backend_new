export interface PaginateOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  firstPage: number;
  currentPage: number;
  previousPage: number;
  nextPage: number;
  lastPage: number;
  pageSize: number;
  totalPages: number;
  count: number;
}

export function Paginate(options: PaginateOptions) {
  const { page, pageSize } = options;
  const offset = page * pageSize;
  const limit = pageSize;

  return {
    offset,
    limit,
  };
}
