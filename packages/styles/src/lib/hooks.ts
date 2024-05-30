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

export function useNestedStylesByKey<T extends string>(match: string, _styles: Partial<Record<T, ICSS>>) {
  const styles = {..._styles}

  return useMemo(() => {
    return getNestedStylesByKey(match, styles)
  }, [styles])
}

type ThemeSelector<T extends Record<string, any>> = (store: ThemeStore) => T

export const useTheme = <T extends Record<string, any>>(selector: ThemeSelector<T>): T => {
  return themeStore(useShallow(selector))
}

export function useMultipleNestedStylesByKey<T extends Array<string>>(
  matches: T,
   _styles: Partial<Record<T[number], ICSS>>
): Partial<Record<T[number], ICSS>> {
  return {}
}
