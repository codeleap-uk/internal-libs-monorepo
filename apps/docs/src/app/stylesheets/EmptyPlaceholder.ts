import { assignTextStyle } from '@codeleap/common'
import { EmptyPlaceholderComposition, EmptyPlaceholderPresets } from '@codeleap/web'
import { variantProvider } from '../theme'

const createEmptyPlaceholderVariant = variantProvider.createVariantFactory<EmptyPlaceholderComposition>()

const defaultStyles = EmptyPlaceholderPresets

const iconSize = 120

export const AppEmptyPlaceholderStyles = {
  ...defaultStyles,
  default: createEmptyPlaceholderVariant((theme) => ({
    wrapper: {
      flexGrow: 1,
      display: 'flex',
      ...theme.presets.fullWidth,
      ...theme.presets.column,
      ...theme.presets.center,
      ...theme.spacing.gap(2),
    },
    'wrapper:loading': {
      ...theme.spacing.paddingTop(2)
    },
    title: {
      ...assignTextStyle('h3')(theme).text,
    },
    description: {
      ...assignTextStyle('p1')(theme).text,
    },
    imageWrapper: {
      ...theme.presets.fullWidth,
      ...theme.presets.center,
    },
    image: {
    },
    icon: {
      width: iconSize,
      height: iconSize,
    }
  })),
  compact: createEmptyPlaceholderVariant((theme) => ({
    wrapper: {
      ...theme.spacing.marginVertical(0),
      marginBottom: theme.spacing.value(6),
    },
  })),
  absolute: createEmptyPlaceholderVariant((theme) => ({
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
