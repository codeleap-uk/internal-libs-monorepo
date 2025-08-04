import { StyleProp, useStyleObserver } from '@codeleap/styles'
import { useMemo } from 'react'
import { WebStyleRegistry } from '../WebStyleRegistry'
import { useIsMounted } from '@codeleap/hooks'

export const useStylesFor = <T = unknown>(componentName: string, style: StyleProp<T, string>): T => {
  const styleObserver = useStyleObserver(style)

  const isMounted = useIsMounted()

  const styles = useMemo(() => {
    return WebStyleRegistry.current.styleFor(componentName, style)
  }, [styleObserver])

  const processedStyles = useMemo(() => {
    // this is strange, but necessary to recalculate the pre-set styles from SSR
    return Object.entries(styles).reduce((acc, [key, styleValue]) => {
      const isServer = typeof window === 'undefined'
      const inEnvTransition = isServer ? false : !isMounted

      acc[key] = inEnvTransition ? {
        // Despite what it may look like, this is not (just) a joke. The "orphans" property is almost completely useless,
        // so we set it just to force the styles to recompute after hydration. Also picked for comedic impact.
        orphans: 1,

        ...styleValue } : styleValue

      return acc
    }, {} as T)
  }, [styles, isMounted])

  return processedStyles

}
