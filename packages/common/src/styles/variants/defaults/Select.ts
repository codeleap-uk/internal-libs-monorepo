import { includePresets } from '../../presets';
import { createDefaultVariantFactory } from '../createDefaults';

export type SelectComposition = 'wrapper';
const createSelectStyle = createDefaultVariantFactory();

const presets = includePresets((styles) => createSelectStyle(() => ({ wrapper: styles })));

export const SelectStyles = {
  ...presets,
  default: createSelectStyle((theme) => ({
    wrapper: {
      position: 'relative',
      width: 'max-content',
      ':after': {
        content: '""',
        position: 'absolute',
        top: `calc(50% - ${theme.typography.baseFontSize / 2}px)`,
        right: `${theme.typography.baseFontSize / 2}px`,
        width: `${theme.typography.baseFontSize / 2}px`,
        height: `${theme.typography.baseFontSize / 2}px`,
        borderBottom: '2px solid',
        borderLeft: '2px solid',
        borderColor: theme.colors.secondary,
        transform: 'rotate(-45deg)',
        pointerEvents: 'none',
      },
    },
    select: {
      fontSize: theme.typography.baseFontSize,
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
  })), 
}
