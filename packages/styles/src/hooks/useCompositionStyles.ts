import { useMemo } from 'react'
import { ICSS } from '../types'
import { getNestedStylesByKey } from '../utils'

export function useCompositionStyles<T extends string, C extends string>(
  composition: (T | Array<T>),
  componentStyles: Partial<Record<C, ICSS>>
): Partial<Record<T, ICSS>> {
  const styles = {
    ...componentStyles
  }

  return useMemo(() => {
    const compositionStyles = {}

    if (Array.isArray(composition)) {
      for (const element of composition) {
        compositionStyles[element as string] = getNestedStylesByKey(element, styles)
      }
    } else {
      compositionStyles[composition as string] = getNestedStylesByKey(composition, styles)
    }

    return compositionStyles
  }, [styles])
}
