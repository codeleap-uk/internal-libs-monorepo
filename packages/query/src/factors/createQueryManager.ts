import { QueryManager } from '../lib'
import { QueryItem, QueryManagerOptions } from '../types'

/**
 * Factory function to create a new QueryManager instance
 * @template T - The query item type that extends QueryItem
 * @template F - The filter type used for list queries
 * @param options - Configuration options for the query manager
 * @returns New QueryManager instance
 * 
 * @example
 * ```typescript
 * interface User extends QueryItem {
 *   name: string
 *   email: string
 *   status: 'active' | 'inactive'
 * }
 * 
 * interface UserFilters {
 *   status?: 'active' | 'inactive'
 *   search?: string
 * }
 * 
 * const userQueryManager = createQueryManager<User, UserFilters>({
 *   name: 'users',
 *   queryClient,
 *   listFn: (limit, offset, filters) => api.getUsers({ limit, offset, ...filters }),
 *   retrieveFn: (id) => api.getUser(id),
 *   createFn: (data) => api.createUser(data),
 *   updateFn: (data) => api.updateUser(data.id, data),
 *   deleteFn: (id) => api.deleteUser(id),
 *   listLimit: 20
 * })
 * ```
 */
export const createQueryManager = <T extends QueryItem, F>(options: QueryManagerOptions<T, F>) => {
  return new QueryManager<T, F>(options)
}
