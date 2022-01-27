import { createDefaultVariantFactory,  RadioInputStyles } from '@codeleap/common';
type RadioParts = 'button' | 'itemWrapper' | 'text' | 'buttonMark'
    
type RadioGroupParts = 'label' |'wrapper' |'list'

export type MobileRadioInputComposition = `${RadioParts}:checked` | RadioParts | RadioGroupParts

const createRadioStyle = createDefaultVariantFactory<MobileRadioInputComposition>()

const defaultStyles = RadioInputStyles.default

export const MobileRadioInputStyles = {
  ...RadioInputStyles,
  default: createRadioStyle((theme) => {
    const style = defaultStyles(theme)

    const itemHeight = theme.typography.baseFontSize * 1.2

    const translateX = -(itemHeight/2)
    const translateY = -(itemHeight/2)
    return {
      ...style,
      itemWrapper: {
        ...style.itemWrapper,
      },
      button: { 
        height: itemHeight,
        width: itemHeight,
        borderRadius: theme.borderRadius.large,
        border: theme.border.primary(1),
        
        position: 'relative',
        ...theme.spacing.marginRight(1),

      },
      'buttonMark': {
        background: theme.colors.primary,
        position: 'absolute',
        left: '50%',
        top: '50%',
        height: '50%',
        width: '50%',
        
        transform: [{translateX},{translateY}],
        borderRadius: theme.borderRadius.large,
        opacity: 0
      },
      'buttonMark:checked': {
          opacity: 1
      },
    }
  }),
  square: createRadioStyle(() => ({
    'buttonMark': {
      borderRadius: 0,
    },
    button: {
      borderRadius: 0,

    },
  })),
}
