import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'
import { assignTextStyle } from './Text'

export type SelectComposition = 'wrapper'
const createSelectStyle = createDefaultVariantFactory()

const presets = includePresets((styles) => createSelectStyle(() => ({ wrapper: styles })),
)

export const SelectStyles = {
  ...presets,
  default: createSelectStyle((theme) => ({
    wrapper: {
      position: 'relative',
      width: 'max-content',
      flexDirection: 'column',
      ':after': {
        content: '""',
        position: 'absolute',
        bottom: '1rem',
        right: '0.5rem',
        width: '0.5rem',
        height: '0.5rem',
        borderBottom: '2px solid',
        borderLeft: '2px solid',
        borderColor: theme.colors.secondary,
        transform: 'rotate(-45deg)',
        pointerEvents: 'none',
      },
    },
    select: {
      ...assignTextStyle('p1')(theme).text,
      minWidth: '100%',
      display: 'flex',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      webkitAppearance: 'none',
      mozAppearance: 'none',
      appearance: 'none',
      backgroundColor: theme.colors.primary,
      color: theme.colors.secondary,
      ...theme.spacing.padding(1),
      ...theme.spacing.paddingRight(3),
    },
    label: {
      ...assignTextStyle('p1')(theme).text,
      color: theme.colors.secondary,
      ...theme.spacing.padding(1),
      ...theme.spacing.paddingLeft(0),
    },
  })),
}
