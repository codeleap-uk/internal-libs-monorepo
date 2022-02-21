import { AppTheme, createTheme, VariantProvider } from '@codeleap/common'
import { textStyles } from './textStyles'
import { CSSObject } from '@emotion/css'
import { Icons } from './assets/icons'

const getWindowDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

const themeObj = {
  colors: {
    light: {
      primary: '#7695EC',
      icon: '#7695EC',
      border: '#7695EC',
      disabled: '#a4aabc',
      text: '#000000',
      background: '#fff',
      backgroundSecondary: '#fff',
      gray: '#333',
      lightGrey: '#ccc',
      veryLightGrey: '#f7f7f7',
      negative: '#a11',
      positive: '#ada',
      secondary: '#000',

      borders: '#ccc',
      placeholder: '#ccc',
      neutral: '#ccc',
      white: '#fff',
      green: 'green',
    },
    dark: {
      primary: '#7695EC',
      icon: '#7695EC',
      border: '#7695EC',
      disabled: '#a4aabc',
      text: '#fff',
      background: '#222',
      backgroundSecondary: '#303030',
      gray: '#333',
      neutral: '#777777bb',
      lightGrey: '#ccc',
      veryLightGrey: '#f7f7f7',
      negative: '#11aa3c',
      positive: '#ada',
      secondary: '#000',
      borders: '#ccc',
      placeholder: '#ccc',
      white: '#fff',
      green: 'green',
    },

  },
  breakpoints: {},
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

    headerHeight: 48,
    navBarHeight: 100,
    buttons: {
      small: {
        height: 40,
      },
      default: {
        height: 35,
      },
      large: {
        height: 60,
      },
    },
  },
  initialTheme: localStorage.getItem('codeleap.theme') || 'light',
} as const

const appTheme = createTheme(themeObj, {
  screenSize: () => Object.values(getWindowDimensions()),
})

const styleGetter = (
  style: CSSObject,
) => {
  return style
}

type StyleGetter = typeof styleGetter;

export const variantProvider = new VariantProvider<
  StyleGetter,
  typeof themeObj
>(appTheme, styleGetter)

export const Theme = variantProvider.theme
