
import { Fonts } from '@codeleap/common'
import { TextComposition, TextPresets } from '@codeleap/web'
import { variantProvider } from '..'

const createTextStyle = variantProvider.createVariantFactory<TextComposition>()

export function assignTextStyle(name: Fonts, add = {}) {
  return createTextStyle((theme) => {
    const style = theme.typography.base.styles[name]
    const fontFamily = theme?.typography?.base?.fontFamily

    const fontWeight = style.weight.toString()

    const fontSize = style.size

    return {
      text: {
        color: name.startsWith('h') ? theme.colors.headlines : theme.colors.body,
        fontWeight,
        fontFamily,
        fontSize,
        lineHeight: style.lineHeight ?? null,
        letterSpacing: style.letterSpacing ?? null,
        ...add,
      },
    }
  })
}

export const AppTextStyles = {
  ...TextPresets,
  default: createTextStyle((theme) => {
    return {
      text: {
        fontFamily: theme.typography.base.fontFamily,
        marginBlock: 0,
        ...assignTextStyle('p1')(theme).text,
      },
    }
  }),
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
  link: createTextStyle((theme) => ({
    text: {
      ...assignTextStyle('p2'),
      textDecoration: 'underline',
      color: theme.colors['primary-3'],
    },
  })),
  'neutral-7': createTextStyle((theme) => ({
    text: {
      color: theme.colors['neutral-7'],
    },
  })),
  'neutral-9': createTextStyle((theme) => ({
    text: {
      color: theme.colors['neutral-9'],
    },
  })),
  'neutral-10': createTextStyle((theme) => ({
    text: {
      color: theme.colors['neutral-10'],
    },
  })),
  primary: createTextStyle((theme) => ({
    text: {
      color: theme.colors.primary,
    },
  })),
  white: createTextStyle(theme => ({
    text: {
      color: theme.colors.white,
    },
  })),
  'primary-1': createTextStyle(theme => ({
    text: {
      color: theme.colors['primary-1'],
    },
  })),
  'primary-3': createTextStyle(theme => ({
    text: {
      color: theme.colors['primary-3'],
    },
  })),
  'primary-5': createTextStyle(theme => ({
    text: {
      color: theme.colors['primary-5'],
    },
  })),
  'secondary-1': createTextStyle(theme => ({
    text: {
      color: theme.colors['secondary-1'],
    },
  })),
  'secondary-3': createTextStyle(theme => ({
    text: {
      color: theme.colors['secondary-3'],
    },
  })),
  'secondary-5': createTextStyle(theme => ({
    text: {
      color: theme.colors['secondary-5'],
    },
  })),
  'destructive-2': createTextStyle(theme => ({
    text: {
      color: theme.colors['destructive-2'],
    },
  })),
  'alert-1': createTextStyle(theme => ({
    text: {
      color: theme.colors['alert-1'],
    },
  })),
  extraBold: createTextStyle((theme) => ({
    text: {
      fontWeight: '800',
    },
  })),
  bold: createTextStyle((theme) => ({
    text: {
      fontWeight: '700',
    },
  })),
  semiBold: createTextStyle((theme) => ({
    text: {
      fontWeight: '600',
    },
  })),
  medium: createTextStyle((theme) => ({
    text: {
      fontWeight: '500',
    },
  })),
  regular: createTextStyle((theme) => ({
    text: {
      fontWeight: '400',
    },
  })),
  light: createTextStyle((theme) => ({
    text: {
      fontWeight: '300',
    },
  })),
  extraLight: createTextStyle((theme) => ({
    text: {
      fontWeight: '200',
    },
  })),
  thin: createTextStyle((theme) => ({
    text: {
      fontWeight: '100',
    },
  })),
}
