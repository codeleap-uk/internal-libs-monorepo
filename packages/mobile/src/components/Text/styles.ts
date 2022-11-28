import { assignTextStyle, createDefaultVariantFactory, includePresets, shadeColor, StylesOf } from '@codeleap/common'
import { FeedbackConfig } from '../../utils'

export type TextComposition = 'text' | 'pressFeedback' | 'text:disabled'

export type TextStylesGen<TCSS = any> = StylesOf<'text', TCSS> & {
  'pressFeedback'?: FeedbackConfig
}

const createTextStyle = createDefaultVariantFactory<
  TextComposition, TextStylesGen
>()

const presets = includePresets((styles) => createTextStyle(() => ({ text: styles })),
)

export const TextStyles = {
  ...presets,
  default: createTextStyle((theme) => {
    const defaultStyle = assignTextStyle('p1')(theme).text
    return {
      text: {
        fontFamily: theme.typography.fontFamily,
        ...defaultStyle,
      },
      'text:disabled': {
        color: theme.colors.disabled,
      },
      pressFeedback: {
        type: 'highlight',
        brightness: 0,
        shiftOpacity: 0.3,
      },
    }
  }),
  h1: assignTextStyle('h1'),
  h2: assignTextStyle('h2'),
  h3: assignTextStyle('h3'),
  h4: assignTextStyle('h4'),
  h5: assignTextStyle('h5'),
  h6: assignTextStyle('h6'),
  p1: assignTextStyle('p1'),
  p2: assignTextStyle('p2'),
  p3: assignTextStyle('p3'),
  p4: assignTextStyle('p4'),
  link: assignTextStyle('p1'),
  OSAlertBody: createTextStyle((theme) => ({
    text: {
      ...assignTextStyle('p1')(theme).text,
      ...theme.presets.textCenter,
    },
  })),
}
