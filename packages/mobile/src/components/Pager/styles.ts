import {
  createDefaultVariantFactory,
  includePresets,
} from '@codeleap/common'
import { Easing } from 'react-native'

export type PagerComposition =
  | 'page'
  | 'page:transition'
  | 'page:previous'
  | 'page:next'
  | 'page:current'
  | 'wrapper'

const createPagerStyle = createDefaultVariantFactory<PagerComposition>()

export const PagerPresets = includePresets((style) => createPagerStyle(() => ({ wrapper: style })))
export const defaultPagerTransition = {
  type: 'timing',
  duration: 300,
  easing: Easing.linear,
}

export function pagerAnimation(height, width, translate = 'X', transition = defaultPagerTransition) {
  const translateProp = `translate${translate}`

  const translateVal = translate === 'X' ? width : height

  return {
    wrapper: {
      height,
      width,
      overflow: 'hidden',
    },
    'page:transition': {
      [translateProp]: transition,
    },
    'page:next': {
      [translateProp]: translateVal,

    },
    'page:current': {
      [translateProp]: 0,
    },
    'page:previous': {
      [translateProp]: -translateVal,
    },
  }
}
