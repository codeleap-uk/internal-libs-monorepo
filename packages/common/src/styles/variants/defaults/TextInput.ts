import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'
import { optionalObject } from '../../../utils'
import { assignTextStyle } from './Text'

type TextInputParts =
  | 'wrapper'
  | 'icon'
  | 'leftIcon'
  | 'rightIcon'
  | 'textField'
  | 'label'
  | 'innerWrapper'
  | 'error'
  | 'placeholder'
  | 'buttonIconWrapper'
  | 'selection'
  | 'requiredAsterisk'
  | 'labelWrapper'

export type TextInputComposition =
  | `${TextInputParts}:error`
  | `${TextInputParts}:focus`
  | TextInputParts

const createTextInputStyle =
  createDefaultVariantFactory<TextInputComposition>()

const presets = includePresets((styles) => createTextInputStyle(() => ({ wrapper: styles })))

export const TextInputStyles = {
  ...presets,
  default: createTextInputStyle((theme) => ({
    textField: {
      ...(theme.IsBrowser
        ? {
          outline: 'none',
          border: 'none',
          caretColor: theme.colors.primary,
        }
        : {
          ...theme.spacing.padding(0),
          ...theme.spacing.paddingHorizontal(1),
        }),
      ...assignTextStyle('p1')(theme).text,
      minWidth: 1,
      backgroundColor: 'transparent',
      flex: 1,
    },
    placeholder: {
      color: theme.colors.lightGrey,
    },
    selection: {
      color: theme.colors.primary,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      ...optionalObject(
        theme.IsBrowser,
        {
          '*': {
            transition: 'all 0.2s ease',
          },
        },
        {},
      ),
    },
    innerWrapper: {
      ...theme.spacing.paddingVertical(0.5),
      ...theme.spacing.paddingHorizontal(1),
      ...theme.presets.row,
      ...theme.border.neutral(1),
      display: 'flex',
      alignItems: 'center',
    },
    'icon:focus': {
      color: theme.colors.primary,
    },
    label: {
      ...theme.spacing.marginBottom(1),
      ...assignTextStyle('h5')(theme).text,
    },
    icon: {
      size: 20,
      color: theme.colors.neutral,
    },
    leftIcon: {
      ...theme.spacing.marginRight(1),
      size: 20,
    },
    rightIcon: {
      ...theme.spacing.marginLeft(1),
      size: 20,
    },
    error: {
      color: theme.colors.negative,
      ...theme.spacing.marginTop(0.5),
    },
    'icon:error': {
      color: theme.colors.negative,
    },
    'label:error': {
      color: theme.colors.negative,
    },
    'textField:error': {
      ...optionalObject(
        theme.IsBrowser,
        {
          caretColor: theme.colors.negative,
        },
        {},
      ),
    },
    'innerWrapper:error': {
      ...theme.border.negative(1),
    },
    'innerWrapper:focus': {
      ...theme.border.primary(1),
    },
    requiredAsterisk: {
      color: theme.colors.negative,
    },
    labelWrapper: {
      ...theme.presets.row,
    },
  })),
  line: createTextInputStyle((theme) => ({
    innerWrapper: {
      ...theme.border.neutral({ width: 1, directions: ['bottom'] }),
    },
  })),
  box: createTextInputStyle((theme) => ({
    innerWrapper: {
      ...theme.border.neutral(1),
    },
  })),
  pill: createTextInputStyle((theme) => ({
    innerWrapper: {
      ...theme.border.neutral(1),
      borderRadius: 15,
    },
  })),
}
