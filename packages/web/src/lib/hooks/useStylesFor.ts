import { StyleProp, useStyleObserver } from '@codeleap/styles'
import { useMemo } from 'react'
import { WebStyleRegistry } from '../WebStyleRegistry'
import { useIsClient } from '@codeleap/hooks'

export const useStylesFor = <T = unknown>(componentName: string, style: StyleProp<T, string>): T => {
  const styleObserver = useStyleObserver(style)

  const { isClient } = useIsClient()

  const styles = useMemo(() => {
    return WebStyleRegistry.current.styleFor(componentName, style)
  }, [styleObserver])

  const processedStyles = useMemo(() => {
    // this is strange, but necessary to recalculate the pre-set styles from SSR
    return Object.entries(styles).reduce((acc, [key, styleValue]) => {
      const isServer = typeof window === 'undefined'
      const inEnvTransition = isServer ? false : !isClient
      
      acc[key] = inEnvTransition ? { opacity: 0 } : styleValue
      
      return acc
    }, {} as T)
  }, [styles, isClient])

  return processedStyles
}
