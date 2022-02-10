import {
  createDefaultVariantFactory,
  includePresets,
  useComponentStyle,
} from '@codeleap/common'

export type PagerComposition =
  | 'page'
  | 'page:transition'
  | 'page:pose:previous'
  | 'page:pose:next'
  | 'page:pose:current'
  | 'wrapper';

const createPagerStyle = createDefaultVariantFactory<PagerComposition>()

const presets = includePresets((style) => createPagerStyle(() => ({ wrapper: style })),
)

export const MobilePagerStyles = {
  ...presets,
  default: createPagerStyle((Theme) => {
    const transition = {
      duration: 500,
      ease: 'easeInOut',
      useNativeDriver: true,
    }

    return {
      wrapper: {
        ...Theme.presets.full,
      },
      'page:pose:next': {
        left: Theme.values.width * 1.8,
        transition: transition,
      },
      'page:pose:current': {
        left: 0,
        transition: transition,
      },
      'page:pose:previous': {
        left: -Theme.values.width * 1.8,
        transition: transition,
      },
      page: {
        width: '100%',
        height: '100%',
      },
    }
  }),
  pageless: createPagerStyle(() => ({})),
}
