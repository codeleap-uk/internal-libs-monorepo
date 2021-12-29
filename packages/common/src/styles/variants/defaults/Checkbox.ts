import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type CheckboxComposition = 'wrapper' | 'label' | 'input';

const createCheckboxStyle = createDefaultVariantFactory<CheckboxComposition>()

const presets = includePresets((styles) => createCheckboxStyle(() => ({ wrapper: styles })))

export const CheckboxStyles = {
  ...presets,
  default: createCheckboxStyle((theme) => ({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.spacing.padding(1),
    },
    input: {
      backgroundColor: theme.colors.primary,
    },
  })),

}
