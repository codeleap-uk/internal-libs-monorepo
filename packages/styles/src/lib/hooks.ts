import { useMemo } from 'react'
import { ICSS } from '../types'
import { getNestedStylesByKey } from './utils'
import { useShallow } from 'zustand/react/shallow'
import { ThemeStore, themeStore } from './themeStore'

export const useStyleObserver = (style) => {
  return useMemo(() => {
    if (Array.isArray(style)) {
      return JSON.stringify(style?.filter(v => !!v))
    } else if (typeof style === 'object'){
      return JSON.stringify(style)
    } else {
      return style
    }
  }, [style])
}

export function useNestedStylesByKey<T extends string>(match: string, styles: Partial<Record<T, ICSS>>) {
  return useMemo(() => {
    return getNestedStylesByKey(match, styles)
  }, [])
}

type ThemeSelector<T extends Record<string, any>> = (store: ThemeStore) => T

export const useTheme = <T extends Record<string, any>>(selector: ThemeSelector<T>): T => {
  return themeStore(useShallow(selector))
}