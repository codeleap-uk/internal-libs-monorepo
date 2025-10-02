import { FakeRestApi } from './class'
import { FakeItem, FakeRestApiOptions } from './types'

/**
 * Factory function to create a new FakeRestApi instance.
 * @template T - The type of items to manage, must extend FakeItem
 * @template F - The type of filters to apply when listing items
 * @param options - Configuration options for the API
 * @returns A new FakeRestApi instance
 * @example
 * ```typescript
 * type User = { id: number; name: string; email: string }
 * 
 * const api = createFakeRestApi<User>({
 *   name: 'users',
 *   maxCount: 50,
 *   generatorFn: (id) => ({
 *     id,
 *     name: `User ${id}`,
 *     email: `user${id}@example.com`
 *   })
 * })
 * ```
 */
export function createFakeRestApi<T extends FakeItem, F = Record<string, unknown>>(
  options: FakeRestApiOptions<T, F>
): FakeRestApi<T, F> {
  return new FakeRestApi<T, F>(options)
}
