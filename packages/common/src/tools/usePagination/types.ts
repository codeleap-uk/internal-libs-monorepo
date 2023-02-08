import {
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
  InfiniteData,
} from '@tanstack/react-query'
import { GetPaginationDataParams } from './utils'

export type PaginationParams = {
    limit: number
    offset: number
  }

export type PaginationReturn<Data = any> = {
    next?: any
    previous?: any
    results: Data[]
    count: number
  }

export type MutationOps = 'create' | 'update' | 'remove'
export type MutationResult<Item = any> = {
    status: 'success' | 'error'
    item?: Item
  }

export type MutationOverride<TItem> = (_default: Partial<UseMutationOptions<TItem, any, Partial<TItem>>>) => UseMutationOptions<TItem, any, Partial<TItem> >

export type DeriveDataArgs<TItem = any> = {
  item: TItem
  index: number
  arr?: TItem[]
  currentData?: any
  context: {
    passedFilter?: boolean
  }
}
export type DeriveDataFn<TItem = any> = (args:DeriveDataArgs<TItem>) => any

export type UsePaginationParams<
    TData extends PaginationReturn,
    ExtraParams = {},

    TItem = TData['results'][number],
    CreateArg = any,
    RetrieveArg extends any[]= any[],
  > = {
    extraParams?: ExtraParams
    onList: (params: PaginationParams & ExtraParams) => Promise<TData>
    onCreate?: (arg:CreateArg) => Promise<TItem>
    onRetrieve?: (...params: RetrieveArg) => Promise<TItem>
    onRemove?: (item:Partial<TItem>) => Promise<TItem>
    onUpdate?: (item:Partial<TItem>) => Promise<TItem>
    keyExtractor: (item: TItem) => string | number
    sort?: (a: TItem, b: TItem) => number
    beforeMutate?: (action: MutationOps) => void | Promise<void>
    filter?: GetPaginationDataParams<TItem>['filter']
    deriveData?: DeriveDataFn<TItem>
    afterMutate?: (action: MutationOps, result: MutationResult<TItem>) => void | Promise<void>
    listDeps?: any[]
    where?: RetrieveArg
    limit?: number
    appendTo?: 'start' | 'end'
    overrides?: Partial<{
      list?: (_default: Partial<UseInfiniteQueryOptions<PaginationReturn, any>>) => UseInfiniteQueryOptions<PaginationReturn, any>
      retrieve?: (_default: UseQueryOptions<TItem>) => UseQueryOptions<TItem>
    } & Record<MutationOps, MutationOverride<TItem>>>
    itemName?: string
  } & (TData extends PaginationReturn ? {
    transformResult?: (page: TData) => PaginationReturn<TData>
  } : {
    transformResult: (page: TData) => PaginationReturn<TData>
  })
export type OperationKey = keyof UsePaginationParams<any>['overrides']
export type AppendToPaginationParams<TItem = any> = {
  item:TItem, to?: 'start' | 'end', modifyPageQuery?: boolean
}
export type AppendToPaginationReturn<TItem = any> = InfiniteData<TItem>

export type AppendToPagination<TItem = any> = (params: AppendToPaginationParams<TItem>) => AppendToPaginationReturn<PaginationReturn<TItem>>
