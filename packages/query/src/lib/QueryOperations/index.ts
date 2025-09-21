import { useMutation, useQuery, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { QueryClient } from '../../types'

export type QueryOperationsOptions = {
  queryClient: QueryClient
}

type MutationFn<T = any, R = any> = (data: T) => Promise<R> | R
type QueryFn<T = any, R = any> = (params?: T) => Promise<R> | R

type InferMutationParams<T> = T extends MutationFn<infer P, any> ? P : never
type InferMutationReturn<T> = T extends MutationFn<any, infer R> ? R : never
type InferQueryParams<T> = T extends QueryFn<infer P, any> ? P : never
type InferQueryReturn<T> = T extends QueryFn<any, infer R> ? R : never

export class QueryOperations<
  TMutations,
  TQueries,
> {
  constructor(
    private _options: QueryOperationsOptions,
    private _mutations: TMutations = {} as TMutations,
    private _queries: TQueries = {} as TQueries
  ) { }

  get mutations(): Readonly<TMutations> {
    return this._mutations
  }

  get queries(): Readonly<TQueries> {
    return this._queries
  }

  mutation<K extends string, T = any, R = any>(
    name: K,
    fn: MutationFn<T, R>
  ): QueryOperations<TMutations & Record<K, MutationFn<T, R>>, TQueries> {
    return new QueryOperations(
      this._options,
      { ...this._mutations, [name]: fn } as TMutations & Record<K, MutationFn<T, R>>,
      this._queries
    )
  }

  query<K extends string, T = any, R = any>(
    name: K,
    fn: QueryFn<T, R>
  ): QueryOperations<TMutations, TQueries & Record<K, QueryFn<T, R>>> {
    return new QueryOperations(
      this._options,
      this._mutations,
      { ...this._queries, [name]: fn } as TQueries & Record<K, QueryFn<T, R>>
    )
  }

  useMutation<K extends keyof TMutations>(
    mutationKey: K,
    options?: Omit<
      UseMutationOptions<
        InferMutationReturn<TMutations[K]>,
        Error,
        InferMutationParams<TMutations[K]>
      >,
      'mutationFn' | 'mutationKey'
    >
  ) {
    const mutationFn = this._mutations[mutationKey] as MutationFn

    type TData = InferMutationReturn<TMutations[K]>
    type TVariables = InferMutationParams<TMutations[K]>

    return useMutation<TData, Error, TVariables>({
      mutationKey: this.getMutationKey(mutationKey),
      mutationFn: async (data: TVariables): Promise<TData> => {
        if (!mutationFn) {
          throw new Error(`Mutation "${String(mutationKey)}" not found`)
        }
        return mutationFn(data) as Promise<TData>
      },
      ...options
    })
  }

  useQuery<K extends keyof TQueries>(
    queryKey: K,
    params?: InferQueryParams<TQueries[K]>,
    options?: Omit<
      UseQueryOptions<
        InferQueryReturn<TQueries[K]>,
        Error,
        InferQueryReturn<TQueries[K]>,
        ReturnType<this['getQueryKey']>
      >,
      'queryKey' | 'queryFn'
    >
  ) {
    const queryFn = this._queries[queryKey] as QueryFn

    type TData = InferQueryReturn<TQueries[K]>

    return useQuery<TData, Error, TData, ReturnType<this['getQueryKey']>>({
      queryKey: this.getQueryKey(queryKey, params),
      queryFn: async (): Promise<TData> => {
        if (!queryFn) {
          throw new Error(`Query "${String(queryKey)}" not found`)
        }
        return queryFn(params as any) as Promise<TData>
      },
      ...options
    } as any)
  }

  getQueryKey<K extends keyof TQueries>(
    queryKey: K,
    params?: InferQueryParams<TQueries[K]>
  ): InferQueryParams<TQueries[K]> extends never
    ? [K]
    : InferQueryParams<TQueries[K]> extends undefined
    ? [K]
    : [K, InferQueryParams<TQueries[K]>] {
    return (params !== undefined ? [queryKey, params] : [queryKey]) as any
  }

  getMutationKey<K extends keyof TMutations>(mutationKey: K): [K] {
    return [mutationKey]
  }
}

export function createQueryOperations(options: QueryOperationsOptions) {
  return new QueryOperations(options)
}
