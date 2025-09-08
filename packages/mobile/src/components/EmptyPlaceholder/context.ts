import { createContext, useContext } from 'react'
import { EmptyPlaceholderCtxValue } from './types'

export const EmptyPlaceholderContext = createContext({} as EmptyPlaceholderCtxValue)

export const useEmptyPlaceholderContext = <T = EmptyPlaceholderCtxValue>(providedProps: Partial<T> = {}) => {
  const ctx = useContext(EmptyPlaceholderContext)

  if (!ctx) {
    throw new Error(
      '[EmptyPlaceholder] useEmptyPlaceholderContext must be used within an EmptyPlaceholder component.'
    )
  }

  return {
    ...ctx,
    ...providedProps,
  }
}
