import { createDefaultVariantFactory, includePresets } from '@codeleap/common';

type CheckboxParts =
  | 'wrapper'
  | 'label'
  | 'input'
  | 'checkmark'
  | 'checkmarkWrapper'
  | 'error';

export type MobileCheckboxComposition =
  | CheckboxParts
  | `${CheckboxParts}:checked`
  | `${CheckboxParts}:disabled`
  | `${CheckboxParts}:error`;
const createCheckboxStyle =
  createDefaultVariantFactory<MobileCheckboxComposition>();

const presets = includePresets((styles) => createCheckboxStyle(() => ({ wrapper: styles })),
);

export const MobileCheckboxStyles = {
  ...presets,
  default: createCheckboxStyle((theme) => {
    const size = theme.typography.baseFontSize * 1.2;

    const markHeight = size * 0.5;
    const markWidth = size * 0.25;

    const translateX = -(markWidth / 2);
    const translateY = -(markHeight / 2);
    return {
      wrapper: {},
      input: {
        flexDirection: 'row',
        ...theme.presets.alignCenter,
        borderRadius: theme.borderRadius.small,
      },
      label: {
        ...theme.spacing.marginLeft(0.5),
      },

      checkmark: {
        position: 'absolute',
        top: '40%',
        left: '50%',

        height: markHeight,
        width: markWidth,
        transform: [{ translateX }, { translateY }, { rotate: '45deg' }],
      },
      'checkmark:checked': {
        ...theme.border.white({
          width: 2,
          directions: ['right', 'bottom'],
        }),
      },
      checkmarkWrapper: {
        position: 'relative',
        width: size,
        height: size,
        ...theme.border.gray(1),
      },
      'checkmarkWrapper:checked': {
        backgroundColor: theme.colors.primary,
      },
      error: {
        color: theme.colors.negative,
      },
    };
  }),
};
