import { UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query'

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

export type UsePaginationParams<
    TData extends PaginationReturn,
    ExtraParams = {},

    TItem = TData['results'][number],
    CreateArg = any,
    RetrieveArg extends any[]= any[]
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
    filter?: Parameters<TItem[]['filter']>[0]
    afterMutate?: (action: MutationOps, result: MutationResult<TItem>) => void | Promise<void>
    where?: RetrieveArg
    limit?: number
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
