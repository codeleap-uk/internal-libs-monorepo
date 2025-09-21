import { FetchQueryOptions, InfiniteData, MutationFunctionContext, QueryKey, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { createQueryKeys, QueryKeys } from './QueryKeys'
import { createMutations, Mutations } from './Mutations'
import { CreateMutationCtx, CreateMutationOptions, ListPaginationResponse, ListQueryOptions, PageParam, QueryItem, QueryManagerOptions, RetrieveQueryOptions, UpdateMutationCtx, UpdateMutationOptions, DeleteMutationCtx, DeleteMutationOptions } from '../types'
import { generateTempId } from '../utils'
import { TypeGuards } from '@codeleap/types'

/**
 * - Remover actions
 * - Remover use
 * - rename, match de functions
 */

/**
 * - usePaginatedList
 * - next e previous precisa retornar undefined por conta do hasNextPage
 */

export class QueryManager<T extends QueryItem, F> {
  constructor(private options: QueryManagerOptions<T, F>) {
    this.queryKeys = createQueryKeys<T, F>(options.name, options.queryClient)
    this.mutations = createMutations<T, F>(this.queryKeys, options.queryClient, options.name)
  }

  get name() {
    return this.options.name
  }

  get functions() {
    return {
      list: this.options.listFn,
      retrieve: this.options.retrieveFn,
      create: this.options.createFn,
      update: this.options.updateFn,
      delete: this.options.deleteFn,
    }
  }

  queryKeys: QueryKeys<T, F>

  mutations: Mutations<T, F>

  /**
   * hooks
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

    const items = query.data?.allItems ?? []

    return {
      items,
      queryKey,
      query,
    }
  }

  useRetrieve(options: RetrieveQueryOptions<T>) {
    const {
      id,
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
        return this.options.retrieveFn(options?.id)
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
   * prefetch
   */

  prefetchRetrieve(id: T['id'], options: FetchQueryOptions<T, Error, T, QueryKey, never>) {
    return this.options.queryClient.prefetchQuery({
      ...options,
      queryKey: this.queryKeys.keys.retrieve(id),
      queryFn: () => this.options.retrieveFn(id),
    })
  }
}
