import { useMemo } from 'react'

/**
 * Hook that observes style changes by creating a memoized string representation.
 * 
 * @param {any} style - Style value to observe (array, object, or primitive)
 * @returns {string} Serialized string representation of the style for comparison
 */
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
