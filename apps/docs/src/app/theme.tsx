import { createTheme, validateTheme, VariantProvider } from '@codeleap/common'
import { textStyles } from './textStyles'
import { Icons } from './assets/icons'
import { logger } from './logger'
import { CSSObject } from '@emotion/react'
import { effects } from './effects'

const themeSpacing = 8

const light = {
  'primary1': '#E0F3F9',
  'primary2': '#BCE8F4',
  'primary3': '#4CB8D6',
  'primary4': '#3A8CA3',
  'primary5': '#235260',
  'secondary1': '#E4E4F8',
  'secondary2': '#B3B4F8',
  'secondary3': '#8183F8',
  'secondary4': '#6668C4',
  'secondary5': '#4C4D91',
  'neutral1': '#FFFFFF',
  'neutral2': '#F2F2F2',
  'neutral3': '#E5E5E5',
  'neutral4': '#D9D9D9',
  'neutral5': '#CCCCCC',
  'neutral6': '#B3B3B3',
  'neutral7': '#999999',
  'neutral8': '#666666',
  'neutral9': '#333333',
  'neutral10': '#000000',
  'positive1': '#4CB7D5',
  'positive2': '#F5F0D1',
  'warning1': '#F3DBDB',
  'warning2': '#4CB7D5',
  'alert1': '#E4C000',
  'alert2': '#F33F3F',
  'destructive1': '#F3DBDB',
  'destructive2': '#F33F3F',
  'background': '#FFFFFF',
  'card': '#4CB7D5',
  'separator': '#E5E5E5',
  'border': '#CCCCCC',
  'overlay': '#000000',
  'headlines': '#000',
  'body': '#f8f8f8',
  'caption': '#999999',
  ripple: '#0002',
  transparent: '#FFF0',
}

const dark = {
  'primary1': '#173740',
  'primary2': '#286070',
  'primary3': '#4FBCDB',
  'primary4': '#43A2BD',
  'primary5': '#A9D0DB',
  'secondary1': '#2F2F59',
  'secondary2': '#434480',
  'secondary3': '#8B8DF8',
  'secondary4': '#7475B2',
  'secondary5': '#A3A4CC',
  'neutral1': '#1A1A1A',
  'neutral2': '#333333',
  'neutral3': '#4D4D4D',
  'neutral4': '#D9D9D9',
  'neutral5': '#737373',
  'neutral6': '#B3B3B3',
  'neutral7': '#999999',
  'neutral8': '#CCCCCC',
  'neutral9': '#333333',
  'neutral10': '#FFFFFF',
  'positive1': '#3D6652',
  'positive2': '#42C586',
  'warning1': '#66603D',
  'warning2': '#E4C000',
  'alert1': '#663D3D',
  'alert2': '#FF4E4E',
  'destructive1': '#663D3D',
  'destructive2': '#FF4E4E',
  'background': '#1A1A1A',
  'card': '#333333',
  'separator': '#4D4D4D',
  'border': '#737373',
  'overlay': '#000000',
  'headlines': '#FFFFFF',
  'body': '#242424',
  'caption': '#666666',
  ripple: '#0002',
  transparent: '#FFF0',
}

const themeObj = validateTheme({
  colors: { light, dark },
  initialTheme: 'light',
  spacing: themeSpacing,
  borderRadius: {
    tiny: 4,
    small: 8,
    medium: 24,
    rounded: 999999,
  },
  typography: {
    base: {
      fontFamily: 'Inter',
      styles: textStyles,
    },
    quotes: {
      fontFamily: 'DMSans',
      styles: textStyles,
    },
  },
  icons: Icons,
  presets: {
    debugger: function (color: 'blue' | 'red' | 'yellow' | 'green' | 'purple' = 'red', background = false) {
      const hex = color === 'purple' ? '#9400D3' : color

      return {
        borderWidth: 1,
        borderColor: hex,
        color: hex,
        ...(background ? { backgroundColor: hex } : {}),
      }
    },
  },
  effects,
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

  values: {
    height: 10,
    width: 10,
    pixel: 1,
    innerSpacing: { X: 2, Y: 2, value: 16 },
    outerSpacing: { X: 2, Y: 2, value: 16 },
    gap: 2,
    smallGap: 1,
    itemHeight: {
      default: 48,
      small: 32,
      tiny: 20,
    },
    iconSize: {
      1: 16,
      2: 20,
      3: 24,
      4: 32,
      5: 48,
      6: 64,
    },
    headerHeight: 60,
    borderWidth: {
      small: 1,
      medium: 2,
    },
  },
})

const appTheme = createTheme(themeObj, {
  screenSize: () => [0, 0],
})

export type TCSS = CSSObject

const styleGetter = (
  style: TCSS,
) => {

  return style
}

type StyleGetter = typeof styleGetter

export const variantProvider = new VariantProvider<
  StyleGetter,
  typeof themeObj
>(appTheme, styleGetter, logger)

export const Theme = variantProvider.theme

export type AppThemeModes = keyof typeof themeObj.colors

export type Breakpoint = keyof typeof themeObj.breakpoints
