import { createContext, useContext } from 'react'
import { AvatarCtxValue } from './types'

export const AvatarContext = createContext({} as AvatarCtxValue)

export const useAvatarContext = <T = AvatarCtxValue>(providedProps: Partial<T> = {}) => {
  const ctx = useContext(AvatarContext)

  if (!ctx) {
    throw new Error(
      '[Avatar] useAvatarContext must be used within an Avatar component.',
    )
  }

  return {
    ...ctx,
    ...providedProps,
  }
}
