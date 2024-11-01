import { TypeGuards } from '@codeleap/common'
import { ICSS } from '@codeleap/styles'
import { useMemo } from 'react'
import { useAnimatedStyle, withTiming } from 'react-native-reanimated'
type Transformer = (key: string, value: any) => [key: string, value: any]
function transformObject(obj: object, transformer: Transformer) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (TypeGuards.isObject(value) && !TypeGuards.isArray(value)) {
        return transformer(key, transformObject(value, transformer))
      }
      return transformer(key, value)
    }),
  )
}

const animationTransformer = (key, value, transition) => {
  if (TypeGuards.isNumber(value)) {
    return [key, withTiming(value, transition)]
  }

  if (TypeGuards.isArray(value)) {
    return [key, value.map((v, idx) => animationTransformer(idx, v, transition))]
  }

  if (TypeGuards.isObject(value)) {
    return transformObject(value, (k, v) => animationTransformer(k, v, transition))
  }

  return [key, value]
}

export function toLayoutAnimation(variant: ICSS, fromVariant?:ICSS, transition?: ICSS, debug = '') {
  const animations = transformObject(variant, (k, v) => animationTransformer(k, v, transition))

  const initialValues = fromVariant ?? {}
  if (debug) {
    console.log(`${debug} initialValues`, initialValues)
    console.log(`${debug} animations`, animations)
  }

  const anim = (values) => {
    'worklet'

    // const animations = Object.fromEntries(
    //   Object.entries(variant).map(([key, value]) => {

    //     return [key, withTiming(value, transition)]
    //   }),
    // )

    return {
      initialValues,
      animations,
    }
  }

  return anim
}

export function useLayoutAnimation(variant: ICSS, fromVariant?:ICSS, transition?: ICSS, debug = '') {
  // useAnimatedStyle(() => ({ transform: [ {tra}]}), [])
  return useMemo(() => {
    return toLayoutAnimation(variant, fromVariant, transition, debug)
  }, [])
}
