import { UseMutationOptions } from '@tanstack/react-query'
import { QueryItem } from './core'
import { RemovedItemMap } from './utility'

export type DeleteMutationCtx<T> = {
  previousItem: T | undefined
  removedAt: RemovedItemMap
}

export type DeleteMutationOptions<T extends QueryItem, F> = Omit<
  UseMutationOptions<unknown, Error, T['id'], DeleteMutationCtx<T>>,
  'mutationKey' | 'mutationFn'
> & {
  optimistic?: boolean
}
