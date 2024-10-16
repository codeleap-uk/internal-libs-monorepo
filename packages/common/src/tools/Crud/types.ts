import { InfiniteData, QueryKey, UseInfiniteQueryOptions, UseInfiniteQueryResult, UseMutationOptions, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { QueryManager } from './index'

export type PaginationResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

type OmitMutationKeys<O> = Omit<O, 'mutationFn'|'mutationKey'>

export type QueryManagerMeta = Record<string, any>

export type CreateOptions<T extends QueryManagerItem> = {
  appendTo?: 'start' | 'end' | [number, number] | Record<string, [number, number]>
  optimistic?: boolean
  mutationOptions?: Partial<OmitMutationKeys<UseMutationOptions<T, unknown, Partial<T>, MutationCtx<T>>>>
  onListsWithFilters?: any
}

export type UpdateOptions<T extends QueryManagerItem> = {
  optimistic?: boolean

  mutationOptions?: Partial<OmitMutationKeys<UseMutationOptions<T, unknown, Partial<T>, MutationCtx<T>>>>

}

export type DeleteOptions<T extends QueryManagerItem> = {
  optimistic?: boolean

  mutationOptions?: Partial<OmitMutationKeys<UseMutationOptions<T, unknown, T, MutationCtx<T>>>>

}

export type RetrieveOptions<T extends QueryManagerItem, ExtraArgs = any> = {
  queryOptions?: Partial<UseQueryOptions<T, unknown, T>>
  id?: T['id']
  filter?: ExtraArgs
}

export type ListOptions<T extends QueryManagerItem, ExtraArgs = any> = {
  queryOptions?: Partial<
    UseInfiniteQueryOptions<PaginationResponse<T>>
  >
  filter?: ExtraArgs
}

export type QueryManagerAction<
  T extends QueryManagerItem,
  ExtraArgs = any,
  Meta extends QueryManagerMeta = QueryManagerMeta,
  Args extends any[] = any[]
> = (
    manager: QueryManager<T, ExtraArgs, Meta>, ...args: Args
  ) => any

export type QueryManagerActions<
  T extends QueryManagerItem,
  ExtraArgs = any,
  Meta extends QueryManagerMeta = QueryManagerMeta
> = Record<
  string, QueryManagerAction<T, ExtraArgs, Meta>
>

export type UseListEffect<T extends QueryManagerItem = any> = (
  listQuery: {
    query: UseInfiniteQueryResult<PaginationResponse<T>, unknown>,
    refreshQuery: (silent?: boolean) => void
    cancelQuery: () => void
  }
) => void

export type QueryManagerOptions<
  T extends QueryManagerItem,
  ExtraArgs = any,
  Meta extends QueryManagerMeta = QueryManagerMeta,
  Actions extends QueryManagerActions<T, ExtraArgs, Meta> = QueryManagerActions<T, ExtraArgs, Meta>
> = {
  name: string
  itemType: T
  queryClient: ReturnType<typeof useQueryClient>

  listItems?: (limit: number, offset: number, args?: ExtraArgs) => Promise<PaginationResponse<T>>
  createItem?: (data: Partial<T>, args?: ExtraArgs) => Promise<T>
  updateItem?: (data: Partial<T>, args?: ExtraArgs) => Promise<T>
  deleteItem?: (data: T, args?: ExtraArgs) => Promise<T>
  retrieveItem?: (id: T['id'], args?: ExtraArgs) => Promise<T>

  useListEffect?: UseListEffect<T>

  limit?: number
  creation?: CreateOptions<T>
  update?: UpdateOptions<T>
  deletion?: DeleteOptions<T>
  generateId?: () => T['id']
  actions?: Actions
  keyExtractor?: (item: T) => string
  initialMeta?: Meta
}

export type QueryManagerActionTrigger<
  A extends QueryManagerAction<any, any, any>,
  Args extends any[] = A extends QueryManagerAction<any, any, any, infer _Args> ? _Args : any[]
> = (...args: Args) => any

export type QueryManagerActionTriggers<
  Actions extends QueryManagerActions<any, any, any>
> = {
  [K in keyof Actions]: QueryManagerActionTrigger<Actions[K]>
}

export type InfinitePaginationData<T> = InfiniteData<PaginationResponse<T>>

export type UseManagerArgs<T extends QueryManagerItem, ExtraArgs = any> = {
  filter?: ExtraArgs
  limit?: number
  offset?: number

  creation?: CreateOptions<T>
  update?: UpdateOptions<T>
  deletion?: DeleteOptions<T>

  listOptions?: Pick<ListOptions<T, ExtraArgs>, 'queryOptions'>
}

export type QueryManagerItem = {
  id: string | number
}

export type AppendToPaginationParams<TItem extends QueryManagerItem, Filters=any> = {
  item: TItem|TItem[]
  to?: CreateOptions<TItem>['appendTo']
  refreshKey?: string
  onListsWithFilters?: any
}

export type AppendToPaginationReturn<TItem = any> = InfiniteData<TItem>

export type AppendToPagination<TItem extends QueryManagerItem> = (params: AppendToPaginationParams<TItem>) => Promise<void>

export type MutationCtx<T extends QueryManagerItem> = null | {
  previousData?: InfinitePaginationData<T>
  addedId?: T['id']
  previousItem?: T
  optimisticItem?: T
  prevItemPages?:Record<string, [number, number]>
}

export const isInfiniteQueryData = <T>(data: any): data is InfinitePaginationData<T> => {
  return !!data?.pages && !!data?.pageParams
}

export type QueryStateValue<T extends QueryManagerItem> = {
  pagesById: Record<T['id'], [number, number]>
  itemIndexes: Record<T['id'], number>
  key: QueryKey
}

export type QueryStateSubscriber<T extends QueryManagerItem> = (data: QueryStateValue<T>) => void

export type FilterKeyOrder = string[]

export type GetItemOptions<T extends QueryManagerItem> = {
  forceRefetch?: boolean
  fetchOnNotFoud?: boolean
}

export type SettableOptions<O extends QueryManagerOptions<any, any, any, any>> = Partial<
  Pick<
    O,
    'limit' |
    'creation' |
    'update' |
    'deletion'
  > & {
    meta: O['initialMeta']
  }
>

export type OptionChangeListener<O extends QueryManagerOptions<any, any, any, any>> = (
  options: O,
  meta: O['initialMeta'],
) => any
