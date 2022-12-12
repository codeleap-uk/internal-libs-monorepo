import { createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'
import { InputLabelComposition } from '../InputLabel'
import { TouchableStylesGen } from '../Touchable'

export type SegmentedControlStates = 'selected'

export type SegmentedControlComposition =
 'selectedBubble' |
 'wrapper' |
 'innerWrapper' |
 'scroll' |
 'scrollContent' |
 'text' |
 `text:${SegmentedControlStates}` |
 'button' |
 'buttonFeedback' |
 `button:${SegmentedControlStates}` |
 `label${Capitalize<InputLabelComposition>}`

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

const presets = includePresets((style) => createSegmentedControlStyle(() => ({ wrapper: style })))

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
      wrapper: {
        height: 'auto',
      },
      scroll: {
        height: theme.values.buttons.default.height,
        maxHeight: theme.values.buttons.default.height,
      },
      scrollContent: {
        ...theme.presets.row,
        ...theme.presets.alignStretch,
        height: theme.values.buttons.default.height,

      },
      button: {
        backgroundColor: 'transparent',
        ...theme.presets.alignCenter,
        ...theme.presets.justifyCenter,

        borderRadius: theme.borderRadius.medium,
        ...theme.spacing.padding(1),
        minHeight: '100%',

      },
      selectedBubble: {
        position: 'absolute',
        zIndex: -1,
        ...theme.spacing.padding(2),
        top: 0,
        bottom: 0,
        borderRadius: theme.borderRadius.medium,
        backgroundColor: theme.colors.primary,
      },
      innerWrapper: {
        borderRadius: theme.borderRadius.medium,
        backgroundColor: theme.colors.backgroundSecondary,
        ...theme.presets.row,
        position: 'relative',
        height: theme.values.buttons.default.height,
      },

    }

  }),
}
