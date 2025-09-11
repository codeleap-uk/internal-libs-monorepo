import { useMemo } from 'react'
import { ICSS } from '../types'
import { getNestedStylesByKey } from '../utils'

export function useNestedStylesByKey<T extends string>(match: string, componentStyles: Partial<Record<T, ICSS>>) {
  const styles = {
    ...componentStyles
  }

  return useMemo(() => {
    return getNestedStylesByKey(match, styles)
  }, [styles])
}
