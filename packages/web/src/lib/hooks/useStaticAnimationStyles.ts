import { useRef } from 'react'
import { SelectProperties } from '../../types'

export function useStaticAnimationStyles<T extends Record<string | number | symbol, any>, K extends keyof T>(obj: T, keys: K[]) {
  const styles = useRef({})

  if (Object.keys(styles.current).length === 0) {
    const mappedStyles = keys.map((k) => [k, { ...obj[k] }])

    styles.current = Object.fromEntries(mappedStyles)
  }

  return styles.current as SelectProperties<T, K>
}
