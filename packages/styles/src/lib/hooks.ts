import { useMemo } from 'react'
import { ICSS } from '../types'
import { getNestedStylesByKey } from './utils'
import { ThemeState, themeStoreComputed } from './themeStore'
import { useStore } from '@nanostores/react'

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

type ThemeSelector<T> = (state: ThemeState) => T

export const useTheme = <T = ThemeState>(
  selector?: ThemeSelector<T>
): T => {
  const state = useStore(themeStoreComputed)
  
  if (!selector) {
    return state as T
  }
  
  return selector(state)
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
