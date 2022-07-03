import { assignTextStyle, createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type TextComposition = 'text'
const createTextStyle = createDefaultVariantFactory<TextComposition>()

const presets = includePresets((styles) => createTextStyle(() => ({ text: styles })),
)

export const TextStyles = {
  ...presets,
  default: createTextStyle((theme) => ({
    text: {
      fontFamily: theme.typography.fontFamily,
      ...assignTextStyle('p1')(theme).text,
    },
  })),
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
