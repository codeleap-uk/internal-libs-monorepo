import { QueryKey, UndefinedInitialDataOptions } from '@tanstack/react-query'
import { QueryItem } from './core'

export type RetrieveQueryOptions<T extends QueryItem> = Omit<
  UndefinedInitialDataOptions<T, Error, T, QueryKey>,
  'queryKey' | 'queryFn'
>
