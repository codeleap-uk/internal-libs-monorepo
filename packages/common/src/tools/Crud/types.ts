import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { QueryManager } from './index'

export type PaginationResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type CreateOptions = {
  appendTo?: 'start' | 'end' | [number, number]
  optimistic?: boolean

}

export type UpdateOptions = {
  optimistic?: boolean
}

export type QueryManagerAction<
  T extends QueryManagerItem,
  ExtraArgs = any,
  Args extends any[] = any[]
> = (manager: QueryManager<T, ExtraArgs>, ...args: Args) => any

export type QueryManagerActions<T extends QueryManagerItem, ExtraArgs = any> = Record<string, QueryManagerAction<T, ExtraArgs>>

export type QueryManagerOptions<
  T extends QueryManagerItem,
  ExtraArgs = any,
  Actions extends QueryManagerActions<T, ExtraArgs> = QueryManagerActions<T, ExtraArgs>
> = {
  name: string
  queryClient: ReturnType<typeof useQueryClient>

  listItems?: (limit: number, offset: number, args?: ExtraArgs) => Promise<PaginationResponse<T>>
  createItem?: (data: Partial<T>, args?: ExtraArgs) => Promise<T>
  updateItem?: (data: Partial<T>, args?: ExtraArgs) => Promise<T>
  deleteItem?: (data: T, args?: ExtraArgs) => Promise<T>
  retrieveItem?: (id: T['id']) => Promise<T>

  limit?: number
  creation?: CreateOptions
  update?: UpdateOptions
  deletion?: UpdateOptions
  generateId?: () => T['id']
  actions?: Actions
}

export type InfinitePaginationData<T> = InfiniteData<PaginationResponse<T>>

export type UseManagerArgs<T extends QueryManagerItem, ExtraArgs = any> = {
  filter?: ExtraArgs
  limit?: number
  offset?: number
}

export type QueryManagerItem = {
  id: string | number
}

export type AppendToPaginationParams<TItem = any> = {
  item: TItem|TItem[]
  to?: CreateOptions['appendTo']
}
export type AppendToPaginationReturn<TItem = any> = InfiniteData<TItem>

export type AppendToPagination<TItem = any> = (params: AppendToPaginationParams<TItem>) => AppendToPaginationReturn<PaginationResponse<TItem>>

export type MutationCtx<T extends QueryManagerItem> = {
  previousData?: InfinitePaginationData<T>
  addedId?: T['id']
  previousItem?: T
  prevItemPage?: [number, number]
}

export const isInfiniteQueryData = <T>(data: any): data is InfinitePaginationData<T> => {
  return !!data?.pages && !!data?.pageParams
}

export type QueryStateValue<T extends QueryManagerItem> = {
  itemMap: Record<T['id'], T>
  itemList: T[]
  pagesById: Record<T['id'], [number, number]>
  itemIndexes: Record<T['id'], number>
}

export type QueryStateSubscriber<T extends QueryManagerItem> = (data: QueryStateValue<T>) => void

export type FilterKeyOrder = string[]

export type GetItemOptions<T extends QueryManagerItem> = {
  forceRefetch?: boolean
  fetchOnNotFoud?: boolean
}
