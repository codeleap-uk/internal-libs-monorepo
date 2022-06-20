import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type SegmentedControlStates = 'selected'

export type SegmentedControlComposition =
 'selectedBubble' |
 'wrapper' |
 'scroll' |
 'scrollContent' |
 'text' |
 `text:${SegmentedControlStates}` |
 'button' |
 `button:${SegmentedControlStates}`

const createSegmentedControlStyle = createDefaultVariantFactory<SegmentedControlComposition>()

const presets = includePresets((style) => createSegmentedControlStyle(() => ({ scrollContent: style })))

export const SegmentedControlStyles = {
  ...presets,
  default: createSegmentedControlStyle((theme) => {

    return {

      text: {
        color: theme.colors.text,
      },
      'text:selected': {
        color: theme.colors.white,
      },
      scroll: {
        height: theme.values.buttons.default.height,
        // borderRadius: Theme.borderRadius.large,
      },
      scrollContent: {
        // borderRadius: Theme.borderRadius.large,
        ...theme.spacing.paddingHorizontal(2),
      },
      button: {
        backgroundColor: 'transparent',
        ...theme.presets.alignCenter,
        color: 'red',
        ...theme.spacing.padding(2),
        ...theme.presets.justifyCenter,
      },
      selectedBubble: {
        position: 'absolute',
        zIndex: -1,
        ...theme.spacing.padding(2),
        maxHeight: 50,
        minHeight: 50,
        borderRadius: theme.borderRadius.large,
        backgroundColor: theme.colors.primary,
      },
      wrapper: {
        borderRadius: theme.borderRadius.large,
        backgroundColor: theme.colors.backgroundSecondary,
        ...theme.presets.row,
        position: 'relative',
      },

    }

  }),
}
