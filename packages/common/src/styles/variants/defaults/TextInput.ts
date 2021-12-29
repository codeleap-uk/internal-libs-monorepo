import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type TextInputComposition = 'wrapper'|'icon'|'textField'|'label'|'innerWrapper';
const createTextInputStyle = createDefaultVariantFactory<TextInputComposition>()

const presets = includePresets((styles) => createTextInputStyle(() => ({ wrapper: styles })))

export const TextInputStyles = {
  ...presets,
  default: createTextInputStyle((theme) => ({
    textField: {
      outline: 'none',
      border: 'none',
      caretColor: theme.colors.primary,
      flex: 1,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    innerWrapper: {
      ...theme.spacing.paddingVertical(0.5),
      ...theme.spacing.paddingHorizontal(1.5),

      display: 'flex',

    },
    label: {
      ...theme.spacing.marginBottom(1),
    },
  })),
  line: createTextInputStyle((theme) => ({
    innerWrapper: {
      borderBottom: `1px solid ${theme.colors.primary}`,
    },
  })),
  box: createTextInputStyle((theme) => ({
    innerWrapper: {
      border: `1px solid ${theme.colors.primary}`,
    },
  })),
  pill: createTextInputStyle((theme) => ({
    innerWrapper: {
      border: `1px solid ${theme.colors.primary}`,
      borderRadius: 15,
    },
  })),

}
