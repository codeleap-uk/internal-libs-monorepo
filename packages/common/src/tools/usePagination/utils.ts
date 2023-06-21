import { InfiniteData, QueryClient, QueryKey, UseInfiniteQueryResult } from '@tanstack/react-query'
import { TypeGuards } from '../../utils'
import { CodeleapQueryClient } from './CodeleapQueryClient'
import { DeriveDataFn, PaginationReturn } from './types'

export const getQueryKeys = (base:string) => {

  return {
    list: [`${base}.list`],
    create: [`${base}.create`],
    update: [`${base}.update`],
    remove: [`${base}.remove`],
    retrieve: [`${base}.retrieve`],
  }
}

export const getPaginationKeys = <Data = any>(base:string, queryClient: CodeleapQueryClient) => {
  return {
    list: queryClient.queryKey<Data>([`${base}.list`]),
    create: queryClient.queryKey<Data>([`${base}.create`]),
    update: queryClient.queryKey<Data>([`${base}.update`]),
    remove: queryClient.queryKey<Data>([`${base}.remove`]),
    retrieve: queryClient.dynamicQueryKey<Data>((id: string|number) => [`${base}.retrieve.${id}`]),
  }
}

type PaginationFilter<T> = (item: T, index: number, arr: T[], map: Record<string, T>, page: Record<string, [number, number]>) => boolean

export type GetPaginationDataParams<TItem = any> = {
  queryKeyOrList: UseInfiniteQueryResult<PaginationReturn<TItem>>['data'] | QueryKey
  queryClient?: QueryClient
  keyExtractor: (item: TItem) => string | number
  filter: PaginationFilter<TItem>
  derive?: DeriveDataFn<TItem>
}
export function getPaginationData<TItem, TParams extends GetPaginationDataParams<TItem> = GetPaginationDataParams<TItem>>(params?: TParams) {
  const pagesById = {} as Record<ReturnType<typeof params.keyExtractor>, [number, number]>
  const flatItems = [] as TItem[]
  const itemMap = {} as Record<ReturnType<typeof params.keyExtractor>, TItem>
  let listVal = params.queryKeyOrList as InfiniteData<PaginationReturn<TItem>>
  const list = params.queryKeyOrList
  if (TypeGuards.isArray(list)) {
    if (!params.queryClient) {
      throw new Error('No QueryClient passed to getPaginationData. It\'s mandatory when requesting queries by key')
    }
    listVal = params.queryClient.getQueryData<UseInfiniteQueryResult<PaginationReturn<TItem>>>(list).data
  }

  let pageIdx = 0
  let derivedData:ReturnType<TParams['derive']> = null

  for (const page of listVal.pages) {

    page.results.forEach((i, itemIdx) => {
      const flatIdx = flatItems.length
      const itemId = params.keyExtractor(i)

      let include = true
      if (params?.filter) {
        include = params?.filter(i, flatIdx, flatItems, itemMap, pagesById) as boolean
      } else {
        include = !itemMap[itemId]
      }

      if (params?.derive) {
        derivedData = params.derive?.({
          item: i,
          context: {
            passedFilter: include,

          },
          index: flatIdx,
          arr: flatItems,
          currentData: derivedData,

        }) as ReturnType<TParams['derive']>
      }

      if (include) {
        flatItems.push(i)
      }
      pagesById[itemId] = [pageIdx, itemIdx]
      itemMap[itemId] = i
    })
    pageIdx += 1
  }
  return {
    flatItems: flatItems,
    pagesById,
    derivedData,
    itemMap,
  }
}
