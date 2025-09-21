import { useQueryClient } from '@tanstack/react-query'

export type QueryItem = {
  id: string | number
}

export type PageParam = number

export type ListPaginationResponse<T extends QueryItem> = T[]

export type QueryManagerOptions<T extends QueryItem, F> = {
  name: string

  queryClient: ReturnType<typeof useQueryClient>

  listFn?: (limit: number, offset: number, filters: F) => Promise<ListPaginationResponse<T>>

  listLimit?: number

  retrieveFn?: (id: T['id']) => Promise<T>

  createFn?: (data: Partial<T>) => Promise<T>

  updateFn?: (data: Partial<T>) => Promise<T>

  deleteFn?: (id: T['id']) => Promise<T['id']>
}
