import { customTextStyles } from './Text'
import { CheckboxComposition } from '@codeleap/web'
import { StyleRegistry } from '../styles'
import { createStyles } from '@codeleap/styles'

const createCheckboxVariant = createStyles<CheckboxComposition>

export const CheckboxStyles = {
  default: createCheckboxVariant((theme) => {
    const iconSize = theme.values.iconSize[2]
    const boxSize = 28
    return {
      'box:transition': {},
      'checkmarkWrapper:transition': {},
      box: {
        borderRadius: theme.borderRadius.tiny,
        height: boxSize,
        width: boxSize,
        ...theme.presets.center,
        ...theme.border({ color: theme.colors.neutral5, width: theme.values.borderWidth.small }),
        cursor: 'pointer',
      },
      'box:disabled': {
        borderColor: theme.colors.neutral2,
        cursor: 'not-allowed',
      },
      'box:unchecked': {
        backgroundColor: '#0000',
      },
      'box:disabled-unchecked': {

      },
      'box:checked': {
        backgroundColor: theme.colors.primary3,
        ...theme.border({ color: theme.colors.primary3, width: theme.values.borderWidth.small }),
      },
      'box:disabled-checked': {
        backgroundColor: theme.colors.primary1,
        ...theme.border({ color: theme.colors.primary1, width: theme.values.borderWidth.small }),
      },
      checkmarkWrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      'checkmarkWrapper:checked': {
        scale: 1,
      },
      'checkmarkWrapper:unchecked': {
        scale: 0,
      },
      checkmark: {
        height: iconSize,
        width: iconSize,
        color: theme.colors.neutral1,
      },
      errorMessage: {
        ...customTextStyles('p4'),
        color: theme.colors.destructive2,
        ...theme.spacing.marginTop(1),
      },
      label: {
        ...customTextStyles('p1'),
        marginRight: theme.spacing.value(1),
        marginBottom: theme.spacing.value(0),
        cursor: 'pointer',
      },
      'label:disabled': {
        color: theme.colors.neutral5,
        cursor: 'not-allowed',
      },
      description: {
        ...customTextStyles('p4'),
        color: theme.colors.neutral7,
        marginBottom: theme.spacing.value(0),
      },
      wrapper: {
        ...theme.presets.row,
        ...theme.presets.alignCenter,
      },
      innerWrapper: {
        ...theme.presets.alignCenter,
      },
    }
  }),
  left: createCheckboxVariant((theme) => ({
    __props: {
      checkboxOnLeft: true,
    },
    label: {
      ...customTextStyles('p1'),
      marginLeft: theme.spacing.value(1),
      marginBottom: theme.spacing.value(0),
    },
    innerWrapper: {
      marginLeft: theme.spacing.value(0),
      ...theme.presets.center,
    },
  })),
}

StyleRegistry.registerVariants('Checkbox', CheckboxStyles)
