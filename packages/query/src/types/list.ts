import { QueryKey, UseInfiniteQueryOptions } from '@tanstack/react-query'
import { ListPaginationResponse, PageParam, QueryItem } from './core'

export type ListSelector<T extends QueryItem> = {
  pageParams: PageParam[]
  pages: ListPaginationResponse<T>[]
  allItems: T[]
}

type InfiniteQueryOptions<T extends QueryItem> = UseInfiniteQueryOptions<
  ListPaginationResponse<T>,
  Error,
  ListSelector<T>,
  QueryKey,
  PageParam
>

export type ListQueryOptions<T extends QueryItem, F> = Omit<
  InfiniteQueryOptions<T>,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'getPreviousPageParam' | 'select'
> & {
  limit?: number
  filters?: F
}
