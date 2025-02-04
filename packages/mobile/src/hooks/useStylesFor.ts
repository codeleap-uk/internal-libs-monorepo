import { StyleProp, useStyleObserver } from '@codeleap/styles'
import { useMemo } from 'react'
import { MobileStyleRegistry } from '../Registry'

export const useStylesFor = <T = unknown>(componentName: string, style?: StyleProp<T, string>): T => {
  const styleObserver = useStyleObserver(style)

  const styles = useMemo(() => {
    return MobileStyleRegistry.current.styleFor(componentName, style)
  }, [styleObserver])

  return styles
}
