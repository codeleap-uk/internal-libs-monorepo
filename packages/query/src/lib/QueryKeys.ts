import { CancelOptions, InfiniteData, InvalidateOptions, InvalidateQueryFilters, Query, QueryFilters, QueryKey, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { useMemo } from 'react'
import { TypeGuards } from '@codeleap/types'
import { ListPaginationResponse, ListSelector, PageParam, QueryClient, QueryItem, RetrieveDataOptions } from '../types'
import deepEqual from 'fast-deep-equal'

/**
 * Class for managing React Query keys and operations for a specific query type
 * @template T - The query item type that extends QueryItem
 * @template F - The filter type used for list queries
 */
export class QueryKeys<T extends QueryItem, F> {
  /**
   * Creates a new QueryKeys instance
   * @param queryName - The name of the query used as base for all keys
   * @param queryClient - The React Query client instance
   */
  constructor(
    private queryName: string,
    private queryClient: QueryClient
  ) { }

  /**
   * Gets the base query keys for different operations
   * @returns Object containing base query keys for list, retrieve, create, update, and delete operations
   */
  get keys() {
    return {
      // queries
      list: [this.queryName, 'list'] as QueryKey,
      retrieve: (id: QueryItem['id']) => [this.queryName, 'retrieve', id] as QueryKey,

      // mutations
      create: [this.queryName, 'create'] as QueryKey,
      update: [this.queryName, 'update'] as QueryKey,
      delete: [this.queryName, 'delete'] as QueryKey,
    }
  }

  /**
   * Generates a list query key with optional filters
   * @param filters - Optional filters to include in the query key
   * @returns Query key array with or without filters
   */
  listKeyWithFilters(filters?: F): QueryKey {
    const hasValidFilters = filters != null && (
      typeof filters !== 'object'
        ? Boolean(filters)
        : Object.values(filters).some(value =>
          value != null && (typeof value !== 'string' || value.trim() !== '')
        )
    )

    return hasValidFilters ? [...this.keys.list, filters] : this.keys.list
  }

  /**
   * React hook that returns a memoized list query key with filters
   * @param filters - Optional filters to include in the query key
   * @returns Memoized query key array
   */
  useListKeyWithFilters(filters?: F) {
    return useMemo(() => {
      return this.listKeyWithFilters(filters)
    }, [filters])
  }

  /**
   * React hook that returns a memoized retrieve query key
   * @param id - The ID of the item to retrieve
   * @returns Memoized query key array for retrieve operation
   */
  useRetrieveKey(id: QueryItem['id']) {
    return useMemo(() => {
      return this.keys.retrieve(id)
    }, [id])
  }

  /**
   * Predicate function to check if a query belongs to this query name (all operations)
   * @private
   * @param queryName - The query name to match against
   * @param query - The query object to check
   * @returns True if the query matches the query name
   */
  private predicateQueryKeyAll(queryName: string, query: Query<unknown, Error, unknown, QueryKey>) {
    const queryKey = query?.queryKey?.join('/')

    return queryKey?.includes(queryName)
  }

  /**
   * Predicate function to check if a query is a list query for this query name
   * @private
   * @param queryName - The query name to match against
   * @param query - The query object to check
   * @param toIgnoreQueryKeys - Query keys to ignore in the matching
   * @returns True if the query is a list query and not in the ignore list
   */
  private predicateQueryKeyList(queryName: string, query: Query<unknown, Error, unknown, QueryKey>, toIgnoreQueryKeys?: QueryKey | QueryKey[]) {
    const queryKey = query?.queryKey?.join('/')

    if (!TypeGuards.isNil(toIgnoreQueryKeys)) {
      const ignoreQueryKeys = Array.isArray(toIgnoreQueryKeys?.[0]) ? toIgnoreQueryKeys : [toIgnoreQueryKeys]
      if (ignoreQueryKeys.some(key => deepEqual(query?.queryKey, key))) {
        return false
      }
    }

    const isListQueryKey = queryKey?.includes(queryName) && queryKey?.includes('list')

    return isListQueryKey
  }

  /**
   * Invalidates all queries for this query name
   * @param filters - Optional filters to apply to the invalidation
   * @param options - Optional invalidation options
   * @returns Promise that resolves when invalidation is complete
   */
  async invalidateAll(filters?: InvalidateQueryFilters<QueryKey>, options?: InvalidateOptions) {
    return this.queryClient.invalidateQueries({
      ...filters,
      predicate: (query) => this.predicateQueryKeyAll(this.queryName, query),
    }, options)
  }

  /**
   * Invalidates list queries, optionally with specific filters
   * @param listFilters - Optional filters to target specific list queries
   * @param ignoreQueryKeys - Query keys to ignore during invalidation
   * @param filters - Optional filters to apply to the invalidation
   * @param options - Optional invalidation options
   * @returns Promise that resolves when invalidation is complete
   */
  async invalidateList(listFilters?: F, ignoreQueryKeys?: QueryKey | QueryKey[], filters?: InvalidateQueryFilters<QueryKey>, options?: InvalidateOptions) {
    if (!!listFilters) {
      const queryKey = this.listKeyWithFilters(listFilters)

      return this.queryClient.invalidateQueries({ ...filters, queryKey }, options)
    }

    return this.queryClient.invalidateQueries({
      ...filters,
      predicate: (query) => this.predicateQueryKeyList(this.queryName, query, ignoreQueryKeys),
    }, options)
  }

  /**
   * Invalidates a specific retrieve query by ID
   * @param id - The ID of the item to invalidate
   * @param filters - Optional filters to apply to the invalidation
   * @param options - Optional invalidation options
   * @returns Promise that resolves when invalidation is complete
   */
  async invalidateRetrieve(id: QueryItem['id'], filters?: InvalidateQueryFilters<QueryKey>, options?: InvalidateOptions) {
    const queryKey = this.keys.retrieve(id)

    return this.queryClient.invalidateQueries({
      ...filters,
      queryKey,
    }, options)
  }

  /**
   * Refetches all queries for this query name
   * @param filters - Optional filters to apply to the refetch
   * @param options - Optional refetch options
   * @returns Promise that resolves when refetch is complete
   */
  async refetchAll(filters?: RefetchQueryFilters<QueryKey>, options?: RefetchOptions) {
    return this.queryClient.refetchQueries({
      ...filters,
      predicate: (query) => this.predicateQueryKeyAll(this.queryName, query),
    }, options)
  }

  /**
   * Refetches list queries, optionally with specific filters
   * @param listFilters - Optional filters to target specific list queries
   * @param ignoreQueryKeys - Query keys to ignore during refetch
   * @param filters - Optional filters to apply to the refetch
   * @param options - Optional refetch options
   * @returns Promise that resolves when refetch is complete
   */
  async refetchList(listFilters?: F, ignoreQueryKeys?: QueryKey | QueryKey[], filters?: RefetchQueryFilters<QueryKey>, options?: RefetchOptions) {
    if (!!listFilters) {
      const queryKey = this.listKeyWithFilters(listFilters)

      return this.queryClient.refetchQueries({ ...filters, queryKey }, options)
    }

    return this.queryClient.refetchQueries({
      ...filters,
      predicate: (query) => this.predicateQueryKeyList(this.queryName, query, ignoreQueryKeys),
    }, options)
  }

  /**
   * Refetches a specific retrieve query by ID
   * @param id - The ID of the item to refetch
   * @param filters - Optional filters to apply to the refetch
   * @param options - Optional refetch options
   * @returns Promise that resolves when refetch is complete
   */
  async refetchRetrieve(id: QueryItem['id'], filters?: RefetchQueryFilters<QueryKey>, options?: RefetchOptions) {
    const queryKey = this.keys.retrieve(id)

    return this.queryClient.refetchQueries({
      ...filters,
      queryKey,
    }, options)
  }

  /**
   * Removes a specific retrieve query data from the cache
   * @param id - The ID of the item to remove from cache
   * @param filters - Optional filters to apply to the removal
   * @returns Promise that resolves when removal is complete
   */
  async removeRetrieveQueryData(id: QueryItem['id'], filters?: QueryFilters<QueryKey>) {
    const queryKey = this.keys.retrieve(id)

    return this.queryClient.removeQueries({
      ...filters,
      queryKey,
    })
  }

  /**
   * Cancels list queries that are currently in flight
   * @param listFilters - Optional filters to target specific list queries
   * @param ignoreQueryKeys - Query keys to ignore during cancellation
   * @param filters - Optional filters to apply to the cancellation
   * @param options - Optional cancellation options
   * @returns Promise that resolves when cancellation is complete
   */
  async cancelListQueries(listFilters?: F, ignoreQueryKeys?: QueryKey | QueryKey[], filters?: QueryFilters<QueryKey>, options?: CancelOptions) {
    if (!!listFilters) {
      const queryKey = this.listKeyWithFilters(listFilters)

      return this.queryClient.cancelQueries({ ...filters, queryKey }, options)
    }

    return this.queryClient.cancelQueries({
      ...filters,
      predicate: (query) => this.predicateQueryKeyList(this.queryName, query, ignoreQueryKeys),
    }, options)
  }

  /**
   * Gets list data from the cache, including both items array and item map
   * @param filters - Optional filters to target specific list data
   * @returns Object containing items array and itemMap (keyed by ID)
   */
  getListData(filters?: F) {
    const queryKey = this.listKeyWithFilters(filters)

    const data = this.queryClient.getQueryData<InfiniteData<ListPaginationResponse<T>, PageParam>>(queryKey)

    const items = (data?.pages ?? []).flat()

    const itemMap = items.reduce((acc, item) => {
      acc[item?.id] = item
      return acc
    }, {} as Record<QueryItem['id'], T>)

    return {
      items,
      itemMap,
    }
  }

  /**
    * Retrieves item data from cache with intelligent fallback strategies
    * 
    * @description Searches for an item using a multi-layered approach:
    * 1. Direct cache lookup using retrieve query
    * 2. Fallback to itemMap from list data (shallow search)  
    * 3. Deep search through all paginated list queries
    * 
    * @param {QueryItem['id']} id - The unique identifier of the item to retrieve
    * @param {RetrieveDataOptions} [options] - Configuration options for retrieval behavior
    * @param {boolean} [options.onlyQueryData=false] - If true, only returns data from the specific retrieve query cache, ignoring list data fallbacks
    * @param {boolean} [options.deepSearch=true] - If true, performs deep search through paginated queries when item not found in direct cache or itemMap
    * 
    * @returns Item | undefined
   */
  getRetrieveData(id: QueryItem['id'], options: RetrieveDataOptions = {}): T | undefined {
    const {
      onlyQueryData = false,
      deepSearch = false,
    } = options

    if (TypeGuards.isNil(id)) return undefined

    const queryKey = this.keys.retrieve(id)

    const queryData = this.queryClient.getQueryData<T>(queryKey)

    if (queryData?.id) return queryData

    if (onlyQueryData) return undefined

    if (!deepSearch) {
      const { itemMap } = this.getListData()

      return itemMap?.[id]
    }

    const queries = this.getAllListQueries()

    for (const query of queries) {
      const pages = query.state.data?.pages
      if (!pages?.length) continue

      const item = pages
        .filter(Boolean)
        .flatMap(page => Array.isArray(page) ? page : [])
        .find(item => item?.id === id)

      if (item) return item
    }

    return undefined
  }

  /**
   * Gets all list queries from the query cache
   * @returns Array of list queries for this query name
   */
  getAllListQueries() {
    const queries = this.queryClient.getQueryCache().findAll({
      predicate: (query) => this.predicateQueryKeyList(this.queryName, query),
    })

    return queries as Query<ListPaginationResponse<T>, Error, Omit<ListSelector<T>, 'allItems'>, QueryKey>[]
  }
}

/**
 * Factory function to create a new QueryKeys instance
 * @template T - The query item type that extends QueryItem
 * @template F - The filter type used for list queries
 * @param name - The name of the query used as base for all keys
 * @param queryClient - The React Query client instance
 * @returns New QueryKeys instance
 */
export const createQueryKeys = <T extends QueryItem, F>(name: string, queryClient: QueryClient) => {
  return new QueryKeys<T, F>(name, queryClient)
}
