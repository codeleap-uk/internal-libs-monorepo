import { theme } from '../styles/theme'
import { Fonts } from '@codeleap/common'
import { TextComposition } from '@codeleap/web'
import { StyleRegistry } from '../styles'
import { ICSS, createStyles } from '@codeleap/styles'

const createTextVariant = createStyles<TextComposition>

export const customTextStyles = (textStyle: Fonts, customStyle = {}): ICSS => {
  const fontStyle = theme?.typography?.base?.styles[textStyle]
  const fontFamily = theme?.typography?.base?.fontFamily
  const fontWeight = fontStyle.weight.toString()
  const fontSize = fontStyle.size

  const style = {
    fontWeight,
    fontFamily,
    fontSize,
    lineHeight: fontStyle.lineHeight ?? null,
    letterSpacing: fontStyle.letterSpacing ?? null,
    color: textStyle.startsWith('h') ? theme.colors.headlines : theme.colors.body,
    ...customStyle,
  } as ICSS

  return style
}

const createTextStyle = (variant: Fonts) => {
  return createTextVariant(() => ({
    text: customTextStyles(variant),
  }))
}

export const TextStyles = {
  default: createTextStyle('p1'),
  hx: createTextStyle('hx'),
  h0: createTextStyle('h0'),
  h1: createTextStyle('h1'),
  h2: createTextStyle('h2'),
  h3: createTextStyle('h3'),
  h4: createTextStyle('h4'),
  h5: createTextStyle('h5'),
  p1: createTextStyle('p1'),
  p2: createTextStyle('p2'),
  p3: createTextStyle('p3'),
  p4: createTextStyle('p4'),
  p5: createTextStyle('p5'),
  link: createTextVariant((theme) => ({
    text: {
      ...createTextStyle('p2'),
      textDecoration: 'underline',
      color: theme.colors['primary-3'],
    },
  })),
  extraBold: createTextVariant((theme) => ({
    text: {
      fontWeight: '800',
    },
  })),
  bold: createTextVariant((theme) => ({
    text: {
      fontWeight: '700',
    },
  })),
  semiBold: createTextVariant((theme) => ({
    text: {
      fontWeight: '600',
    },
  })),
  medium: createTextVariant((theme) => ({
    text: {
      fontWeight: '500',
    },
  })),
  regular: createTextVariant((theme) => ({
    text: {
      fontWeight: '400',
    },
  })),
  light: createTextVariant((theme) => ({
    text: {
      fontWeight: '300',
    },
  })),
  extraLight: createTextVariant((theme) => ({
    text: {
      fontWeight: '200',
    },
  })),
  thin: createTextVariant((theme) => ({
    text: {
      fontWeight: '100',
    },
  })),
  ellipsis: createTextVariant(() => ({
    text: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  })),
}

StyleRegistry.registerVariants('Text', TextStyles)
