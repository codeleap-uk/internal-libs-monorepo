import { InfiniteData, QueryClient, QueryKey, UseInfiniteQueryResult } from '@tanstack/react-query'
import { TypeGuards } from '../../utils'
import { PaginationReturn } from './types'

export const getQueryKeys = (base:string) => ({
  list: [`${base}.list`],
  create: [`${base}.create`],
  update: [`${base}.update`],
  remove: [`${base}.remove`],
  retrieve: [`${base}.retrieve`],
})

export function getPaginationData<TItem>(params?: {
    queryKeyOrList: UseInfiniteQueryResult<PaginationReturn<TItem>>['data'] | QueryKey
    queryClient?: QueryClient
    keyExtractor: (item: TItem) => string | number
  }) {
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
  for (const page of listVal.pages) {
    flatItems.push(...page.results)
    page.results.forEach((i, itemIdx) => {
      const itemId = params.keyExtractor(i)
      pagesById[itemId] = [pageIdx, itemIdx]
      itemMap[itemId] = i
    })
    pageIdx += 1
  }
  return {
    flatItems: flatItems,
    pagesById,
    itemMap,
  }
}
