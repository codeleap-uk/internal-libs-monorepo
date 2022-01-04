import { includePresets } from '../../presets';
import { createDefaultVariantFactory } from '../createDefaults';

export type SelectComposition = 'wrapper';
const createSelectStyle = createDefaultVariantFactory();

const presets = includePresets((styles) => createSelectStyle(() => ({ wrapper: styles })));

export const SelectStyles = {
  ...presets,
  default: createSelectStyle((theme) => ({
    wrapper: {
      display: 'flex',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      webkitAppearance: 'none',
      background: theme.colors.primary,
      color: theme.colors.secondary,
      ...theme.spacing.padding(1),
    }
  })),
}