import { useMemo } from 'react'
import { TextStyle, ViewStyle } from 'react-native'

export function useInputBasePartialStyles<C extends string, S extends Record<string, boolean>>(
  styles: Record<C, ViewStyle>,
  styleKeys: Array<C | [C, boolean]>,
  states: S,
) {
  return useMemo(() => {
    return styleKeys.reduce((acc, value) => {
      const [key, overrideWithDefault] = Array.isArray(value) ? value : [value, true]

      const result = Object.entries(states).reduce((acc, [state, is]) => {
        if (!is) return acc

        const style = styles?.[`${key}:${state}` as C]

        if (!style) return acc

        return {
          ...acc,
          ...styles[`${key}:${state}` as C]
        }
      }, {})

      if (overrideWithDefault && !!styles?.[key]) {
        acc[key] = {
          ...styles[key],
          ...result,
        }
      } else {
        acc[key] = result
      }

      return acc
    }, {} as Record<C, ViewStyle & TextStyle>)
  }, [states])
}