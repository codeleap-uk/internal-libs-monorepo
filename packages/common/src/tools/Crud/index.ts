/* eslint-disable max-lines */
import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  hashQueryKey,
  QueryKey,
} from '@tanstack/react-query'

import { useRef, useState } from 'react'
import { usePromise } from '../..'
import { isArray } from '../../utils/typeGuards'
import {
  QueryManagerItem,

  AppendToPagination,
  CreateOptions,
  QueryManagerOptions,
  MutationCtx,
  QueryStateValue,
  InfinitePaginationData,
  QueryManagerActions,
  UpdateOptions,
  UseManagerArgs,
  GetItemOptions,
} from './types'

export * from './types'

export class QueryManager<
  T extends QueryManagerItem,
  ExtraArgs extends Record<string, any> = any,
  Actions extends QueryManagerActions<T, ExtraArgs> = QueryManagerActions<T, ExtraArgs>
> {
  options: QueryManagerOptions<T>

  itemMap: Record<T['id'], T>

  queryStates: Record<string, QueryStateValue<T>> = {}

  constructor(options: QueryManagerOptions<T, ExtraArgs>) {
    this.options = options

    this.itemMap = {} as Record<T['id'], T>
  }

  extractKey(item:T) {
    return this.options?.keyExtractor?.(item) ?? item.id
  }

  get keySuffixes() {
    return {
      list: 'list',
      infiniteList: 'infinite-list',
      create: 'create',
      update: 'update',
      delete: 'delete',
      retrieve: 'retrieve',
    }
  }

  get actions() {
    const actions = this.options.actions ?? {} as Actions

    const actionKeys = Object.keys(actions)

    const actionFunctions = actionKeys.reduce((acc, key) => {
      const action = actions[key]
      // @ts-ignore
      acc[key] = (...args: any[]) => {
        return action(this, ...args)
      }

      return acc
    }, {} as Actions)

    return actionFunctions
  }

  generateId() {
    return this.options.generateId?.() ?? Date.now().toString()

  }

  async updateItems(items: T | T[]) {
    const itemArr = Array.isArray(items) ? items : [items]

    const ids = itemArr.map((i) => {
      const id = this.extractKey(i)
      this.itemMap[id] = i
      return id
    })

    const promises = Object.values(this.queryStates).map(async ({ key, pagesById }) => {

      this.queryClient.setQueryData<InfinitePaginationData<T>>(key, (old) => {
        ids.forEach((id) => {
          if (!pagesById[id]) return
          const [pageIdx, itemIdx] = pagesById[id]

          old.pages[pageIdx].results[itemIdx] = this.itemMap[id]

        })

        return old
      })
    })

    await Promise.all(promises)

  }

  async getItem(itemId: T['id'], options?: GetItemOptions<T>) {
    const i = this.itemMap[itemId]

    if ((!i && !!options.fetchOnNotFoud) || options.forceRefetch) {
      const item = await this.options.retrieveItem(itemId)
      this.updateItems(item)
      return item
    }
    return i
  }

  addItem: AppendToPagination<T> = async (args) => {

    const promises = Object.entries(this.queryStates).map(async ([hashedKey, { key, pagesById }]) => {

      this.queryClient.setQueryData<InfinitePaginationData<T>>(key, (old) => {
        const itemsToAppend = isArray(args.item) ? args.item : [args.item]
        if (args.to == 'end') {
          const idx = old.pages.length - 1
          old.pages[idx].results.push(...itemsToAppend)

          // @ts-ignore
          old.pageParams[idx].limit += itemsToAppend.length

        } else if (args.to === 'start') {
          old.pages[0].results.unshift(...itemsToAppend)
          // @ts-ignore
          old.pageParams[0].limit += itemsToAppend.length

        } else if (!!args.to) {
          const appendTo = isArray(args.to) ? args.to : args.to[hashedKey]

          const [pageIdx, itemIdx] = appendTo
          old.pages[pageIdx].results.splice(itemIdx, 0, ...itemsToAppend)
          // @ts-ignore
          old.pageParams[pageIdx].limit += itemsToAppend.length

        }
        return old
      })
    })

    await Promise.all(promises)

  }

  async removeItem(itemId: T['id']) {

    const removedPositions = {} as Record<string, [number, number]>

    const promises = Object.entries(this.queryStates).map(async ([hashedKey, { key, pagesById }]) => {

      this.queryClient.setQueryData<InfinitePaginationData<T>>(key, (old) => {
        const [itemPage, itemIdx] = pagesById[itemId]

        old.pages[itemPage].results.splice(itemIdx, 1)
        // @ts-ignore
        old.pageParams[itemPage].limit -= 1

        removedPositions[hashedKey] = [itemPage, itemIdx]
        return old
      })
    })

    await Promise.all(promises)

    return removedPositions
  }

  transformData(data: InfinitePaginationData<T>, key: QueryKey) {
    const pagesById = {} as Record<T['id'], [number, number]>
    const flatItems = [] as T[]
    const itemIndexes = {} as Record<T['id'], number>

    const hashedKey = hashQueryKey(key)

    let pageIdx = 0

    for (const page of data.pages) {

      page.results.forEach((i, itemIdx) => {
        const flatIdx = flatItems.length
        const itemId = i.id

        const include = true

        if (include) {
          flatItems.push(i)
        }
        pagesById[itemId] = [pageIdx, itemIdx]
        this.itemMap[itemId] = i
        itemIndexes[itemId] = flatIdx
      })
      pageIdx += 1
    }

    this.queryStates[hashedKey] = {
      itemIndexes: { ...this.queryStates[hashedKey]?.itemIndexes, ...itemIndexes },
      pagesById: { ...this.queryStates[hashedKey]?.pagesById, ...pagesById },
      key,
    }

    return {
      itemMap: this.itemMap,
      pagesById,
      itemIndexes,
      itemList: flatItems,
    }
  }

  get queryKeys() {
    return {
      list: [this.name, this.keySuffixes.list],
      // infiniteList: [this.name, this.keySuffixes.infiniteList],
      create: [this.name, this.keySuffixes.create],
      update: [this.name, this.keySuffixes.update],
      delete: [this.name, this.keySuffixes.delete],
      retrieve: [this.name, this.keySuffixes.retrieve],

    }
  }

  get name() {
    return this.options.name
  }

  get standardLimit() {
    return this.options.limit ?? 10
  }

  get queryClient() {
    return this.options.queryClient
  }

  queryKeyFor(itemId: T['id']) {
    return [this.name, this.keySuffixes.retrieve, itemId]
  }

  filteredQueryKey(filters?: ExtraArgs) {
    return [...this.queryKeys.list, filters]
  }

  useList(args?: ExtraArgs) {
    const [isRefreshing, setRefreshing] = useState(false)

    const queryKey = this.filteredQueryKey(args)

    const hashedKey = hashQueryKey(queryKey)

    const query = useInfiniteQuery({
      queryKey,
      initialData: {
        pageParams: [
          {
            limit: this.standardLimit,
            offset: 0,
          },
        ],
        pages: [],
      },
      queryFn: async (query) => {

        return this.options.listItems(this.standardLimit, query.pageParam?.offset ?? 0, args)
      },
      refetchOnMount: (query) => {
        return query.state.dataUpdateCount === 0 || query.isStaleByTime()
      },
      getNextPageParam: (lastPage, pages) => {
        const currentTotal = pages.reduce((acc, p) => p.results.length + acc, 0)

        if (currentTotal >= (lastPage?.count || Infinity)) {
          return undefined
        }
        return {
          limit: this.standardLimit,
          offset: currentTotal,
        }
      },
      select: (data: InfinitePaginationData<T>) => {

        const { itemList } = this.transformData(data, queryKey)

        return {
          pageParams: data.pageParams,
          pages: data.pages,
          flatItems: itemList,
        }

      },
      keepPreviousData: true,
    })

    const refresh = async () => {
      setRefreshing(true)
      await this.refresh(args)
      setRefreshing(false)
    }

    return {
      // @ts-ignore
      items: query.data?.flatItems,
      query,
      getNextPage: query.fetchNextPage,
      getPreviousPage: query.fetchPreviousPage,
      refresh,
      isRefreshing,
      itemMap: this.itemMap,
      pagesById: this.queryStates[hashedKey]?.pagesById ?? {},
      itemIndexes: this.queryStates[hashedKey]?.itemIndexes ?? {},
    }
  }

  useRetrieve(itemId: T['id']) {
    const [isRefreshing, setRefreshing] = useState(false)

    const query = useQuery({
      queryKey: this.queryKeyFor(itemId),
      initialData: () => {
        return this.itemMap[itemId]
      },
      queryFn: () => {
        return this.options.retrieveItem(itemId)
      },
      select: (data) => {
        this.updateItems(data)
        return data
      },
    })

    const refresh = async () => {
      setRefreshing(true)
      await this.refreshItem(itemId)
      setRefreshing(false)
    }

    return {
      data: query.data,
      query,
      refresh,
      isRefreshing,
    }
  }

  useItem(itemId: T['id']) {
    return this.useRetrieve(itemId)
  }

  useCreate(options?: CreateOptions, filters?: ExtraArgs) {

    const tmpOptions = useRef<CreateOptions>(options ?? this.options.creation ?? {
      appendTo: 'start',
      optimistic: false,
    })

    const getOptimisticItem = usePromise<T>({
      timeout: 1200,
    })

    const query = useMutation({
      mutationKey: this.queryKeys.create,
      mutationFn: (data: Partial<T>) => {
        return this.options.createItem(data)
      },

      onMutate: async (data) => {
        if (tmpOptions?.current?.optimistic) {
          await this.queryClient.cancelQueries({ queryKey: this.queryKeys.list })
          const addedItem = {
            id: this.generateId(),
            ...data,
          } as T
          getOptimisticItem.resolve(addedItem)

          const addedId = this.extractKey(addedItem)

          this.addItem({
            item: addedItem,
            to: this.options.creation?.appendTo || 'start',
          })

          return {
            // previousData,
            addedId,
          }
        }
      },
      onError: (error, data, ctx: MutationCtx<T>) => {
        const isOptimistic = tmpOptions.current?.optimistic

        if (isOptimistic) {
          this.removeItem(ctx.addedId)
        }
      },
      onSuccess: (data) => {
        if (!tmpOptions.current?.optimistic) {
          this.addItem({
            item: data,
            to: this.options.creation?.appendTo || 'start',
          })

        } else {
          this.updateItems(data)
        }
      },
    })

    const createItem = async (data: Partial<T>, options?: CreateOptions) => {
      const prevOptions = tmpOptions.current
      if (!!options) {

        tmpOptions.current = options
      }
      let res: T = null

      if (tmpOptions.current?.optimistic) {
        query.mutateAsync(data)
        res = await getOptimisticItem.await()
      } else {
        res = await query.mutateAsync(data)
      }

      if (!!options) {
        tmpOptions.current = prevOptions
      }

      return res
    }

    return {
      item: query.data,
      create: createItem,
      query,
    }
  }

  useUpdate(options?: UpdateOptions, filters?: ExtraArgs) {
    const tmpOptions = useRef<UpdateOptions>(options ?? this.options.update ?? {
      optimistic: false,
    })

    const getOptimisticItem = usePromise<T>({
      timeout: 1200,
    })

    const query = useMutation({
      mutationKey: this.queryKeys.update,
      onMutate: async (data) => {

        if (tmpOptions.current?.optimistic) {

          const prevItem = await this.getItem(data.id, {
            fetchOnNotFoud: false,
          })

          if (!prevItem) return

          const optimisticItem:T = {
            ...prevItem,
            ...data,
          }

          getOptimisticItem.resolve(optimisticItem)

          this.updateItems(optimisticItem)

          return {
            previousItem: prevItem,
            optimisticItem,

          } as MutationCtx<T>
        }
      },
      onError: (error, data, ctx: MutationCtx<T>) => {
        if (tmpOptions.current?.optimistic && !!ctx?.previousItem?.id) {
          this.updateItems(
            ctx.previousItem,
          )
        }
      },
      mutationFn: (data: Partial<T>) => {
        return this.options.updateItem(data)
      },
      onSuccess: (data) => {
        this.updateItems(data)
      },
    })

    const update = async (data: Partial<T>, options?: UpdateOptions) => {
      const prevOptions = tmpOptions.current
      if (!!options) {

        tmpOptions.current = options
      }

      let res: T = null

      if (tmpOptions.current?.optimistic) {
        query.mutateAsync(data)
        res = await getOptimisticItem.await()
      } else {

        res = await query.mutateAsync(data)
      }

      if (!!options) {
        tmpOptions.current = prevOptions
      }

      return res
    }

    return {
      update,
      query,
      item: query.data,
    }
  }

  useDelete(options?: UpdateOptions, filters?: ExtraArgs) {

    const tmpOptions = useRef<UpdateOptions>(options ?? this.options?.deletion ?? {
      optimistic: false,
    })

    const getOptimisticItem = usePromise<T>({
      timeout: 1200,
    })

    const query = useMutation({
      mutationKey: this.queryKeys.delete,

      onMutate: async (data) => {
        if (tmpOptions.current?.optimistic) {

          const prevItem = await this.getItem(data.id, {
            fetchOnNotFoud: false,
          })

          getOptimisticItem.resolve(prevItem)

          const removedAt = await this.removeItem(data.id)

          if (!prevItem) return

          return {
            previousItem: prevItem,
            prevItemPages: removedAt,
          } as MutationCtx<T>

        }
      },
      mutationFn: (data: T) => {
        return this.options.deleteItem(data)
      },
      onError: (error, data, ctx: MutationCtx<T>) => {
        if (!!ctx?.previousItem?.id && tmpOptions.current?.optimistic) {
          this.addItem({
            item: ctx.previousItem,
            to: ctx.prevItemPages,
          })
        }
      },
      onSuccess: (data) => {
        if (!tmpOptions.current?.optimistic) {
          this.removeItem(data.id)
        }
      },

    })

    const _delete = async (data: T, options?: UpdateOptions) => {
      const prevOptions = tmpOptions.current
      if (!!options) {

        tmpOptions.current = options
      }

      let prevItem = null

      if (tmpOptions.current?.optimistic) {
        query.mutateAsync(data)
        prevItem = await getOptimisticItem.await()
      } else {
        prevItem = await query.mutateAsync(data)
      }

      if (!!options) {
        tmpOptions.current = prevOptions
      }

      return prevItem
    }

    return {
      delete: _delete,
      query,
    }
  }

  async refreshItem(itemId: T['id']) {
    const newItem = await this.getItem(itemId, {
      fetchOnNotFoud: true,
      forceRefetch: true,
    })

    this.queryClient.setQueryData(this.queryKeyFor(itemId), newItem)

    this.updateItems(newItem)

    return newItem
  }

  async refresh(filters?: ExtraArgs) {
    if (!!filters) {
      const key = this.filteredQueryKey(filters)
      await this.queryClient.refetchQueries(key)
    } else {

      this.queryClient.removeQueries(this.queryKeys.list)
    }
  }

  setItem(item: T) {
    return this.updateItems(item)
  }

  use(options?: UseManagerArgs<T, ExtraArgs>) {
    const list = this.useList(options.filter)
    const create = this.useCreate(options.creation, options.filter)
    const update = this.useUpdate(options.update, options.filter)
    const del = this.useDelete(options.deletion, options.filter)

    return {
      items: list.items,
      list,
      itemMap: list.itemMap,
      create: create.create,
      update: update.update,
      delete: del.delete,
      getNextPage: list.getNextPage,
      getPreviousPage: list.getPreviousPage,
      refreshItem: this.refreshItem.bind(this),
      setItem: this.setItem.bind(this),
      refresh: list.refresh,
      isRefreshing: list.isRefreshing,
      actions: this.actions,
      updatedAt: list.query.dataUpdatedAt,
    }
  }

}

