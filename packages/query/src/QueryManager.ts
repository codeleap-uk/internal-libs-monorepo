/* eslint-disable max-lines */
import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  hashKey,
  QueryKey,
} from '@tanstack/react-query'
import { Draft, produce } from 'immer'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { deepMerge } from '@codeleap/utils'
import { usePromise } from '@codeleap/hooks'
import { TypeGuards } from '@codeleap/types'
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
  DeleteOptions,
  SettableOptions,
  QueryManagerMeta,
  ListOptions,
  RetrieveOptions,
  OptionChangeListener,
  QueryManagerActionTriggers,
  UseActionOptions,
  PaginationResponse,
  UseListSelector,
  PageParam,
} from './types'

export * from './types'

export class QueryManager<
  T extends QueryManagerItem,
  ExtraArgs extends Record<string, any> = any,
  Meta extends QueryManagerMeta = QueryManagerMeta,
  Actions extends QueryManagerActions<T, ExtraArgs, Meta> = QueryManagerActions<T, ExtraArgs, Meta>
> {

  options: QueryManagerOptions<T, ExtraArgs, Meta, Actions>

  meta: Meta

  itemMap: Record<T['id'], T>

  queryStates: Record<string, QueryStateValue<T>> = {}

  optionListeners: OptionChangeListener<QueryManagerOptions<T, ExtraArgs, Meta, Actions>>[]

  constructor(options: QueryManagerOptions<T, ExtraArgs, Meta, Actions>) {
    this.options = options

    this.itemMap = {} as Record<T['id'], T>

    this.meta = options?.initialMeta

    this.optionListeners = []

    this.queryStates = {
      [hashKey(this.filteredQueryKey())]: {
        itemIndexes: {},
        pagesById: {},
        key: this.queryKeys.list,
      } as unknown as QueryStateValue<T>,
    }
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
    }, {} as QueryManagerActionTriggers<Actions>)

    return actionFunctions
  }

  generateId() {
    return this.options.generateId?.() ?? this.knownItemCount()?.count + 1

  }

  useOptions(cb?: OptionChangeListener<QueryManagerOptions<T, ExtraArgs, Meta, Actions>>) {
    const [options, setOptions] = useState(this.options)
    const [meta, setMeta] = useState(this.meta)

    useEffect(() => {
      const idx = this.optionListeners.push((o, meta) => {
        setOptions(o)
        setMeta(meta)
        cb?.(o, meta)
      }) - 1

      return () => {
        this.optionListeners.splice(idx, 1)
      }
    })

    return [options, meta] as const
  }

  async updateItems(items: T | T[], settingIds?: T['id'] | T['id'][]) {
    const itemArr = Array.isArray(items) ? items : [items]

    const setIdsTo = TypeGuards.isNil(settingIds) ? settingIds : TypeGuards.isArray(settingIds) ? settingIds : [settingIds]

    const newItems = []

    const ids = itemArr.map((i, idx) => {
      const id = this.extractKey(i)

      let newId = id

      let withNewId = i

      if (setIdsTo?.[idx]) {
        newId = setIdsTo[idx]

        withNewId = {
          ...(this.itemMap[id] ?? {}),
          ...i,
          id: newId,
        }

        delete this.itemMap[id]
      }

      this.itemMap[withNewId.id] = withNewId

      this.queryClient.setQueryData<T>(this.queryKeyFor(id), (old) => {

        return withNewId
      })

      if (!TypeGuards.isNil(newId)) {
        this.queryClient.setQueryData<T>(this.queryKeyFor(newId), (old) => {
          return withNewId
        })
      }
      newItems.push(withNewId)
      return id
    })

    const promises = Object.values(this.queryStates).map(async ({ key, pagesById }) => {

      this.queryClient.setQueryData<InfinitePaginationData<T>>(key, (old) => {
        if (!old) return old

        ids.forEach((id, idx) => {
          if (!pagesById[id]) return
          const [pageIdx, itemIdx] = pagesById[id]

          const newItem = newItems[idx]

          old.pages[pageIdx].results[itemIdx] = newItem

        })

        this.transformData(old, key)
        return old
      })

    })

    await Promise.all(promises)

  }

  async getItem(itemId: T['id'], options?: GetItemOptions<T>) {
    const i = this.itemMap[itemId]

    if ((!i && !!options?.fetchOnNotFoud) || options?.forceRefetch) {
      const item = await this.options.retrieveItem(itemId)
      this.updateItems(item)
      return item
    }
    return i
  }

  addItem: AppendToPagination<T, ExtraArgs> = async (args) => {
    const updateOnList = TypeGuards.isUndefined(args?.onListsWithFilters) ? undefined : hashKey(
      this.filteredQueryKey(args.onListsWithFilters),
    )

    const promises = Object.entries(this.queryStates).map(async ([hashedKey, { key }]) => {
      if (!TypeGuards.isUndefined(updateOnList)) {
        if (updateOnList !== hashedKey) {
          return
        }
      }

      this.queryClient.setQueryData<InfinitePaginationData<T>>(key, (_old) => {
        const newData = produce(_old, (old) => {
          if (!old?.pages?.length || (old?.pages?.length > 1 && old?.pages?.every(page => page.results.length <= 0))) {
            old = {
              pageParams: [],
              pages: [
                {
                  results: [],
                  count: 0,
                  next: null,
                  previous: null,
                },
              ],
            }
          }

          const itemsToAppend = (TypeGuards.isArray(args.item) ? args.item : [args.item]) as Draft<T>[]

          if (args.to === 'end') {
            const idx = old.pages.length - 1
            old.pages[idx].results.push(...itemsToAppend)

            old.pages[idx].count += itemsToAppend.length

            if (old.pageParams[idx]) {
              // @ts-ignore
              old.pageParams[idx].limit += itemsToAppend.length
            } else {
              old.pageParams[idx] = {
                limit: this.options?.limit ?? itemsToAppend.length,
                offset: 0,
              }
            }

          } else if (args.to === 'start') {
            old.pages[0].results.unshift(...itemsToAppend)
            // @ts-ignore

            if (old.pageParams[0]) {
              // @ts-ignore
              old.pageParams[0].offset -= itemsToAppend.length
              // @ts-ignore
              old.pageParams[0].limit += itemsToAppend.length
            } else {
              old.pageParams[0] = {
                limit: itemsToAppend.length,
                offset: -itemsToAppend.length,
              }
            }

          } else if (!!args.to) {
            const appendTo = TypeGuards.isArray(args.to) ? args.to : args.to[hashedKey]

            const [pageIdx, itemIdx] = appendTo
            old.pages[pageIdx].results.splice(itemIdx, 0, ...itemsToAppend)

            if (old.pageParams[pageIdx]) {
              // @ts-ignore
              old.pageParams[pageIdx].offset -= itemsToAppend.length
              // @ts-ignore
              old.pageParams[pageIdx].limit += itemsToAppend.length
            } else {
              old.pageParams[pageIdx] = {
                limit: itemsToAppend.length,
                offset: -itemsToAppend.length,
              }
            }
          }
        })

        this.transformData(newData, key)

        return newData
      })
    })

    await Promise.all(promises)
  }

  useAction<T extends keyof Actions>(
    action: T,
    options?: UseActionOptions<Actions[T]>,
  ) {
    const mut = useMutation({
      mutationKey: [this.name, action, options?.mutationKey],
      mutationFn: (vars) => this.options.actions[action](this, vars),
      ...options,
    })

    return mut
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

    const hashedKey = hashKey(key)

    let pageIdx = 0

    for (const page of data?.pages ?? []) {

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

  getList(forFilters?: ExtraArgs) {
    return this.queryClient.getQueryData<InfinitePaginationData<T>>(this.filteredQueryKey(forFilters))
  }

  getListState(forFilters?: ExtraArgs) {
    return this.queryClient.getQueryState<InfinitePaginationData<T>>(this.filteredQueryKey(forFilters))
  }

  getItemCount(forFilters?: ExtraArgs) {
    return this.getList(forFilters)?.pages.reduce((acc, p) => Math.max(p.count, acc), 0)
  }

  knownItemCount() {
    const res = Object.values(this.queryStates).reduce<{ count: number; lastDatetime?: number }>((acc, { key }) => {
      const state = this.queryClient.getQueryState<InfinitePaginationData<T>>(key)

      const lastDatetime = acc.lastDatetime ?? 0

      if (state?.dataUpdatedAt > lastDatetime) {
        acc.lastDatetime = state.dataUpdatedAt
        const totals = state.data?.pages.reduce((acc, p) => Math.max(p.count, acc), 0)

        acc.count = totals
      }

      return acc
    }, {
      count: 0,
      lastDatetime: null,
    })

    return res
  }

  queryKeyFor(itemId: T['id']) {
    return [this.name, this.keySuffixes.retrieve, itemId]
  }

  filteredQueryKey(filters = {} as ExtraArgs) {
    return [...this.queryKeys.list, filters]
  }

  useList(options: ListOptions<T, ExtraArgs> = {}) {
    const [isRefreshing, setRefreshing] = useState(false)

    const {
      filter = {} as ExtraArgs,
      queryOptions,
      limit = this.standardLimit,
    } = options

    const queryKey = this.filteredQueryKey(filter)

    const hashedKey = hashKey(queryKey)

    const useListEffect = this.options?.useListEffect ?? (() => null)

    const select:ListOptions<T, ExtraArgs>['queryOptions']['select'] = useCallback((data) => {

      const { itemList } = this.transformData(data, queryKey)

      return {
        pageParams: data.pageParams,
        pages: data?.pages ?? [],
        flatItems: itemList,
      }

    }, [])

    const query = useInfiniteQuery<PaginationResponse<T>, Error, UseListSelector<T>, QueryKey, PageParam>({
      queryKey,

      initialPageParam: {
        limit,
        offset: 0,
      },
      queryFn: async (query) => {

        return this.options.listItems(limit, query.pageParam?.offset ?? 0, filter)
      },
      refetchOnMount: (query) => {

        if (TypeGuards.isBoolean(queryOptions?.refetchOnMount) || TypeGuards.isString(queryOptions?.refetchOnMount)) {
          return queryOptions?.refetchOnMount
        }
        return query.state.dataUpdateCount === 0 || query.isStaleByTime()
      },
      getNextPageParam: (lastPage, pages) => {
        const currentTotal = pages.reduce((acc, p) => p.results.length + acc, 0)

        if (currentTotal >= (lastPage?.count || Infinity)) {
          return undefined
        }
        return {
          limit: limit,
          offset: currentTotal,
        }
      },
      getPreviousPageParam: (lastPage, pages) => {
        const currentTotal = pages.reduce((acc, p) => p.results.length + acc, 0)

        if (currentTotal >= (lastPage?.count || Infinity)) {
          return undefined
        }
        return {
          limit: limit,
          offset: currentTotal,
        }
      },
      select,

      ...queryOptions,

    })

    const refresh = async () => {
      setRefreshing(true)
      await this.refresh(filter)
      setRefreshing(false)
    }

    const listEffect = useListEffect({
      query,
      refreshQuery: (silent = true) => silent ? this.refresh(filter) : refresh(),
      cancelQuery: () => this.queryClient.cancelQueries({ queryKey }),
    })

    const itemCount = useMemo(() => {
      return query.data?.pages.reduce((acc, p) => Math.max(p.count, acc), 0)
    }, [query.data])

    // @ts-ignore
    const items = query.data?.flatItems ?? []

    return {
      items: items as T[],
      query,
      getNextPage: query.fetchNextPage,
      getPreviousPage: query.fetchPreviousPage,
      refresh,
      isRefreshing,
      itemMap: this.itemMap,
      pagesById: this.queryStates[hashedKey]?.pagesById ?? {},
      itemIndexes: this.queryStates[hashedKey]?.itemIndexes ?? {},
      itemCount,
    }
  }

  useRetrieve(options?: RetrieveOptions<T>) {
    const [isRefreshing, setRefreshing] = useState(false)

    const itemId = options?.id

    const select:RetrieveOptions<T>['queryOptions']['select'] = useCallback((data) => {
      this.updateItems(data)
      return data
    }, [])

    const query = useQuery({
      queryKey: this.queryKeyFor(itemId),
      initialData: () => {
        return this.itemMap[itemId]
      },
      queryFn: () => {
        return this.options.retrieveItem(itemId)
      },
      select,

      ...options?.queryOptions,
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

  useItem(options?: RetrieveOptions<T>) {
    return this.useRetrieve(options)
  }

  useCreate(options?: CreateOptions<T>) {

    const [managerOptions, meta] = this.useOptions()

    const tmpOptions = useRef<CreateOptions<T>>(options ?? managerOptions.creation ?? {
      appendTo: 'start',
      optimistic: false,
    })

    const getOptimisticItem = usePromise<T>({
      timeout: 1200,
    })

    const query = useMutation({
      ...options?.mutationOptions,
      mutationFn: (data: Partial<T>) => {
        return this.options.createItem(data)
      },
      mutationKey: this.queryKeys.create,
      onMutate: async (data) => {
        options?.mutationOptions?.onMutate?.(data)
        if (!!tmpOptions?.current?.optimistic) {
          await this.queryClient.cancelQueries({ queryKey: this.queryKeys.list })
          const addedItem = {
            id: this.generateId(),
            ...data,
          } as T
          getOptimisticItem.resolve(addedItem)

          const addedId = this.extractKey(addedItem)

          this.addItem({
            item: addedItem,
            to: tmpOptions?.current?.appendTo || managerOptions.creation?.appendTo || 'start',
            onListsWithFilters: tmpOptions.current?.onListsWithFilters,
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
            to: tmpOptions?.current?.appendTo || managerOptions.creation?.appendTo || 'start',
            onListsWithFilters: tmpOptions?.current?.onListsWithFilters,
          })
        } else {
          this.updateItems(data)
        }
      },
    })

    const createItem = async (data: Partial<T>, options?: CreateOptions<T>) => {
      const prevOptions = { ...(tmpOptions.current ?? {}) }

      if (!!options) {
        tmpOptions.current = options
      }

      let res: T = null

      if (tmpOptions.current?.optimistic) {
        query.mutateAsync(data)
        res = await getOptimisticItem._await()
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

  useUpdate(options?: UpdateOptions<T>) {
    const [managerOptions] = this.useOptions()

    const tmpOptions = useRef<UpdateOptions<T>>(options ?? managerOptions.update ?? {
      optimistic: false,
    })

    const getOptimisticItem = usePromise<T>({
      timeout: 1200,
    })

    const query = useMutation({
      ...options?.mutationOptions,
      mutationKey: this.queryKeys.update,
      onMutate: async (data) => {
        options?.mutationOptions?.onMutate?.(data)
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

    const update = async (data: Partial<T>, options?: UpdateOptions<T>) => {
      const prevOptions = tmpOptions.current
      if (!!options) {

        tmpOptions.current = options
      }

      let res: T = null

      if (tmpOptions.current?.optimistic) {
        query.mutateAsync(data)
        res = await getOptimisticItem._await()
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

  useDelete(options?: DeleteOptions<T>) {

    const [managerOptions] = this.useOptions()

    const tmpOptions = useRef<DeleteOptions<T>>(options ?? managerOptions?.deletion ?? {
      optimistic: false,
    })

    const getOptimisticItem = usePromise<T>({
      timeout: 1200,
    })

    const query = useMutation({
      ...options?.mutationOptions,
      mutationKey: this.queryKeys.delete,
      onMutate: async (data) => {
        options?.mutationOptions?.onMutate?.(data)
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

    const _delete = async (data: T, options?: UpdateOptions<T>) => {
      const prevOptions = tmpOptions.current
      if (!!options) {

        tmpOptions.current = options
      }

      let prevItem = null

      if (tmpOptions.current?.optimistic) {
        query.mutateAsync(data)
        prevItem = await getOptimisticItem._await()
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

    this.queryClient.setQueryData(this.queryKeyFor(itemId), old => {
      return newItem
    })

    this.updateItems(newItem)

    return newItem
  }

  async refresh(filters?: ExtraArgs) {
    if (!!filters) {
      const key = this.filteredQueryKey(filters)
      this.queryClient.refetchQueries({
        queryKey: key,
      })

    } else {

      this.queryClient.refetchQueries({
        queryKey: this.queryKeys.list,

      })
    }
  }

  setItem(item: T) {
    return this.updateItems(item)
  }

  use(options?: UseManagerArgs<T, ExtraArgs>) {

    const list = this.useList({
      filter: options?.filter,
      queryOptions: options?.listOptions?.queryOptions,
      limit: options?.limit,
    })
    const create = this.useCreate(options?.creation)
    const update = this.useUpdate(options?.update)
    const del = this.useDelete(options?.deletion)

    const queries = {
      create,
      update,
      del,
    }

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
      queries,
    }
  }

  setOptions(to: SettableOptions<QueryManagerOptions<T, ExtraArgs, Meta, Actions>>) {
    const {
      creation = {},
      update = {},
      deletion = {},
      limit,
    } = this.options

    const currentOptions = {
      creation,
      update,
      deletion,
      limit,
    }

    const o = deepMerge(currentOptions, to)

    this.options = {
      ...this.options,
      ...o,
    }

    this.meta = deepMerge(this.meta, to.meta)

    this.optionListeners.forEach((l) => l(this.options, this.meta))
  }

}

