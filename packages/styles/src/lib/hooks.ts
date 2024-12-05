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

export function useNestedStylesByKey<T extends string>(match: string, componentStyles: Partial<Record<T, ICSS>>) {
  const styles = {
    ...componentStyles
  }

  return useMemo(() => {
    return getNestedStylesByKey(match, styles)
  }, [styles])
}

type ThemeSelector<T = Record<string, any>> = (store: ThemeStore) => T

export const useTheme = <T = Record<string, any>>(selector: ThemeSelector<T>): T => {
  return themeStore(useShallow(selector))
}

export function useCompositionStyles<T extends string, C extends string>(
  composition: Array<T>,
  componentStyles: Partial<Record<C, ICSS>>
): Partial<Record<T, ICSS>> {
  const styles = {
    ...componentStyles
  }

  return useMemo(() => {
    const compositionStyles = {}

    for (const element of composition) {
      compositionStyles[element as string] = getNestedStylesByKey(element, styles)
    }

    return compositionStyles
  }, [styles])
}
