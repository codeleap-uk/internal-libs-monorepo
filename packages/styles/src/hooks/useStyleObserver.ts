import { useMemo } from 'react'

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
