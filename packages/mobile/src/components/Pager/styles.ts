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

const presets = includePresets((style) => createPagerStyle(() => ({ wrapper: style })),
)
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

export const PagerStyles = {
  ...presets,
  default: createPagerStyle((theme) => {
    const width = theme.values.width
    const height = theme.values.height * 0.8
    return {
      ...pagerAnimation(height, width, 'X'),
      page: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      },
    }
  }),
  horizontal: createPagerStyle((Theme) => {

    const width = Theme.values.width
    const height = Theme.values.height * 0.8
    return pagerAnimation(height, width, 'X')
  }),
  vertical: createPagerStyle((Theme) => {
    const height = Theme.values.height * 0.8
    const width = Theme.values.width
    return pagerAnimation(height, width, 'Y')
  }),
}
