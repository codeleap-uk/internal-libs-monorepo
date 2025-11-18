import {
  QueryKey,
  Query,
  QueryCacheNotifyEvent,
  EnsureQueryDataOptions,
} from '@tanstack/react-query'

export type QueryKeyBuilder<Args extends any[] = any[]> = (...args: Args) => QueryKey

export type PollingResult<T> = {
  stop: boolean
  data: T
}

export type PollingCallback<T, R> = (query: Query<T>, count: number, prev?: R) => Promise<PollingResult<R>>

export type PollQueryOptions<T, R> = {
  interval: number
  callback: PollingCallback<T, R>
  leading?: boolean
  initialData?: R
}

export interface EnhancedQuery<T> extends Query<T> {
  waitForRefresh(): Promise<Query<T>>
  listen(callback: (e: QueryCacheNotifyEvent) => void): () => void
  refresh(): Promise<T>
  poll<R>(
    options: PollQueryOptions<T, R>
  ): Promise<R>
  getData(): T
  ensureData(options?: Partial<EnsureQueryDataOptions<T, Error, T, QueryKey, never>>): Promise<T>
  key: QueryKey
}

export type DynamicEnhancedQuery<T, BuilderArgs extends any[]> = {
  [P in keyof EnhancedQuery<T>]: (...args: BuilderArgs) => EnhancedQuery<T>[P]
}
