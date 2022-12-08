// import { queryClient } from '@/services/api'
import { useMemo, useState } from 'react'
import { InfiniteData, QueryFunctionContext,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { AppendToPagination, OperationKey, PaginationReturn, UsePaginationParams } from './types'
import { getPaginationData, getPaginationKeys, getQueryKeys } from './utils'
import { TypeGuards } from '../../utils'

export function usePagination<
 TItem = any,
 TData extends PaginationReturn<TItem> = PaginationReturn<TItem>,
 P extends UsePaginationParams<TData> = UsePaginationParams<TData>
>(key: string | ReturnType<typeof getPaginationKeys>, params:P) {
  type OverrideParamType<K extends OperationKey> = Parameters<P['overrides'][K]>[0]

  function withOverride<
    K extends OperationKey
  >(op: K, values: Parameters<P['overrides'][K]>[0]): ReturnType<P['overrides'][K]> {
    const overrideFn:P['overrides'][K] = params?.overrides?.[op]
    const a:Parameters<typeof overrideFn>[0] = values
    if (overrideFn) {
      // @ts-ignore
      return overrideFn(a)
    }
    // @ts-ignore
    return values
  }

  const QUERY_KEYS = useMemo(() => {
    if (TypeGuards.isString(key)) {
      return getQueryKeys(key)
    }

    return {
      create: key.create.key,
      list: key.list.key,
      remove: key.remove.key,
      update: key.update.key,
      retrieve: key.retrieve.key(1).slice(0, 2),
    }
  }, [key])

  const [isRefreshing, setRefreshing] = useState(false)
  const queryClient = useQueryClient()

  const listFn = async ({ pageParam }:QueryFunctionContext<QueryKey, any>) => {
    const data = await params.onList(pageParam)
    return data as unknown as PaginationReturn<TData>
  }

  const defaultListParams:OverrideParamType<'list'> = {
    initialData: {
      pageParams: [
        {
          limit: params.limit,
          offset: 0,
        },
      ],
      pages: [],
    },
    refetchOnMount: (query) => {

      return query.state.dataUpdateCount === 0 || query.isStaleByTime()
    },
    getNextPageParam: (page, pages) => {
      const currentTotal = pages.reduce((acc, p) => p.results.length + acc, 0)

      if (currentTotal >= (page?.count || Infinity)) {
        return undefined
      }
      return {
        limit: params.limit,
        offset: currentTotal,
      }

    },
    queryFn: listFn,

    queryKey: QUERY_KEYS.list,
    keepPreviousData: true,

  }

  const list = useInfiniteQuery(withOverride('list', defaultListParams))

  type ListQueryData = typeof list.data

  type TItems = TData['results']

  const {
    flatItems,
    derivedData,
    pagesById,
    itemMap,
  } = useMemo(() => {
    const flatData = getPaginationData<TItems[number]>({
      keyExtractor: params.keyExtractor,
      queryKeyOrList: list.data,
      filter: params?.filter,
      derive: params?.deriveData,
    })

    return {
      ...flatData,
    }
  }, [list.dataUpdatedAt])

  const retrieveParams = (params?.where || []).filter(x => typeof x !== 'undefined')

  const defaultRetrieveParams:OverrideParamType<'retrieve'> = {
    queryKey: [...QUERY_KEYS.retrieve, ...retrieveParams],
    queryFn: async () => {
      if (retrieveParams.length) {

        return await params.onRetrieve(...retrieveParams)
      }
      return null
    },

    onSuccess(data) {
      if (!data) return

      queryClient.setQueryData<ListQueryData>(QUERY_KEYS.list, old => {
        const itemId = params.keyExtractor(data)
        if (!itemMap[itemId]) {
          old.pages[0].results.unshift(data)
          // @ts-ignore
          old.pageParams[0].limit += 1
        } else {
          const [itemPage, itemIdx] = pagesById[itemId]
          old.pages[itemPage].results[itemIdx] = data
        }

        return old
      })
    },

  }

  const retrieve = useQuery(withOverride('retrieve', defaultRetrieveParams))

  const append:AppendToPagination<TItem> = (args) => {
    return queryClient.setQueryData<ListQueryData>(QUERY_KEYS.list, old => {
      if (args.to == 'end') {
        const idx = old.pages.length - 1
        old.pages[idx].results.push(args.item)

        // @ts-ignore
        old.pageParams[idx].limit += 1

      } else {
        old.pages[0].results.unshift(args.item)
        // @ts-ignore
        old.pageParams[0].limit += 1

      }
      return old
    })
  }

  const defaultCreateParams:OverrideParamType<'create'> = {
    mutationKey: QUERY_KEYS.create,
    mutationFn: params.onCreate,
    async onMutate() {
      await params?.beforeMutate?.('create')
    },
    async onError() {
      await params?.afterMutate?.('create', {
        status: 'error',
      })
    },

    onSuccess(newItem) {

      params?.afterMutate?.('create', {
        status: 'success',
        item: newItem,
      })

      append({
        item: newItem,
        to: params?.appendTo,
      })

    },
  }
  const create = useMutation(withOverride('create', defaultCreateParams))

  const updateItem = (data:TItem) => {
    const itemId = params.keyExtractor(data)
    queryClient.setQueryData<ListQueryData>(QUERY_KEYS.list, old => {
      const [pageIdx, itemIdx] = pagesById[itemId]
      old.pages[pageIdx].results[itemIdx] = data
      return old
    })
  }
  const defaultUpdateParams:OverrideParamType<'update'> = {
    mutationKey: QUERY_KEYS.update,
    mutationFn: params.onUpdate,

    async onMutate() {
      await params?.beforeMutate?.('update')

    },
    async onError() {
      await params?.afterMutate?.('update', {
        status: 'error',
      })
    },
    async onSuccess(data) {
      await params?.afterMutate?.('update', {
        status: 'success',
        item: data,
      })

      updateItem(data)

    },

  }
  const update = useMutation(withOverride('update', defaultUpdateParams))

  const removeItem = (id:string|number):InfiniteData<PaginationReturn<TItem>> => {
    return queryClient.setQueryData<ListQueryData>(QUERY_KEYS.list, oldData => {
      const [pageIdx, itemIdx] = pagesById[id]

      oldData.pages[pageIdx].results.splice(itemIdx, 1)
      let updateIdx = pageIdx + 1

      while (updateIdx < oldData.pageParams.length) {
        if (TypeGuards.isUndefined(oldData?.pageParams?.[updateIdx])) {
          break
        }
        // @ts-ignore
        oldData.pageParams[updateIdx].offset -= 1
        updateIdx += 1
      }

      return oldData
    })
  }

  const defaultRemoveParams:OverrideParamType<'remove'> = {
    mutationKey: QUERY_KEYS.remove,
    mutationFn: params.onRemove,
    async onMutate() {
      await params?.beforeMutate?.('remove')

    },
    async onError() {
      await params?.afterMutate?.('remove', {
        status: 'error',
      })
    },
    async onSuccess(data) {
      const _id = params.keyExtractor(data)
      await params?.afterMutate?.('remove', {
        status: 'success',
        item: data,
      })

      removeItem(_id)

    },

  }
  const remove = useMutation(withOverride('remove', defaultRemoveParams))

  const listQuery = {
    ...list,
    isRefreshing,
    refresh: (...params: Parameters<typeof list.refetch>) => {
      setRefreshing(true)
      list.refetch(...params).then(() => {
        setRefreshing(false)
      })
    },
  }
  const itemName = params?.itemName || key
  type TDerivedData = ReturnType<typeof params.deriveData>
  return {
    items: flatItems,
    pagesById,
    itemMap,
    itemName,
    queries: {
      list: listQuery,
      update,
      remove,
      create,
      retrieve,
    },
    create: create.mutateAsync,
    remove: remove.mutateAsync,
    update: update.mutateAsync,
    derivedData,
    QUERY_KEYS,
    params,
    objects: {
      remove: removeItem,
      append,
      update: updateItem,
    },
    // flatListProps,
  }
}
