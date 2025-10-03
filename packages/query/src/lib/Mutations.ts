import { InfiniteData } from '@tanstack/query-core'
import { QueryKeys } from './QueryKeys'
import { ItemPosition, ListPaginationResponse, PageParam, QueryClient, QueryItem, RemovedItemMap, WithTempId } from '../types'
import deepEqual from 'fast-deep-equal'
import { TypeGuards } from '@codeleap/types'

/**
 * Class for managing mutations and cache updates for React Query list data
 * @template T - The query item type that extends QueryItem
 * @template F - The filter type used for list queries
 */
export class Mutations<T extends QueryItem, F> {
  /**
   * Creates a new Mutations instance
   * @param queryKeys - The QueryKeys instance for managing query keys
   * @param queryClient - The React Query client instance
   * @param queryName - The name of the query used for identification
   */
  constructor(
    private queryKeys: QueryKeys<T, F>,
    private queryClient: QueryClient,
    private queryName: string
  ) { }

  /**
   * Adds a new item to the cached list data
   * @param newItem - The new item to add to the list
   * @param position - Where to add the item: 'start', 'end', or a RemovedItemMap for specific positions
   * @param listFilters - Optional filters to target specific list queries
   * 
   * @example
   * ```typescript
   * // Add item to the beginning
   * mutations.addItem(newUser, 'start')
   * 
   * // Add item to the end with filters
   * mutations.addItem(newUser, 'end', { status: 'active' })
   * 
   * // Add item to specific positions (restore from removed item map)
   * mutations.addItem(newUser, removedItemMap)
   * ```
   */
  addItem(newItem: T, position: 'start' | 'end' | RemovedItemMap = 'start', listFilters?: F) {
    const isMultiQueryKeys = Array.isArray(position) && position?.length >= 1

    if (isMultiQueryKeys) {
      for (const [queryKey, itemPosition] of position) {
        const currentData = this.queryClient.getQueryData<InfiniteData<ListPaginationResponse<T>, PageParam>>(queryKey)

        const updatedPages = [...(currentData?.pages || [])]

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

  /**
   * Removes an item from all cached list queries and returns the positions where it was found
   * @param itemId - The ID of the item to remove
   * @returns A RemovedItemMap containing the query keys and positions where the item was found, or null if not found
   * 
   * @example
   * ```typescript
   * const removedPositions = mutations.removeItem('user-123')
   * 
   * // Later, restore the item to its original positions
   * if (removedPositions) {
   *   mutations.addItem(restoredUser, removedPositions)
   * }
   * ```
   */
  removeItem(itemId: QueryItem['id'], listFilters?: F): RemovedItemMap | null {
    this.queryKeys.removeRetrieveQueryData(itemId)

    const listQueries = TypeGuards.isNil(listFilters) ? this.queryKeys.getAllListQueries() : [this.queryKeys.getListQuery(listFilters)]

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

  /**
   * Updates existing items in all cached list queries and individual retrieve queries
   * @param data - Single item or array of items to update. Items can have tempId for temporary identification
   * 
   * @description
   * This method:
   * - Finds items by their ID or tempId in all list queries
   * - Updates the items only if the data has actually changed (uses deep equality check)
   * - Updates both list cache and individual retrieve cache
   * - Removes tempId from the final cached data
   * 
   * @example
   * ```typescript
   * // Update single item
   * mutations.updateItems({ id: 'user-123', name: 'Updated Name', tempId: 'temp-1' })
   * 
   * // Update multiple items
   * mutations.updateItems([
   *   { id: 'user-123', name: 'Updated Name' },
   *   { id: 'user-456', status: 'active' }
   * ])
   * ```
   */
  updateItems(data: WithTempId<T> | WithTempId<T>[]) {
    const listQueries = this.queryKeys.getAllListQueries()

    const dataArray = Array.isArray(data) ? data : [data]

    for (const item of dataArray) {
      const { tempId, ...updateData } = item
      const cachedQueryKey = this.queryKeys.keys.retrieve(updateData.id)
      const cachedItemData = this.queryKeys.getRetrieveData(updateData.id)
      if (!deepEqual(cachedItemData, updateData)) {
        this.queryClient.setQueryData(cachedQueryKey, updateData)
      }
    }

    const dataMap = Object.fromEntries(dataArray.map(item => [item?.tempId ?? item?.id, item]))

    for (const query of listQueries) {
      const oldData = query.state?.data
      const queryKey = query?.queryKey

      if (!oldData?.pages || !Array.isArray(oldData?.pages)) continue

      let hasChanges = false

      const updatedPages = (oldData?.pages ?? [])?.filter(Array.isArray)?.map(page => {
        let pageChanged = false

        const updatedPage = page.map((item) => {
          if (dataMap?.[item?.id]) {
            const { tempId, ...updateData } = dataMap?.[item?.id]

            const needsUpdate = !deepEqual(item, updateData)

            if (needsUpdate) {
              pageChanged = true
              hasChanges = true
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

/**
 * Factory function to create a new Mutations instance
 * @template T - The query item type that extends QueryItem
 * @template F - The filter type used for list queries
 * @param queryKeys - The QueryKeys instance for managing query keys
 * @param queryClient - The React Query client instance
 * @param queryName - The name of the query used for identification
 * @returns New Mutations instance
 * 
 * @example
 * ```typescript
 * const userQueryKeys = createQueryKeys<User, UserFilters>('users', queryClient)
 * const userMutations = createMutations(userQueryKeys, queryClient, 'users')
 * ```
 */
export const createMutations = <T extends QueryItem, F>(queryKeys: QueryKeys<T, F>, queryClient: QueryClient, queryName: string) => {
  return new Mutations<T, F>(queryKeys, queryClient, queryName)
}
