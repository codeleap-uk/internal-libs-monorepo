import { assignTextStyle, createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ActivityIndicatorComposition } from '../ActivityIndicator'

export type EmptyPlaceholderComposition =
  | 'wrapper:loading'
  | `loader${Capitalize<ActivityIndicatorComposition>}`
  | 'wrapper'
  | 'title'
  | 'description'
  | 'image'
  | 'imageWrapper'
  | 'icon'

const createEmptyPlaceholderStyle = createDefaultVariantFactory<EmptyPlaceholderComposition>()

const presets = includePresets((styles) => createEmptyPlaceholderStyle(() => ({ wrapper: styles })),
)

export const EmptyPlaceholderStyles = {
  ...presets,
  default: createEmptyPlaceholderStyle((theme) => ({
    wrapper: {
      flexGrow: 1,
      ...theme.presets.center,
    },
    title: {
      ...assignTextStyle('h3')(theme).text,
      ...theme.spacing.marginBottom(theme.values.innerSpacing.Y),
    },
    description: {
      ...assignTextStyle('p1')(theme).text,
    },
    imageWrapper: {
      ...theme.spacing.paddingBottom(theme.values.innerSpacing.Y * 2),
      ...theme.presets.fullWidth,
      ...theme.presets.alignCenter,
      height: '45%',
    },
    image: {
      ...theme.presets.fullHeight,
    },
  })),
  compact: createEmptyPlaceholderStyle((theme) => ({
    wrapper: {
      ...theme.spacing.marginVertical(0),
      marginBottom: theme.spacing.value(6),
    },
  })),
  absolute: createEmptyPlaceholderStyle((theme) => ({
    'wrapper:loading': {
      ...theme.presets.absolute,
      ...theme.presets.whole,
      backgroundColor: theme.colors.background,
    },
    wrapper: {
      ...theme.presets.absolute,
      ...theme.presets.whole,
      backgroundColor: theme.colors.background,
    },
  })),
}
