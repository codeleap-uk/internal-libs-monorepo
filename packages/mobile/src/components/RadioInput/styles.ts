import {
  createDefaultVariantFactory, includePresets,
} from '@codeleap/common'
type RadioParts = 'button' | 'itemWrapper' | 'text' | 'buttonMark' | 'buttonFeedback'

type RadioGroupParts = 'label' | 'wrapper' | 'list'

export type RadioInputComposition =
  | `${RadioParts}:checked`
  | RadioParts
  | RadioGroupParts

const createRadioStyle =
  createDefaultVariantFactory<RadioInputComposition>()

const presets = includePresets(style => createRadioStyle(() => ({ wrapper: style })))

export const RadioInputStyles = {
  ...presets,
  default: createRadioStyle((theme) => {

    const itemHeight = theme.typography.baseFontSize * 1.2
    const markHeight = itemHeight / 2
    const translateX = -(markHeight / 2)
    const translateY = -(markHeight / 2)
    return {
      itemWrapper: {
        ...theme.presets.row,
        ...theme.spacing.marginVertical(1.3),
      },
      button: {
        height: itemHeight,
        width: itemHeight,
        ...theme.border.primary(1),
        borderRadius: theme.borderRadius.large,

        position: 'relative',
        ...theme.spacing.marginRight(1),
      },
      buttonFeedback: { type: 'opacity', value: 0.5 },
      buttonMark: {
        backgroundColor: theme.colors.primary,
        position: 'absolute',
        left: '50%',
        top: '50%',
        height: markHeight,
        width: markHeight,

        transform: [{ translateX }, { translateY }],
        borderRadius: theme.borderRadius.large,
        opacity: 0,
      },
      'buttonMark:checked': {
        opacity: 1,
      },
    }
  }),
  square: createRadioStyle(() => ({
    buttonMark: {
      borderRadius: 0,
    },
    button: {
      borderRadius: 0,
    },
  })),
}
