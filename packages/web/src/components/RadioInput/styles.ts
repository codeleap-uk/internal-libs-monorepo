import {
  createDefaultVariantFactory,
  RadioInputComposition,
  RadioInputStyles,
} from '@codeleap/common'

const createRadioStyle = createDefaultVariantFactory<RadioInputComposition>()

const defaultStyles = RadioInputStyles.default

export const WebRadioInputStyles = {
  ...RadioInputStyles,
  default: createRadioStyle((theme) => {
    const style = defaultStyles(theme)
    return {
      ...style,
      itemWrapper: {
        ...style.itemWrapper,
        cursor: 'pointer',
      },
      button: {
        height: '1em',
        width: '1em',
        borderRadius: theme.borderRadius.medium,
        border: theme.border.primary(1),

        position: 'relative',
        ...theme.spacing.marginRight(1),
      },
      'button:mark': {
        background: theme.colors.primary,
        content: '""',
        position: 'absolute',
        left: '50%',
        top: '50%',

        transform: 'translate(-50%,-50%)',
        borderRadius: theme.borderRadius.medium,
        height: '50%',
        width: '50%',
        visibility: 'hidden',
      },
      'button:checked': {
        '&:after': {
          visibility: 'visible',
        },
      },
    }
  }),
  square: createRadioStyle(() => ({
    'button:mark': {
      borderRadius: '1px',
    },
    button: {
      borderRadius: '1px',
    },
  })),
}
