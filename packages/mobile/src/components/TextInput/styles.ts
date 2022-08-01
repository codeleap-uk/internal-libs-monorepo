import { assignTextStyle, createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ActionIconParts } from '../ActionIcon'

export type IconParts = Exclude<ActionIconParts, 'icon' | 'icon:disabled'>
type InputIcons = 'icon' | 'leftIcon' | 'rightIcon'

export type InputIconComposition = `${InputIcons}${Capitalize<IconParts>}`
| InputIcons

type TextInputParts =
  | 'wrapper'
  | InputIconComposition
  | 'textField'
  | 'label'
  | 'innerWrapper'
  | 'error'
  | 'subtitle'
  | 'subtitleWrapper'
  | 'placeholder'
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
      ...theme.spacing.padding(0),
      ...theme.spacing.paddingHorizontal(1),
      ...assignTextStyle('p1')(theme).text,
      minWidth: 1,
      backgroundColor: 'transparent',
      flex: 1,
    },
    placeholder: {
      color: theme.colors.lightGray,
    },
    selection: {
      color: theme.colors.primary,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',

    },
    innerWrapper: {
      ...theme.spacing.paddingVertical(0.5),
      ...theme.spacing.paddingHorizontal(1),
      ...theme.presets.row,
      ...theme.border.neutral(1),
      display: 'flex',
      alignItems: 'center',
    },

    label: {
      ...theme.spacing.marginBottom(1),
      ...assignTextStyle('h5')(theme).text,
    },
    'icon': {
      color: theme.colors.neutral,
    },
    'icon:error': {
      color: theme.colors.negative,
    },
    'icon:focus': {
      color: theme.colors.primary,
    },
    leftIconTouchableWrapper: {
      // ...theme.spacing.marginRight(0.5),
    },
    rightIconTouchableWrapper: {
      // ...theme.spacing.marginLeft(0.5),
    },
    error: {
      color: theme.colors.negative,

    },
    subtitleWrapper: {
      ...theme.spacing.marginTop(0.2),
      ...theme.presets.row,
      ...theme.presets.justifySpaceBetween,
      ...theme.presets.alignCenter,
    },
    subtitle: {
      ...theme.presets.textRight,
    },
    'label:error': {
      color: theme.colors.negative,
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
