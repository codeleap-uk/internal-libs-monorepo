import { Fonts, TypographyStyle } from '../..'
import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type TextComposition = 'text'
const createTextStyle = createDefaultVariantFactory<TextComposition>()

const presets = includePresets((styles) => createTextStyle(() => ({ text: styles })),
)
function createClampExpression(values: TypographyStyle, baseSize: number) {
  const { max, min, multiplier, viewport } = values.size
  const add =
    typeof multiplier == 'string' ? multiplier : `${baseSize * multiplier}px`
  const s = `max(${min}px, min(calc(${add} + ${viewport}vw), ${max}px))`
  // const s = `clamp(${min}px, calc(${add} + ${viewport}vw), ${max}px)`
  return s
}
export function assignTextStyle(name: Fonts, add = {}) {
  return createTextStyle((theme) => {
    const style = theme.typography.styles[name]
    const fontFamily = style?.fontFamily || theme?.typography?.fontFamily
    const fontWeight = style.weight.toString()

    const color = style?.color ||
      name.startsWith('h') ? theme?.colors.textH : theme?.colors.textP

    if (theme.IsBrowser) {
      return {
        text: {
          fontFamily,
          fontWeight,
          fontSize: createClampExpression(style, theme.typography.baseFontSize),
          lineHeight: style.lineHeight,
          color,
          ...add,
        },
      }
    }
    const fontSize = style.sizeMultiplier * theme.typography.baseFontSize
    const lineHeight = style.lineHeightMultiplier ? fontSize * style.lineHeightMultiplier : null
    // console.log('name', name)

    return {
      text: {
        fontWeight,
        color,
        fontFamily,
        lineHeight,
        fontSize,
        ...add,
      },
    }
  })
}

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
