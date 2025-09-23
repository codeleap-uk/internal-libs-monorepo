import { UseMutationOptions } from '@tanstack/react-query'
import { QueryItem } from './core'
import { RemovedItemMap } from './utility'

export type CreateMutationCtx = {
  tempId?: QueryItem['id']
}

export type CreateMutationOptions<T extends QueryItem, F> = Omit<
  UseMutationOptions<T, Error, Partial<T>, CreateMutationCtx>,
  'mutationKey' | 'mutationFn'
> & {
  optimistic?: boolean
  listFilters?: F
  appendTo?: RemovedItemMap | 'start' | 'end'
}
