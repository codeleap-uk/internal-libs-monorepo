import { TextInputComposition } from '@codeleap/web'
import { customTextStyles } from './Text'
import { createStyles } from '@codeleap/styles'
import { StyleRegistry } from '../styles'

const createTextInputVariant = createStyles<TextInputComposition>

export const TextInputStyles = {
  default: createTextInputVariant((theme) => ({
    wrapper: {
      ...theme.presets.column,
      width: 'auto',
      ...theme.presets.fullWidth,
    },
    innerWrapper: {
      minHeight: theme.values.itemHeight.default,
      borderRadius: theme.borderRadius.small,
      ...theme.spacing.paddingHorizontal(2),
      ...theme.border({ color: theme.colors.neutral5, width: 1 }),
      paddingVertical: theme.spacing.value(0),
      ...theme.presets.row,
      ...theme.presets.alignCenter,
      backgroundColor: theme.colors.neutral1,
      cursor: 'text',
    },
    'innerWrapper:hasMultipleLines': {
      ...theme.spacing.paddingVertical(2),
    },
    'innerWrapper:multiline': {
      ...theme.presets.alignStart,
    },
    selection: {
      color: theme.colors.neutral10,
      backgroundColor: theme.colors.neutral3,
    },
    'innerWrapper:focus': {
      ...theme.border({ color: theme.colors.primary3, width: 1 }),
    },
    'innerWrapper:error': {
      ...theme.border({ color: theme.colors.destructive2, width: 1 }),
    },
    'innerWrapper:disabled': {
      ...theme.border({ color: theme.colors.neutral2, width: 1 }),
      cursor: 'not-allowed',
    },
    input: {
      ...customTextStyles('p1'),
      flex: 1,
      minWidth: null,
      width: '100%',
      color: theme.colors.neutral10,
      borderWidth: 0,
    },
    'input:multiline': {
      resize: 'none',
      minHeight: 1.5 * theme.values.itemHeight.default,
      maxHeight: 3 * theme.values.itemHeight.default,
    },
    'input:hasMultipleLines': {
      ...theme.presets.justifyCenter,
    },
    'input:focus': {
      caretColor: theme.colors.primary3,
    },
    'input:disabled': {
      color: theme.colors.neutral5,
      backgroundColor: 'transparent',
      cursor: 'not-allowed',
    },
    'placeholder:disabled': {
      color: theme.colors.neutral5,
    },
    'input:error': {
      color: theme.colors.destructive2,
    },
    placeholder: {
      color: theme.colors.neutral7,
    },
    iconIcon: {
      height: theme.values.iconSize[2],
      width: theme.values.iconSize[2],
      color: theme.colors.neutral7,
    },
    'iconIcon:focus': {
      color: theme.colors.primary3,
    },
    'iconIcon:disabled': {
      color: theme.colors.neutral5,
      cursor: 'not-allowed',
    },
    'iconIcon:error': {
      color: theme.colors.destructive2,
    },
    iconTouchableWrapper: {
      ...theme.spacing.padding(0),
      height: 'auto',
      width: 'auto',
      backgroundColor: theme.colors.neutral1,
    },
    'iconTouchableWrapper:disabled': {
      backgroundColor: theme.colors.neutral1,
    },
    leftIconTouchableWrapper: {
      ...theme.spacing.marginRight(2),
    },
    rightIconTouchableWrapper: {
      ...theme.spacing.marginLeft(2),
    },
    label: {
      ...customTextStyles('p2'),
      color: theme.colors.neutral7,
      ...theme.spacing.marginBottom(1),
    },
    description: {
      ...customTextStyles('p4'),
      color: theme.colors.neutral7,
      ...theme.spacing.marginBottom(1),
    },
    errorMessage: {
      ...customTextStyles('p4'),
      color: theme.colors.destructive2,
      ...theme.spacing.marginTop(1),
      ...theme.spacing.paddingLeft(2),
    },
  })),
  line: createTextInputVariant((theme) => ({
    innerWrapper: {
      ...theme.border({ color: theme.colors.neutral5, width: 0 }),
      ...theme.border({ color: theme.colors.neutral5, width: 1, directions: ['bottom'] }),
      borderRadius: 0,
    },
    'innerWrapper:focus': {
      ...theme.border({ color: theme.colors.neutral5, width: 0 }),
      ...theme.border({ color: theme.colors.primary3, width: 1, directions: ['bottom'] }),
    },
    'innerWrapper:error': {
      ...theme.border({ color: theme.colors.neutral5, width: 0 }),
      ...theme.border({ color: theme.colors.destructive2, width: 1, directions: ['bottom'] }),
    },
    'innerWrapper:disabled': {
      ...theme.border({ color: theme.colors.neutral5, width: 0 }),
      ...theme.border({ color: theme.colors.neutral2, width: 1, directions: ['bottom'] }),
    },
  })),
  box: createTextInputVariant((theme) => ({
    innerWrapper: {
      ...theme.border({ color: theme.colors.neutral5, width: 1 }),
    },
  })),
  normal: createTextInputVariant((theme) => ({
    innerWrapper: {
      borderRadius: theme.borderRadius.small,
    },
  })),
  pill: createTextInputVariant((theme) => ({
    innerWrapper: {
      borderRadius: theme.borderRadius.rounded,
    },
  })),
  noError: createTextInputVariant((theme) => ({
    errorMessage: {
      display: 'none',
    },
  })),
}

StyleRegistry.registerVariants('TextInput', TextInputStyles)
