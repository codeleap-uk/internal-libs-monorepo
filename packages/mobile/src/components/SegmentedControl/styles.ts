import { createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'
import { TouchableStylesGen } from '../Touchable'

export type SegmentedControlStates = 'selected'

export type SegmentedControlComposition =
 'selectedBubble' |
 'wrapper' |
 'scroll' |
 'scrollContent' |
 'text' |
 `text:${SegmentedControlStates}` |
 'button' |
 'buttonFeedback' |
 `button:${SegmentedControlStates}`

export type SegmentedControlStylesGen<TCSS = any> =
  StylesOf<
    Exclude<SegmentedControlComposition, 'buttonFeedback'>
  > & {
    buttonFeedback?: TouchableStylesGen['feedback']
  }

const createSegmentedControlStyle = createDefaultVariantFactory<
SegmentedControlComposition,
SegmentedControlStylesGen
>()

const presets = includePresets((style) => createSegmentedControlStyle(() => ({ scrollContent: style })))

export const SegmentedControlStyles = {
  ...presets,
  default: createSegmentedControlStyle((theme) => {

    return {
      buttonFeedback: {
        type: 'opacity',
        value: 0.5,
      },
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
        ...theme.presets.row,
        ...theme.spacing.paddingHorizontal(2),
        ...theme.presets.alignStretch,
      },
      button: {
        backgroundColor: 'transparent',
        ...theme.presets.alignCenter,
        ...theme.presets.justifyCenter,

        borderRadius: theme.borderRadius.large,
        ...theme.spacing.padding(1),
        minHeight: '100%',

      },
      selectedBubble: {
        position: 'absolute',
        zIndex: -1,
        ...theme.spacing.padding(2),
        // maxHeight: 50,
        // minHeight: 50,
        top: 0,
        bottom: 0,
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
