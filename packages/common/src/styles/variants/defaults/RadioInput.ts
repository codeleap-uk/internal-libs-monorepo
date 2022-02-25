import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type RadioInputComposition =
  | 'text'
  | 'itemText'
  | 'button:checked'
  | 'button:unchecked'
  | 'button'
  | 'itemWrapper'
  | 'wrapper'
  | 'listWrapper'
  | 'button:mark'

const createRadioInputStyle =
  createDefaultVariantFactory<RadioInputComposition>()

const presets = includePresets((styles) => createRadioInputStyle(() => ({ wrapper: styles })),
)

export const RadioInputStyles = {
  ...presets,
  default: createRadioInputStyle((theme) => ({
    wrapper: {
      display: 'flex',
      ...theme.presets.column,
    },
    itemWrapper: {
      display: 'flex',
      ...theme.presets.row,
      ...theme.presets.alignCenter,
      ...theme.spacing.paddingVertical(0.2),
    },
    listWrapper: {
      ...theme.presets.column,
      ...theme.spacing.paddingVertical(1),
    },
  })),
}
