import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type SwitchParts = 'wrapper' | 'label' | 'input' | 'error' | 'inputWrapper'
export type SwitchComposition =
  | SwitchParts
  | `${SwitchParts}:disabled`
  | `${SwitchParts}:on`

const createSwitchStyle = createDefaultVariantFactory<SwitchComposition>()

const presets = includePresets((styles) => createSwitchStyle(() => ({ wrapper: styles })),
)

export const SwitchStyles = {
  ...presets,
  default: createSwitchStyle((theme) => ({
    wrapper: {},
    inputWrapper: {
      ...theme.presets.row,
      ...theme.presets.alignCenter,
    },
    label: {
      ...theme.spacing.marginLeft(0.5),
    },
    input: {
      color: theme.colors.white,
      backgroundColor: theme.colors.gray,
    },
    'input:on': {
      color: theme.colors.primary,
      backgroundColor: theme.colors.gray,
    },
    error: {
      color: theme.colors.negative,
    },
  })),
}
