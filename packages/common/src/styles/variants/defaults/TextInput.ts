import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'
import { optionalObject } from '../../../utils'

type TextInputParts =
  | 'wrapper'
  | 'icon'
  | 'leftIcon'
  | 'rightIcon'
  | 'textField'
  | 'label'
  | 'innerWrapper'
  | 'error'
  | 'placeholder';

export type TextInputComposition =
  | `${TextInputParts}:error`
  | `${TextInputParts}:focus`
  | TextInputParts;

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

      backgroundColor: 'transparent',
      flex: 1,
      fontSize: theme.typography.baseFontSize,
      // ...assignTextStyle('p2')(theme).text,
    },
    placeholder: {
      color: theme.colors.gray,
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
      ...theme.border.gray({
        width: 1,
      }),
      height: theme.buttons.default.height,
      display: 'flex',
      alignItems: 'center',
      ...theme.border.primary(1),
    },
    'icon:focus': {
      color: theme.colors.primary,
    },
    label: {
      ...theme.spacing.marginBottom(1),
    },
    icon: {
      height: 20,
      width: 25,
      color: theme.colors.gray,
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
  })),
  line: createTextInputStyle((theme) => ({
    innerWrapper: {
      ...theme.border.gray({ width: 1, directions: ['bottom'] }),
    },
  })),
  box: createTextInputStyle((theme) => ({
    innerWrapper: {
      ...theme.border.gray(1),
    },
  })),
  pill: createTextInputStyle((theme) => ({
    innerWrapper: {
      ...theme.border.gray(1),
      borderRadius: 15,
    },
  })),
}
