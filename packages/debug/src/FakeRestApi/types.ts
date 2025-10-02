/**
 * Represents a basic item with an ID.
 */
export type FakeItem = {
  id: number
}

/**
 * Represents a paginated response structure.
 * @template T - The type of items in the results array, must extend FakeItem
 */
export type PaginationResponse<T extends FakeItem> = {
  /** Total count of items */
  count: number
  /** URL for the next page, or null if there are no more pages */
  next: string | null
  /** URL for the previous page, or null if this is the first page */
  previous: string | null
  /** Array of items for the current page */
  results: T[]
}

/**
 * Configuration options for creating a FakeRestApi instance.
 * @template T - The type of items to manage, must extend FakeItem
 * @template F - The type of filters to apply when listing items
 */
export type FakeRestApiOptions<T extends FakeItem, F = Record<string, unknown>> = {
  /** Name of the API (used in URLs and error messages) */
  name: string
  /** Whether to enable artificial delay for requests */
  enableDelay?: boolean
  /** Maximum number of items to generate on initialization */
  maxCount?: number
  /** Delay duration in milliseconds */
  delayMs?: number
  /** Function to generate a new item given an ID */
  generatorFn: (id: T['id']) => T
  /** Optional function to filter items based on criteria */
  filterFn?: (item: T, filters: F) => boolean
}
