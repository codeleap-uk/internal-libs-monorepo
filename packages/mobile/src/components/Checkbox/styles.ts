import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputLabelComposition } from '../InputLabel'

type CheckboxParts =
  | 'wrapper'
  | 'input'
  | 'inputFeedback'
  | 'checkmark'
  | 'checkmarkWrapper'
  | 'error'
  | `label${Capitalize<InputLabelComposition>}`

export type CheckboxComposition =
  | CheckboxParts
  | `${CheckboxParts}:checked`
  | `${CheckboxParts}:disabled`
  | `${CheckboxParts}:error`
const createCheckboxStyle =
  createDefaultVariantFactory<CheckboxComposition>()

const presets = includePresets((styles) => createCheckboxStyle(() => ({ wrapper: styles })),
)

export const CheckboxStyles = {
  ...presets,
  default: createCheckboxStyle((theme) => {
    const size = theme.typography.baseFontSize * 1.2

    const markHeight = size * 0.5
    const markWidth = size * 0.25

    const translateX = -(markWidth / 2)
    const translateY = -(markHeight / 2)
    return {
      wrapper: {},
      input: {
        flexDirection: 'row',
        ...theme.presets.alignCenter,

      },
      labelWrapper: {
        // flex: 1,
        ...theme.spacing.marginLeft(1),

      },
      inputFeedback: {
        type: 'opacity',
        value: 0.5,
      },

      checkmark: {
        position: 'absolute',
        top: '40%',
        left: '50%',

        height: markHeight,
        width: markWidth,
        transform: [{ translateX }, { translateY }, { rotate: '45deg' }],
      },
      'checkmark:checked': {
        ...theme.border.white({
          width: 2,
          directions: ['right', 'bottom'],
        }),
      },
      checkmarkWrapper: {
        position: 'relative',
        width: size,
        borderRadius: theme.borderRadius.small,
        height: size,
        ...theme.border.neutral(1),
      },
      'checkmarkWrapper:checked': {
        backgroundColor: theme.colors.primary,
      },
      error: {
        color: theme.colors.negative,
      },
    }
  }),
}
