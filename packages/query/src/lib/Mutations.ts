import { InfiniteData } from '@tanstack/query-core'
import { QueryKeys } from './QueryKeys'
import { ItemPosition, ListPaginationResponse, PageParam, QueryClient, QueryItem, RemovedItemMap, WithTempId } from '../types'
import deepEqual from 'fast-deep-equal'

export class Mutations<T extends QueryItem, F> {
  constructor(
    private queryKeys: QueryKeys<T, F>,
    private queryClient: QueryClient,
    private queryName: string
  ) { }

  addItem(newItem: T, position: 'start' | 'end' | RemovedItemMap = 'start', listFilters?: F) {
    const isMultiQueryKeys = Array.isArray(position) && position?.length >= 1

    if (isMultiQueryKeys) {
      for (const [queryKey, itemPosition] of position) {
        const currentData = this.queryClient.getQueryData<InfiniteData<ListPaginationResponse<T>, PageParam>>(queryKey)

        const updatedPages = [...currentData.pages]

        if (itemPosition.pageIndex < updatedPages.length) {
          const targetPage = [...updatedPages[itemPosition.pageIndex]]

          const insertIndex = Math.min(itemPosition.itemIndex, targetPage.length)
          targetPage.splice(insertIndex, 0, newItem)
          updatedPages[itemPosition.pageIndex] = targetPage
        } else {
          const lastPageIndex = updatedPages.length - 1
          if (lastPageIndex >= 0) {
            updatedPages[lastPageIndex] = [...updatedPages[lastPageIndex], newItem]
          } else {
            updatedPages.push([newItem])
          }
        }

        const newData = {
          ...currentData,
          pages: updatedPages
        }

        this.queryClient.setQueryData(queryKey, newData)
      }

      return
    }

    const queryKey = this.queryKeys.listKeyWithFilters(listFilters)

    const currentData = this.queryClient.getQueryData<InfiniteData<ListPaginationResponse<T>, PageParam>>(queryKey)

    if (!currentData) {
      const newData = {
        pageParams: [0],
        pages: [[newItem]]
      }

      this.queryClient.setQueryData(queryKey, newData)

      return
    }

    const updatedPages = [...currentData.pages]

    if (position === 'start') {
      if (updatedPages.length > 0) {
        updatedPages[0] = [newItem, ...updatedPages[0]]
      } else {
        updatedPages.push([newItem])
      }
    } else if (position === 'end') {
      if (updatedPages.length > 0) {
        const lastPageIndex = updatedPages.length - 1
        updatedPages[lastPageIndex] = [...updatedPages[lastPageIndex], newItem]
      } else {
        updatedPages.push([newItem])
      }
    }

    const newData = {
      ...currentData,
      pages: updatedPages
    }

    this.queryClient.setQueryData(queryKey, newData)
  }

  removeItem(itemId: QueryItem['id']): RemovedItemMap | null {
    this.queryKeys.removeRetrieveQueryData(itemId)

    const listQueries = this.queryKeys.getAllListQueries()

    const removedItemMap: RemovedItemMap = []

    for (const query of listQueries) {
      const currentData = query.state?.data
      const queryKey = query?.queryKey

      if (!currentData) continue

      let removedItemPosition: ItemPosition | null = null

      for (let pageIndex = 0; pageIndex < currentData?.pages?.length; pageIndex++) {
        const page = currentData.pages[pageIndex]
        const itemIndex = page.findIndex((item: T) => item?.id === itemId)

        if (itemIndex !== -1) {
          removedItemPosition = {
            pageIndex,
            itemIndex,
          }
          break
        }
      }

      if (!removedItemPosition) continue

      removedItemMap.push([queryKey, removedItemPosition])

      const updatedPages = currentData.pages.map(page =>
        page.filter((item: T) => item?.id !== itemId)
      )

      const filteredPages = updatedPages.filter(page => page?.length > 0)
      const finalPages = filteredPages?.length > 0 ? filteredPages : [[]]
      const newPageParams = currentData?.pageParams?.slice(0, finalPages?.length)

      const newData = {
        ...currentData,
        pages: finalPages,
        pageParams: newPageParams
      }

      this.queryClient.setQueryData(queryKey, newData)
    }

    return removedItemMap
  }

  updateItems(data: WithTempId<T> | WithTempId<T>[]) {
    const listQueries = this.queryKeys.getAllListQueries()

    const dataMap = Array.isArray(data)
      ? Object.fromEntries(data.map(item => [item?.tempId ?? item?.id, item]))
      : { [data?.tempId ?? data?.id]: data }

    for (const query of listQueries) {
      const oldData = query.state?.data
      const queryKey = query?.queryKey

      if (!oldData) continue

      let hasChanges = false

      const updatedPages = oldData.pages.map(page => {
        let pageChanged = false

        const updatedPage = page.map((item) => {
          if (dataMap?.[item?.id]) {
            const { tempId, ...updateData } = dataMap?.[item?.id]

            const needsUpdate = !deepEqual(item, updateData)

            if (needsUpdate) {
              pageChanged = true
              hasChanges = true

              const cachedQueryKey = this.queryKeys.keys.retrieve(updateData.id)
              this.queryClient.setQueryData(cachedQueryKey, updateData)

              return updateData
            }
          }

          return item
        })

        return pageChanged ? updatedPage : page
      })

      if (hasChanges) {
        this.queryClient.setQueryData(queryKey, {
          ...oldData,
          pages: updatedPages
        })
      }
    }
  }
}

export const createMutations = <T extends QueryItem, F>(queryKeys: QueryKeys<T, F>, queryClient: QueryClient, queryName: string) => {
  return new Mutations<T, F>(queryKeys, queryClient, queryName)
}
