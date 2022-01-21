import { assignTextStyle } from '.';
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
      outline: 'none',
      border: 'none',
      caretColor: theme.colors.primary,
      background: 'transparent',
      flex: 1,
      ...assignTextStyle('p2')(theme).text,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    innerWrapper: {
      ...theme.spacing.paddingVertical(0.5),
      ...theme.spacing.paddingHorizontal(1),
      border: `1px solid ${theme.colors.primary}`,
      display: 'flex',

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
      border: 'none',
      borderBottom: theme.border.white(1),
    },
  })),
  box: createTextInputStyle((theme) => ({
    innerWrapper: {
      border: theme.border.white(1),
    },
  })),
  pill: createTextInputStyle((theme) => ({
    innerWrapper: {
      border: theme.border.primary(1),
      borderRadius: 15,
    },
  })),
}
