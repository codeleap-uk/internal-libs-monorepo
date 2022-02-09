import { DefaultColors } from '.';
import { createBorderHelpers } from './helpers';

import { breakpointHooksFactory, buildMediaQueries } from './MediaQuery';
import { defaultPresets } from './presets';
import { spacingFactory } from './Spacing';
import { DynamicValueAccessors, EnhancedTheme, ThemeValues } from './types';

const defaultColors: Record<DefaultColors, string> = {
  black: '#000',
  gray: '#ccc',
  negative: '#a11',
  positive: '#ada',
  primary: '#7695EC',
  secondary: '#000',
  white: '#fff',
};

const defaultAccessors: DynamicValueAccessors = {
  screenSize: () => [0, 0],
};

/**
 * [[include:Theme.md]]
 */
export function createTheme<T extends ThemeValues>(
  values: T,
  accessors?: DynamicValueAccessors,
): EnhancedTheme<T> {
  const getters = { ...defaultAccessors, ...accessors };
  const isBrowser = !window?.process;
  return {
    ...values,
    colors: {
      ...defaultColors,
      ...values.colors,
    },
    hooks: breakpointHooksFactory(values.breakpoints, getters.screenSize),
    media: buildMediaQueries(values.breakpoints),
    spacing: {
      base: values.spacing,
      ...spacingFactory(values.spacing, 'padding'),
      ...spacingFactory(values.spacing, 'margin'),
    },
    border: createBorderHelpers(values, isBrowser),
    presets: defaultPresets,
    semiCircle: (side) => ({
      width: side,
      height: side,
      borderRadius: values.borderRadius.small,
    }),
    circle: (side) => ({
      width: side,
      height: side,
      borderRadius: values.borderRadius.large,
    }),
    square: (side) => ({
      width: side,
      height: side,
    }),
    sized: (size) => ({
      width: size * values.spacing,
      height: size * values.spacing,
    }),
    IsBrowser: isBrowser,
  };
}
