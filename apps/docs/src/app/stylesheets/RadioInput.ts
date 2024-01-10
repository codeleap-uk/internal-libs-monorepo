import { assignTextStyle } from './Text'
import { RadioInputComposition, RadioInputPresets } from '@codeleap/web'
import { variantProvider } from '../theme'

const createRadioInputStyle = variantProvider.createVariantFactory<RadioInputComposition>()

const defaultStyles = RadioInputPresets

export const AppRadioInputStyles = {
  ...defaultStyles,
  default: createRadioInputStyle((theme) => {
    const indicatorSize = theme.values.itemHeight.tiny
    const ellipsisSize = indicatorSize * 0.5

    return {
      wrapper: {
        ...theme.presets.column,
      },
      optionIndicator: {
        ...theme.border['neutral5']({ width: 1 }),
        borderRadius: theme.borderRadius.rounded,
        height: indicatorSize,
        width: indicatorSize,
        ...theme.presets.center,
        cursor: 'pointer',
      },
      "optionIndicator:disabled": {
        ...theme.border['neutral3'](1),
        cursor: 'not-allowed',
      },
      "optionIndicator:selected": {
        ...theme.border['primary3']({ width: 1 }),
        backgroundColor: theme.colors['primary3']
      },
      "optionIndicator:selectedDisabled": {
        ...theme.border['primary1']({ width: 1 }),
        backgroundColor: theme.colors['primary1']
      },
      optionIndicatorInner: {
        height: ellipsisSize,
        width: ellipsisSize,
        backgroundColor: theme.colors.neutral1,
        borderRadius: theme.borderRadius.rounded,
      },
      label: {
        cursor: 'pointer',
      },
      'label:disabled': {
        cursor: 'not-allowed',
      },
      description: {
        ...theme.spacing.marginTop(0),
      },
      optionWrapper: {
        ...theme.spacing.marginTop(1),
        ...theme.spacing.marginRight(1),
        ...theme.presets.row,
        ...theme.presets.alignCenter,
      },
      optionSeparator: {
        ...theme.spacing.marginBottom(2),
      },
      optionLabel: {
        ...assignTextStyle('p1')(theme).text,
        color: theme.colors['neutral8'],
        ...theme.spacing.marginLeft(1),
      },
      "optionLabel:disabled": {
        color: theme.colors['neutral5'],
      },
      "optionLabel:selectedDisabled": {
        color: theme.colors['neutral5'],
      }
    }
  }),
  'options:vertical': createRadioInputStyle((theme) => ({
    innerWrapper: {
      ...theme.presets.column,
      ...theme.presets.alignStart,
    },
  }))
}
