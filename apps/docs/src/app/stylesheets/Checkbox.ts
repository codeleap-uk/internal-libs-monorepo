import { assignTextStyle } from './Text'
import { CheckboxComposition, CheckboxPresets } from '@codeleap/web'
import { variantProvider } from '../theme'

const createCheckboxVariant = variantProvider.createVariantFactory<CheckboxComposition>()

const defaultStyles = CheckboxPresets

export const AppCheckboxStyles = {
  ...defaultStyles,
  default: createCheckboxVariant((theme) => {

    const iconSize = theme.values.iconSize[2]
    const boxSize = 28

    return {
      "box:transition": {},
      "checkmarkWrapper:transition": {},
      box: {
        borderRadius: theme.borderRadius.tiny,
        height: boxSize,
        width: boxSize,
        ...theme.presets.center,
        ...theme.border['neutral5']({ width: 1 }),
        cursor: "pointer",
      },
      "box:disabled": {
        borderColor: theme.colors['neutral2'],
        cursor: 'not-allowed',
      },
      "box:unchecked": {
        backgroundColor: '#0000',
      },
      "box:disabled-unchecked": {
      
      },
      "box:checked": {
        backgroundColor: theme.colors['primary3'],
        ...theme.border['primary3']({ width: 1 }),
      },
      "box:disabled-checked": {
        backgroundColor: theme.colors['primary1'],
        ...theme.border['primary1']({ width: 1 }),
      },
      checkmarkWrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      "checkmarkWrapper:checked": {
        scale: 1,
      },
      "checkmarkWrapper:unchecked": {
        scale: 0
      },
      checkmark: {
        height: iconSize,
        width: iconSize,
        color: theme.colors['neutral1']
      },
      label: {
        ...assignTextStyle('p1')(theme).text,
        marginRight: theme.spacing.value(1),
        marginBottom: theme.spacing.value(0),
        cursor: 'pointer',
      },
      "label:disabled": {
        color: theme.colors['neutral5'],
        cursor: 'not-allowed',
      },
      description: {
        marginBottom: theme.spacing.value(0)
      },
      wrapper: {
        ...theme.presets.row,
        ...theme.presets.alignCenter,
      },
      innerWrapper: {
        ...theme.presets.alignCenter,
      }
    }
  }),
  left: createCheckboxVariant((theme) => ({
    __props: {
      checkboxOnLeft: true
    },
    label: {
      ...assignTextStyle('p1')(theme).text,
      marginLeft: theme.spacing.value(1),
      marginBottom: theme.spacing.value(0)
    },
    innerWrapper: {
      marginLeft: theme.spacing.value(0),
      ...theme.presets.center,
    },
  }))
}
