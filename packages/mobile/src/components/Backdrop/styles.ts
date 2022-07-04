import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type BackdropComposition =
 'wrapper'|
'touchable' |
'wrapper:visible' |
'wrapper:hidden'

const createBackdropVariant = createDefaultVariantFactory<BackdropComposition>()

const presets = includePresets((style) => createBackdropVariant(() => ({ wrapper: style })))

export const BackdropStyles = {
  ...presets,
  default: createBackdropVariant((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.black,
      ...theme.presets.whole,
      ...theme.presets.absolute,
    },
    'wrapper:visible': {
      opacity: 0.5,
    },
    'wrapper:hidden': {

      opacity: 0,
    },
    touchable: {
      ...theme.presets.whole,
      ...theme.presets.absolute,
    },
  })),
}
