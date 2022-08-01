import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

type CheckboxParts =
  | 'wrapper'
  | 'label'
  | 'labelWrapper'
  | 'input'
  | 'inputFeedback'
  | 'checkmark'
  | 'checkmarkWrapper'
  | 'error'

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
        borderRadius: theme.borderRadius.small,
      },
      labelWrapper: {
        flex: 1,
      },
      inputFeedback: {
        type: 'opacity',
        value: 0.5,
      },
      label: {
        ...theme.spacing.marginLeft(0.5),
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
