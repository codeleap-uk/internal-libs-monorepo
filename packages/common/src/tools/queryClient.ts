import * as ReactQuery from '@tanstack/react-query'
import { TypeGuards, waitFor } from '../utils'
import { QueryManager, QueryManagerOptions, QueryManagerItem } from './Crud'

type Updater<Prev, Next> = Next | ((prev: Prev) => Next)

export type QueryKeyBuilder<Args extends any[] = any[]> = (...args:Args) => ReactQuery.QueryKey

type PollingResult<T> = {
  stop: boolean
  data: T
}

type PollingCallback<T, R> = (query: ReactQuery.Query<T>, count: number, prev?: R) => Promise<PollingResult<R>>

type PollQueryOptions<T, R> = {
  interval: number
  callback: PollingCallback<T, R>
  leading?: boolean
  initialData?: R
}

interface EnhancedQuery<T> extends ReactQuery.Query<T> {
  waitForRefresh(): Promise<ReactQuery.Query<T>>
  listen(callback: (e: ReactQuery.QueryCacheNotifyEvent) => void): () => void
  refresh(): Promise<T>
  poll<R>(
    options: PollQueryOptions<T, R>
  ): Promise<R>
  getData(): T
  key: ReactQuery.QueryKey
}

type DynamicEnhancedQuery<T, BuilderArgs extends any[]> = {
  [P in keyof EnhancedQuery<T>]: (...args: BuilderArgs) => EnhancedQuery<T>[P]
}

export class CodeleapQueryClient {
  constructor(public client: ReactQuery.QueryClient) {
  }

  listenToQuery(key: ReactQuery.QueryKey, callback: (e: ReactQuery.QueryCacheNotifyEvent) => void) {
    const cache = this.client.getQueryCache()

    const query = cache.find({ exact: true, queryKey: key })

    if (!query) {
      return
    }

    const removeListener = cache.subscribe((e) => {
      const matches = ReactQuery.matchQuery({ exact: true, queryKey: key }, e.query)

      if (matches) {
        callback(e)

      }
    })

    return removeListener
  }

  async pollQuery<T, R>(
    key: ReactQuery.QueryKey,
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

  queryProxy<T>(key: ReactQuery.QueryKey) {
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
            return (callback: (e: ReactQuery.QueryCacheNotifyEvent) => void) => {
              return client.listenToQuery(key, callback)
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
            return Reflect.get(query, p, receiver)
        }
      },

    })
  }

  waitForRefresh<T>(key: ReactQuery.QueryKey) {
    const initialQuery = this.client.getQueryCache().find({ exact: true, queryKey: key })

    if (!initialQuery) {
      return Promise.reject(new Error('Query not found'))
    }

    const updateTime = initialQuery.state.dataUpdatedAt
    const errorTime = initialQuery.state.errorUpdatedAt

    return new Promise<ReactQuery.Query<T>>((resolve, reject) => {
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

  queryKey<Data>(k: ReactQuery.QueryKey) {

    return this.queryProxy<Data>(k)
  }

  dynamicQueryKey<Data, BuilderArgs extends any[] = any[]>(k: QueryKeyBuilder<BuilderArgs>) {

    const getClient = () => this

    return new Proxy<DynamicEnhancedQuery<Data, BuilderArgs>>({} as DynamicEnhancedQuery<Data, BuilderArgs>, {
      get(target, p, receiver) {
        return (...params:BuilderArgs) => {
          const key = k(...params)

          const proxy = getClient().queryProxy<Data>(key)

          return Reflect.get(proxy, p, receiver)
        }
      },
    })
  }

  queryManager<T extends QueryManagerItem, Args>(name:string, options: Partial<QueryManagerOptions<T, Args>>) {
    // @ts-expect-error
    const m = new QueryManager<T, Args>({
      name,
      queryClient: this.client,
      ...options,

    })

    return m
  }

}
