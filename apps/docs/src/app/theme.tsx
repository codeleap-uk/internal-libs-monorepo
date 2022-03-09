import { AppTheme, createTheme, VariantProvider } from '@codeleap/common'
import { textStyles } from './textStyles'
import { CSSObject } from '@emotion/css'
import { Icons } from './assets/icons'
import { useWindowSize } from '@codeleap/web'
import { LocalStorageKeys } from './constants'

const IS_SSR = typeof window === 'undefined'

const getWindowDimensions = () => {
  if (IS_SSR) {
    return {
      height: 0,
      widht: 0,
    }

  }
  return {
    width: window?.innerWidth || 0,
    height: window?.innerHeight || 0,
  }
}

const themeObj = {
  colors: {
    light: {
      primary: '#7695EC',
      icon: '#000',
      border: '#7695EC',
      disabled: '#a4aabc',
      text: '#000000',
      background: '#ffffff',
      backgroundSecondary: '#fff',
      gray: '#333',
      lightGrey: '#ccc',
      veryLightGrey: '#f7f7f7',
      negative: '#a11',
      positive: '#ada',
      secondary: '#000',
      black: '#000',
      borders: '#ccc',
      placeholder: '#ccc',
      neutral: '#5f5f5f',
      white: '#fff',
      green: 'green',
      textH: '#333',
      textP: '#555',
      grayFade: '#5552',
      inlineCode: '#7695EC',
    },
    dark: {
      primary: '#7695EC',
      icon: '#fff',
      border: '#7695EC',
      disabled: '#a4aabc',
      text: '#fff',
      background: '#222222',
      backgroundSecondary: '#303030',
      gray: '#333',
      neutral: '#777777bb',
      lightGrey: '#ccc',
      black: '#000',
      veryLightGrey: '#f7f7f7',
      negative: '#a11',
      positive: '#ada',
      secondary: '#000',
      borders: '#ccc',
      placeholder: '#ccc',
      white: '#fff',
      green: 'green',
      textH: '#fff',
      textP: '#fff',
      grayFade: '#5552',
      inlineCode: '#7695EC',
    },
  },
  breakpoints: {
    zero: 0,
    tinyest: 290,
    tiny: 350,
    smallish: 420,
    small: 600,
    mid: 900,
    largeish: 1050,
    large: 1200,
    xlarge: 1400,
    xxlarge: 1800,
    huge: 2559,
  },
  spacing: 8,
  borderRadius: {
    large: 15,
    medium: 10,
    small: 5,
  },
  typography: {
    baseFontSize: 18,
    hColor: '#333',
    pColor: '#555',
    fontFamily: 'Helvetica',
    styles: textStyles,
  },
  icons: Icons,
  presets: {
    something: {
      backgroundColor: 'red',
    },
    elevated: {
      shadowOffset: { width: 0, height: 0 },
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowRadius: 20,
      shadowOpacity: 0.3,
      elevation: 8,
    },
  },
  values: {
    ...getWindowDimensions(),

    headerHeight: 56,
    navBarHeight: 100,
    buttons: {
      small: {
        height: 20,
      },
      default: {
        height: 35,
      },
      large: {
        height: 60,
      },
    },
    zIndex: {
      header: 2,
      footer: 1,
      appStatusOverlay: 6,

    },
  },
  initialTheme: IS_SSR ? 'light' : (window.___savedTheme || 'light'),
} as const

const appTheme = createTheme(themeObj, {
  screenSize: useWindowSize,
})

const styleGetter = (
  style: CSSObject,
) => {
  return style
}

type StyleGetter = typeof styleGetter

export const variantProvider = new VariantProvider<
  StyleGetter,
  typeof themeObj
>(appTheme, styleGetter)

export const Theme = variantProvider.theme
