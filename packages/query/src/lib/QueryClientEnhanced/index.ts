import { waitFor } from '@codeleap/utils'
import { QueryClient, QueryKey, Query, hashKey, QueryCacheNotifyEvent, matchQuery, QueryOptions } from '@tanstack/react-query'
import { DynamicEnhancedQuery, EnhancedQuery, PollQueryOptions, PollingResult, QueryKeyBuilder } from './types'

export class QueryClientEnhanced {
  constructor(public client: QueryClient) { }

  listenToQuery(key: QueryKey, callback: (e: QueryCacheNotifyEvent) => void) {
    const cache = this.client.getQueryCache()

    const query = cache.find({ exact: true, queryKey: key })

    if (!query) {
      return
    }

    const removeListener = cache.subscribe((e) => {
      const matches = matchQuery({ exact: true, queryKey: key }, e.query)

      if (matches) {
        callback(e)

      }
    })

    return removeListener
  }

  async pollQuery<T, R>(
    key: QueryKey,
    options: PollQueryOptions<T, R>,
  ) {
    const { interval, callback, initialData, leading = false } = options
    const cache = this.client.getQueryCache()

    const initialQuery = cache.find({ exact: true, queryKey: key })

    if (!initialQuery) {
      return Promise.reject(new Error('Query not found'))
    }

    let count = 0
    let result: PollingResult<R> = {
      stop: false,
      data: initialData,
    }

    while (!result?.stop) {
      const shouldWait = count > 0 || leading

      if (shouldWait) {
        await waitFor(interval)
      }

      this.client.refetchQueries({
        exact: true,
        queryKey: key,
      })

      const newQuery = await this.waitForRefresh<T>(key)

      const newResult = await callback(newQuery, count, result?.data)

      count += 1
      result = newResult
    }

    return result?.data
  }

  queryProxy<T>(key: QueryKey) {
    const getClient = () => this

    return new Proxy<EnhancedQuery<T>>({} as EnhancedQuery<T>, {
      get(target, p, receiver) {

        const client = getClient()

        // these don't need the actual query
        switch (p) {
          case 'key':
            return key
          case 'getData':
            return () => {
              return client.client.getQueryData<T>(key)
            }
          default:
            break
        }

        const cache = client.client.getQueryCache()

        const query = cache.find({ exact: true, queryKey: key })

        if (!query) {
          console.warn(`Attempt to access property ${String(p)} on undefined query with key`, key)
          return undefined
        }

        switch (p) {
          case 'waitForRefresh':
            return () => {
              return client.waitForRefresh<T>(key)
            }

          case 'listen':
            return (callback: (e: QueryCacheNotifyEvent) => void) => {
              return client.listenToQuery(key, callback)
            }

          case 'ensureData':
            return (options) => {
              return client.client.ensureQueryData<T>({
                queryKey: key,
                ...options
              })
            }

          case 'refresh':
            return async () => {
              client.client.refetchQueries({
                exact: true,
                queryKey: key,
              })
              const newQuery = await client.waitForRefresh<T>(key)
              return newQuery.state.data
            }

          case 'poll':
            return (options: PollQueryOptions<T, any>) => {
              return client.pollQuery(key, options)
            }

          default:
            return Reflect.get(query, p, query)
        }
      },
    })
  }

  waitForRefresh<T>(key: QueryKey) {
    const initialQuery = this.client.getQueryCache().find({ exact: true, queryKey: key })

    if (!initialQuery) {
      return Promise.reject(new Error('Query not found'))
    }

    const updateTime = initialQuery.state.dataUpdatedAt
    const errorTime = initialQuery.state.errorUpdatedAt

    return new Promise<Query<T>>((resolve, reject) => {
      const removeListener = this.listenToQuery(key, (e) => {
        const query = e.query

        const isNewer = query.state.dataUpdatedAt > updateTime || query.state.errorUpdatedAt > errorTime

        const isIdle = query.state.fetchStatus === 'idle'

        const isSuccess = query.state.status === 'success'
        const isError = query.state.status === 'error'

        const isResolved = isSuccess || isError

        if (isNewer && isIdle && isResolved) {
          if (isSuccess) {
            resolve(query)
          } else {
            reject()
          }

          removeListener()
        }
      })
    })

  }

  queryKey<Data>(k: QueryKey, options?: QueryOptions<Data>) {
    if (options) {
      this.client.setQueryDefaults(k, options)

      const cache = this.client.getQueryCache()

      const q = new Query({
        client: this.client,
        queryKey: k,
        queryHash: hashKey(k),
        ...options,
      })

      cache.add(q)
    }

    return this.queryProxy<Data>(k)
  }

  dynamicQueryKey<Data, BuilderArgs extends any[] = any[]>(k: QueryKeyBuilder<BuilderArgs>) {
    const getClient = () => this

    return new Proxy<DynamicEnhancedQuery<Data, BuilderArgs>>({} as DynamicEnhancedQuery<Data, BuilderArgs>, {
      get(target, p, receiver) {
        return (...params: BuilderArgs) => {
          const key = k(...params)

          const proxy = getClient().queryProxy<Data>(key)

          return Reflect.get(proxy, p, proxy)
        }
      },
    })
  }
}
