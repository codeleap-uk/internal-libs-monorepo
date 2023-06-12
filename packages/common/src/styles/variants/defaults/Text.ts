import { AppTheme, FontAttrs, Fonts, ThemeColorScheme } from '../..'
import { TypeGuards } from '../../../utils'
import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type TextComposition = 'text'
const createTextStyle = createDefaultVariantFactory<TextComposition>()

const presets = includePresets((styles) => createTextStyle(() => ({ text: styles })),
)

type ResolveTextFamilyParam = {fontWeight?: string; fontFamily?:string; resolveFontFamilyAttr?: FontAttrs}
export function resolveTextFamily(theme: ThemeColorScheme<AppTheme>, { fontWeight = '400', fontFamily = '', resolveFontFamilyAttr }: ResolveTextFamilyParam) {
  const family = fontFamily || theme?.typography?.base?.fontFamily

  const resolveFontFamily = theme.typography.base.resolveFontFamily

  if (!TypeGuards.isNil(resolveFontFamily)) {
    const fontName = `${fontFamily}_${fontWeight.toString()}`

    if (TypeGuards.isFunction(resolveFontFamily)) {
      fontFamily = resolveFontFamily(fontName, resolveFontFamilyAttr)
    } else {
      const resolved = Object.entries(resolveFontFamily).find(([key]) => fontName.startsWith(key))?.[1]
      if (resolved) {
        fontFamily = resolved
      }
    }
  }

  return { fontFamily: family, fontWeight }
}

export function assignTextStyle(name: Fonts, add = {}) {
  return createTextStyle((theme) => {
    const style = theme.typography.base.styles[name]
    const fontFamily = theme?.typography?.base?.fontFamily
    const fontWeight = style.weight.toString()
    const fontSize = style.size

    const resolveFontFamilyAttr = {
      weight: Number(fontWeight),
      family: fontFamily,
      letterSpacing: style.letterSpacing ?? null,
      size: fontSize,
    }

    return {
      text: {
        ...resolveTextFamily(theme, { fontWeight, resolveFontFamilyAttr }),
        fontSize,
        lineHeight: style.lineHeight ?? null,
        letterSpacing: style.letterSpacing ?? null,
        ...add,
      },
    }
  })
}

export const TextStyles = {
  ...presets,
  default: createTextStyle((theme) => ({
    text: {
      fontFamily: theme.typography.base.fontFamily,
      ...assignTextStyle('p1')(theme).text,
    },
  })),
  hx: assignTextStyle('hx'),
  h0: assignTextStyle('h0'),
  h1: assignTextStyle('h1'),
  h2: assignTextStyle('h2'),
  h3: assignTextStyle('h3'),
  h4: assignTextStyle('h4'),
  h5: assignTextStyle('h5'),
  p1: assignTextStyle('p1'),
  p2: assignTextStyle('p2'),
  p3: assignTextStyle('p3'),
  p4: assignTextStyle('p4'),
  p5: assignTextStyle('p5'),
  link: assignTextStyle('p2'),
  OSAlertBody: createTextStyle((theme) => ({
    text: {
      ...assignTextStyle('p1')(theme).text,
      ...theme.presets.textCenter,
    },
  })),
}
