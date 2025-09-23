import { QueryOperations } from '../lib'
import { QueryOperationsOptions } from '../lib/QueryOperations/types'

/**
 * Factory function to create a new QueryOperations builder instance
 * @param options - Configuration options including the QueryClient
 * @returns New QueryOperations instance ready for operation registration
 * 
 * @description
 * This is the entry point for creating a new QueryOperations instance. Use this
 * function to start building your collection of queries and mutations.
 * 
 * @example
 * ```typescript
 * import { QueryClient } from '@tanstack/react-query'
 * 
 * const queryClient = new QueryClient()
 * 
 * const userOperations = createQueryOperations({ queryClient })
 *   .query('getUser', async (id: string) => fetchUser(id))
 *   .query('getUsers', async (filters?: UserFilters) => fetchUsers(filters))
 *   .mutation('createUser', async (data: CreateUserData) => createUser(data))
 *   .mutation('updateUser', async (data: UpdateUserData) => updateUser(data))
 *   .mutation('deleteUser', async (id: string) => deleteUser(id))
 * 
 * // In components
 * function UserList() {
 *   const usersQuery = userOperations.useQuery('getUsers', { active: true })
 *   const createMutation = userOperations.useMutation('createUser')
 *   
 *   // Both hooks are fully type-safe
 * }
 * ```
 */
export function createQueryOperations(options: QueryOperationsOptions) {
  return new QueryOperations(options)
}
