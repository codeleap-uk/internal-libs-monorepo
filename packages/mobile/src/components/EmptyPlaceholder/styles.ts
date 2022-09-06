import { assignTextStyle, createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ActivityIndicatorComposition } from '../ActivityIndicator'

export type EmptyPlaceholderComposition =
  | 'wrapper:loading'
  | `loader${Capitalize<ActivityIndicatorComposition>}`
  | 'wrapper'
  | 'text'
  | 'icon'

const createEmptyPlaceholderStyle = createDefaultVariantFactory<EmptyPlaceholderComposition>()

const presets = includePresets((styles) => createEmptyPlaceholderStyle(() => ({ wrapper: styles })),
)

export const EmptyPlaceholderStyles = {
  ...presets,
  default: createEmptyPlaceholderStyle((theme) => ({
    wrapper: {
      ...theme.presets.center,
      minHeight: theme.values.window.height / 2,
      height: '100%',
      flex: 1,
    },
    loaderWrapper: {

      ...theme.spacing.marginVertical(8),
      ...theme.presets.center,
      ...theme.presets.flex,
    },
    icon: {
      color: theme.colors.placeholder,
      size: theme.spacing.value(24),
    },
    text: {
      ...assignTextStyle('p1')(theme).text,
      ...theme.presets.textCenter,
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
