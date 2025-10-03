import { UseMutationOptions } from '@tanstack/react-query'
import { QueryItem } from './core'

export type UpdateMutationCtx<T> = {
  previousItem: T | undefined
  optimisticItem: T | undefined
}

export type UpdateMutationOptions<T extends QueryItem, F> = Omit<
  UseMutationOptions<T, Error, Partial<T>, UpdateMutationCtx<T>>,
  'mutationKey' | 'mutationFn'
> & {
  optimistic?: boolean
}
