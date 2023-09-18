import { includePresets } from "@codeleap/common"
import { variantProvider } from "../theme"

export type CardBaseParts = 'wrapper' | 'innerWrapper'
export type CardBaseState = 'pressable'

export type CardBaseComposition = CardBaseParts | `${CardBaseParts}:${CardBaseState}`

const createCardBaseStyle = variantProvider.createVariantFactory<CardBaseComposition>()

export const CardBasePresets = includePresets((style) => createCardBaseStyle(() => ({ wrapper: style })))

const defaultStyles = CardBasePresets

export const AppCardBaseStyles = {
  ...defaultStyles,
  default: createCardBaseStyle((theme) => ({
    wrapper: {
      backgroundColor: theme.colors.neutral1,
      borderRadius: theme.borderRadius.small,
      ...theme.spacing.padding(2),
      ...theme.presets.column,
      ...theme.presets.justifySpaceBetween,
      ...theme.presets.alignStart,
    },
    innerWrapper: {
      ...theme.presets.column
    },
    'wrapper:pressable': {
      cursor: 'pointer',
      transition: 'opacity 0.2s',

      '&:hover': {
        opacity: 0.8,
      }
    }
  })),
  'card:elevated': createCardBaseStyle(theme => ({
    wrapper: {
      ...theme.effects.light,
    }
  })),
}
