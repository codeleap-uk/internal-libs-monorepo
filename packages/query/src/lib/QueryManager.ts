import { FetchQueryOptions, InfiniteData, MutationFunctionContext, QueryKey, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { createQueryKeys, QueryKeys } from './QueryKeys'
import { createMutations, Mutations } from './Mutations'
import { CreateMutationCtx, CreateMutationOptions, ListPaginationResponse, ListQueryOptions, PageParam, QueryItem, QueryManagerOptions, RetrieveQueryOptions, UpdateMutationCtx, UpdateMutationOptions, DeleteMutationCtx, DeleteMutationOptions } from '../types'
import { generateTempId } from '../utils'
import { TypeGuards } from '@codeleap/types'

/**
 * Comprehensive query manager class that provides hooks and utilities for managing CRUD operations with React Query
 * @template T - The query item type that extends QueryItem
 * @template F - The filter type used for list queries
 * 
 * @description
 * QueryManager provides a complete solution for managing list and individual item queries with:
 * - Infinite scroll pagination for lists
 * - Optimistic updates for create, update, and delete operations
 * - Automatic cache synchronization between list and individual queries
 * - Built-in error handling and rollback mechanisms
 */
export class QueryManager<T extends QueryItem, F> {
  /**
   * Creates a new QueryManager instance
   * @param options - Configuration options for the query manager
   */
  constructor(private options: QueryManagerOptions<T, F>) {
    this.queryKeys = createQueryKeys<T, F>(options.name, options.queryClient)
    this.mutations = createMutations<T, F>(this.queryKeys, options.queryClient, options.name)
  }

  /**
   * Gets the name of this query manager
   * @returns The query name used for identification
   */
  get name() {
    return this.options.name
  }

  /**
   * Gets the configured CRUD functions
   * @returns Object containing all configured function handlers
   */
  get functions() {
    return {
      list: this.options.listFn,
      retrieve: this.options.retrieveFn,
      create: this.options.createFn,
      update: this.options.updateFn,
      delete: this.options.deleteFn,
    }
  }

  /** QueryKeys instance for managing query keys and cache operations */
  queryKeys: QueryKeys<T, F>

  /** Mutations instance for managing cache mutations */
  mutations: Mutations<T, F>

  /**
   * React hook for infinite scroll list queries with pagination
   * @param options - Configuration options for the list query
   * @returns Object containing items array, query key, and query object
   * 
   * @example
   * ```typescript
   * const { items, query } = queryManager.useList({
   *   filters: { status: 'active' },
   *   limit: 20
   * })
   * ```
   */
  useList(options: ListQueryOptions<T, F> = {}) {
    const {
      limit,
      filters,
      ...queryOptions
    } = options

    const listLimit = limit ?? this.options?.listLimit ?? 10

    const queryKey = this.queryKeys.useListKeyWithFilters(filters)

    const onSelect = useCallback((data: InfiniteData<ListPaginationResponse<T>, PageParam>) => {
      const pages = data?.pages ?? []

      return {
        pageParams: data?.pageParams,
        pages,
        allItems: pages.flat(),
      }
    }, [])

    const query = useInfiniteQuery({
      queryKey,

      queryFn: async (query) => {
        const listOffset = query?.pageParam ?? 0

        return this.options?.listFn?.(listLimit, listOffset, filters)
      },

      initialPageParam: 0,

      getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
        if (!lastPage?.length || lastPage.length < listLimit) {
          return undefined
        }

        return (lastPageParam ?? 0) + lastPage.length
      },

      getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) => {
        if ((firstPageParam ?? 0) <= 0) {
          return undefined
        }

        return (firstPageParam ?? 0) - listLimit
      },

      select(data) {
        return onSelect(data)
      },

      ...queryOptions,
    })

    const useListEffect = (this.options.useListEffect ?? ((args: any) => null))

    useListEffect(query)

    const items = query.data?.allItems ?? []

    return {
      items,
      queryKey,
      query,
    }
  }

  /**
   * React hook for retrieving a single item by ID
   * @param id - The ID of the item to retrieve
   * @param options - Configuration options for the retrieve query
   * @returns Object containing the item data, query key, and query object
   * 
   * @description
   * This hook automatically:
   * - Uses list cache as initial data if available
   * - Updates list cache when retrieve data changes
   * - Synchronizes data between list and individual caches
   * 
   * @example
   * ```typescript
   * const { item, query } = queryManager.useRetrieve('user-123', {
   *   enabled: !!userId
   * })
   * ```
   */
  useRetrieve(id: T['id'], options: RetrieveQueryOptions<T> = {}) {
    const {
      select,
      ...queryOptions
    } = options

    const onSelect = useCallback((data: T) => {
      this.mutations.updateItems(data)
      if (select) select?.(data)
      return data
    }, [select])

    const getInitialData = useCallback(() => {
      const { itemMap } = this.queryKeys.getListData()
      return itemMap?.[id]
    }, [id])

    const queryKey = this.queryKeys.useRetrieveKey(id)

    const query = useQuery({
      initialData: getInitialData,

      ...queryOptions,

      queryKey,

      queryFn: () => {
        return this.options.retrieveFn(id)
      },

      select: (data) => {
        return onSelect(data)
      },
    })

    return {
      item: query.data,
      queryKey,
      query,
    }
  }

  /**
   * React hook for creating new items with optimistic updates
   * @param options - Configuration options for the create mutation
   * @returns React Query mutation object for create operations
   * 
   * @description
   * This hook supports optimistic updates by:
   * - Immediately adding a temporary item to the cache
   * - Rolling back on error by removing the temporary item
   * - Replacing temporary item with real data on success
   * 
   * @example
   * ```typescript
   * const createMutation = queryManager.useCreate({
   *   optimistic: true,
   *   appendTo: 'start',
   *   listFilters: { status: 'active' }
   * })
   * 
   * // Usage
   * createMutation.mutate({ name: 'New User', email: 'user@example.com' })
   * ```
   */
  useCreate(options: CreateMutationOptions<T, F> = {}) {
    const {
      optimistic,
      listFilters,
      appendTo,
      onMutate: providedOnMutate,
      onError: providedOnError,
      onSuccess: providedOnSuccess,
      ...mutationOptions
    } = options

    const onMutate = useCallback(async (data: Partial<T>, context: MutationFunctionContext) => {
      if (providedOnMutate) providedOnMutate?.(data, context)

      if (optimistic) {
        await this.queryKeys.cancelListQueries(listFilters)

        const tempId = generateTempId()

        const newItem = { ...data, id: tempId } as T

        this.mutations.addItem(newItem, appendTo, listFilters)

        return {
          tempId,
        }
      }
    }, [providedOnMutate, optimistic, listFilters])

    const onError = useCallback((error: Error, variables: Partial<T>, onMutateResult: CreateMutationCtx, context: MutationFunctionContext) => {
      if (providedOnError) providedOnError?.(error, variables, onMutateResult, context)

      if (!TypeGuards.isNil(onMutateResult?.tempId)) {
        this.mutations.removeItem(onMutateResult?.tempId)
      }
    }, [providedOnError])

    const onSuccess = useCallback((data: T, variables: Partial<T>, onMutateResult: CreateMutationCtx, context: MutationFunctionContext) => {
      if (providedOnSuccess) providedOnSuccess?.(data, variables, onMutateResult, context)

      if (TypeGuards.isNil(onMutateResult?.tempId)) {
        this.mutations.addItem(data, appendTo, listFilters)
      } else {
        this.mutations.updateItems({ ...data, tempId: onMutateResult?.tempId })
      }
    }, [providedOnSuccess, listFilters])

    const mutation = useMutation<T, Error, Partial<T>, CreateMutationCtx>({
      ...mutationOptions,

      mutationKey: this.queryKeys.keys.create,

      mutationFn: (data: Partial<T>) => {
        return this.options.createFn(data)
      },

      onMutate,

      onError,

      onSuccess,
    })

    return mutation
  }

  /**
   * React hook for updating existing items with optimistic updates
   * @param options - Configuration options for the update mutation
   * @returns React Query mutation object for update operations
   * 
   * @description
   * This hook supports optimistic updates by:
   * - Immediately updating the item in cache with new data
   * - Rolling back to previous data on error
   * - Confirming updates with server response on success
   * 
   * @example
   * ```typescript
   * const updateMutation = queryManager.useUpdate({
   *   optimistic: true,
   *   onSuccess: (data) => console.log('Updated:', data)
   * })
   * 
   * // Usage
   * updateMutation.mutate({ id: 'user-123', name: 'Updated Name' })
   * ```
   */
  useUpdate(options: UpdateMutationOptions<T, F> = {}) {
    const {
      optimistic,
      onMutate: providedOnMutate,
      onError: providedOnError,
      onSuccess: providedOnSuccess,
      ...mutationOptions
    } = options

    const onMutate = useCallback(async (data: Partial<T>, context: MutationFunctionContext) => {
      if (providedOnMutate) providedOnMutate?.(data, context)

      if (optimistic) {
        const previousItem = this.queryKeys.getRetrieveData(data?.id)

        if (!previousItem) return

        const optimisticItem = {
          ...previousItem,
          ...data,
        } as T

        this.mutations.updateItems(optimisticItem)

        return {
          previousItem,
          optimisticItem,
        }
      }
    }, [providedOnMutate, optimistic])

    const onError = useCallback((error: Error, variables: Partial<T>, onMutateResult: UpdateMutationCtx<T>, context: MutationFunctionContext) => {
      if (providedOnError) providedOnError?.(error, variables, onMutateResult, context)

      if (!TypeGuards.isNil(onMutateResult?.previousItem?.id)) {
        this.mutations.updateItems(onMutateResult?.previousItem)
      }
    }, [providedOnError])

    const onSuccess = useCallback((data: T, variables: Partial<T>, onMutateResult: UpdateMutationCtx<T>, context: MutationFunctionContext) => {
      if (providedOnSuccess) providedOnSuccess?.(data, variables, onMutateResult, context)

      this.mutations.updateItems(data)
    }, [providedOnSuccess])

    const mutation = useMutation<T, Error, Partial<T>, UpdateMutationCtx<T>>({
      ...mutationOptions,

      mutationKey: this.queryKeys.keys.update,

      mutationFn: (data: Partial<T>) => {
        return this.options.updateFn(data)
      },

      onMutate,

      onError,

      onSuccess,
    })

    return mutation
  }

  /**
   * React hook for deleting items with optimistic updates
   * @param options - Configuration options for the delete mutation
   * @returns React Query mutation object for delete operations
   * 
   * @description
   * This hook supports optimistic updates by:
   * - Immediately removing the item from cache
   * - Storing the removal positions for potential rollback
   * - Restoring the item to original positions on error
   * - Confirming deletion on success
   * 
   * @example
   * ```typescript
   * const deleteMutation = queryManager.useDelete({
   *   optimistic: true,
   *   onSuccess: () => console.log('Item deleted successfully')
   * })
   * 
   * // Usage
   * deleteMutation.mutate('user-123')
   * ```
   */
  useDelete(options: DeleteMutationOptions<T, F> = {}) {
    const {
      optimistic,
      onMutate: providedOnMutate,
      onError: providedOnError,
      onSuccess: providedOnSuccess,
      ...mutationOptions
    } = options

    const onMutate = useCallback(async (id: T['id'], context: MutationFunctionContext) => {
      if (providedOnMutate) providedOnMutate?.(id, context)

      if (optimistic) {
        const previousItem = this.queryKeys.getRetrieveData(id)

        if (!previousItem) return

        const removedAt = this.mutations.removeItem(id)

        return {
          previousItem,
          removedAt,
        }
      }
    }, [providedOnMutate, optimistic])

    const onError = useCallback((error: Error, variables: T['id'], onMutateResult: DeleteMutationCtx<T>, context: MutationFunctionContext) => {
      if (providedOnError) providedOnError?.(error, variables, onMutateResult, context)

      if (!TypeGuards.isNil(onMutateResult?.previousItem?.id)) {
        this.mutations.addItem(
          onMutateResult?.previousItem,
          onMutateResult?.removedAt,
        )
      }
    }, [providedOnError])

    const onSuccess = useCallback((data: T['id'], variables: T['id'], onMutateResult: DeleteMutationCtx<T>, context: MutationFunctionContext) => {
      if (providedOnSuccess) providedOnSuccess?.(data, variables, onMutateResult, context)

      if (TypeGuards.isNil(onMutateResult?.previousItem?.id)) {
        this.mutations.removeItem(data)
      }
    }, [providedOnSuccess])

    const mutation = useMutation<unknown, Error, T['id'], DeleteMutationCtx<T>>({
      ...mutationOptions,

      mutationKey: this.queryKeys.keys.delete,

      mutationFn: async (id: QueryItem['id']) => {
        return this.options.deleteFn(id)
      },

      onMutate,

      onError,

      onSuccess,
    })

    return mutation
  }

  /**
   * Prefetches a single item by ID for improved performance
   * @param id - The ID of the item to prefetch
   * @param options - Prefetch options compatible with React Query
   * @returns Promise that resolves when prefetch is complete
   * 
   * @description
   * Use this method to preload data that users are likely to need soon,
   * such as when hovering over links or preparing for navigation.
   * 
   * @example
   * ```typescript
   * // Prefetch on hover
   * const handleHover = (userId: string) => {
   *   queryManager.prefetchRetrieve(userId, { staleTime: 5 * 60 * 1000 })
   * }
   * ```
   */
  prefetchRetrieve(id: T['id'], options: FetchQueryOptions<T, Error, T, QueryKey, never>) {
    return this.options.queryClient.prefetchQuery({
      ...options,
      queryKey: this.queryKeys.keys.retrieve(id),
      queryFn: () => this.options.retrieveFn(id),
    })
  }
}
