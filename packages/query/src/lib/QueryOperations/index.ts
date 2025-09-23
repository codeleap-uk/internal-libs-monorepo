import { useMutation, useQuery, UseQueryOptions, UseMutationOptions, QueryKey, FetchQueryOptions } from '@tanstack/react-query'
import { QueryOperationsOptions, MutationFn, QueryFn, InferMutationParams, InferMutationReturn, InferQueryParams, InferQueryReturn } from './types'

/**
 * Builder class for creating type-safe query and mutation operations
 * @template TMutations - Record type containing all registered mutation functions
 * @template TQueries - Record type containing all registered query functions
 * 
 * @description
 * QueryOperations provides a fluent interface for building collections of queries and mutations
 * with full type safety. It acts as a centralized registry for all data operations and provides
 * corresponding React hooks that are automatically typed based on the registered functions.
 * 
 * Key features:
 * - Fluent builder pattern for registering operations
 * - Automatic type inference for parameters and return types
 * - Type-safe React hooks generation
 * - Immutable operation registration (returns new instances)
 */
export class QueryOperations<
  TMutations,
  TQueries,
> {
  /**
   * Creates a new QueryOperations instance
   * @param _options - Configuration options including QueryClient
   * @param _mutations - Record of registered mutation functions (internal)
   * @param _queries - Record of registered query functions (internal)
   */
  constructor(
    private _options: QueryOperationsOptions,
    private _mutations: TMutations = {} as TMutations,
    private _queries: TQueries = {} as TQueries
  ) { }

  /**
   * Gets all registered mutation functions
   * @returns Readonly record of mutation functions
   */
  get mutations(): Readonly<TMutations> {
    return this._mutations
  }

  /**
   * Gets all registered query functions
   * @returns Readonly record of query functions
   */
  get queries(): Readonly<TQueries> {
    return this._queries
  }

  /**
   * Registers a new mutation function
   * @template K - The name/key for the mutation
   * @template T - The input data type for the mutation
   * @template R - The return data type for the mutation
   * @param name - Unique name identifier for the mutation
   * @param fn - The mutation function that performs the operation
   * @returns New QueryOperations instance with the mutation added
   * 
   * @example
   * ```typescript
   * const operations = createQueryOperations({ queryClient })
   *   .mutation('createUser', async (userData: CreateUserData) => {
   *     return api.post('/users', userData)
   *   })
   *   .mutation('updateUser', async (userData: UpdateUserData) => {
   *     return api.put(`/users/${userData.id}`, userData)
   *   })
   * ```
   */
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

  /**
   * Registers a new query function
   * @template K - The name/key for the query
   * @template T - The parameters type for the query
   * @template R - The return data type for the query
   * @param name - Unique name identifier for the query
   * @param fn - The query function that fetches the data
   * @returns New QueryOperations instance with the query added
   * 
   * @example
   * ```typescript
   * const operations = createQueryOperations({ queryClient })
   *   .query('getUser', async (userId: string) => {
   *     return api.get(`/users/${userId}`)
   *   })
   *   .query('getUsers', async (filters?: UserFilters) => {
   *     return api.get('/users', { params: filters })
   *   })
   * ```
   */
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

  /**
   * React hook for executing mutations with full type safety
   * @template K - The mutation key type
   * @param mutationKey - The name of the registered mutation to use
   * @param options - React Query mutation options (excluding mutationFn and mutationKey)
   * @returns React Query mutation object with inferred types
   * 
   * @description
   * This hook automatically provides type-safe parameters and return types based on the
   * registered mutation function. It handles error cases and provides proper TypeScript
   * inference for the mutation data and variables.
   * 
   * @example
   * ```typescript
   * const createUserMutation = operations.useMutation('createUser', {
   *   onSuccess: (user) => {
   *     // 'user' is automatically typed as the return type of createUser
   *     console.log('Created user:', user.id)
   *   }
   * })
   * 
   * // Usage - parameters are type-checked
   * createUserMutation.mutate({ name: 'John', email: 'john@example.com' })
   * ```
   */
  useMutation<K extends keyof TMutations>(
    mutationKey: K,
    options?: Omit<
      UseMutationOptions<
        InferMutationReturn<TMutations[K]>,
        Error,
        InferMutationParams<TMutations[K]>
      >,
      'mutationFn'
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

  /**
   * React hook for executing queries with full type safety
   * @template K - The query key type
   * @param queryKey - The name of the registered query to use
   * @param params - Parameters to pass to the query function (optional if query doesn't require params)
   * @param options - React Query options (excluding queryKey and queryFn)
   * @returns React Query query object with inferred types
   * 
   * @description
   * This hook automatically provides type-safe parameters and return types based on the
   * registered query function. It generates appropriate query keys and handles parameter
   * validation.
   * 
   * @example
   * ```typescript
   * // Query with parameters
   * const userQuery = operations.useQuery('getUser', 'user-123', {
   *   enabled: !!userId
   * })
   * 
   * // Query without parameters
   * const usersQuery = operations.useQuery('getUsers', undefined, {
   *   refetchInterval: 30000
   * })
   * 
   * // Query with optional parameters
   * const filteredUsersQuery = operations.useQuery('getUsers', { status: 'active' })
   * ```
   */
  useQuery<K extends keyof TQueries, T = InferQueryReturn<TQueries[K]>>(
    queryKey: K,
    params?: InferQueryParams<TQueries[K]>,
    options?: Omit<
      Partial<UseQueryOptions<
        InferQueryReturn<TQueries[K]>,
        Error,
        T,
        ReturnType<this['getQueryKey']>
      >>,
      'queryFn'
    >
  ) {
    const queryFn = this._queries[queryKey] as QueryFn

    type TData = InferQueryReturn<TQueries[K]>

    return useQuery<TData, Error, T, ReturnType<this['getQueryKey']>>({
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

  /**
   * Generates a properly typed query key for React Query
   * @template K - The query key type
   * @param queryKey - The name of the query
   * @param params - Optional parameters for the query
   * @returns Query key array, with params included only when necessary
   * 
   * @description
   * This method creates React Query compatible keys that include parameters when present.
   * The return type is conditionally typed based on whether the query requires parameters.
   * 
   * @example
   * ```typescript
   * // Returns ['getUser', 'user-123']
   * const keyWithParams = operations.getQueryKey('getUser', 'user-123')
   * 
   * // Returns ['getUsers']
   * const keyWithoutParams = operations.getQueryKey('getUsers')
   * ```
   */
  getQueryKey<K extends keyof TQueries>(
    queryKey: K,
    params?: InferQueryParams<TQueries[K]>
  ): QueryKey {
    return (params !== undefined ? [queryKey, params] : [queryKey]) as QueryKey
  }

  /**
   * Generates a mutation key for React Query
   * @template K - The mutation key type
   * @param mutationKey - The name of the mutation
   * @returns Mutation key array containing only the mutation name
   * 
   * @example
   * ```typescript
   * // Returns ['createUser']
   * const mutationKey = operations.getMutationKey('createUser')
   * ```
   */
  getMutationKey<K extends keyof TMutations>(mutationKey: K): QueryKey {
    return [mutationKey] as QueryKey
  }

  /**
   * Prefetches a query to populate the cache ahead of time
   * @template K - The query key type
   * @param queryKey - The name of the registered query to prefetch
   * @param params - Parameters to pass to the query function (optional if query doesn't require params)
   * @param options - React Query prefetch options
   * @returns Promise that resolves when the prefetch is complete
   * 
   * @example
   * ```typescript
   * // Prefetch user data when hovering over a user link
   * const handleUserHover = async (userId: string) => {
   *   await operations.prefetchQuery('getUser', userId, {
   *     staleTime: 5 * 60 * 1000 // 5 minutes
   *   })
   * }
   * 
   * // Prefetch data on route change
   * useEffect(() => {
   *   operations.prefetchQuery('getUsers', { status: 'active' })
   * }, [])
   * ```
   */
  prefetchQuery<K extends keyof TQueries>(
    queryKey: K,
    params?: InferQueryParams<TQueries[K]>,
    options?: FetchQueryOptions<any, Error, any, QueryKey, never>
  ) {
    const prefetchQueryKey = this.getQueryKey(queryKey, params)

    const queryFn = this._queries[queryKey] as QueryFn

    return this._options.queryClient.prefetchQuery({
      queryKey: prefetchQueryKey,
      queryFn: queryFn,
      ...options,
    })
  }

  /**
   * Retrieves cached query data if it exists
   * @template K - The query key type
   * @template T - The expected return type (defaults to inferred query return type)
   * @param queryKey - The name of the registered query
   * @param params - Parameters used when the query was cached (optional if query doesn't require params)
   * @returns The cached data if it exists, undefined otherwise
   * 
   * @example
   * ```typescript
   * // Get cached user data
   * const cachedUser = operations.getQueryData('getUser', 'user-123')
   * if (cachedUser) {
   *   console.log('User already in cache:', cachedUser.name)
   * }
   * 
   * // Check if users list is cached before showing loading state
   * const cachedUsers = operations.getQueryData('getUsers')
   * const showSkeleton = !cachedUsers
   * 
   * // Access cached data in event handlers
   * const handleUserAction = () => {
   *   const currentUser = operations.getQueryData('getCurrentUser')
   *   if (currentUser?.role === 'admin') {
   *     // Perform admin action
   *   }
   * }
   * ```
   */
  getQueryData<K extends keyof TQueries, T = InferQueryReturn<TQueries[K]>>(
    queryKey: K,
    params?: InferQueryParams<TQueries[K]>,
  ) {
    const prefetchQueryKey = this.getQueryKey(queryKey, params)

    return this._options.queryClient.getQueryData<T, QueryKey>(prefetchQueryKey)
  }
}
