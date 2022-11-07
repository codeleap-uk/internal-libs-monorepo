import { InfiniteData, QueryClient, QueryKey, UseInfiniteQueryResult } from '@tanstack/react-query'
import { TypeGuards } from '../../utils'
import { DeriveDataArgs, DeriveDataFn, PaginationReturn } from './types'

export const getQueryKeys = (base:string) => ({
  list: [`${base}.list`],
  create: [`${base}.create`],
  update: [`${base}.update`],
  remove: [`${base}.remove`],
  retrieve: [`${base}.retrieve`],
})
type GetPaginationDataParams<TItem = any, Arr extends TItem[]= TItem[]> = {
  queryKeyOrList: UseInfiniteQueryResult<PaginationReturn<TItem>>['data'] | QueryKey
  queryClient?: QueryClient
  keyExtractor: (item: TItem) => string | number
  filter: Parameters<Arr['filter']>[0]
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
      let include = true
      if (params?.filter) {
        include = params?.filter(i, flatIdx, flatItems) as boolean
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
      const itemId = params.keyExtractor(i)
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
