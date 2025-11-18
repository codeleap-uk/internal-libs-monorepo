import { QueryClient } from '../../types'

/**
 * Configuration options for QueryOperations
 */
export type QueryOperationsOptions = {
  /** The React Query client instance */
  queryClient: QueryClient
}

/**
 * Generic mutation function type
 * @template T - The input data type
 * @template R - The return data type
 */
export type MutationFn<T = any, R = any> = (data: T) => Promise<R> | R

/**
 * Generic query function type
 * @template T - The parameters type
 * @template R - The return data type
 */
export type QueryFn<T = any, R = any> = (params?: T) => Promise<R> | R

/**
 * Utility type to infer mutation function parameters
 * @template T - The mutation function type
 */
export type InferMutationParams<T> = T extends MutationFn<infer P, any> ? P : never

/**
 * Utility type to infer mutation function return type
 * @template T - The mutation function type
 */
export type InferMutationReturn<T> = T extends MutationFn<any, infer R> ? R : never

/**
 * Utility type to infer query function parameters
 * @template T - The query function type
 */
export type InferQueryParams<T> = T extends QueryFn<infer P, any> ? P : never

/**
 * Utility type to infer query function return type
 * @template T - The query function type
 */
export type InferQueryReturn<T> = T extends QueryFn<any, infer R> ? R : never
