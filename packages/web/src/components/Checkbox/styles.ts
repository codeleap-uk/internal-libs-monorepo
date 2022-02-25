import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
export type WebCheckboxComposition =
  | 'wrapper'
  | 'label'
  | 'input'
  | 'checkmark'
  | 'checkmarkWrapper'

const createCheckboxStyle =
  createDefaultVariantFactory<WebCheckboxComposition>()

const presets = includePresets((styles) => createCheckboxStyle(() => ({ wrapper: styles })),
)

export const WebCheckboxStyles = {
  ...presets,
  default: createCheckboxStyle((theme) => ({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      cursor: 'pointer',
      '.checkbox-label': {
        height: '18px',
        width: '18px',
        border: `1px solid ${theme.colors.gray}`,
        borderRadius: theme.borderRadius.small,
        position: 'absolute',
        overflow: 'hidden',
        transition: 'background 0.3s ease',
        ':after': {
          content: '""',
          border: `2px solid ${theme.colors.white}`,
          borderLeftColor: 'transparent',
          borderTopColor: 'transparent',
          height: '40%',
          width: '20%',
          position: 'absolute',
          left: '50%',
          top: '40%',

          transform: 'translate(-50%,-50%) rotate(45deg) scale(0)',
          transition: 'transform 0.2s ease',
        },
      },
    },
    label: {
      ...theme.spacing.marginLeft(1),
    },
    input: {
      visibility: 'hidden',
      '&:checked + .checkbox-label': {
        '&:after': {
          transform: 'translate(-50%,-50%) rotate(45deg) scale(1)',
        },
        background: theme.colors.primary,
      },
    },
  })),
}
