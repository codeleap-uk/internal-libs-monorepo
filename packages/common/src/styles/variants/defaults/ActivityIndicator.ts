import { includePresets } from '../../presets';
import { createDefaultVariantFactory } from '../createDefaults';

export type ActivityIndicatorComposition =
  | 'wrapper'
  | 'backCircle'
  | 'frontCircle'
  | 'circle';

const createActivityIndicatorStyle =
  createDefaultVariantFactory<ActivityIndicatorComposition>();

const presets = includePresets((styles) => createActivityIndicatorStyle(() => ({ wrapper: styles })),
);

export const ActivityIndicatorStyles = {
  ...presets,
  default: createActivityIndicatorStyle((theme) => {
    const size = theme.spacing.base * 1.6;

    return {
      wrapper: {
        position: 'relative',
        height: size,
        width: size,
      },
      circle: {
        borderRadius: 100,
        position: 'absolute',
        ...theme.presets.whole,
      },
      backCircle: {
        ...theme.border.primary(size * 0.25),
        opacity: 0.5,
      },
      frontCircle: {
        ...theme.border.create({ width: size * 0.25, style: 'transparent' }),
        borderTopColor: theme.colors.primary,
      },
    };
  }),
};
