import { assignTextStyle } from './Text';
import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type TextInputComposition = 
    'wrapper' 
  | 'wrapper:error' 
  | 'icon'
  | 'icon:error'
  | 'leftIcon' 
  | 'leftIcon:error' 
  | 'rightIcon' 
  | 'rightIcon:error:error' 
  | 'textField' 
  | 'textField:error' 
  | 'label' 
  | 'label:error' 
  | 'innerWrapper' 
  | 'innerWrapper:error' 
  | 'error';
const createTextInputStyle = createDefaultVariantFactory<TextInputComposition>()

const presets = includePresets((styles) => createTextInputStyle(() => ({ wrapper: styles })))

export const TextInputStyles = {
  ...presets,
  default: createTextInputStyle((theme) => ({
    textField: {
      ...(
        theme.IsBrowser ? 
          {
            outline: 'none',
            border: 'none',
            caretColor: theme.colors.primary,
          }
          : 
          {
            ...theme.spacing.padding(0),
            ...theme.spacing.paddingHorizontal(1),
          }
      ),
     
      backgroundColor: 'transparent',
      flex: 1,

      // ...assignTextStyle('p2')(theme).text,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    innerWrapper: {
      ...theme.spacing.paddingVertical(0.5),
      ...theme.spacing.paddingHorizontal(1),
      ...theme.presets.row,
      ...theme.border.primary({
        width: 1,
      }),
      display: 'flex',
      alignItems: 'center',

    },
    label: {
      ...theme.spacing.marginBottom(1),
    },
    icon: {
      height: 20,
      width: 20,
      color: theme.colors.primary,
    },
    leftIcon: {
      ...theme.spacing.marginRight(1),
    },
    rightIcon: {
    
      ...theme.spacing.marginLeft(1),
    },
    error: {
      color: theme.colors.negative,
    },
    'icon:error': {
      color: theme.colors.negative,
    },
    'textField:error': {
      caretColor: theme.colors.negative,
    },
    'innerWrapper:error': {
      borderColor: theme.colors.negative,
    },
  })),
  line: createTextInputStyle((theme) => ({
    innerWrapper: {
      ...theme.border.primary({width: 1, directions: ['bottom']}),
    },
  })),
  box: createTextInputStyle((theme) => ({
    innerWrapper: {
      ...theme.border.primary(1),
    },
  })),
  pill: createTextInputStyle((theme) => ({
    innerWrapper: {
      ...theme.border.primary(1),
      borderRadius: 15,
    },
  })),
}
