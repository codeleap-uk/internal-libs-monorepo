import { assignTextStyle, createDefaultVariantFactory } from '@codeleap/common'
import { SegmentedControlComposition, SegmentedControlPresets } from '@codeleap/web'

const createSegmentedControlStyle = createDefaultVariantFactory<SegmentedControlComposition>()

const ICON_SEGMENTED_SIZE = 20
const TAB_BUBBLE_HEIGHT = 3

export const AppSegmentedControlStyles = {
  ...SegmentedControlPresets,
  default: createSegmentedControlStyle((theme) => ({
    wrapper: {
      height: 'auto',
      width: 'fit-content',
      ...theme.presets.column,
    },
    innerWrapper: {
      borderRadius: theme.borderRadius.small,
      ...theme.presets.row,
      ...theme.presets.relative,
      height: theme.values.itemHeight.default,
      backgroundColor: theme.colors.neutral2,
    },
    text: {
      color: theme.colors.primary3,
      '&:hover': {
        color: theme.colors.primary4,
      },
    },
    'text:selected': {
      color: theme.colors.neutral10,
    },
    'text:disabled': {
      color: theme.colors.neutral5,
    },
    icon: {
      ...theme.spacing.marginRight(1),
      color: theme.colors.primary3,
      width: theme.values.iconSize[2],
      height: theme.values.iconSize[2],
    },
    'icon:selected': {
      color: theme.colors.neutral10,
    },
    'icon:disabled': {
      color: theme.colors.neutral5,
    },
    label: {
      ...theme.spacing.marginBottom(1),
      ...assignTextStyle('p1')(theme).text,
      color: theme.colors.neutral8,
    },
    button: {
      ...theme.presets.alignCenter,
      ...theme.presets.justifyCenter,
      borderRadius: theme.borderRadius.small,
      minHeight: '100%',
      ...theme.spacing.paddingHorizontal(2),
      cursor: 'pointer',
      zIndex: 1,
      backgroundColor: 'transparent',
    },
    selectedBubble: {
      ...theme.presets.absolute,
      zIndex: 0,
      bottom: 0,
      top: 0,
      backgroundColor: theme.colors.primary3,
      borderRadius: theme.borderRadius.small,
    },
    'innerWrapper:disabled': {
      backgroundColor: 'transparent',
    },
    'selectedBubble:disabled': {
      backgroundColor: 'transparent',
      pointerEvents: 'none',
    },
    'button:disabled': {
      backgroundColor: 'transparent',
      pointerEvents: 'none',
    },
  })),
  tiny: createSegmentedControlStyle((theme) => ({
    innerWrapper: {
      height: theme.values.itemHeight.tiny,
    },
    'button:selected': {
      height: theme.values.itemHeight.tiny,
    },
    selectedBubble: {
      height: theme.values.itemHeight.tiny,
      ...theme.spacing.padding(0),
    },
  })),
  small: createSegmentedControlStyle((theme) => ({
    innerWrapper: {
      height: theme.values.itemHeight.small,
    },
    button: {
      borderRadius: theme.borderRadius.small,
    },
    'button:selected': {
      height: theme.values.itemHeight.small,
    },
    selectedBubble: {
      height: theme.values.itemHeight.small,
      ...theme.spacing.padding(0),
    },
  })),
  tinyRadius: createSegmentedControlStyle((theme) => ({
    innerWrapper: {
      borderRadius: theme.borderRadius.tiny,
    },
    button: {
      borderRadius: theme.borderRadius.tiny,
    },
    'button:selected': {
      borderRadius: theme.borderRadius.tiny,
    },
    selectedBubble: {
      borderRadius: theme.borderRadius.tiny,
    },
  })),
  smallRadius: createSegmentedControlStyle((theme) => ({
    innerWrapper: {
      borderRadius: theme.borderRadius.small,
    },
    button: {
      borderRadius: theme.borderRadius.small,
    },
    'button:selected': {
      borderRadius: theme.borderRadius.small,
    },
    selectedBubble: {
      borderRadius: theme.borderRadius.small,
    },
  })),
  rounded: createSegmentedControlStyle((theme) => ({
    innerWrapper: {
      borderRadius: theme.borderRadius.rounded,
    },
    button: {
      borderRadius: theme.borderRadius.rounded,
    },
    'button:selected': {
      borderRadius: theme.borderRadius.rounded,
    },
    selectedBubble: {
      borderRadius: theme.borderRadius.rounded,
    },
  })),
  fullWidth: createSegmentedControlStyle((theme) => ({
    wrapper: {
      ...theme.presets.fullWidth,
    },
    innerWrapper: {
      ...theme.presets.fullWidth,
    },
    selectedBubble: {
      ...theme.presets.fullWidth,
    },
    button: {
      flex: 1,
    },
    'button:selected': {
      flex: 1.,
    },
  })),

  tab: createSegmentedControlStyle((theme) => ({
    innerWrapper: {
      backgroundColor: 'transparent',
    },
    'button:selected': {
      backgroundColor: 'transparent',
    },
    selectedBubble: {
      height: TAB_BUBBLE_HEIGHT,
      top: '100%',
      ...theme.border.primary3({ directions: ['bottom'], width: theme.values.borderWidth.medium }),
    },
    'text:selected': {
      color: theme.colors.neutral10,
    },
    text: {
      color: theme.colors.neutral9,
      '&:hover': {
        color: theme.colors.neutral10,
      },
    },
    icon: {
      color: theme.colors.neutral7,
      width: ICON_SEGMENTED_SIZE,
      height: ICON_SEGMENTED_SIZE,
    },
  })),

}

