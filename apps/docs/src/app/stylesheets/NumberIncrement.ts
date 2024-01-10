import { NumberIncrementComposition, NumberIncrementPresets } from '@codeleap/web'
import { variantProvider } from '../theme'
import { assignTextStyle } from './Text'

const createNumberIncrementStyle =
  variantProvider.createVariantFactory<NumberIncrementComposition>()

const defaultStyles = NumberIncrementPresets

export const AppNumberIncrementStyles = {
  ...defaultStyles,
  default: createNumberIncrementStyle((theme) => {
    const height = theme.values.itemHeight.default

    return {
      wrapper: {
        ...theme.presets.column,
        width: 'auto',
      },
      input: {
        ...assignTextStyle('p1')(theme).text,
        borderWidth: 0,
        textAlign: 'center',
        width: '100%',
        flex: 1,
      },
      "input:disabled": {
        color: theme.colors['neutral5'],
      },
      "input:error": {
        color: theme.colors['destructive2'],
      },
      placeholder: {
        color: theme.colors['neutral7'],
      },
      "placeholder:disabled": {
        color: theme.colors['neutral5'],
      },
      innerWrapper: {
        ...theme.spacing.paddingHorizontal(2),
        ...theme.spacing.paddingVertical(2),
        ...theme.presets.row,
        ...theme.presets.alignCenter,
        ...theme.presets.justifySpaceBetween,
        maxHeight: height,
        minHeight: height,
        borderRadius: theme.borderRadius.small,
        backgroundColor: theme.colors['neutral1'],
        ...theme.border['neutral5']({ width: 1 }),
      },
      "innerWrapper:cursor": {
        cursor: 'text',
      },
      "innerWrapper:focus": {
        ...theme.border['primary3']({ width: 1 }),
      },
      "innerWrapper:error": {
        ...theme.border['destructive2']({ width: 1 }),
      },
      "innerWrapper:disabled": {
        ...theme.border['neutral2']({ width: 1 }),
        cursor: 'not-allowed'
      },
      iconIcon: {
        height: theme.values.iconSize[3],
        width: theme.values.iconSize[3],
        color: theme.colors['primary3'],
      },
      "leftIconIcon:disabled": {
        color: theme.colors['neutral5'],
        cursor: 'not-allowed'
      },
      "rightIconIcon:disabled": {
        color: theme.colors['neutral5'],
        cursor: 'not-allowed'
      },
      iconTouchableWrapper: {
        ...theme.spacing.padding(0),
        height: theme.values.iconSize[3],
        width: theme.values.iconSize[3],
        borderWidth: 0,
        backgroundColor: theme.colors['neutral1'],
      },
      leftIconTouchableWrapper: {
        ...theme.spacing.marginRight(2),
      },
      'leftIconTouchableWrapper:disabled': {
        backgroundColor: theme.colors['neutral1'],
      },
      rightIconTouchableWrapper: {
        ...theme.spacing.marginLeft(2),
      },
      'rightIconTouchableWrapper:disabled': {
        backgroundColor: theme.colors['neutral1'],
      }
    }
  }),
  noError: createNumberIncrementStyle((theme) => ({
    errorMessage: {
      display: 'none',
    },
  })),
  line: createNumberIncrementStyle((theme) => ({
    innerWrapper: {
      ...theme.border['neutral5']({ width: 0 }),
      ...theme.border['neutral5']({ width: 1, directions: ['bottom'] }),
      borderRadius: 0,
    },
    "innerWrapper:focus": {
      ...theme.border['neutral5']({ width: 0 }),
      ...theme.border['primary3']({ width: 1, directions: ['bottom'] }),
    },
    "innerWrapper:error": {
      ...theme.border['neutral5']({ width: 0 }),
      ...theme.border['destructive2']({ width: 1, directions: ['bottom'] }),
    },
    "innerWrapper:disabled": {
      ...theme.border['neutral5']({ width: 0 }),
      ...theme.border['neutral2']({ width: 1, directions: ['bottom'] }),
    },
  })),
  pill: createNumberIncrementStyle((theme) => ({
    innerWrapper: {
      borderRadius: theme.borderRadius.rounded,
    },
  })),
}
