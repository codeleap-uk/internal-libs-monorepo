import { CancelOptions, InfiniteData, InvalidateOptions, InvalidateQueryFilters, Query, QueryFilters, QueryKey, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { useMemo } from 'react'
import { TypeGuards } from '@codeleap/types'
import { ListPaginationResponse, ListSelector, PageParam, QueryClient, QueryItem } from '../types'
import deepEqual from 'fast-deep-equal'

export class QueryKeys<T extends QueryItem, F> {
  constructor(
    private queryName: string,
    private queryClient: QueryClient
  ) { }

  /**
   * keys
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

  useListKeyWithFilters(filters?: F) {
    return useMemo(() => {
      return this.listKeyWithFilters(filters)
    }, [filters])
  }

  useRetrieveKey(id: QueryItem['id']) {
    return useMemo(() => {
      return this.keys.retrieve(id)
    }, [id])
  }

  /**
   * utilities function
  */

  private predicateQueryKeyAll(queryName: string, query: Query<unknown, Error, unknown, QueryKey>) {
    const queryKey = query?.queryKey?.join('/')

    return queryKey?.includes(queryName)
  }

  private predicateQueryKeyList(queryName: string, query: Query<unknown, Error, unknown, QueryKey>, toIgnoreQueryKeys?: QueryKey | QueryKey[]) {
    const queryKey = query?.queryKey?.join('/')

    if (!TypeGuards.isNil(toIgnoreQueryKeys)) {
      const ignoreQueryKeys = Array.isArray(toIgnoreQueryKeys) ? toIgnoreQueryKeys : [toIgnoreQueryKeys]
      if (ignoreQueryKeys.some(k => deepEqual(query?.queryKey, k))) return false
    }

    const isListQueryKey = queryKey?.includes(queryName) && queryKey?.includes('list')

    return isListQueryKey
  }

  /**
   * invalidate functions
  */

  async invalidateAll(filters?: InvalidateQueryFilters<QueryKey>, options?: InvalidateOptions) {
    return this.queryClient.invalidateQueries({
      ...filters,
      predicate: (query) => this.predicateQueryKeyAll(this.queryName, query),
    }, options)
  }

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

  async invalidateRetrieve(id: QueryItem['id'], filters?: InvalidateQueryFilters<QueryKey>, options?: InvalidateOptions) {
    const queryKey = this.keys.retrieve(id)

    return this.queryClient.invalidateQueries({
      ...filters,
      queryKey,
    }, options)
  }

  /**
   * refetch functions
  */

  async refetchAll(filters?: RefetchQueryFilters<QueryKey>, options?: RefetchOptions) {
    return this.queryClient.refetchQueries({
      ...filters,
      predicate: (query) => this.predicateQueryKeyAll(this.queryName, query),
    }, options)
  }

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

  async refetchRetrieve(id: QueryItem['id'], filters?: RefetchQueryFilters<QueryKey>, options?: RefetchOptions) {
    const queryKey = this.keys.retrieve(id)

    return this.queryClient.refetchQueries({
      ...filters,
      queryKey,
    }, options)
  }

  /**
   * remove queries functions
  */

  async removeRetrieveQueryData(id: QueryItem['id'], filters?: QueryFilters<QueryKey>) {
    const queryKey = this.keys.retrieve(id)

    return this.queryClient.removeQueries({
      ...filters,
      queryKey,
    })
  }

  /**
   * cancel queries functions
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
   * data getters
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

  getRetrieveData(id: QueryItem['id'], onlyQueryData = false): T | undefined {
    if (TypeGuards.isNil(id)) return undefined

    const queryKey = this.keys.retrieve(id)

    const queryData = this.queryClient.getQueryData<T>(queryKey)

    if (!queryData?.id && !onlyQueryData) {
      const { itemMap } = this.getListData()

      return itemMap?.[id]
    }

    return queryData
  }

  /**
   * utils functions
   */

  getAllListQueries() {
    const queries = this.queryClient.getQueryCache().findAll({
      predicate: (query) => this.predicateQueryKeyList(this.queryName, query),
    })

    return queries as Query<ListPaginationResponse<T>, Error, Omit<ListSelector<T>, 'allItems'>, QueryKey>[]
  }
}

export const createQueryKeys = <T extends QueryItem, F>(name: string, queryClient: QueryClient) => {
  return new QueryKeys<T, F>(name, queryClient)
}
